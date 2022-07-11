import { FC, useState } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import Card from "desktop/app/components/common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../common/Button";
import { Info, Share, Star, TelevisionSimple } from "phosphor-react";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { Tab } from "@headlessui/react";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localData from "dayjs/plugin/localeData";
import Accordion from "../../../../common/Accordion";
import DetailedTeamMemberList from "../DetailedTeamMemberList";
import DisclosureModal from "../../../../modules/funds/DisclosureModal";
import FundDocuments from "../FundDocuments";
import { AssetClasses } from "backend/graphql/enumerations.graphql";

dayjs.extend(localData);
dayjs.extend(utc);

interface StrategyOverviewProps {
  fund: FundDetails;
}

const StrategyOverview: FC<StrategyOverviewProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const fundTeam = [fund.manager, ...(fund?.team ?? [])];

  return (
    <div className="mt-5 px-2 flex justify-center">
      <div className="lg:grid grid-cols-3 max-w-6xl">
        <div className="col-span-2">
          <div>
            <Tab.Group>
              <Tab.List className="grid grid-cols-2">
                <Tab>
                  {({ selected }) => (
                    <div
                      className={`border-b-2 ${
                        selected
                          ? "border-primary-medium"
                          : "border-white/[.12]"
                      }`}
                    >
                      <div
                        className={`text-sm uppercase ${
                          selected ? "text-white/[.87]" : "text-primary"
                        } hover:text-white transition-all font-medium py-4`}
                      >
                        Overview
                      </div>
                    </div>
                  )}
                </Tab>
                <Tab>
                  {({ selected }) => (
                    <div
                      className={`border-b-2 uppercase ${
                        selected
                          ? "border-primary-medium"
                          : "border-white/[.12]"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          selected ? "text-white/[.87]" : "text-primary"
                        } hover:text-white transition-all font-medium py-4`}
                      >
                        Documents
                      </div>
                    </div>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="mt-8">
                    <div className="text-xl text-white font-medium">
                      Strategy Overview
                    </div>
                    <div className="text-sm text-white mt-3">
                      <ReactMarkdown className="whitespace-pre-wrap break-words">
                        {fund.overview}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {fund.presentationUrl && (
                    <div className="mt-5 mb-6">
                      <Button variant="outline-primary">
                        <TelevisionSimple color="currentColor" size={24} />
                        <span className="ml-3">View Presentation</span>
                      </Button>
                    </div>
                  )}
                  <div className="border-b border-white/[.12] mt-6 pb-6">
                    <div
                      className={`flex flex-wrap -mx-1 py-2 text-xs text-white/[.60]
                      font-medium rounded-full uppercase m-1 px-1 py-1
                      tracking-widest`}
                    >
                      {fund.tags.join(" • ")}
                    </div>
                  </div>
                  {fund.disclosure && (
                    <Accordion
                      title="Fund Disclosures"
                      titleClassName="text-sm font-medium tracking-wider"
                      className="mt-5"
                    >
                      <p className="text-xs leading-5 text-white/[0.4] whitespace-pre-line">
                        {fund.disclosure}
                      </p>
                    </Accordion>
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  {fund.documents && (
                    <div className="mt-8">
                      <FundDocuments
                        fundId={fund._id}
                        documents={fund.documents}
                      />
                    </div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <div className="border-t border-white/[.12] mt-6 mb-24 pt-2">
              <Button
                variant="text"
                className="text-white opacity-60 flex items-center tracking-normal font-normal"
                onClick={() => setShowDisclosureModal(true)}
              >
                <Info color="currentColor" weight="light" size={20} />
                <span className="ml-2 underline">Disclosure</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:ml-8">
          <Card className="rounded-lg overflow-hidden p-0">
            <div>
              <div className="flex items-center px-4 py-3">
                <Avatar user={fund.company} size={48} shape="square" />
                <div className="flex-grow ml-3">
                  <div className="text-sm text-white font-medium">
                    {fund.name}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 text-center border-y border-white/[.12] divide-x divide-inherit">
                <div className="p-2">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase">
                    Asset Class
                  </div>
                  <div className="text-xs text-white">
                    {AssetClasses.find(
                      (assetClass) => assetClass.value === fund.class
                    )?.label ?? ""}
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase">
                    Strategy
                  </div>
                  <div className="text-xs text-white">{fund.strategy}</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-white px-4 py-4">
              {fund.company.tagline}
            </div>
            <div className="text-right leading-none px-4 mb-3">
              <Button variant="text" className="hidden">
                <Share color="white" weight="light" size={24} />
              </Button>
              <Button
                variant="text"
                className="ml-2 py-0"
                onClick={toggleWatch}
              >
                <Star
                  className={isWatching ? "text-primary-medium" : "text-white"}
                  color="currentColor"
                  weight={isWatching ? "fill" : "light"}
                  size={24}
                />
              </Button>
            </div>
          </Card>
          <div className="mt-9 px-3">
            <DetailedTeamMemberList members={fundTeam} />
          </div>
        </div>
      </div>
      <DisclosureModal
        show={showDisclosureModal}
        onClose={() => setShowDisclosureModal(false)}
      />
    </div>
  );
};

export default StrategyOverview;
