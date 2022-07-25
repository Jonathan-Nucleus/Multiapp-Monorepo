import { FC, useState } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import Card from "../../../../common/Card";
import Avatar from "../../../../common/Avatar";
import Button from "../../../../common/Button";
import { Info, Share, Star, TelevisionSimple } from "phosphor-react";
import { Tab } from "@headlessui/react";
import FundMedia from "../../../../modules/funds/FundMedia";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import FundDocuments from "../FundDocuments";
import Accordion from "../../../../common/Accordion";
import ManagerCard from "../ManagerCard";
import TeamMembersList from "desktop/app/components/modules/teams/TeamMembersList";
import DisclosureModal from "desktop/app/components/modules/funds/DisclosureModal";

const MONTHS = dayjs().localeData().monthsShort();

interface FundDetailsViewProps {
  fund: FundDetails;
}

const FundDetailsView: FC<FundDetailsViewProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const fundTeam = [fund.manager, ...(fund?.team ?? [])];
  const sortedReturns = fund.metrics.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const earliestYear = sortedReturns[0]?.date.getFullYear();
  // Assume last entry is YTD for last year
  const latestYear =
    sortedReturns[sortedReturns.length - 2]?.date.getFullYear();
  const numYears = latestYear - earliestYear + 1;
  const years = [...Array(!isNaN(numYears) ? numYears : 0)]
    .map((_, index) => earliestYear + index)
    .reverse();

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
                  {fund.presentationUrl ? (
                    <div className="mt-5 mb-6">
                      <Button variant="outline-primary">
                        <TelevisionSimple color="currentColor" size={24} />
                        <span className="ml-3">View Presentation</span>
                      </Button>
                    </div>
                  ) : null}
                  <div className="mt-6">
                    <div
                      className={`flex flex-wrap -mx-1 py-2 text-xs text-white/[.60]
                      font-medium rounded-full uppercase m-1 px-1 py-1
                      tracking-widest`}
                    >
                      {fund.tags.join(" • ")}
                    </div>
                  </div>
                  <div className="border-t border-white/[.12] mt-4" />
                  <div className="mt-6">
                    <div className="text-xl text-white font-medium items-center">
                      Highlights
                      <span className="float-right text-white/[0.6] text-xs leading-7 font-light">
                        As of {dayjs(fund.updatedAt).utc().format("M/DD/YYYY")}
                      </span>
                    </div>
                    <Card className="mt-5 p-0">
                      <div className="flex border-white/[.12] divide-x divide-inherit">
                        {fund.attributes.map((attribute, index) => (
                          <div
                            key={index}
                            className="flex flex-1 flex-col items-center py-6"
                          >
                            <div className="text-tiny text-white/[.6] text-center uppercase">
                              {attribute.label}
                            </div>
                            <div className="text-sm text-white mt-1">
                              {attribute.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                  {fund.metrics.length > 0 ? (
                    <div className="mt-6 text-white/[0.3]">
                      <div className="mb-2 font-light tracking-widest">
                        Monthly Net Return
                      </div>
                      <table className="w-full border-collapse border border-white/[.12] text-[0.75rem]">
                        <thead className="font-bold">
                          <tr>
                            <th className="border border-white/[.12] py-3" />
                            {MONTHS.map((month) => (
                              <th
                                key={month}
                                className="border border-white/[.12] py-3 text-white/[0.4]"
                              >
                                {month}
                              </th>
                            ))}
                            <th className="border border-white/[.12] py-3 text-white/[0.4]">
                              YTD
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {years.map((year) => {
                            const ytdFigure = sortedReturns.find(
                              (metric) =>
                                metric.date.getUTCMonth() === 0 &&
                                metric.date.getUTCFullYear() === year + 1 &&
                                metric.date.getUTCDate() === 1
                            )?.figure;

                            return (
                              <tr key={year}>
                                <td className="font-bold border border-white/[.12] py-3 text-center text-white/[0.4]">
                                  {year}
                                </td>
                                {MONTHS.map((month, index) => {
                                  const figure = sortedReturns.find(
                                    (metric) =>
                                      metric.date.getUTCMonth() === index &&
                                      metric.date.getUTCFullYear() === year &&
                                      metric.date.getUTCDate() !== 1
                                  )?.figure;

                                  return (
                                    <td
                                      key={month}
                                      className="text-center border border-white/[.12] py-3"
                                    >
                                      {figure !== undefined
                                        ? `${figure.toFixed(1)}%`
                                        : "--"}
                                    </td>
                                  );
                                })}
                                <td className="text-center font-bold border border-white/[.12] py-3 text-white/[0.4]">
                                  {ytdFigure !== undefined
                                    ? `${ytdFigure.toFixed(1)}%`
                                    : "--"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
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
            {fund.disclosure && (
              <Accordion
                title="Fund Disclosures"
                titleClassName="text-sm font-medium tracking-wider text-white"
                className="mt-8"
              >
                <p className="text-xs leading-5 text-white/[0.4] whitespace-pre-line">
                  {fund.disclosure}
                </p>
              </Accordion>
            )}
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
            <TeamMembersList members={fundTeam} />
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

export default FundDetailsView;
