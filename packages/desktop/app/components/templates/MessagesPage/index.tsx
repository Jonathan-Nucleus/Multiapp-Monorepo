import React, { useEffect, useMemo, useState, useRef } from "react";
import { ChannelFilters, ChannelSort, StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  LoadingIndicator,
} from "stream-chat-react";
import { useChecklist } from "./ChecklistTasks";
import { useChatToken, useAccount } from "mobile/src/graphql/query/account";

import GetStartedChannel from "./GetStartedChannel";
import CreateChannel from "./CreateChannel";
import MessagingChannelList, {
  MessagingChannelListHeader,
} from "./MessagingChannelList";
import MessagingChannelPreview from "./MessagingChannelPreview";
import MessagingThreadHeader from "./MessagingThread";
import { ChannelInner } from "./ChannelInner";
import { StreamType, GiphyContext } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_ACCESS_KEY as string;
const TARGET_ORIGIN = process.env.NEXT_PUBLIC_STREAM_TARGET_ORIGIN as string;
const options = { state: true, watch: true, presence: true, limit: 4 };

const MessagesPage = () => {
  const chatClient = useRef<StreamChat | null>(null);
  const [channelFilters, setChannelFilters] = useState<ChannelFilters>();
  const [channelSort, setChannelSort] = useState<ChannelSort>({
    last_message_at: -1,
    updated_at: -1,
    cid: 1,
  });
  const [giphyState, setGiphyState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileNavVisible, setMobileNav] = useState(false);
  const { data: userData } = useAccount();
  const { data: chatData } = useChatToken();

  useChecklist(chatClient.current, TARGET_ORIGIN);

  useEffect(() => {
    if (API_KEY && !chatClient.current && chatData?.chatToken && userData) {
      const initChat = async () => {
        const client = StreamChat.getInstance(API_KEY, {
          enableInsights: true,
          enableWSFallback: true,
        });
        await client.connectUser(
          {
            id: userData.account._id,
            name: `${userData.account.firstName} ${userData.account.lastName}`,
            image: undefined,
          },
          chatData.chatToken
        );

        chatClient.current = client;
        setChannelFilters({
          type: "messaging",
          members: { $in: [userData.account._id] },
        });
      };

      initChat();

      return () => {
        chatClient.current?.disconnectUser();
      };
    }
  }, [chatData, userData]);

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
    /*
     * Get the actual rendered window height to set the container size properly.
     * In some browsers (like Safari) the nav bar can override the app.
     */
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
    if (!userData) return;

    const criteria: ChannelFilters = {
      type: "messaging",
      $and: [{ members: { $in: [userData.account._id] } }],
    };

    if (keyword) {
      criteria.$and?.push({
        $or: [{ members: { $in: [keyword] } }, { name: { $in: [keyword] } }],
      });
    }

    setChannelFilters(criteria);
  };

  if (!chatClient.current) return <LoadingIndicator />;

  return (
    <Chat client={chatClient.current} theme="prometheus-messages dark">
      <div className="flex h-[calc(100vh-78px)] overflow-hidden">
        <div
          id="mobile-channel-list"
          className="w-72 p-4 border-r border-white/[.15]"
          onClick={toggleMobile}
        >
          <MessagingChannelListHeader
            onCreateChannel={() => setIsCreating(!isCreating)}
            onSearch={onChannelSearch}
          />
          <ChannelList
            filters={channelFilters}
            sort={channelSort}
            options={options}
            List={MessagingChannelList}
            Preview={(props) => (
              <MessagingChannelPreview {...{ setIsCreating }} {...props} />
            )}
          />
        </div>
        <div className="flex-auto overflow-y-auto">
          {isCreating ? (
            <CreateChannel
              toggleMobile={toggleMobile}
              onClose={() => setIsCreating(false)}
            />
          ) : (
            <Channel
              maxNumberOfFiles={10}
              multipleUploads={true}
              ThreadHeader={MessagingThreadHeader}
              TypingIndicator={() => null}
            >
              <GiphyContext.Provider value={giphyContextValue}>
                <ChannelInner toggleMobile={toggleMobile} />
              </GiphyContext.Provider>
            </Channel>
          )}
        </div>
      </div>
    </Chat>
  );
};

export default MessagesPage;
