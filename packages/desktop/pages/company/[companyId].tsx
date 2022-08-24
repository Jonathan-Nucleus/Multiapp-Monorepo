import Head from "next/head";
import { useRouter } from "next/router";
import CompanyPage from "../../app/components/templates/CompanyPage";
import { NextPageWithLayout } from "../../app/types/next-page";
import { useCompany } from "shared/graphql/query/company/useCompany";

const Company: NextPageWithLayout = () => {
  const router = useRouter();
  const { companyId } = router.query as Record<string, string>;
  const { data: { companyProfile: company } = {} } = useCompany(companyId);

  return (
    <div>
      <Head>
        <title>{company?.name ?? "Company"} - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      {company && (
        <CompanyPage company={company} />
      )}
    </div>
  );
};

Company.layout = "main";
Company.middleware = "auth";

export default Company;
