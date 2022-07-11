import { FC, useState } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import Card from "desktop/app/components/common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../common/Button";
import { Info, Share, Star, TelevisionSimple } from "phosphor-react";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { Tab } from "@headlessui/react";
import FundMedia from "../../../../modules/funds/FundMedia";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localData from "dayjs/plugin/localeData";
import Accordion from "../../../../common/Accordion";
import ManagerCard from "../ManagerCard";
import DetailedTeamMemberList from "../DetailedTeamMemberList";
import DisclosureModal from "../../../../modules/funds/DisclosureModal";
import FundDocuments from "../FundDocuments";

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
          <Card className="flex flex-row bg-background-card rounded-lg overflow-hidden p-4">
            <div className="flex flex-col flex-grow">
              <div className="flex">
                <Avatar user={fund.company} size={96} shape="square" />
                <div className="self-center flex-grow mx-4">
                  <div className="text-2xl text-white">{fund.name}</div>
                  <div className="text-primary">{fund.company.name}</div>
                </div>
              </div>
              <div className="min-h-0 flex flex-grow text-sm text-white px-1 mt-5">
                <ul className="self-center list-disc ml-4">
                  {fund.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="self-start flex items-center">
                <div className="w-3 h-3 bg-success rounded-full" />
                <div className="text-xs text-success ml-1">{fund.status}</div>
              </div>
              <div className="text-right leading-none">
                <Button variant="text" className="hidden">
                  <Share color="white" weight="light" size={24} />
                </Button>
                <Button
                  variant="text"
                  className="ml-2 py-0"
                  onClick={toggleWatch}
                >
                  <Star
                    className={
                      isWatching ? "text-primary-medium" : "text-white"
                    }
                    color="currentColor"
                    weight={isWatching ? "fill" : "light"}
                    size={24}
                  />
                </Button>
              </div>
            </div>
          </Card>
          <div className="mt-3">
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
                  {fund.videos && fund.videos.length > 0 ? (
                    <div className="mt-4 rounded-xl overflow-hidden">
                      <FundMedia mediaUrl={fund.videos[0]} fundId={fund._id} />
                    </div>
                  ) : null}
                  <div className="mt-9">
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
          <ManagerCard fund={fund} />
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
