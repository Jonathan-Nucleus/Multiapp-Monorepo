import React, { FC, useEffect, useState } from "react";
import { ChannelFilters, ChannelSort } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  LoadingIndicator,
} from "stream-chat-react";

import GetStartedChannel from "./GetStartedChannel";
import CreateChannel from "./CreateChannel";
import PChannelList, { PChannelListHeader } from "./PChannelList";
import PChannelPreview from "./PChannelList/PChannelPreview";
import PThreadHeader from "./PChannel/PThreadHeader";
import { PChannel } from "./PChannel";
import { GiphyContext } from "../../../types/message";
import { useAccountContext } from "shared/context/Account";
import { useChatContext } from "shared/context/Chat";

const TARGET_ORIGIN = "https://getstream.io";
const options = { state: true, watch: true, presence: true };

const MessagesPage: FC = () => {
  const { client } = useChatContext() ?? {};
  const account = useAccountContext();

  const [channelFilters, setChannelFilters] = useState<ChannelFilters>({
    type: "messaging",
    members: { $in: [account._id] },
  });
  const [channelSort, setChannelSort] = useState<ChannelSort>({
    last_message_at: -1,
    updated_at: -1,
    cid: 1,
  });
  const [giphyState, setGiphyState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileNavVisible, setMobileNav] = useState(false);

  useEffect(() => {
    const mobileChannelList = document.querySelector("#mobile-channel-list");
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add("show");
      document.body.style.overflow = "hidden";
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  }, [isMobileNavVisible]);

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    setAppHeight();

    window.addEventListener("resize", setAppHeight);
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  const giphyContextValue = { giphyState, setGiphyState };
  const toggleMobile = () => setMobileNav(!isMobileNavVisible);

  const onChannelSearch = (keyword: string): void => {
    if (!account) return;

    const criteria: ChannelFilters = {
      type: "messaging",
      $and: [{ members: { $in: [account._id] } }],
    };

    if (keyword) {
      criteria.$and?.push({
        $or: [{ members: { $in: [keyword] } }, { name: { $in: [keyword] } }],
      });
    }

    setChannelFilters(criteria);
  };

  if (!client)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-82px)]">
        <LoadingIndicator size={40} />
      </div>
    );

  return (
    <Chat client={client} theme="prometheus-messages dark">
      <div className="flex h-[calc(100vh-82px)] border border-white/[.15]">
        <div
          id="mobile-channel-list"
          className="w-[300px] border-r border-white/[.15] pmessages-sidebar"
          onClick={toggleMobile}
        >
          <PChannelListHeader
            onCreateChannel={() => setIsCreating(!isCreating)}
            onSearch={onChannelSearch}
          />
          <ChannelList
            filters={channelFilters}
            sort={channelSort}
            options={options}
            List={PChannelList}
            Preview={(props) => (
              <PChannelPreview {...{ setIsCreating }} {...props} />
            )}
          />
        </div>
        <div className="flex-auto">
          {isCreating ? (
            <CreateChannel
              toggleMobile={toggleMobile}
              onClose={() => setIsCreating(false)}
            />
          ) : (
            <Channel
              maxNumberOfFiles={10}
              multipleUploads={true}
              ThreadHeader={PThreadHeader}
              TypingIndicator={() => null}
              EmptyPlaceholder={
                <GetStartedChannel
                  onCreateChannel={() => setIsCreating(true)}
                />
              }
            >
              <GiphyContext.Provider value={giphyContextValue}>
                <PChannel toggleMobile={toggleMobile} />
              </GiphyContext.Provider>
            </Channel>
          )}
        </div>
      </div>
    </Chat>
  );
};

export default MessagesPage;
