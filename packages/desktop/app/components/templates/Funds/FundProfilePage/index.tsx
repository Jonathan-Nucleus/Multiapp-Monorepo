import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { File, Info, Share, Star, TelevisionSimple } from "phosphor-react";
import { Tab } from "@headlessui/react";

import Avatar from "../../../common/Avatar";
import Accordian from "../../../common/Accordian";
import Button from "../../../common/Button";
import Card from "../../../common/Card";
import FundMedia from "../../../modules/funds/FundMedia";
import DisclosureModal from "../../../modules/funds/DisclosureModal";
import TeamMembersList from "../../../modules/teams/TeamMembersList";
import RecentDoc from "shared/assets/images/recent-doc.svg";

import {
  useFund,
  DocumentCategories,
  DocumentCategory,
} from "shared/graphql/query/marketplace/useFund";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { useDocumentToken } from "shared/graphql/query/account/useDocumentToken";
import { AssetClasses } from "shared/graphql/fragments/fund";
import Skeleton from "./Skeleton";
import ContactSpecialist from "../../../modules/funds/ContactSpecialist";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localData from "dayjs/plugin/localeData";

dayjs.extend(localData);
dayjs.extend(utc);

const dollarFormatter = Intl.NumberFormat("en", { notation: "compact" });
const MONTHS = dayjs().localeData().monthsShort();

interface FundProfileProps {
  fundId: string;
}

const FundProfilePage: FC<FundProfileProps> = ({ fundId }) => {
  const { data: { fund } = {} } = useFund(fundId);
  const { isWatching, toggleWatch } = useWatchFund(fundId);
  const [more, setMore] = useState(false);
  const [showContactSpecialist, setShowContactSpecialist] = useState(false);
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  const categories = new Set<DocumentCategory>();
  const [fetchDocumentToken] = useDocumentToken();

  if (!fund) {
    return <Skeleton />;
  }

  const fundTeam = [fund.manager, ...(fund?.team ?? [])];

  const sortedReturns = fund.metrics.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const earliestYear = sortedReturns[0]?.date.getFullYear();
  const latestYear =
    sortedReturns[sortedReturns.length - 2]?.date.getFullYear(); // Assume last entry is YTD for last year
  const numYears = latestYear - earliestYear + 1;
  const years = [...Array(!isNaN(numYears) ? numYears : 0)]
    .map((_, index) => earliestYear + index)
    .reverse();

  const documentsSorted = [...fund.documents];
  documentsSorted.sort((a, b) => b.date.getTime() - a.date.getTime());
  documentsSorted.forEach((doc) => categories.add(doc.category));

  const goToFile = async (url: string): Promise<void> => {
    try {
      const { data } = await fetchDocumentToken({
        variables: {
          fundId: fund._id,
          document: url,
        },
      });

      if (data && data.documentToken) {
        window.open(
          `https://api-dev.prometheusalts.com/pdf-watermark?token=${data.documentToken}`
        );
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
    }
  };

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
                      {fund.overview}
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
                            <div className="text-tiny text-white/[0.60] uppercase">
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
                  <div className="mt-8">
                    <div className="text-xl text-white font-medium">
                      Recently Added
                    </div>
                    <div className="mt-3">
                      {documentsSorted.slice(0, 2)?.map((doc) => (
                        <div key={doc.url} className="mb-3">
                          <Card
                            className="p-0 cursor-pointer"
                            onClick={() => goToFile(doc.url)}
                          >
                            <div className="flex items-center">
                              <div className="w-32 h-24 flex bg-gray-300 relative items-center justify-center">
                                <Image src={RecentDoc} alt="" />
                              </div>
                              <div className="ml-5">
                                <div className="text-white">{doc.title}</div>
                                <div className="text-white opacity-60">
                                  {dayjs(doc.date).format("MMMM D, YYYY h:mmA")}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                  {DocumentCategories.map((orderedCategory, index) => {
                    const category = orderedCategory.value;
                    if (!categories.has(category)) {
                      return null;
                    }

                    const categoryDocuments = documentsSorted.filter(
                      (doc) => doc.category === category
                    );

                    return (
                      <div key={index} className="mt-10">
                        <div className="text-xl text-white font-medium">
                          {orderedCategory.label}
                        </div>
                        <div className="border-white/[.12] divide-y divide-inherit mt-5">
                          {categoryDocuments.slice(0, 5).map((item, index) => (
                            <div
                              key={index}
                              className="flex py-5 cursor-pointer"
                              onClick={() => goToFile(item.url)}
                            >
                              <div className="text-white">
                                <File color="currentColor" size={24} />
                              </div>
                              <div className="ml-3">
                                <div className="text-white">{item.title}</div>
                                <div className="text-xs text-white/[0.6] mt-1 tracking-wider">
                                  {dayjs(item.date).format(
                                    "MMMM D, YYYY h:mmA"
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {more &&
                            categoryDocuments.slice(5).map((item, index) => (
                              <div
                                key={index}
                                className="flex py-5 cursor-pointer"
                                onClick={() => goToFile(item.url)}
                              >
                                <div className="text-white">
                                  <File color="currentColor" size={24} />
                                </div>
                                <div className="ml-3">
                                  <div className="text-white">{item.title}</div>
                                  <div className="text-xs text-white/[0.6] mt-1 tracking-wider">
                                    {dayjs(item.date).format(
                                      "MMMM D, YYYY h:mmA"
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          {categoryDocuments.length > 5 && (
                            <div className="py-5">
                              <Button
                                variant="text"
                                className="text-primary font-medium"
                                onClick={() => setMore(!more)}
                              >
                                {more
                                  ? `LESS ${orderedCategory.label}`
                                  : `MORE ${orderedCategory.label}`}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            {fund.disclosure ? (
              <Accordian
                title="Important Information"
                titleClassName="text-xs uppercase tracking-widest"
                className="mt-8"
              >
                <p className="text-xs leading-5 text-white/[0.4] whitespace-pre-line">
                  {fund.disclosure}
                </p>
              </Accordian>
            ) : null}
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
        <div className="ml-8">
          <Card className="p-0 rounded-lg">
            <div className="border-white/[.12] divide-y divide-inherit">
              <div className="p-5">
                <div className="flex flex-col items-center p-5 pt-1">
                  <Link href={`/profile/${fund?.manager?._id}`}>
                    <a>
                      <Avatar user={fund?.manager} size={128} />
                    </a>
                  </Link>
                  <div className="flex items-center mt-2">
                    <Link href={`/profile/${fund?.manager?._id}`}>
                      <a className="text-sm text-white tracking-wider">
                        {fund?.manager?.firstName} {fund?.manager?.lastName}
                      </a>
                    </Link>
                    <div className="text-white opacity-60 mx-2">•</div>
                    <div>
                      <Button
                        variant="text"
                        className="text-sm text-primary font-normal tracking-wider py-0"
                      >
                        Follow
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-white opacity-60 tracking-wide">
                    {fund?.manager?.followerIds?.length ?? 0} Followers
                    {" • "}
                    {fund?.manager?.postIds?.length ?? 0} Posts
                  </div>
                </div>
                <div className="my-2">
                  <Button
                    variant="gradient-primary"
                    className="w-full font-medium h-12"
                    onClick={() => setShowContactSpecialist(true)}
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
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Asset Class
                  </div>
                  <div className="text-white">
                    {AssetClasses.find(
                      (assetClass) => assetClass.value === fund.class
                    )?.label ?? ""}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Strategy
                  </div>
                  <div className="text-white">{fund.strategy}</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    AUM
                  </div>
                  <div className="text-white">
                    ${dollarFormatter.format(fund.aum)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="py-4 pl-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Minimum Investment
                  </div>
                  <div className="text-white">
                    ${dollarFormatter.format(fund.min)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Lockup Period
                  </div>
                  <div className="text-white">{fund.lockup}</div>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white/[0.6] uppercase mb-1">
                    liquidity
                  </div>
                  <div className="text-white font-light">{fund.liquidity}</div>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div className="p-4">
                  <div className="text-xs text-white/[0.6] font-light tracking-wider">
                    {fund.fees
                      .map((fee) => `${fee.label}: ${fee.value}`)
                      .join(" • ")}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="mt-9">
            {fundTeam.length > 0 && <TeamMembersList members={fundTeam} />}
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

export default FundProfilePage;
