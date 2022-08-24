import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../../app/types/next-page";
import ResetPasswordPage from "../../app/components/templates/ResetPasswordPage";

const ResetPassword: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query as Record<string, string>;
  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="" />
      </Head>
      <ResetPasswordPage token={token} />
    </div>
  );
};

ResetPassword.layout = "onboarding";
ResetPassword.middleware = "guest";

export default ResetPassword;
