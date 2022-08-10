import { ChangeEvent, FC, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../common/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Label from "../../common/Label";
import Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import { CheckCircle } from "phosphor-react";
import Link from "next/link";
import { UserTypeOptions } from "backend/schemas/user";

type FormValues = { firstName: string; lastName: string; email: string };

const schema = yup
  .object({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email("Must be a valid email").lowercase().required(),
  })
  .required();

const RequestCodePage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>();
  const [selections, setSelections] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormData(data);
    setStep(1);
  };
  const submitRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 500);
  };

  return (
    <div className="h-screen">
      <div className="text-center py-20">
        <Image src={LogoWithText} alt="" width={238} height={42} />
      </div>
      {step == 0 && (
        <>
          <h1 className="text-xl text-white text-center font-medium mt-4">
            Get an invite
          </h1>
          <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  isInvalid={!!errors.firstName}
                  className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                  {...register("firstName")}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  isInvalid={!!errors.lastName}
                  className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                  {...register("lastName")}
                />
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                autoComplete="email"
                className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                isInvalid={!!errors.email}
                {...register("email")}
              />
            </div>
            <div className="flex items-center justify-between mt-16">
              <Button
                type="button"
                variant="text"
                className="text-sm text-primary font-medium tracking-normal px-0"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-32 text-sm font-medium tracking-normal"
                disabled={!isValid}
              >
                Next
              </Button>
            </div>
          </form>
        </>
      )}
      {step == 1 && (
        <>
          <div className="text-white text-center font-medium mt-3">
            <div>Which of the following</div>
            <div>best describes you?</div>
          </div>
          <div className="mt-6">
            {Object.keys(UserTypeOptions).map((key) => (
              <div
                key={key}
                className={`rounded-full border border-primary-solid 
                  hover:bg-primary-solid cursor-pointer transition-all ${
                    selections.includes(key) ? "bg-primary-solid" : ""
                  } mb-4`}
                onClick={() => {
                  if (!selections.includes(key)) {
                    setSelections([...selections, key]);
                  } else {
                    setSelections(selections.filter((item) => item != key));
                  }
                }}
              >
                <div className="flex items-center p-4">
                  <Checkbox
                    className="bg-transparent accent-white"
                    checked={selections.includes(key)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked) {
                        setSelections([...selections, key]);
                      } else {
                        setSelections(selections.filter((item) => item != key));
                      }
                    }}
                  />
                  <div className="text-sm text-white font-medium ml-2">
                    {UserTypeOptions[key]}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-16">
            <Button
              type="button"
              variant="text"
              className="text-sm text-primary font-medium tracking-normal px-0"
              onClick={() => setStep(0)}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-32 text-sm font-medium tracking-normal"
              disabled={selections.length == 0}
              loading={loading}
              onClick={() => submitRequest()}
            >
              Finish
            </Button>
          </div>
        </>
      )}
      {step == 2 && (
        <>
          <div className="bg-success text-white text-sm font-medium flex items-center rounded-xl mt-8 p-4">
            <div>
              <CheckCircle color="currentColor" size={24} weight="bold" />
            </div>
            <div className="ml-3">
              <span className="font-bold">{formData?.email}</span>
              has been sent an email confirming your invite code request.
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/welcome">
              <a>
                <Button
                  type="button"
                  variant="gradient-primary"
                  className="w-full h-12 text-sm font-medium tracking-normal"
                >
                  Go back to Welcome
                </Button>
              </a>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestCodePage;
