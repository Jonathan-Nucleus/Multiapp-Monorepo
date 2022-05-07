import React, { FC, useState } from "react";
import { X } from "phosphor-react";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../../common/Button";
import Field from "../../../common/Field";
import { useUpdateUserProfile } from "mobile/src/graphql/mutation/account";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";
import ModalDialog from "../../../common/ModalDialog";

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

interface EditModalProps {
  account: UserProfile;
  show: boolean;
  onClose: () => void;
}

const EditProfileModal: FC<EditModalProps> = ({ account, show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [updateUserProfile] = useUpdateUserProfile();
  const { register, handleSubmit, formState } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: schema.cast(account, { assert: false }),
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
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
      setLoading(false);
      onClose();
    } catch (err) {
    }
  };

  return (
    <>
      <ModalDialog
        title={"Edit Profile"}
        className="max-w-full"
        show={show}
        onClose={onClose}
      >
        <>
          <form className="w-96" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="flex justify-between border-t p-4">
              <Button
                type="button"
                variant="outline-primary"
                className="text-primary"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="leading-6"
                disabled={!isValid}
                loading={loading}
              >
                Save
              </Button>
            </div>
          </form>
        </>
      </ModalDialog>
    </>
  );
};

export default EditProfileModal;
