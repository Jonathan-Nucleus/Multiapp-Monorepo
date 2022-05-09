import React, {
  ReactElement,
  PropsWithChildren,
  MutableRefObject,
  useState,
  useRef,
} from "react";
import {
  useForm,
  UseFormReturn,
  DefaultValues,
  SubmitHandler,
  FieldValues,
  FieldErrors,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type WizardBag = {
  state: {
    currentStep: number;
    totalSteps: number;
  };
  stepTitles: string[];
  helpers: {
    /**
     * Navigates to the next step. If the current step is the last step, this
     * function will trigger form submission. Note that this will skip form
     * validation for the current step.
     *
     * @param values    Optional object used to update the form data for the
     *                  current step before proceeding to the next step.
     *
     * @returns   Optionally returns a callback function if one is provided by
     *            the onSubmit() handler after successful form submission on
     *            the last step.
     */
    next: (
      values?: FieldValues,
      proceed?: () => Promise<void | boolean>
    ) => Promise<void>;

    /** Navigates to the previous step. */
    previous: () => void;

    /**
     * Jumps to a specific step in the Wizard, where the first step number is
     * one-based (starts at 1).
     */
    jumpToStep: (step: number) => void;
  };

  /**
   * Attempt to submit the form early.
   */
  submitForm: () => Promise<void>;
};

interface WizardWrapperProps {
  wizardStep: ReactElement;
  bag: WizardBag;
  showNavigation: boolean;
  isSubmitting: boolean;
}

export interface WizardProps<WizardData extends FieldValues = FieldValues>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /**
   * Submit handler invoked when the whole form is submitted and is successfully
   * valid. Care should be taken to not perform any action that would unmount
   * the Wizard in this function, as this will interfere with state management
   * associated with the submission process. Any appriopriate return value should
   * be provided to indicate the success state of the submission logic.
   *
   * @param values    Validate form getValues
   *
   * @returns   False if submission handling was not successful. You may also
   *            return a callback function to execute any logic after successful
   *            submission. This can be safely used to execute any logic that may
   *            result in unmounting the Wizard.
   */
  onSubmit: (values: WizardData) => Promise<false | void | (() => void)>;

  /**
   * Object defining whether or not intermediate form state data should be saved
   * to localStorage. If defined, state data will be automatically saved on any
   * updates to form controls using the provided data key. State data will also
   * be cleared upon successful form submission.
   */
  saveState?: {
    /** The key under which state data should be saved in localStorage. */
    dataKey: string;

    /**
     * A debounce interval in ms to tune performance of state saves. Default
     * value is 500 ms.
     */
    debounceInterval?: number;
  };

  /** A ref object that points to the current state of the wizard data. */
  currentData?: MutableRefObject<Partial<WizardData>>;

  /** Specifies which step the wizard should start on. Defaults to 1 (first). */
  startStep?: number;

  /**
   * Initial values for the form data.
   */
  initialValues?: Partial<WizardData>;

  /**
   * Provides an option to provide a custom wrapper as a render method for
   * all of the wizard steps. This allows for shared components and styles to be
   * used throughout the wizard. The current wizard step is provided as a
   * parameter in the form of an instantiated element that must be included in
   * the component heirarchy returned by this render method
   * (i.e., `{wizardStep}`). The render function is also provided the wizard
   * bag that provides access to the wizard state, helpers, and list of titles
   * for all wizard steps.
   */
  wrapper: (wrapperProps: WizardWrapperProps) => ReactElement;

  /**
   * Optional callback invoked when next is clicked on a form step and the data
   * has been successfully validated.
   */
  onNext?: (wizardBag: WizardBag) => Promise<void | boolean>;

  /** Optional callback invoked when a form validation error is encountered. */
  onValidationError?: (errors: FieldErrors<WizardData>) => void;
}

function WizardComponent<WizardData extends FieldValues = FieldValues>({
  children,
  onSubmit,
  onNext,
  onValidationError,
  currentData,
  startStep = 0,
  saveState,
  initialValues,
  wrapper,
  ...divProps
}: PropsWithChildren<WizardProps<WizardData>>): ReactElement {
  const elements = React.Children.toArray(children) as ReactElement[];
  const totalSteps = elements.length;
  if (totalSteps === 0) return <>Empty form.</>;

  const [firstSchema, ...restSchema] = elements.reduce<
    Yup.ObjectSchema<FieldValues>[]
  >((schemas, element) => {
    const { schema } = element?.props as WizardStepProps;
    if (schema) {
      schemas = [...schemas, schema];
    }

    return schemas;
  }, []);

  const fullSchema = restSchema.reduce(
    (mergedSchemas, schema) => mergedSchemas.concat(schema),
    firstSchema
  ) as Yup.SchemaOf<WizardData>;

  const [stepIndex, setStepIndex] = useState(
    Math.min(Math.max(startStep, 0), totalSteps - 1)
  );

  const formValues = useRef(
    fullSchema.cast(initialValues || {}, {
      assert: false,
    }) as unknown as Partial<WizardData>
  );

  const updateDraft = (values: Partial<WizardData>): void => {
    const updatedValues = { ...formValues.current, ...values };
    formValues.current = updatedValues;
    console.log("updated to", updatedValues);
    if (currentData) currentData.current = formValues.current;
  };

  const deleteDraft = (): void => {
    formValues.current = fullSchema.cast(initialValues || {}, {
      assert: false,
    }) as unknown as Partial<WizardData>;
  };

  // Update ref object to point to most recent form values
  if (currentData) currentData.current = formValues.current;

  const stepTitles = Array.from(
    { length: totalSteps },
    (v, index) => (elements[index]?.props as WizardStepProps).stepName ?? ""
  );

  const submit = async (values: Partial<WizardData>): Promise<void> => {
    const result = await onSubmit(values as WizardData);
    if (result !== false) {
      result?.();
      deleteDraft();
    } else {
      throw Error("Submission failed");
    }
  };

  const wizardBag: WizardBag = {
    state: {
      currentStep: stepIndex,
      totalSteps,
    },
    stepTitles,
    helpers: {
      next: async (values, onNext): Promise<void> => {
        const newValues = { ...formValues.current, ...values };
        if (values) updateDraft(newValues);
        if (stepIndex === totalSteps - 1) {
          return submit(newValues);
        }

        const result = await onNext?.();
        if (result !== false) {
          setStepIndex(Math.min(stepIndex + 1, totalSteps - 1));
        }
      },
      previous: () => {
        setStepIndex(Math.max(stepIndex - 1, 0));
      },
      jumpToStep: (step: number) => {
        if (step < 0 || step >= totalSteps) return;
        setStepIndex(step);
      },
    },
    submitForm: async () => {
      await submit(formValues.current);
    },
  };

  const handleProgressBarClick = (newStep: number): void => {
    // Dont' change step if it's after the current step
    if (newStep < stepIndex) {
      setStepIndex(newStep);
    }
  };

  const element = elements[stepIndex];
  return (
    <div {...divProps}>
      {React.cloneElement<WizardStepProps<WizardData>>(element, {
        onNext, // Keep before ...elements.props so the onNext from ...elements.props takes precedence
        onValidationError, // Keep before ...elements.props so the onError from ...elements.props takes precedence
        ...element.props,
        initialValues: formValues.current,
        wizardBag,
        saveState,
        updateState: updateDraft,
        wrapper,
      })}
    </div>
  );
}

export type WizardStepRenderProps<
  SchemaData extends FieldValues = FieldValues
> = Omit<UseFormReturn<SchemaData>, "handleSubmit"> & {
  /** Object containing wizard state data and utility functions. */
  wizardBag: WizardBag;

  /** Callback to manually trigger a state save of the current form data. */
  saveFormState: () => void;

  /** Manually trigger submission of the form for the current step. */
  submitStep: () => void;
};

export interface WizardStepProps<SchemaData extends FieldValues = FieldValues> {
  schema?: Yup.SchemaOf<SchemaData>;
  renderer: (props: WizardStepRenderProps<SchemaData>) => ReactElement;
  showNavigation?: boolean;
  stepName?: string;

  /**
   * Optional callback invoked when next is clicked on a form step and the data
   * has been successfully validated. Note that this overrides any onNext()
   * callback set on the parent Wizard for this particular WizardStep.
   */
  onNext?: (wizardBag: WizardBag) => Promise<void | boolean>;

  /**
   * Optional callback invoked when a form validation error is encountered after
   * clicking next on a form step. Note that this overrides any
   * onValidationError() callback set on the parent Wizard for this particular
   * WizardStep.
   */
  onValidationError?: (errors: FieldErrors<SchemaData>) => void;
}

type PrivateWizardStepProps<SchemaData extends FieldValues> =
  WizardStepProps<SchemaData> & {
    initialValues?: Partial<SchemaData>;
    wizardBag: WizardBag;
    updateState?: (data: Partial<SchemaData>) => void;
    wrapper: (wrapperProps: WizardWrapperProps) => ReactElement;
  };

const WizardStep = function <SchemaData extends FieldValues = FieldValues>(
  props: WizardStepProps<SchemaData>
): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const {
    schema = Yup.object().shape({}),
    initialValues,
    showNavigation = true,
    renderer: Renderer,
    wizardBag,
    updateState,
    wrapper,
    onNext,
    onValidationError,
  } = props as PrivateWizardStepProps<SchemaData>;
  const { state, helpers } = wizardBag;

  const { handleSubmit, ...form } = useForm<SchemaData>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(initialValues || {}, {
      assert: false,
    }) as DefaultValues<SchemaData>,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<SchemaData> = async (values) => {
    await helpers
      .next(values, async () => onNext?.(wizardBag) ?? true)
      .catch((err) => {
        console.log("form error", err);
      });

    setSubmitting(false);
  };

  const submitHandler = async (
    event?: React.FormEvent<Element>
  ): Promise<void> => {
    event?.preventDefault();
    if (submitting) return;

    if (state.currentStep === state.totalSteps - 1) {
      setSubmitting(true);
    }

    const result = await handleSubmit(onSubmit)(event);
    const {
      formState: { errors },
    } = form;

    // Check to see if validation failed and update the submission status
    if (Object.keys(errors).length > 0) {
      onValidationError?.(errors);
      setSubmitting(false);
    }
  };

  const saveFormState = (): void => {
    updateState?.(form.getValues() as Partial<SchemaData>);
  };

  const wizardStep = (
    <Renderer
      {...form}
      saveFormState={saveFormState}
      wizardBag={wizardBag}
      submitStep={submitHandler}
    />
  );

  return (
    <form onSubmit={submitHandler} onChange={() => saveFormState()}>
      {wrapper({
        wizardStep: wizardStep,
        bag: wizardBag,
        showNavigation,
        isSubmitting: submitting,
      })}
    </form>
  );
};

WizardComponent.Step = WizardStep;

type WizardType = typeof WizardComponent & {
  Step: typeof WizardStep;
};

const Wizard: WizardType = WizardComponent;
export default Wizard;
