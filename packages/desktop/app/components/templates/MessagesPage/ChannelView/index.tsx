import { FC, useEffect, useRef, useState } from "react";
import { Channel, PMessage } from "shared/context/Chat/types";
import ChatAvatar from "../ChatAvatar";
import { useAccountContext } from "shared/context/Account";
import Button from "../../../common/Button";
import { CaretLeft, Info } from "phosphor-react";
import MessageItem from "./MessageItem";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import GroupChatInfo from "./GroupChatInfo";
import { channelName, processMessages } from "shared/context/Chat/utils";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface ChannelViewProps {
  channel: Channel;
  onClose: () => void;
}

const ChannelView: FC<ChannelViewProps> = ({ channel, onClose }) => {
  const account = useAccountContext();
  const [messages, setMessages] = useState<PMessage[]>([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const lastMessageView = useRef<HTMLDivElement>(null);
  const { members } = channel.state;
  const users = Object.keys(members)
    .filter((key) => key != account._id)
    .map((id) => members[id].user!);
  const firstMessageDate =
    messages.length > 0 ? dayjs(messages[0].created_at) : undefined;

  useEffect(() => {
    setMessages(processMessages(channel.state.messages).reverse());
  }, [channel.state.messages]);
  useEffect(() => {
    lastMessageView.current?.scrollIntoView();
    channel.markRead().then();
  }, [channel, messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-white/[.12] px-7 py-4">
        <Button
          variant="text"
          className="text-white lg:hidden"
          onClick={onClose}
        >
          <CaretLeft size={24} color="currentColor" />
        </Button>
        <div className="flex items-center">
          <ChatAvatar size={48} members={channel.state.members} />
          <div className="text-white font-semibold ml-4">
            {channelName(channel, account._id)}
          </div>
        </div>
        <div
          className={
            Object.keys(channel.state.members).length == 2 ? "invisible" : ""
          }
        >
          <Button
            variant="text"
            className="text-white"
            onClick={() => setShowGroupInfo(true)}
          >
            <Info size={24} color="currentColor" />
          </Button>
          <GroupChatInfo
            users={users}
            show={showGroupInfo}
            onClose={() => setShowGroupInfo(false)}
          />
        </div>
      </div>
      <div className="flex-grow flex flex-col overflow-y-auto">
        <div className="text-center mt-12 mb-1">
          <div className="inline-block">
            <ChatAvatar size={64} members={channel.state.members} />
          </div>
          <div className="text-white/[.87] font-semibold mt-3">
            {channelName(channel, account._id)}
          </div>
        </div>
        <div className="mt-auto">
          {firstMessageDate && (
            <div className="text-xs text-white/[.6] text-center my-5">
              {firstMessageDate.isToday()
                ? `Today, ${firstMessageDate.format("h:mm A")}`
                : firstMessageDate.isYesterday()
                ? `Yesterday, ${firstMessageDate.format("h:mm A")}`
                : firstMessageDate.format("MMM D, h:mm A")}
            </div>
          )}
          {messages.map((message, index) => (
            <div ref={lastMessageView} key={index} className="my-4 px-3">
              <MessageItem
                message={message}
                isMine={message.user.id == account._id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelView;
