import Head from "next/head";
import { useRouter } from "next/router";

import FundProfilePage from "../../app/components/templates/Funds/FundProfilePage";
import { NextPageWithLayout } from "../../app/types/next-page";

const FundProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { fundId } = router.query as Record<string, string>;

  return (
    <>
      <Head>
        <title>Fund Profile - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FundProfilePage fundId={fundId} />
    </>
  );
};

FundProfile.layout = "main";
FundProfile.middleware = "auth";

export default FundProfile;
