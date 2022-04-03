import { FC } from "react";

const LoginPage: FC = () => {
  return (
    <div className="container mx-auto">
      <form method="post" onSubmit={() => {}}>
        <label>
          Email address
          <input type="email" id="email" name="email" />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>
    </div>
  );
};

export default LoginPage;
