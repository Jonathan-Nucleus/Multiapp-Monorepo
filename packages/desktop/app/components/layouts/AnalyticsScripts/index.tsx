import { FC, useEffect, useState } from "react";
import Script from "next/script";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { DATADOG_RUM_ENVIRONMENT } = publicRuntimeConfig;

const GA_MEASUREMENT_ID = "G-MFTEK524Q4";

const AnalyticsScripts: FC = () => {
  const [windowFocus, setWindowFocus] = useState(true);

  useEffect(() => {
    const handleActivityFalse = () => {
      setWindowFocus(false);
    };

    const handleActivityTrue = () => {
      setWindowFocus(true);
    };

    window.addEventListener("focus", handleActivityTrue);
    window.addEventListener("blur", handleActivityFalse);

    return () => {
      window.removeEventListener("focus", handleActivityTrue);
      window.removeEventListener("blur", handleActivityFalse);
    };
  }, [windowFocus]);

  return (
    <>
      {/* Full Story Script */}
      <Script id="full-story-script" strategy="afterInteractive">
        {`
          window['_fs_debug'] = false;
          window['_fs_host'] = 'fullstory.com';
          window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
          window['_fs_org'] = 'o-1B7PX3-na1';
          window['_fs_namespace'] = 'FS';
          (function(m,n,e,t,l,o,g,y){
          if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
          g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
          o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
          y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
          g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
          g.anonymize=function(){g.identify(!!0)};
          g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
          g.log = function(a,b){g("log",[a,b])};
          g.consent=function(a){g("consent",!arguments.length||a)};
          g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
          g.clearUserCookie=function(){};
          g.setVars=function(n, p){g('setVars',[n,p]);};
          g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
          if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
          g._v="1.3.0";
          })(window,document,window['_fs_namespace'],'script','user');
        `}
      </Script>

      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window['ga-disable-${GA_MEASUREMENT_ID}'] = ${
          !windowFocus || DATADOG_RUM_ENVIRONMENT !== "production"
        };
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
};

export default AnalyticsScripts;
