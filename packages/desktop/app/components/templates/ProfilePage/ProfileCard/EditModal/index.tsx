import React, { FC, useEffect, useState } from "react";
import * as yup from "yup";
import "yup-phone";
import _omitBy from "lodash/omitBy";
import _isNil from "lodash/isNil";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../../common/Button";
import Field from "../../../../common/Field";
import { useUpdateUserProfile } from "shared/graphql/mutation/account";
import { useAccountContext } from "shared/context/Account";
import { DialogProps } from "../../../../../types/common-props";
import ModalDialog from "../../../../common/ModalDialog";

type FormValues = {
  firstName: string;
  lastName: string;
  tagline?: string;
  overview?: string;
  website?: string;
  twitter?: string;
  linkedIn?: string;
};

const schema = yup.object({
  firstName: yup.string().default("").required("Required"),
  lastName: yup.string().default("").required("Required"),
  tagline: yup.string().default("").notRequired(),
  overview: yup.string().default("").notRequired(),
  website: yup.string().url().notRequired(),
  twitter: yup.string().url().notRequired(),
  linkedIn: yup.string().url().notRequired(),
});

type EditModalProps = DialogProps;

const EditModal: FC<EditModalProps> = ({ show, onClose }) => {
  const account = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [updateUserProfile] = useUpdateUserProfile();
  const { register, handleSubmit, reset, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: schema.cast(account ?? {}, { assert: false }),
  });
  const { isValid } = formState;

  useEffect(() => {
    if (account) {
      reset(
        _omitBy(
          schema.cast(account, { assert: false, stripUnknown: true }),
          _isNil
        )
      );
    }
  }, [account, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!account) return;

    try {
      setLoading(true);
      await updateUserProfile({
        variables: {
          profile: {
            _id: account._id,
            ...values,
          },
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <ModalDialog
        title="Edit Profile"
        className="max-w-xl w-full"
        show={show}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4">
            <Field
              register={register}
              state={formState}
              name="firstName"
              label="First Name"
              autoComplete="firstName"
            />
            <Field
              register={register}
              state={formState}
              name="lastName"
              label="Last Name"
              autoComplete="lastName"
            />
            <Field
              register={register}
              state={formState}
              name="tagline"
              label="Tagline"
              autoComplete="tagline"
            />
            <Field
              register={register}
              state={formState}
              name="overview"
              label="Bio"
              autoComplete="overview"
              textareaClassName="block w-full bg-white rounded-lg text-sm text-black p-2"
              rows={5}
              textarea
            />
            <Field
              register={register}
              state={formState}
              name="website"
              label="Website"
              autoComplete="website"
            />
            <Field
              register={register}
              state={formState}
              name="twitter"
              label="twitter"
              autoComplete="twitter"
            />
            <Field
              register={register}
              state={formState}
              name="linkedIn"
              label="LinkedIn"
              autoComplete="linkedIn"
            />
          </div>
          <div className="flex justify-between border-t border-white/[.12] p-4">
            <Button
              type="button"
              variant="text"
              className="text-primary"
              disabled={!isValid || loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-48 leading-6"
              disabled={!isValid}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </form>
      </ModalDialog>
    </>
  );
};

export default EditModal;
