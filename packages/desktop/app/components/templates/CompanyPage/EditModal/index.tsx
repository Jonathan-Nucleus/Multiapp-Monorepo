import React, { FC, useState } from "react";
import { Dialog } from "@headlessui/react";
import { WarningCircle, X } from "phosphor-react";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";

import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Field from "../../../common/Field";
import Alert from "../../../common/Alert";

import { CompanyProfile } from "shared/graphql/query/company/useCompany";
import { useUpdateCompanyProfile } from "shared/graphql/mutation/account";

interface CompanyEditModalProps {
  show: boolean;
  onClose: () => void;
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
      <Dialog open={show} onClose={onClose} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 mx-auto p-0 z-10 w-full max-w-md overflow-y-auto h-4/5">
            <div className="flex justify-between items-center border-b-2  px-4 py-2">
              <div className="text-sm text-white opacity-60 font-medium tracking-widest">
                Edit Company
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
                <div className="border-t p-4">
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

export default CompanyEdit;
