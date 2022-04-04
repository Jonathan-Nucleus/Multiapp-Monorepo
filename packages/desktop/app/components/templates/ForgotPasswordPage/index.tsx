import { FC } from "react";
import Button from "../../common/Button";
import ArrowLeft from "shared/assets/images/arrow-left.svg";
import Image from "next/image";
import Alert from "../../common/Alert";
import Label from "../../common/Label";
import Input from "../../common/Input";

const ForgotPasswordPage: FC = () => {
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <Button variant="text">
          <Image src={ArrowLeft} alt="" />
          <span className="font-medium text-primary uppercase ml-3">
            Back to login
          </span>
        </Button>
        <h1 className="text-white text-2xl mt-6">Reset Password</h1>
        <Alert variant="info" className="mt-6 text-white text-sm">
          Enter your email below and we’ll send you a link to reset your
          password.
        </Alert>
        <form className="mt-6">
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required
            />
          </div>
          <div className="text-right mt-8">
            <Button variant="gradient-primary" className="px-10">
              SEND EMAIL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
