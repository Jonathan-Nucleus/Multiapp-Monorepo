import React, { FC, useEffect, useState } from "react";
import { useChatContext } from "shared/context/Chat";
import Spinner from "../../common/Spinner";
import DisclosureCard from "../../modules/funds/DisclosureCard";
import ChannelList, { ChannelType } from "./ChannelList";
import MessageInput from "./MessageInput";
import ChannelView from "./ChannelView";
import CreateChannel from "./CreateChannel";
import ChatsImage from "shared/assets/images/Chats.svg";
import Button from "../../common/Button";
import Image from "next/image";
import { Pencil } from "phosphor-react";
import { createChannel } from "shared/context/Chat/utils";

interface MessagesPageProps {
  user?: string;
}

const MessagesPage: FC<MessagesPageProps> = ({ user }) => {
  const session = useChatContext();
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>();

  useEffect(() => {
    if (session && user) {
      createChannel(session.client, "messaging", [
        user,
        session.client.userID!,
      ]).then((channel) => {
        setSelectedChannel(channel);
      });
    }
  }, [session, user]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-x border-white/[.12]">
      <div className="flex flex-grow min-h-0 relative">
        <div className="w-full lg:w-96 flex-shrink-0 pt-9 lg:border-r border-white/[.12]">
          <div className="flex flex-col h-full">
            <div className="flex-grow min-h-0">
              <ChannelList
                session={session}
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel}
              />
            </div>
            <div className="h-20 flex-shrink-0 border-t border-white/[.12] px-3">
              <DisclosureCard className="my-3" />
            </div>
          </div>
        </div>
        <div
          className={`lg:static flex-grow flex flex-col bg-background ${
            selectedChannel ? "absolute inset-0 z-10" : ""
          }`}
        >
          <div className="flex-grow min-h-0">
            {selectedChannel ? (
              <>
                {selectedChannel == "NEW_CHANNEL" ? (
                  <CreateChannel
                    session={session}
                    onCreate={setSelectedChannel}
                    onClose={() => setSelectedChannel(undefined)}
                  />
                ) : (
                  <ChannelView
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(undefined)}
                  />
                )}
              </>
            ) : (
              <div className="hidden lg:block text-center">
                <div>
                  <Image src={ChatsImage} alt="" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="gradient-primary"
                    className="font-semibold"
                    onClick={() => setSelectedChannel("NEW_CHANNEL")}
                  >
                    <Pencil size={24} />
                    <span className="ml-1">Start A Conversation</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          {selectedChannel && selectedChannel != "NEW_CHANNEL" && (
            <div className="min-h-[80px] flex-grow-0 flex-shrink-0 flex items-center border-t border-white/[.12]">
              <MessageInput channel={selectedChannel} />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="primary"
          className={`lg:hidden w-12 h-12 text-black !fixed bottom-12 right-10 ${
            selectedChannel == "NEW_CHANNEL" ? "hidden" : ""
          }`}
          onClick={() => setSelectedChannel("NEW_CHANNEL")}
        >
          <Pencil size={24} color="currentColor" className="text-black" />
        </Button>
      </div>
    </div>
  );
};

export default MessagesPage;
