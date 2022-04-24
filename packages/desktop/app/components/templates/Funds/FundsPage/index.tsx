import { FC, useState } from "react";
import Navbar from "../../../modules/funds/Navbar";
import { Info, Lock } from "phosphor-react";
import Button from "../../../common/Button";
import { useFunds } from "mobile/src/graphql/query/marketplace/useFunds";
import FundsList from "./FundsList";
import { useAccount } from "mobile/src/graphql/query/account";
import AccreditationQuestionnaire from "../AccreditationQuestionnaire";

const FundsPage: FC = () => {
  const { data } = useFunds();
  const [isVerifying, setIsVerifying] = useState(false);
  const funds = data?.funds ?? [];
  const { data: accountData } = useAccount();
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 max-w-screen-xl lg:px-4">
        <header className="flex items-center px-4 lg:px-0">
          <h1 className="text-2xl text-white">Browse by Fund</h1>
          <div className="text-xs text-white opacity-60 ml-2 mt-2">
            {funds.length} Funds
          </div>
          <Button variant="text" className="text-gray-600 ml-auto">
            <Info color="currentColor" weight="light" size={24} />
          </Button>
        </header>
        <div className="my-9">
          {accountData?.account?.accreditation == "NONE" ? (
            <div className="backdrop-blur text-center px-4 pt-36 pb-64">
              <div className="text-2xl text-white flex items-center justify-center">
                <Lock color="currentColor" size={48} weight="light" />
                <span className="ml-2">
                  Only verified accredited investors can browse funds
                </span>
              </div>
              <div className="mt-24">
                <Button
                  variant="gradient-primary"
                  onClick={() => setIsVerifying(true)}
                >
                  <Lock color="currentColor" size={24} weight="light" />
                  <span className="ml-2">VERIFY ACCREDITATION STATUS</span>
                </Button>
              </div>
              <AccreditationQuestionnaire
                show={isVerifying}
                onClose={() => setIsVerifying(false)}
              />
            </div>
          ) : (
            <>{funds.length > 0 && <FundsList funds={funds} />}</>
          )}
        </div>
        <footer className="border-t border-white/[.12] mt-6 px-4 lg:px-0 pt-3">
          <Button
            variant="text"
            className="text-white opacity-60 flex items-center tracking-normal font-normal"
          >
            <Info color="currentColor" weight="light" size={20} />
            <span className="ml-2">Disclosure</span>
          </Button>
        </footer>
      </div>
    </>
  );
};

export default FundsPage;
