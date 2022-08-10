import { FC, useEffect, useRef } from "react";
import introJs, { Step } from "intro.js";
import { useRouter } from "next/router";
import {
  KEY_HOME_TUTORIALS_SHOWN,
  LocalStorage,
} from "../../../../lib/storageHelper";

const steps: Step[] = [
  {
    element: "#site-header-home",
    intro:
      "This is your newsfeed!<br/>Market insights from professionals live here.",
    position: "top",
    highlightClass: "rounded-full",
  },
  {
    element: "#posts-list-filter",
    intro: "Click here to filter<br/>your newsfeed.",
    position: "right",
  },
  {
    element: "#home-page-add-post",
    intro: "Use this form to<br/>make new posts.",
    position: "top",
    highlightClass: "rounded-2xl",
  },
  {
    element: "#home-page-user-avatar",
    intro: "Click here to go to<br/>your profile.",
    position: "top",
    highlightClass: "rounded-full",
  },
  {
    element: "#site-header-invest",
    intro:
      "Accredited investors<br/>can browse for funds<br/>in the marketplace.",
    position: "bottom",
    highlightClass: "rounded-full",
  },
  {
    element: "#invite-card",
    intro: "Tap more to<br/>invite your network!",
    position: "left",
    highlightClass: "rounded-2xl",
  },
];

interface TutorialsProps {
  show: boolean;
}

const Tutorials: FC<TutorialsProps> = ({ show }) => {
  const loaded = useRef(false);
  const router = useRouter();
  useEffect(() => {
    if (
      !loaded.current &&
      show &&
      !LocalStorage.getItem(KEY_HOME_TUTORIALS_SHOWN)
    ) {
      loaded.current = true;
      introJs()
        .setOptions({
          steps,
          showBullets: false,
          tooltipClass: "tooltipCommon",
          highlightClass: "introjs-highlight",
          scrollToElement: false,
          exitOnEsc: false,
          exitOnOverlayClick: false,
          doneLabel: "Next",
        })
        .onexit(async () => {
          LocalStorage.setItem(KEY_HOME_TUTORIALS_SHOWN, "true");
          await router.push("/preferences");
        })
        .start();
    }
  }, [router, show]);
  return <></>;
};

export default Tutorials;
