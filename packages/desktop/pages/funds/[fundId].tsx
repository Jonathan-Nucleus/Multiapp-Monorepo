import Head from "next/head";
import { useRouter } from "next/router";

import FundProfilePage from "../../app/components/templates/Funds/FundProfilePage";
import { NextPageWithLayout } from "../../app/types/next-page";
import { useFund } from "shared/graphql/query/marketplace/useFund";

const FundProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { fundId } = router.query as Record<string, string>;
  const { data: { fund } = {} } = useFund(fundId);

  return (
    <>
      <Head>
        <title>Fund Profile - Prometheus</title>
        <meta name="description" content="" />
      </Head>
      <FundProfilePage fund={fund} />
    </>
  );
};

FundProfile.layout = "main";
FundProfile.middleware = "auth";

export default FundProfile;
