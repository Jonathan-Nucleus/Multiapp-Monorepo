import { GAEventAction, GAEventParams } from "shared/src/ga";

export const logEvent = ({
  action,
  params,
}: {
  action: GAEventAction;
  params: GAEventParams;
}) => {
  window.gtag("event", action, {
    ...params,
    non_interaction: true,
    platfrom: "Web",
  });
};
