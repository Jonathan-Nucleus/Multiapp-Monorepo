import { FC } from "react";
import Button from "../../common/Button";
import Label from "../../common/Label";
import Input from "../../common/Input";

const InviteCodePage: FC = () => {
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-white text-2xl mt-6">Join the inner circle!</h1>
        <form className="mt-8">
          <div>
            <Label for="email">Enter code</Label>
            <Input
              id="code"
              type="text"
              name="code"
              autocomplete="code"
              required
            />
          </div>
          <div className="text-right mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="px-6 w-full md:w-auto"
            >
              Next
            </Button>
          </div>
        </form>
        <div className="text-center mt-12 text-white">OR</div>
        <div className="text-center mt-4">
          <Button variant="text" className="uppercase text-primary">
            request an invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteCodePage;
