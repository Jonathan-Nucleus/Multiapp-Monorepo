import { FC, useEffect, useRef } from "react";
import introJs, { Step } from "intro.js";
import {
  KEY_INVEST_TUTORIALS_SHOWN,
  LocalStorage,
} from "desktop/app/lib/storageHelper";

export interface TutorialsProps {
  fundId: string;
}

const Tutorials: FC<TutorialsProps> = ({ fundId }) => {
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current && !LocalStorage.getItem(KEY_INVEST_TUTORIALS_SHOWN)) {
      loaded.current = true;
      const steps: Step[] = [
        {
          element: "#funds-navbar-item-funds",
          intro: "Welcome to the marketplace!<br/>Browse funds on this tab.",
          position: "bottom",
        },
        {
          element: `#button-view-fund-${fundId}`,
          intro:
            "Found a fund you like?<br/>Learn about their strategy<br/>and performance.",
          position: "bottom",
        },
        {
          element: "#funds-navbar-item-managers",
          intro: "Learn about the managers<br/>behind the funds.",
        },
        {
          element: `#button-toggle-watch-fund-${fundId}`,
          intro: "Add to your<br/>watchlist",
        },
      ];
      introJs()
        .setOptions({
          steps,
          showBullets: false,
          tooltipClass: "tooltipCommon",
          highlightClass: "introjs-highlight",
          scrollToElement: false,
          exitOnEsc: false,
          exitOnOverlayClick: false,
          doneLabel: "Done",
        })
        .onexit(async () => {
          LocalStorage.setItem(KEY_INVEST_TUTORIALS_SHOWN, "true");
        })
        .start();
    }
  }, [fundId]);
  return <></>;
};

export default Tutorials;
