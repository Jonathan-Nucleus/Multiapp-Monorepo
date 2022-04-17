import { FC, useState } from "react";
import Card from "../../../common/Card";
import Image from "next/image";
import Button from "../../../common/Button";
import { File, Info, Share, Star, TelevisionSimple } from "phosphor-react";
import { Tab } from "@headlessui/react";
import Avatar from "../../../common/Avatar";
import TeamMember from "desktop/app/components/templates/CompanyPage/TeamMembers/Member";
import MembersModal from "desktop/app/components/templates/CompanyPage/TeamMembers/MembersModal";

import { useAccount } from "desktop/app/graphql/queries";
import { useFund } from "mobile/src/graphql/query/marketplace";
import { useWatchFund } from "mobile/src/graphql/mutation/funds";

import { PINK } from "shared/src/colors";

const fundData = {
  background: "",
  name: "Good Soil Accelerated Opportunities",
  overview:
    "Concetrated growth in disruptive tech\n" +
    "Looks in to invest in early stages of growth\n" +
    "Seeks to genearte substantial multiples over a long-term horizon\n" +
    "50% of all fees are donated to Charities",
  strategyOverView:
    "Renewable energy production is no longer the future. It is the present. The Climate Action portfolio, built in collaboration with Etho Capital, seeks long-term capital appreciation and allows everyone to positvely affect climate change by investing in companies that exceed leading climate investment standards, are net climate positive on the Etho Global Climate Positive Index, and dedicate resources not only to reducing pollution, but to implementing real solutions.\n" +
    "\n" +
    "\n",
  status: "OPEN",
  tags: ["concetrated", "charitable", "natural resources", "consumer"],
  mtd: "3.2%",
  ytd: "3.1%",
  annualVolatility: "2.8%",
  arsi: "2.8%",
  company: {
    avatar: "",
    name: "Good Soil Investment Management",
  },
  netData: {
    2012: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2013: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2014: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2015: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2016: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2017: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2018: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2019: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2020: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2021: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
    2022: [0.5, -0.5, -0.1, 0.5, 0.5, 0.5, 0.5, -0.1, -0.1, -0.1, 0.5, -0.1],
  },
  documents: [
    {
      image: "",
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      image: "",
      title: "Team Overview",
      created: "July 1, 2021 5:59PM",
    },
  ],
  presentations: [
    {
      title: "February 2022 -  Letter to Investors",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "January 2022 - Letter to Investors",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "December 2021 - Letter to Investors",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "November 2021 - Letter to Investors",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "October 2021 - Letter to Investors",
      created: "July 1, 2021 5:59PM",
    },
  ],
  tearSheets: [
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
  ],
  investorLetters: [
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Overview Presentation",
      created: "July 1, 2021 5:59PM",
    },
  ],
  operational: [
    {
      title: "Dislosures and Disclaimers",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Additional Risk Disclosures",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Form CRS",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Something",
      created: "July 1, 2021 5:59PM",
    },
    {
      title: "Something Else",
      created: "July 1, 2021 5:59PM",
    },
  ],
  specialist: {
    avatar: "",
    firstName: "Emmet",
    lastName: "Peppers",
    followerIds: [],
    postIds: [],
  },
  members: [
    {
      avatar: "",
      firstName: "Emmet",
      lastName: "Peppers",
      position: "CEO",
    },
    {
      avatar: "",
      firstName: "Valeria",
      lastName: "Caza",
      position: "Fund Manager",
    },
    {
      avatar: "",
      firstName: "Michelle",
      lastName: "Mendiola",
      position: "Portfolio Manager",
    },
  ],
};

interface FundProfileProps {
  fundId?: string;
}

const FundProfile: FC<FundProfileProps> = ({ fundId }) => {
  const [watchFund] = useWatchFund();
  const { data } = useFund(fundId);
  const { data: userData } = useAccount({ fetchPolicy: "cache-only" });
  const [showModal, setShowModal] = useState(false);

  const fund = data?.fund;
  const isWatching = userData?.account?.watchlistIds?.includes(fundId) ?? false;
  const toggleWatchFund = async (): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch: !isWatching, fundId },
        refetchQueries: ["Account"],
      });

      if (!data?.watchFund) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="container mx-auto mt-5 lg:px-4 max-w-screen-xl">
      <div className="lg:grid grid-cols-3">
        <div className="col-span-2">
          <Card className="bg-secondary/[.27] rounded p-0 border border-t-0">
            <div className="flex flex-row bg-secondary/[.27]">
              <div className="flex-shrink-0 w-72 h-72 bg-white relative">
                {fund?.company?.background && (
                  <Image
                    loader={() =>
                      `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund.company.background.url}`
                    }
                    src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund.company.background.url}`}
                    alt=""
                    layout="fill"
                    className="object-cover"
                    unoptimized={true}
                  />
                )}
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex px-5">
                  <div className="w-24 h-24 flex-shrink-0 bg-purple-secondary rounded-b relative">
                    {fund?.company?.avatar && (
                      <Image
                        loader={() =>
                          `${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.company.avatar}`
                        }
                        src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.company.avatar}`}
                        alt=""
                        layout="fill"
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </div>
                  <div className="self-center flex-grow mx-4">
                    <div className="text-xl text-white font-medium">
                      {fund?.name}
                    </div>
                    <div className="text-primary">{fund?.company?.name}</div>
                  </div>
                  <div className="self-start flex items-center mt-5">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <div className="text-xs text-success ml-1">
                      {fund?.status}
                    </div>
                  </div>
                </div>
                <div className="min-h-0 flex flex-grow text-sm text-white px-5 py-3">
                  <ul className="self-center list-disc ml-4">
                    {fund?.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-white/[.12] text-right px-3 py-2">
                  <Button variant="text">
                    <Share color="white" weight="light" size={24} />
                  </Button>
                  <Button
                    variant="text"
                    className="ml-2"
                    onClick={() => toggleWatchFund(fund._id, !isWatching)}
                  >
                    <Star
                      color={isWatching ? PINK : "white"}
                      weight={isWatching ? "fill" : "light"}
                      size={24}
                    />
                  </Button>
                </div>
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
                      <Button
                        variant="text"
                        className={`text-sm ${
                          selected ? "text-white/[.87]" : "text-primary"
                        } font-medium py-4`}
                      >
                        OVERVIEW
                      </Button>
                    </div>
                  )}
                </Tab>
                <Tab>
                  {({ selected }) => (
                    <div
                      className={`border-b-2 ${
                        selected
                          ? "border-primary-medium"
                          : "border-white/[.12]"
                      }`}
                    >
                      <Button
                        variant="text"
                        className={`text-sm ${
                          selected ? "text-white/[.87]" : "text-primary"
                        } font-medium py-4`}
                      >
                        DOCUMENTS
                      </Button>
                    </div>
                  )}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="mt-4">
                    <Card className="h-96 bg-[#C4C4C4]" />
                  </div>
                  <div className="mt-11">
                    <div className="text-xl text-white font-medium">
                      Strategy Overview
                    </div>
                    <div className="text-sm text-white mt-3">
                      {fund?.overview}
                    </div>
                  </div>
                  <div className="mt-5">
                    <Button variant="outline-primary">
                      <TelevisionSimple color="currentColor" size={24} />
                      <span className="uppercase ml-3">view presentation</span>
                    </Button>
                  </div>
                  <div className="mt-8">
                    <div className="flex flex-wrap -mx-1 py-2">
                      {fund?.tags.map((tag) => (
                        <div
                          key={tag}
                          className={`bg-white/[.12] text-tiny text-white
                            font-medium rounded-full uppercase m-1 px-3 py-1
                            tracking-widest`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/[.12] mt-4" />
                  <div className="mt-16">
                    <div className="text-xl text-white font-medium">
                      Performance
                    </div>
                    <Card className="mt-5 p-0">
                      <div className="flex border-white/[.12] divide-x divide-inherit">
                        <div className="flex flex-col items-center p-6">
                          <div className="text-xs text-white opacity-60">
                            MTD RETURN
                          </div>
                          <div className="text-lg text-white mt-1">
                            {fundData.mtd}
                          </div>
                        </div>
                        <div className="flex flex-col items-center p-6">
                          <div className="text-xs text-white opacity-60">
                            YTD RETURN
                          </div>
                          <div className="text-lg text-white mt-1">
                            {fundData.ytd}
                          </div>
                        </div>
                        <div className="flex-grow" />
                        <div className="flex flex-col items-center p-6">
                          <div className="text-xs text-white opacity-60">
                            ANN. VOLATILITY
                          </div>
                          <div className="text-lg text-white mt-1">
                            {fundData.annualVolatility}
                          </div>
                        </div>
                        <div className="flex flex-col items-center p-6">
                          <div className="text-xs text-white opacity-60">
                            ARSI
                          </div>
                          <div className="text-lg text-white mt-1">
                            {fundData.arsi}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="mt-5 opacity-40">
                    <div className="text-white">Monthly Net Return</div>
                    <table className="w-full border-collapse border border-white/[.12]">
                      <thead className="text-sm text-white font-bold">
                        <tr>
                          <th className="border border-white/[.12] p-2" />
                          <th className="border border-white/[.12] p-2">Jan</th>
                          <th className="border border-white/[.12] p-2">Feb</th>
                          <th className="border border-white/[.12] p-2">Mar</th>
                          <th className="border border-white/[.12] p-2">Apr</th>
                          <th className="border border-white/[.12] p-2">May</th>
                          <th className="border border-white/[.12] p-2">Jun</th>
                          <th className="border border-white/[.12] p-2">Jul</th>
                          <th className="border border-white/[.12] p-2">Aug</th>
                          <th className="border border-white/[.12] p-2">Sep</th>
                          <th className="border border-white/[.12] p-2">Oct</th>
                          <th className="border border-white/[.12] p-2">Nov</th>
                          <th className="border border-white/[.12] p-2">Dec</th>
                          <th className="border border-white/[.12] p-2">YTD</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-white">
                        {Object.keys(fundData.netData).map((year) => (
                          <tr key={year}>
                            <td className="font-bold border border-white/[.12] p-2">
                              {year}
                            </td>
                            {fundData.netData[year].map((data, index) => (
                              <td
                                key={index}
                                className="text-center border border-white/[.12] p-2"
                              >
                                {data}%
                              </td>
                            ))}
                            <td className="text-center font-bold border border-white/[.12] p-2">
                              {fundData.netData[year]
                                .reduce((a, b) => a + b, 0)
                                .toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="mt-8">
                    <div className="text-xl text-white font-medium">
                      Recently Added
                    </div>
                    <div className="mt-3">
                      {fundData.documents.map((item, index) => (
                        <div key={index} className="mb-3">
                          <Card className="p-0">
                            <div className="flex items-center">
                              <div className="w-32 h-24 flex bg-white relative">
                                {item.image && (
                                  <Image
                                    loader={() => item.image}
                                    src={item.image}
                                    alt=""
                                    layout="fill"
                                    className="object-cover"
                                    unoptimized={true}
                                  />
                                )}
                              </div>
                              <div className="ml-5">
                                <div className="text-white">{item.title}</div>
                                <div className="text-white opacity-60">
                                  {item.created}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="text-xl text-white font-medium">
                      Presentations
                    </div>
                    <div className="border-white/[.12] divide-y divide-inherit mt-5">
                      {fundData.presentations.map((item, index) => (
                        <div key={index} className="flex py-5">
                          <div className="text-white">
                            <File color="currentColor" size={24} />
                          </div>
                          <div className="ml-3">
                            <div className="text-white">{item.title}</div>
                            <div className="text-xs text-white opacity-60">
                              {item.created}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="py-5">
                        <Button
                          variant="text"
                          className="text-primary font-medium"
                        >
                          MORE PRESENTATIONS
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="text-xl text-white font-medium">
                      Tearsheets
                    </div>
                    <div className="border-white/[.12] divide-y divide-inherit mt-5">
                      {fundData.tearSheets.map((item, index) => (
                        <div key={index} className="flex py-5">
                          <div className="text-white">
                            <File color="currentColor" size={24} />
                          </div>
                          <div className="ml-3">
                            <div className="text-white">{item.title}</div>
                            <div className="text-xs text-white opacity-60">
                              {item.created}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="py-2" />
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="text-xl text-white font-medium">
                      Investor Letters
                    </div>
                    <div className="border-white/[.12] divide-y divide-inherit mt-5">
                      {fundData.presentations.map((item, index) => (
                        <div key={index} className="flex py-5">
                          <div className="text-white">
                            <File color="currentColor" size={24} />
                          </div>
                          <div className="ml-3">
                            <div className="text-white">{item.title}</div>
                            <div className="text-xs text-white opacity-60">
                              {item.created}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="py-5">
                        <Button
                          variant="text"
                          className="text-primary font-medium"
                        >
                          MORE INVESTOR LETTERS
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="text-xl text-white font-medium">
                      Operational
                    </div>
                    <div className="border-white/[.12] divide-y divide-inherit mt-5">
                      {fundData.operational.map((item, index) => (
                        <div key={index} className="flex py-5">
                          <div className="text-white">
                            <File color="currentColor" size={24} />
                          </div>
                          <div className="ml-3">
                            <div className="text-white">{item.title}</div>
                            <div className="text-xs text-white opacity-60">
                              {item.created}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="py-5">
                        <Button
                          variant="text"
                          className="text-primary font-medium"
                        >
                          MORE OPERATIONAL
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <div className="border-t border-white/[.12] mt-6" />
            <div className="mt-2 mb-24">
              <Button
                variant="text"
                className="text-white opacity-60 flex items-center tracking-normal font-normal"
              >
                <Info color="currentColor" weight="light" size={20} />
                <span className="ml-2">Disclosure</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="ml-8">
          <Card className="p-0">
            <div className="border-white/[.12] divide-y divide-inherit">
              <div className="p-5">
                <div className="flex flex-col items-center p-5 pt-1">
                  <Avatar size={128} src={fund?.manager?.avatar} />
                  <div className="flex items-center mt-2">
                    <div className="text-sm text-white tracking-wider">
                      {`${fund?.manager?.firstName} ${fund?.manager?.lastName}`}
                    </div>
                    <div className="text-white opacity-60 mx-2">•</div>
                    <div>
                      <Button
                        variant="text"
                        className="text-sm text-primary font-normal tracking-wider py-0"
                      >
                        FOLLOW
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-white opacity-60 tracking-wide">
                    {fundData.specialist.followerIds.length} Followers
                    {" • "}
                    {fundData.specialist.postIds.length} Posts
                  </div>
                </div>
                <div className="my-2">
                  <Button
                    variant="gradient-primary"
                    className="w-full font-medium h-12"
                  >
                    CONTACT SPECIALIST
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Asset Class
                  </div>
                  <div className="text-white">Hedge Fund</div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Strategy
                  </div>
                  <div className="text-white">L/S Equity</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    AUM
                  </div>
                  <div className="text-white">$10M</div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Remaining Capacity
                  </div>
                  <div className="text-white">--</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Sharpe Ratio
                  </div>
                  <div className="text-white">2.5</div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    ann. volatility
                  </div>
                  <div className="text-white">7.8%</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Target returns
                  </div>
                  <div className="text-white">8-10%</div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    volatility
                  </div>
                  <div className="text-white">Low</div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Minimum Investment
                  </div>
                  <div className="text-white">$25K</div>
                </div>
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    Lockup Period
                  </div>
                  <div className="text-white">2 years</div>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div className="p-4">
                  <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                    liquidity
                  </div>
                  <div className="text-white">Quarterly w/30 days notice</div>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div className="p-4">
                  <div className="text-sm text-white opacity-60">
                    Management Fee: 1% • Performance Fee: 12%
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="mt-9">
            <div className="flex items-center">
              <div className="text-xl text-white font-medium">Team Members</div>
              <div className="text-sm text-primary font-medium mx-2">•</div>
              <div>
                <Button
                  variant="text"
                  className="text-sm text-primary font-medium tracking-normal py-0"
                  onClick={() => setShowModal(true)}
                >
                  VIEW ALL
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-col -space-y-4">
              {fund?.team.map((member, index) => (
                <TeamMember
                  key={member._id}
                  member={member}
                  hiddenChat={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {fund?.team && (
        <MembersModal
          members={fund.team}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FundProfile;
