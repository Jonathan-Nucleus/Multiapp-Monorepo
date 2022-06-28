import { NextPageWithLayout } from "../app/types/next-page";
import { useRouter } from "next/router";
import { useVerifyInvite } from "shared/graphql/query/auth/useVerifyInvite";
import Head from "next/head";
import SignupPage from "../app/components/templates/SignupPage";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { LoginProps } from "./login";

const Signup: NextPageWithLayout<LoginProps> = ({}) => {
  const router = useRouter();
  const { code } = router.query as Record<string, string>;
  const { data, loading } = useVerifyInvite(code ?? "");
  // Disabled until a strategy for handling bots has been identified (06/29/2022)
  // const ssoProviders = Object.keys(providers).filter(
  //   (provider) => provider == "google"
  // );
  useEffect(() => {
    if (!loading) {
      if (data && !data.verifyInvite) {
        router.replace("/invite-code");
      }
    }
  }, [data, loading, router]);
  return (
    <div>
      <Head>
        <title>Signup - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!loading && data?.verifyInvite && (
        <SignupPage ssoProviders={[]} />
      )}
    </div>
  );
};

Signup.layout = "auth";
Signup.middleware = "guest";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  };
};

export default Signup;
