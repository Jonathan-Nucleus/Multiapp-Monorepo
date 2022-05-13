import { NextPageWithLayout } from "../app/types/next-page";
import { useRouter } from "next/router";
import { useVerifyInvite } from "shared/graphql/query/auth/useVerifyInvite";
import Head from "next/head";
import SignupPage from "../app/components/templates/SignupPage";
import { useEffect } from "react";

const Signup: NextPageWithLayout = () => {
  const router = useRouter();
  const { code } = router.query as Record<string, string>;
  const { data: { verifyInvite } = {}, loading } = useVerifyInvite(code ?? "");
  useEffect(() => {
    if (!loading && !verifyInvite) {
      router.replace("/invite-code");
    }
  }, [verifyInvite, loading, router]);
  return (
    <div>
      <Head>
        <title>Signup - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!loading && verifyInvite &&
        <SignupPage />
      }
    </div>
  );
};

Signup.layout = "auth";
Signup.middleware = "guest";

export default Signup;