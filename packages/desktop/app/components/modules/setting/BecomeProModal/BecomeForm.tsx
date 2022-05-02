import React, { ChangeEvent, FC, useMemo, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../common/Button";
import Field from "../../../common/Field";
import { useProRequest } from "mobile/src/graphql/mutation/account";
import { ProRoleOptions } from "backend/schemas/user";
import { useRef } from "react";

const ROLES = Object.keys(ProRoleOptions).map((option) => ({
  value: option,
  label: ProRoleOptions[option].label,
}));

type FormValues = {
  role: string;
  email: string;
  position: string;
  info?: string;
  organization?: string;
};

const schema = yup.object({
  role: yup.string().default("").required("Required"),
  email: yup.string().email("Must be a valid email").required("Required"),
  position: yup.string().default("").required("Required"),
  info: yup.string().default("").notRequired(),
  organization: yup.string().default("").notRequired(),
});

interface BecomeFormProps {
  setSuccess: () => void;
}

const BecomeForm: FC<BecomeFormProps> = ({ setSuccess }: BecomeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [proRequest] = useProRequest();
  const roleRef = useRef();

  const { register, handleSubmit, reset, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { role, email, organization, info, position } = values;
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
        setSuccess();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4">
        <div className="text-sm text-white mb-4">
          Are you a top level professional within financial markets and want the
          Pro tag associated with your name?
        </div>
        <div className="text-sm text-white">
          Pros are given special features within the Prometheus ecosystem and
          their posts are more likely to be seen. If you’d like us to consider
          you for the role of pro please fill out the following form.
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
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
          <Field
            register={register}
            state={formState}
            name="email"
            label="Employer:"
            autoComplete="email"
          />
          <Field
            register={register}
            state={formState}
            name="position"
            label="Job Title / Role"
            autoComplete="position"
          />
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
        <div className="flex justify-end border-t p-4 border-brand-overlay/[.1]">
          <Button
            type="submit"
            variant="gradient-primary"
            className="w-full md:w-48 uppercase leading-6"
            disabled={!isValid}
            loading={loading}
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BecomeForm;
