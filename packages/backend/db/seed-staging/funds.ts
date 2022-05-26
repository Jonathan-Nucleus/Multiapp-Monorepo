import type { Fund } from "backend/schemas/fund";
import type { Company } from "backend/schemas/company";
import type { User } from "backend/schemas/user";

type FundData = {
  fund: Omit<Fund.Mongo, "_id" | "companyId" | "managerId" | "teamIds">;
  company: Omit<Company.Mongo, "_id" | "memberIds">;
  manager: Pick<User.Mongo, "firstName" | "lastName" | "position">;
};

export const fundData: FundData[] = [
  {
    fund: {
      name: "Blue Duck Capital Partners LP",
      status: "open",
      level: "client",
      class: "hedge",
      aum: 30000000,
      min: 100000,
      lockup: 0,
      strategy: "L/S Equity",
      liquidity: "Quarterly w/ 45 days notice",
      fees: [
        { label: "Management Fee", value: "1%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "2021 Return", value: "15.40%" },
        { label: "YTD % vs S&P500", value: ".4% vs -13.3%" },
        { label: "Correlation to S&P 500", value: "0.18" },
      ],
      tags: ["Event-Driven", "Tech", "Consumer", "Fundamental"],
      highlights: [
        "Focused on thematic opportunities within Technology, Media and " +
          "Telecom, Consumer, and Industrial Sectors",
        "Rigorous bottoms-up, risk/reward discipline that uncovers mispriced " +
          "global equities across all market caps",
        "Low correlation",
      ],
      overview:
        "We employ thematic, bottoms up, and risk vs reward focused research " +
        "to uncover mispriced equities. The selective process makes heavy use " +
        "of primary source materials while largely ignoring broker and media " +
        "product. Returns are often uncorrelated as a result. Risk/reward " +
        "skews are carefully framed and followed. Many of our long positions " +
        "represent situations where we believe sentiment has swung too far " +
        "negative, and that underlying fundamentals are better than the market " +
        "gives credit for. We go look for these opportunities across all market " +
        "caps and find many of them in the small cap space. On the short side, " +
        "we try and identify momentum stocks, fad products, crowded stocks, " +
        "and dishonest management teams to bet against. For shorts, we employ " +
        "the same risk vs reward focus and usage of primary source research.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [
        {
          date: new Date(2020, 8, 30),
          figure: -0.3,
        },
        {
          date: new Date(2020, 9, 31),
          figure: -1.4,
        },
        {
          date: new Date(2020, 10, 30),
          figure: 1.2,
        },
        {
          date: new Date(2020, 11, 31),
          figure: 1.5,
        },
        {
          date: new Date(2021, 0, 1),
          figure: 3.9,
        },
        {
          date: new Date(2021, 0, 31),
          figure: -2.1,
        },
        {
          date: new Date(2021, 1, 28),
          figure: 6.2,
        },
        {
          date: new Date(2021, 2, 31),
          figure: 7.2,
        },
        {
          date: new Date(2021, 3, 30),
          figure: 6.4,
        },
        {
          date: new Date(2021, 4, 31),
          figure: 3.9,
        },
        {
          date: new Date(2021, 5, 30),
          figure: -1.5,
        },
        {
          date: new Date(2021, 6, 31),
          figure: -2.4,
        },
        {
          date: new Date(2021, 7, 31),
          figure: -4.3,
        },
        {
          date: new Date(2021, 8, 30),
          figure: -0.4,
        },
        {
          date: new Date(2021, 9, 31),
          figure: -0.2,
        },
        {
          date: new Date(2021, 10, 30),
          figure: 2.2,
        },
        {
          date: new Date(2021, 11, 31),
          figure: -0.7,
        },
        {
          date: new Date(2022, 0, 1),
          figure: 15.4,
        },
        {
          date: new Date(2022, 0, 31),
          figure: 0.62,
        },
        {
          date: new Date(2022, 1, 28),
          figure: 0.3,
        },
        {
          date: new Date(2022, 2, 31),
          figure: -0.2,
        },
        {
          date: new Date(2022, 3, 30),
          figure: -0.37,
        },
      ],
    },
    company: {
      name: "Blue Duck Capital",
    },
    manager: {
      firstName: "Alex",
      lastName: "Beinfield",
      position: "Founder & CIO",
    },
  },
];
