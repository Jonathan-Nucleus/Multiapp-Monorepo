import React from "react";
import { useForm } from "react-hook-form";

function SignupCode(props) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: any) => {
    const { code } = data;
  };

  return <div>code</div>;
}

export default SignupCode;
