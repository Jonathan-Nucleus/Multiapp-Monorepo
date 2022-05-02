import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Dialog, Tab } from "@headlessui/react";
import { X } from "phosphor-react";
import Image from "next/image";
import * as yup from "yup";
import "yup-phone";
import _omitBy from "lodash/omitBy";
import _isNil from "lodash/isNil";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import Field from "../../../../common/Field";
import Alert from "../../../../common/Alert";
import { useAccount } from "mobile/src/graphql/query/account";
import WarningIcon from "shared/assets/images/warning-red.svg";
import { useUpdateUserProfile } from "mobile/src/graphql/mutation/account";

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
  show: boolean;
  onClose: () => void;
}

const EditModal: FC<EditModalProps> = ({ show, onClose }) => {
  const { data: accountData } = useAccount();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateUserProfile] = useUpdateUserProfile();

  const account = accountData?.account;
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
  }, [account]);

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
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 mx-auto p-0 z-10 w-full max-w-md">
            <div className="flex justify-between items-center border-b-2  px-4 py-2">
              <div className="text-sm text-white opacity-60 font-medium tracking-widest">
                Edit Profile
              </div>
              <Button
                variant="text"
                className="text-white opacity-60"
                onClick={onClose}
              >
                <X color="white" weight="bold" size={24} />
              </Button>
            </div>
            <div>
              <div className={error ? "block" : "hidden"}>
                <div className="my-6 mb-9">
                  <Alert variant="error">
                    <div className="flex flex-row">
                      <div className="flex-shrink-0 mt-1">
                        <Image src={WarningIcon} alt="" />
                      </div>
                      <div className="text-white ml-3">{error}</div>
                    </div>
                  </Alert>
                </div>
              </div>
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
                <div className="flex justify-between border-t p-4">
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="w-full md:w-48 uppercase text-primary"
                    disabled={!isValid || loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient-primary"
                    className="w-full md:w-48 uppercase leading-6"
                    disabled={!isValid}
                    loading={loading}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default EditModal;
