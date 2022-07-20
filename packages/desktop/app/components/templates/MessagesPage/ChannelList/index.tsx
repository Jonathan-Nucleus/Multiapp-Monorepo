import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../../../common/Button";
import { Pencil } from "phosphor-react";
import SearchInput from "../../../common/SearchInput";
import { ChatSession } from "shared/context/Chat";
import retry from "async-retry";
import { Channel, ChannelSort } from "shared/context/Chat/types";
import ChannelItem from "./ChannelItem";
import _ from "lodash";

const DEFAULT_SORT: ChannelSort = [
  { last_message_at: -1 },
  { updated_at: -1 },
  { cid: 1 },
];

export type ChannelType = Channel | "NEW_CHANNEL";

interface ChannelListProps {
  session: ChatSession;
  selectedChannel?: ChannelType;
  onSelectChannel: (channel: ChannelType) => void;
}

const ChannelList: FC<ChannelListProps> = ({
  session,
  selectedChannel,
  onSelectChannel,
}) => {
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const fetchChannels = useCallback(
    async (query: string) => {
      const filter = {
        type: "messaging",
        members: { $in: [session.userId] },
        ...(query.trim().length > 0
          ? {
              "member.user.name": {
                $autocomplete: query,
              },
            }
          : {}),
      };
      const _channels = await retry(
        () =>
          session.client.queryChannels(filter, DEFAULT_SORT, {
            limit: 12,
            watch: true,
          }),
        {
          onRetry: (error) => {
            session.reconnect();
            console.log("retrying", error);
          },
        }
      );
      setChannels(_channels);
    },
    [session]
  );
  const searchCallback = useRef(
    _.debounce(async (query: string) => {
      await fetchChannels(query);
    }, 500)
  ).current;

  useEffect(() => {
    if (query.trim().length > 1) {
      searchCallback(query);
    } else {
      searchCallback("");
    }
  }, [query, searchCallback]);
  useEffect(() => {
    fetchChannels("").then();
  }, [fetchChannels]);

  useEffect(() => {
    const handler = session.client.on((event) => {
      switch (event.type) {
        case "message.new":
        case "channel.created":
        case "channel.updated":
        case "channel.deleted":
          setChannels([...channels]);
          if (selectedChannel && selectedChannel != "NEW_CHANNEL") {
            onSelectChannel(_.clone(selectedChannel));
          }
          break;
        case "notification.added_to_channel":
          fetchChannels("").then();
          break;
      }
    });
    return () => handler.unsubscribe();
  }, [
    channels,
    fetchChannels,
    onSelectChannel,
    selectedChannel,
    session.client,
  ]);

  return (
    <div className="flex flex-col h-full px-6">
      <div className="flex items-center justify-between">
        <div className="text-xl text-white font-medium">Messages</div>
        <div className="hidden lg:block">
          <Button
            variant="outline-primary"
            className="text-sm !text-white font-semibold bg-info/[0.24]"
            onClick={() => onSelectChannel("NEW_CHANNEL")}
          >
            <Pencil
              color="currentColor"
              weight="bold"
              size={24}
              className="mr-1"
            />
            <span className="ml-1">NEW</span>
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <SearchInput
          placeholder="Search"
          value={query}
          className="text-sm"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
        />
      </div>
      <div className="flex-grow overflow-y-auto mt-8">
        {selectedChannel == "NEW_CHANNEL" && (
          <div className="rounded-lg overflow-hidden">
            <div className="bg-primary-overlay/[.24] px-8 py-7">
              New Message
            </div>
          </div>
        )}
        {channels.map((channel, index) => (
          <div key={index}>
            <ChannelItem
              channel={channel}
              selected={
                selectedChannel != "NEW_CHANNEL" &&
                selectedChannel?.id == channel.id
              }
              onSelect={() => onSelectChannel(channel)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;
