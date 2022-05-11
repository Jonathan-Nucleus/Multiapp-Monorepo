import React, {
  ChangeEvent,
  FC,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Dialog } from "@headlessui/react";
import { Channel } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import { X, CheckCircle, Pencil, Trash, UserMinus } from "phosphor-react";

import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import Input from "../../../../common/Input";
import AvatarGroup from "../../AvatarGroup";
import { StreamType } from "../../../../../types/message";
import { useMessageChannel } from "../../../../../hooks/useMessageChannel";

interface EditModalProps {
  show: boolean;
  channel: Channel<StreamType> | Channel;
  onClose: () => void;
}

const PChannelEdit: FC<EditModalProps> = ({ show, channel, onClose }) => {
  const { client } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { channelAvatar } = useMessageChannel(channel);

  const members = useMemo(
    () =>
      Object.values(channel.state?.members).filter(
        (member) => member.user?.id !== client?.user?.id
      ),
    [channel, client]
  );

  useEffect(() => {
    let channelName = channel.data?.name;
    if (!channelName) {
      channelName = members
        .map((member) => member.user?.name || member.user?.id || "Unnamed User")
        .join(", ");
    }

    setChannelName(channelName);
  }, [channel, members]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  const updateChannel = async () => {
    if (channelName && channelName !== channel.data?.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    setIsEditing(false);
  };

  const EditChannelName = () => (
    <div className="flex items-center">
      <Input
        autoFocus
        className="h-12"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setChannelName(event.target.value);
          inputRef?.current?.blur();
        }}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
      <CheckCircle
        className="ml-2"
        color="white"
        size="32"
        onClick={updateChannel}
      />
    </div>
  );

  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen text-white">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 mx-auto p-0 z-10 w-full max-w-md">
            <div className="flex justify-between items-center  px-4 py-2">
              <div className="text-md text-white font-medium tracking-widest">
                Edit Channel
              </div>
              <Button variant="text" className="text-white" onClick={onClose}>
                <X color="white" weight="bold" size={24} />
              </Button>
            </div>
            <div className="">
              <div className="border-b border-white/[.12] py-4 flex flex-col items-center">
                <AvatarGroup size={96} members={channelAvatar} />
                <div className="mt-2 text-md text-center">
                  {members[0].user?.name}
                </div>
              </div>
              <div className="p-4 border-b">
                {!isEditing ? (
                  <div className="flex items-center">
                    <div className="mr-4">{channelName}</div>
                    <Pencil
                      color="white"
                      size="24"
                      onClick={() => setIsEditing(true)}
                    />
                  </div>
                ) : (
                  <EditChannelName />
                )}
              </div>
              <div className="p-4 border-b">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {}}
                >
                  <Trash color="#CD403A" size="24" />
                  <div className="ml-2 text-error">Delete Contact</div>
                </div>
              </div>
              <div className="p-4">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {}}
                >
                  <UserMinus color="#CD403A" size="24" />
                  <div className="ml-2 text-error">Block Contact</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default PChannelEdit;
