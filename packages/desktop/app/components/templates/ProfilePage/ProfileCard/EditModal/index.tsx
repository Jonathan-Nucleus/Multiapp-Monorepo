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
import Input from "../../../../common/Input";
import { Globe } from "phosphor-react";

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
        titleClass="text-base"
        className="max-w-xl w-full"
        show={show}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 py-4">
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
          </div>
          <div className="border-t border-white/[.12] px-5 py-4">
            <div className="text-xs text-white/[.6] mb-3">About You</div>
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
          </div>
          <div className="border-t border-white/[.12] px-5 py-4">
            <div className="text-xs text-white/[.6] mb-3">
              Social / Website Links
            </div>
            <div className="flex">
              <div className="w-32 flex items-center text-gray-800 bg-primary-light rounded-l-lg px-2">
                <svg
                  className="text-gray-800"
                  width="26"
                  height="25"
                  viewBox="0 0 26 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7586 0.5H1.82187C0.816703 0.5 0 1.27679 0 2.23036V22.7697C0 23.7233 0.816703 24.5001 1.82187 24.5001H23.7586C24.7638 24.5001 25.5862 23.7233 25.5862 22.7697V2.23036C25.5862 1.27679 24.7638 0.5 23.7586 0.5ZM7.73297 21.0715H3.94073V9.61788H7.73869V21.0715H7.73297ZM5.83685 8.05359C4.62037 8.05359 3.63804 7.1268 3.63804 5.99109C3.63804 4.85537 4.62037 3.92858 5.83685 3.92858C7.04763 3.92858 8.03567 4.85537 8.03567 5.99109C8.03567 7.13216 7.05334 8.05359 5.83685 8.05359ZM21.9482 21.0715H18.1559V15.5C18.1559 14.1715 18.1274 12.4625 16.1856 12.4625C14.2095 12.4625 13.9068 13.909 13.9068 15.4036V21.0715H10.1145V9.61788H13.7526V11.1822H13.804C14.3123 10.2822 15.5516 9.33395 17.3963 9.33395C21.2343 9.33395 21.9482 11.7072 21.9482 14.7929V21.0715Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="text-sm ml-2">LinkedIn</div>
              </div>
              <Input
                {...register("linkedIn")}
                className="text-sm rounded-l-none rounded-r-lg mt-0"
                placeholder="https://"
              />
            </div>
            <div className="flex mt-4">
              <div className="w-32 flex items-center text-gray-800 bg-primary-light rounded-l-lg px-2">
                <svg
                  className="text-gray-800"
                  width="27"
                  height="25"
                  viewBox="0 0 27 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.4792 7.78446L22.4608 10.6063C21.8611 17.1595 15.9643 22.2501 8.9181 22.2501C7.46888 22.2501 6.26953 22.0345 5.36002 21.6126C4.63041 21.2657 4.33057 20.9001 4.25062 20.7876C4.18446 20.6933 4.14183 20.5863 4.12591 20.4744C4.10998 20.3626 4.12117 20.2488 4.15863 20.1416C4.1961 20.0344 4.25888 19.9364 4.34229 19.8551C4.42571 19.7738 4.52761 19.7112 4.64041 19.672C4.6604 19.6626 7.01912 18.8188 8.5483 17.197C7.59995 16.5636 6.76641 15.7912 6.07963 14.9095C4.71037 13.1657 3.26115 10.1376 4.13068 5.61884C4.15802 5.4845 4.22352 5.35958 4.32028 5.25727C4.41703 5.15496 4.54145 5.07906 4.68038 5.03759C4.81976 4.99478 4.96901 4.98875 5.11179 5.02017C5.25458 5.05159 5.3854 5.11923 5.48995 5.21571C5.51993 5.25321 8.84814 8.32821 12.9159 9.32196V8.75009C12.9199 8.15544 13.0486 7.56735 13.2949 7.01938C13.5411 6.47141 13.9 5.9743 14.351 5.55643C14.8021 5.13857 15.3365 4.80813 15.9237 4.58398C16.5109 4.35984 17.1394 4.24638 17.7733 4.25009C18.6054 4.26122 19.4201 4.47432 20.1383 4.86863C20.8564 5.26294 21.4534 5.82502 21.8711 6.50009H24.9095C25.0673 6.49962 25.2218 6.543 25.3534 6.62475C25.485 6.7065 25.5879 6.82296 25.6491 6.95946C25.7067 7.098 25.7213 7.249 25.6912 7.395C25.6612 7.54099 25.5876 7.67602 25.4792 7.78446V7.78446Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="text-sm ml-2">Twitter</div>
              </div>
              <Input
                {...register("twitter")}
                className="text-sm rounded-l-none rounded-r-lg mt-0"
                placeholder="https://"
              />
            </div>
            <div className="flex mt-4 mb-4">
              <div className="w-32 flex items-center text-gray-800 bg-primary-light rounded-l-lg px-2">
                <Globe color="currentColor" size={24} weight="fill" />
                <div className="text-sm ml-2">Website</div>
              </div>
              <Input
                {...register("website")}
                className="text-sm rounded-l-none rounded-r-lg mt-0"
                placeholder="https://"
              />
            </div>
          </div>
          <div className="flex justify-between border-t border-white/[.12] px-5 py-4">
            <Button
              type="button"
              variant="text"
              className="text-sm text-primary font-medium"
              disabled={!isValid || loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-24 text-sm font-medium"
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
