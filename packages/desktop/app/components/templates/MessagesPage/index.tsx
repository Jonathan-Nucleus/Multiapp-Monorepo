import React, { useEffect, useState, useRef } from "react";
import { ChannelFilters, ChannelSort, StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  LoadingIndicator,
} from "stream-chat-react";
import { useChecklist } from "./ChecklistTasks";
import { useAccount } from "shared/graphql/query/account/useAccount";
import { useChatToken } from "shared/graphql/query/account/useChatToken";

import GetStartedChannel from "./GetStartedChannel";
import CreateChannel from "./CreateChannel";
import PChannelList, { PChannelListHeader } from "./PChannelList";
import PChannelPreview from "./PChannelList/PChannelPreview";
import PThreadHeader from "./PChannel/PThreadHeader";
import { PChannel } from "./PChannel";
import { GiphyContext } from "../../../types/message";

const API_KEY = "2xhrce9kvxbt"; //process.env.NEXT_PUBLIC_GETSTREAM_ACCESS_KEY as string;
const TARGET_ORIGIN = "https://getstream.io"; //process.env.NEXT_PUBLIC_STREAM_TARGET_ORIGIN as string;
const options = { state: true, watch: true, presence: true };

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
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const { data: chatData } = useChatToken();
  console.log("Received chat token", chatData);
  console.log("App key", API_KEY);
  console.log("App origin", TARGET_ORIGIN);

  useChecklist(chatClient.current, TARGET_ORIGIN);

  useEffect(() => {
    if (API_KEY && !chatClient.current && chatData?.chatToken && account) {
      console.log("initializing chat client");
      const initChat = async () => {
        const client = StreamChat.getInstance(API_KEY, {
          enableInsights: true,
          enableWSFallback: true,
        });
        
        await client.connectUser(
          {
            id: account._id,
            name: `${account.firstName} ${account.lastName}`,
            image: `${process.env.NEXT_PUBLIC_AVATAR_URL}/${account.avatar}`,
          },
          chatData.chatToken
        );
        console.log("connected user", client);

        chatClient.current = client;
        setChannelFilters({
          type: "messaging",
          members: { $in: [account._id] },
        });
      };

      initChat();

      return () => {
        if (chatClient.current) {
          chatClient.current.disconnectUser();
          chatClient.current = null;
        }
      };
    }
  }, [chatData, account]);

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

  if (!chatClient.current) return (
    <div className="flex items-center justify-center h-[calc(100vh-82px)]">
      <LoadingIndicator size={40} />
    </div>
  );

  return (
    <Chat client={chatClient.current} theme="prometheus-messages dark">
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
