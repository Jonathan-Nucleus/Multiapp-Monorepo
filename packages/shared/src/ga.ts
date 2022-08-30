export type GAEventAction = "contact_fund_specialist" | "read_more_feed";
export type GAEventLabel = "Button Clicked";
export type GAEventCategory = "Contact Fund Specialist" | "Read More In Feed";

export type GAEventParams = {
  event_category: GAEventCategory;
  event_label: GAEventLabel;
  value: string | number;
  author?: string;
  id: string;
};
