import { FC, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Tab } from "@headlessui/react";
import { Info, Share, Star, TelevisionSimple } from "phosphor-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localData from "dayjs/plugin/localeData";

import Accordion from "../../../../common/Accordion";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../common/Button";
import Card from "desktop/app/components/common/Card";
import DetailedTeamMemberList from "../DetailedTeamMemberList";
import DisclosureModal from "../../../../modules/funds/DisclosureModal";
import FundDocuments from "../FundDocuments";
import FundMedia from "../../../../modules/funds/FundMedia";
import ContactSpecialist from "../../../../modules/funds/ContactSpecialist";
import { logEvent } from "../../../../../lib/ga";

import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { useDocumentToken } from "shared/graphql/query/account/useDocumentToken";
import { AssetClasses } from "backend/graphql/enumerations.graphql";
import getConfig from "next/config";

dayjs.extend(localData);
dayjs.extend(utc);

const { publicRuntimeConfig = {} } = getConfig();
const { NEXT_PUBLIC_WATERMARKING_SERVICE_URL } = publicRuntimeConfig;

interface StrategyOverviewProps {
  fund: FundDetails;
}

const StrategyOverview: FC<StrategyOverviewProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const fundTeam = [fund.manager, ...(fund?.team ?? [])];
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [showContactSpecialist, setShowContactSpecialist] = useState(false);
  const [fetchDocumentToken] = useDocumentToken();

  const presentation = fund.documents
    ?.filter((doc) => doc.category === "PRESENTATION")
    ?.sort((a, b) => b.date.getTime() - a.date.getTime())?.[0];

  const goToPresentation = async (): Promise<void> => {
    if (!presentation) {
      return;
    }

    try {
      const { data } = await fetchDocumentToken({
        variables: {
          fundId: fund._id,
          document: presentation.url,
        },
      });

      if (data && data.documentToken) {
        window.open(
          `${NEXT_PUBLIC_WATERMARKING_SERVICE_URL}?token=${data.documentToken}`
        );
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
    }
  };

  const handleContactSpecialist = () => {
    logEvent({
      action: "contact_fund_specialist",
      params: {
        event_category: "Contact Fund Specialist",
        event_label: "Button Clicked",
        value: fund.name,
        id: fund._id,
      },
    });
    setShowContactSpecialist(true);
  };

  return (
    <div className="mt-5 px-2 flex justify-center">
      <div className="lg:grid grid-cols-3 max-w-6xl">
        <div className="col-span-2">
          <div>
            {fund.videos && fund.videos.length > 0 && (
              <div className="mb-8">
                <div className="bg-black rounded-2xl overflow-hidden">
                  <FundMedia
                    key={selectedVideo}
                    mediaUrl={fund.videos[selectedVideo]}
                    fundId={fund._id}
                  />
                </div>
                <div className="flex flex-wrap mt-3">
                  {fund.videos.map((video, index) => (
                    <div
                      key={index}
                      className={`w-24 h-14 bg-black overflow-hidden rounded border mr-3 ${
                        selectedVideo == index
                          ? "border-white"
                          : "border-transparent opacity-60"
                      } hover:opacity-100 transition-all cursor-pointer`}
                      onClick={() => setSelectedVideo(index)}
                    >
                      <FundMedia
                        fundId={fund._id}
                        mediaUrl={video}
                        hideControls={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  {presentation && (
                    <div className="mt-5 mb-6">
                      <Button
                        variant="outline-primary"
                        onClick={goToPresentation}
                      >
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
                      title={
                        fund.limitedView
                          ? "Important Notes"
                          : "Fund Disclosures"
                      }
                      titleClassName="text-sm font-medium tracking-wider text-white"
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
          <div className="my-6">
            <Button
              variant="gradient-primary"
              className="w-full font-medium h-12"
              onClick={handleContactSpecialist}
            >
              Contact Specialist
            </Button>
            {showContactSpecialist && (
              <ContactSpecialist
                show={showContactSpecialist}
                onClose={() => setShowContactSpecialist(false)}
              />
            )}
          </div>
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
