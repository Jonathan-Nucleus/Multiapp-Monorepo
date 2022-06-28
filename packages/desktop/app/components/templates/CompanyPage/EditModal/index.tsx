import React, { FC, useState } from "react";
import { WarningCircle, X } from "phosphor-react";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../common/Button";
import Field from "../../../common/Field";
import Alert from "../../../common/Alert";

import { CompanyProfile } from "shared/graphql/query/company/useCompany";
import { useUpdateCompanyProfile } from "shared/graphql/mutation/account";
import { DialogProps } from "../../../../types/common-props";
import ModalDialog from "../../../common/ModalDialog";

interface CompanyEditModalProps extends DialogProps {
  company: CompanyProfile;
}

type FormValues = {
  name: string;
  about: string;
  website: string;
  twitter: string;
  linkedIn: string;
};

const schema = yup.object({
  name: yup.string().default("").required("Required"),
  about: yup.string().default(""),
  website: yup.string().url().default(""),
  twitter: yup.string().url().default(""),
  linkedIn: yup.string().url().default(""),
});

const CompanyEdit: FC<CompanyEditModalProps> = ({
  show,
  onClose,
  company,
}: CompanyEditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateCompanyProfile] = useUpdateCompanyProfile();
  const { register, handleSubmit, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    defaultValues: schema.cast({
      name: company.name,
      about: company.overview ?? "",
      website: company.website ?? "",
      linkedIn: company.linkedIn ?? "",
      twitter: company.twitter ?? "",
    }) as DefaultValues<FormValues>,
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { name, about, website, twitter, linkedIn } = values;
    try {
      setLoading(true);
      await updateCompanyProfile({
        variables: {
          profile: {
            _id: company._id,
            name: name,
            overview: about,
            website,
            twitter,
            linkedIn,
          },
        },
      });
    } catch (err) {
      setError("Save failed with error");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <ModalDialog
        title="Edit Company"
        className="max-w-xl w-full"
        show={show}
        onClose={onClose}
      >
        <div>
          <div className={error ? "block" : "hidden"}>
            <div className="my-6 mb-9">
              <Alert variant="error">
                <div className="flex flex-row">
                  <div className="flex-shrink-0 text-error">
                    <WarningCircle
                      size={24}
                      weight="bold"
                      color="currentColor"
                    />
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
                name="name"
                label="Name"
                autoComplete="name"
              />
              <Field
                register={register}
                state={formState}
                name="about"
                label="About"
                autoComplete="about"
                textareaClassName="block w-full bg-white rounded-lg text-sm text-black p-2"
                rows={5}
                textarea
              />
            </div>
            <div className="border-t border-white/[.12] p-4">
              <Field
                register={register}
                state={formState}
                name="website"
                label="Website"
                autoComplete="website"
                placeholder="https://"
              />
              <Field
                register={register}
                state={formState}
                name="twitter"
                label="twitter"
                autoComplete="twitter"
                placeholder="https://"
              />
              <Field
                register={register}
                state={formState}
                name="linkedIn"
                label="LinkedIn"
                autoComplete="linkedIn"
                placeholder="https://"
              />
            </div>
            <div className="flex justify-between border-t border-white/[.12] p-4">
              <Button
                type="button"
                variant="text"
                className="text-primary font-medium"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-48 font-medium"
                disabled={!isValid}
                loading={loading}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </ModalDialog>
    </>
  );
};

export default CompanyEdit;
