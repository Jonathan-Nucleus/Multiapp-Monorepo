import type { Fund } from "backend/schemas/fund";
import type { Company } from "backend/schemas/company";
import type { User } from "backend/schemas/user";

type FundMember = Pick<User.Mongo, "firstName" | "lastName" | "position">;
type FundData = {
  fund: Omit<Fund.Mongo, "_id" | "companyId" | "managerId" | "teamIds">;
  company: Omit<Company.Mongo, "_id" | "memberIds">;
  manager: FundMember;
  team: FundMember[];
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
    team: [],
  },
  {
    fund: {
      name: "Manole FinTech Fund LP",
      status: "open",
      level: "client",
      class: "hedge",
      aum: 41700000,
      min: 1000000,
      lockup: 0,
      strategy: "L/S Equity",
      liquidity: "Quarterly w/ 45 days notice",
      fees: [
        { label: "Management Fee", value: "1.25%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "ITD annualized", value: "14.96%" },
        { label: "Average monthly return", value: "1.19%" },
        { label: "Sharpe Ratio", value: "2.06" },
        { label: "Max Drawdown", value: "2.68%" },
      ],
      tags: ["Fintech", "Private Equity", "Downside Protection", "Fundamental"],
      highlights: [
        "Highly differentiated, concentrated FinTech Fund",
        "Specialized, niche long/short equity manager",
        "Alpha driven by high conviction, low correlations",
        "25+ years of asset management experience",
      ],
      overview:
        "Manole Capital, established in February 2015, is a boutique asset manager that exclusively focuses on the emerging FINTECH industry. The Manole Fintech Fund is a hybrid hedge fund seeking exceptional growth opportunities by investing in both publicly- traded companies and privately-held companies.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Manole Capital Management",
    },
    manager: {
      firstName: "Warren",
      lastName: "Fisher",
      position: "CEO & Founder",
    },
    team: [
      {
        firstName: "Kurt",
        lastName: "Winslow",
        position: "COO",
      },
    ],
  },
  {
    fund: {
      name: "RAEIF, LP",
      status: "open",
      level: "client",
      class: "hedge",
      aum: 38500000,
      min: 500000,
      lockup: 0,
      strategy: "L/S Equity",
      liquidity: "Monthly w/ 30 days notice",
      fees: [
        { label: "Management Fee", value: "1.5%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Trailing 12 Months vs S&P GNR", value: "72.4%" },
        { label: "5 Year vs S&P GNR", value: "28.3%" },
        { label: "Correlation to Oil", value: "0.22" },
        { label: "ITD Average Annual Yield ", value: "7.3%" },
      ],
      tags: [
        "Energy & Materials",
        "Real Asset",
        "Yield/Income",
        "Low Correlation",
      ],
      highlights: [
        "Opportunistically allocate (±2% of capital) into highly convex positions that benefit from rising volatility and market dislocations",
        "Inexpensive exposure to the secular growth in renewable and green energy",
        "3+ decades of investment experience and “full cycle” natural resource portfolio management",
      ],
      overview:
        "Manole Capital, established in February 2015, is a boutique asset manager that exclusively focuses on the emerging FINTECH industry. The Manole Fintech Fund is a hybrid hedge fund seeking exceptional growth opportunities by investing in both publicly- traded companies and privately-held companies.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Marathon Resource Advisors",
    },
    manager: {
      firstName: "Robert",
      lastName: "Mullin",
      position: "Founding Partner & Portfolio Manager",
    },
    team: [],
  },
  {
    fund: {
      name: "Accelerated Opportunities LP",
      status: "open",
      level: "client",
      class: "hedge",
      aum: 26500000,
      min: 500000,
      lockup: 0.5,
      strategy: "L/S Equity",
      liquidity: "Quarterly w/ 30 days notice",
      fees: [
        { label: "Management Fee", value: "2%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Cumulative return", value: "9319%" },
        { label: "2021 Return", value: "15.7%" },
        { label: "YTD Return", value: "-39.3%" },
        { label: "Sharpe Ratio", value: "3.22" },
      ],
      tags: ["Hedge Fund", "Growth", "Public Markets", "Impact"],
      highlights: [
        "Concentrated growth in disruptive tech",
        "Seeks to generate substantial multiples over the longterm",
        "50% of management and performance fees go to charity",
      ],
      overview:
        "Accelerated Opportunities LP (“Accelerated”) launched in January 2020 to invest in a highly selective set of U.S.-based companies whose innovative products and services we expect will fundamentally change industries and generate exponential growth over time. The Fund typically takes long and short positions in highly liquid equities to express its thesis and will often use exchange-traded options to accelerate the performance of the highest conviction ideas in the portfolio or to protect capital.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Good Soil Investment Management",
    },
    manager: {
      firstName: "Emmet",
      lastName: "Peppers",
      position: "Founder & Portfolio Manager",
    },
    team: [
      {
        firstName: "Matt",
        lastName: "Smith",
        position: "Managing Partner",
      },
    ],
  },
  {
    fund: {
      name: "Cartenna Partners LP",
      status: "open",
      level: "purchaser",
      class: "hedge",
      aum: 62200000,
      min: 5000000,
      lockup: 1,
      strategy: "L/S Equity",
      liquidity: "Quarterly w/ 45 days notice",
      fees: [
        { label: "Management Fee", value: "1.5%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Annualized return since inception", value: "11.9%" },
        { label: "Correlation to S&P500", value: "0.37" },
        { label: "Ann. Volatility", value: "7.80%" },
        { label: "Sharpe Ratio", value: "1.8" },
      ],
      tags: ["Consumer", "Industrials", "Absolute Return", "Fundamental"],
      highlights: [
        "Seek to construct a portfolio with low correlation to broader market",
        "Strive to create alpha on both long and short sides of portfolio",
        "Limited ETF and derivative usage",
        "Target investments that contain a catalyst within 3 to 12-month timeline",
      ],
      overview:
        "Cartenna Capital LP (“Cartenna”) is a long/short equity investment manager focused on industrial and consumer cyclical companies. Cartenna employs a lower-net exposure strategy focused on process-driven alpha derived from both the long and short sides of the portfolio. The firm seeks absolute returns for the fund with limited correlation to the broader market.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Cartenna Capital",
    },
    manager: {
      firstName: "Peter",
      lastName: "Avellone",
      position: "CIO & Founders",
    },
    team: [],
  },
  {
    fund: {
      name: "Arena Special Opportunities Partners II, LP",
      status: "open",
      level: "purchaser",
      class: "credit",
      aum: 299000000,
      min: 500000,
      lockup: 60,
      strategy: "Special Situations",
      liquidity: "N/A",
      fees: [
        { label: "Management Fee", value: "2%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Current LTV", value: "60%" },
        { label: "% 1st Lien (senior)", value: "98%" },
        { label: "Coupon", value: "12.90%" },
        { label: "ITD Net IRR", value: "8.15%" },
      ],
      tags: ["Yield/Income", "Debt/Credit", "Opportunistic"],
      highlights: [
        "Deep and experienced team",
        "Focus on producing consistent and uncorrelated returns",
        "Full transparency in process and portfolio",
      ],
      overview:
        "Arena Special Opportunities Partners II (“Fund”) was launched in July 2021 and employs Arena’s core investment strategy. Arena’s mandate is flexible, and the team is structured to optimize for outsized returns in non-competitive and special situations typically between $5 million – $50 million. We invest in a variety of investment structures, collateralized by a variety of asset types, and consider collateral that includes a mix of different assets across industries, products, and geographies. Much like insurance underwriters and unlike market speculators, Arena aims to minimize risks and pursues controlled returns on behalf of investors.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Arena Investors LP",
    },
    manager: {
      firstName: "Dan",
      lastName: "Zwirn",
      position: "CEO & CIO",
    },
    team: [
      {
        firstName: "David",
        lastName: "Rothenberg",
        position: "Managing Director, Business Development",
      },
      {
        firstName: "Parag",
        lastName: "Shah",
        position: "Managing Director, Head of Marketing",
      },
    ],
  },
  {
    fund: {
      name: "Arena Special Opportunities Partners (Cayman) II, LP",
      status: "open",
      level: "purchaser",
      class: "credit",
      aum: 299000000,
      min: 500000,
      lockup: 5,
      strategy: "Special Situations",
      liquidity: "N/A",
      fees: [
        { label: "Management Fee", value: "2%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Current LTV", value: "60%" },
        { label: "% 1st Lien (senior)", value: "98%" },
        { label: "Coupon", value: "12.90%" },
        { label: "ITD Net IRR", value: "8.15%" },
      ],
      tags: ["Yield/Income", "Debt/Credit", "Opportunistic"],
      highlights: [
        "Deep and experienced team",
        "Focus on producing consistent and uncorrelated returns",
        "Full transparency in process and portfolio",
      ],
      overview:
        "Arena Special Opportunities Partners II (“Fund”) was launched in July 2021 and employs Arena’s core investment strategy. Arena’s mandate is flexible, and the team is structured to optimize for outsized returns in non-competitive and special situations typically between $5 million – $50 million. We invest in a variety of investment structures, collateralized by a variety of asset types, and consider collateral that includes a mix of different assets across industries, products, and geographies. Much like insurance underwriters and unlike market speculators, Arena aims to minimize risks and pursues controlled returns on behalf of investors.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Arena Investors LP",
    },
    manager: {
      firstName: "Dan",
      lastName: "Zwirn",
      position: "CEO & CIO",
    },
    team: [
      {
        firstName: "David",
        lastName: "Rothenberg",
        position: "Managing Director, Business Development",
      },
      {
        firstName: "Parag",
        lastName: "Shah",
        position: "Managing Director, Head of Marketing",
      },
    ],
  },
  {
    fund: {
      name: "Arena Special Opportunities Fund, LP",
      status: "open",
      level: "purchaser",
      class: "credit",
      aum: 288000000,
      min: 500000,
      lockup: 1,
      strategy: "Special Situations",
      liquidity: "Annually w/ 120 days notice",
      fees: [
        { label: "Management Fee", value: "2%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Current LTV", value: "59%" },
        { label: "% 1st Senior", value: "97.30%" },
        { label: "Coupon", value: "12.20%" },
        { label: "Target Net Returns", value: "10-12%" },
      ],
      tags: ["Yield/Income", "Debt/Credit", "Opportunistic"],
      highlights: [
        "Deep and experienced team",
        "Focus on producing consistent and uncorrelated returns",
        "Full transparency in process and portfolio",
      ],
      overview:
        "The Arena Special Opportunities Fund, LP (the “Fund” or “ASOF”) has generated an annualized return of 7.89% since inception (October 2015), including its initial ramp-up period in 2015-2016. For the twelve months ending December 31, 2021, the Fund’s net return was 9.56%*. The Fund employs Arena’s core investment strategy and accepts monthly subscriptions from investors (subject to deployment). Arena’s mandate is flexible and the team is structured to optimize for outsized returns in non-competitive and special situations typically between $5 million – $50 million. We invest in a variety of investment structures, collateralized by a variety of asset types, and consider collateral that includes a mix of different assets across industries, products, and geographies.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Arena Investors LP",
    },
    manager: {
      firstName: "Dan",
      lastName: "Zwirn",
      position: "CEO & CIO",
    },
    team: [
      {
        firstName: "David",
        lastName: "Rothenberg",
        position: "Managing Director, Business Development",
      },
      {
        firstName: "Parag",
        lastName: "Shah",
        position: "Managing Director, Head of Marketing",
      },
    ],
  },
  {
    fund: {
      name: "Arena Special Opportunities Fund (Cayman), LP",
      status: "open",
      level: "purchaser",
      class: "credit",
      aum: 91000000,
      min: 500000,
      lockup: 1,
      strategy: "Special Situations",
      liquidity: "Annually w/ 120 days notice",
      fees: [
        { label: "Management Fee", value: "2%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "Current LTV", value: "59%" },
        { label: "% 1st Senior", value: "97.60%" },
        { label: "Coupon", value: "12.00%" },
        { label: "Target Net Returns", value: "10-12%" },
      ],
      tags: ["Yield/Income", "Debt/Credit", "Opportunistic", "Offshore"],
      highlights: [
        "Portfolio of global health care stocks designed to capture inefficiencies across long and short positions.",
        "Focus on unmet medical needs and large market opportunities",
        "Substantial health care investing experience supported by institutional framework",
      ],
      overview:
        'Arena Special Opportunities Fund (Cayman), LP (the "Fund") has generated an annualized return of 5.71% since inception (March 2016), including its initial ramp-up period in 2016. For the twelve months ended December 31, 2021, the Fund\'s net return was 9.08%.* The Fund employs Arena’s core investment strategy and accepts monthly subscriptions from investors (subject to deployment). Arena’s mandate is flexible and the team is structured to optimize for outsized returns in non-competitive and special situations typically between $5 million – $50 million. We invest in a variety of investment structures, collateralized by a variety of asset types, and consider collateral that includes a mix of different assets across industries, products, and geographies.',
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "Arena Investors LP",
    },
    manager: {
      firstName: "Dan",
      lastName: "Zwirn",
      position: "CEO & CIO",
    },
    team: [
      {
        firstName: "David",
        lastName: "Rothenberg",
        position: "Managing Director, Business Development",
      },
      {
        firstName: "Parag",
        lastName: "Shah",
        position: "Managing Director, Head of Marketing",
      },
    ],
  },
  {
    fund: {
      name: "TimesSquare Global Health Care Fund",
      status: "open",
      level: "purchaser",
      class: "hedge",
      aum: 30600000,
      min: 250000,
      lockup: 1,
      strategy: "L/S Equity",
      liquidity: "Quarterly w/ 45 days notice",
      fees: [
        { label: "Management Fee", value: "1.5%" },
        { label: "Performance Fee", value: "20%" },
      ],
      attributes: [
        { label: "ITD Return", value: "10.30%" },
        { label: "ITD Alpha", value: "9.70%" },
        { label: "ITD Sortino Ratio", value: "1.55" },
        { label: "ITD Correlation", value: "0.53" },
      ],
      tags: ["Healthcare", "Biotech", "Small-Cap", "Mid-Cap"],
      highlights: [
        "Deep and experienced team",
        "Focus on producing consistent and uncorrelated returns",
        "Full transparency in process and portfolio",
      ],
      overview:
        "The TimesSquare Global Health Care Fund focuses on global opportunities primarily within the small and mid cap space. TimesSquare believes its specialized research skills, which place an emphasis on the assessment of management quality and an in-depth understanding of business models, enable it to build a portfolio of global health care stocks designed to capture inefficiencies across long and short positions. The portfolio is prudently diversified across sub-sectors.",
      updatedAt: new Date(2022, 3, 30), // month is 0 indexed (4/30/22)
      metrics: [],
    },
    company: {
      name: "TimesSquare Capital Management, Inc.",
    },
    manager: {
      firstName: "David",
      lastName: "Ferreiro",
      position: "Lead Portfolio Manager",
    },
    team: [
      {
        firstName: "Bret D.",
        lastName: "Jones",
        position: "Co-Portfolio Manager",
      },
    ],
  },
];
