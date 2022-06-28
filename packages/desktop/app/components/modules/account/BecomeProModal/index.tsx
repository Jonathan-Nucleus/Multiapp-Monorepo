import React, { FC, useState } from "react";
import { DialogProps } from "../../../../types/common-props";
import ModalDialog from "../../../common/ModalDialog";
import Field from "../../../common/Field";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProRequest } from "shared/graphql/mutation/account/useProRequest";
import { ProRoleOptions } from "backend/schemas/user";
import Button from "../../../common/Button";

type BecomeProModalProps = DialogProps;

const ROLES = Object.keys(ProRoleOptions).map((option) => ({
  value: option,
  label: ProRoleOptions[option].label,
}));

type FormValues = {
  role: string;
  organization?: string;
  email: string;
  position: string;
  info?: string;
};

const schema = yup.object({
  role: yup.string().default("").required("Required"),
  organization: yup.string().when("role", {
    is: "OTHER",
    then: (schema) => schema.default("").required("Required"),
  }),
  email: yup.string().email("Must be a valid email").required("Required"),
  position: yup.string().default("").required("Required"),
  info: yup.string().default("").notRequired(),
});

const BecomeProModal: FC<BecomeProModalProps> = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proRequest] = useProRequest();
  const { register, handleSubmit, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const { isValid } = formState;
  const onSubmit: SubmitHandler<FormValues> = async ({
    role,
    email,
    organization,
    info,
    position,
  }) => {
    try {
      setLoading(true);
      const { data } = await proRequest({
        variables: {
          request: {
            role,
            email,
            organization: organization ?? "",
            info: info ?? "",
            position,
          },
        },
      });
      if (data?.proRequest) {
        setShowSuccess(true);
      }
    } catch (err) {}
    setLoading(false);
  };
  return (
    <>
      <ModalDialog
        title="Become a Pro"
        className="w-full max-w-xl"
        show={show}
        onClose={onClose}
      >
        {showSuccess ? (
          <div className="px-4 py-6">
            <div className="text-white">Confirmation message</div>
          </div>
        ) : (
          <div className="mt-6 px-4">
            <header className="text-white">
              <div>
                Are you a top level professional within financial markets and
                want the Pro tag associated with your name?
              </div>
              <div className="mt-3">
                Pros are given special features within the Prometheus ecosystem
                and their posts are more likely to be seen. If you’d like us to
                consider you for the role of Pro please fill out the following
                form.
              </div>
            </header>
            <form>
              <div className="lg:grid grid-cols-2 gap-8 mt-6">
                <Field
                  register={register}
                  state={formState}
                  name="role"
                  label="I’m a:"
                  autoComplete="role"
                  selectBox
                  options={ROLES}
                />
                <Field
                  register={register}
                  state={formState}
                  name="organization"
                  label="If “other”, please fill in:"
                  autoComplete="organization"
                />
              </div>
              <div className="lg:grid grid-cols-2 gap-8 mt-2">
                <Field
                  register={register}
                  state={formState}
                  name="email"
                  label="Employee Email:"
                  autoComplete="email"
                />
                <Field
                  register={register}
                  state={formState}
                  name="position"
                  label="Job Title / Role"
                  autoComplete="position"
                />
              </div>
              <div className="mt-2">
                <Field
                  register={register}
                  state={formState}
                  name="info"
                  label="Anything further we should consider in your application? "
                  autoComplete="info"
                  textareaClassName="block w-full bg-white rounded-lg text-sm text-black p-2"
                  rows={5}
                  textarea
                />
              </div>
            </form>
          </div>
        )}
        <div className="border-t border-white/[.12] text-right mt-24 p-5">
          {showSuccess ? (
            <Button
              variant="outline-primary"
              className="w-full md:w-48"
              disabled={!isValid}
              loading={loading}
              onClick={() => onClose()}
            >
              Close
            </Button>
          ) : (
            <Button
              type="submit"
              variant="outline-primary"
              className="w-full md:w-48"
              disabled={!isValid}
              loading={loading}
              onClick={() => handleSubmit(onSubmit)()}
            >
              Continue
            </Button>
          )}
        </div>
      </ModalDialog>
    </>
  );
};

export default BecomeProModal;
