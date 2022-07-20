import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEventHandler,
  ChangeEvent,
} from "react";
import Button from "desktop/app/components/common/Button";
import TagInput, { TagRenderer } from "desktop/app/components/common/TagInput";
import { CaretLeft, X as XButton } from "phosphor-react";
import { ChatSession } from "shared/context/Chat";
import ChatAvatar from "../ChatAvatar";
import { Channel, User } from "shared/context/Chat/types";
import _ from "lodash";
import { findUsers } from "shared/context/Chat/utils";

type CreateChannelProps = {
  session: ChatSession;
  onCreate: (channel: Channel) => void;
  onClose: () => void;
};

const CreateChannel: React.FC<CreateChannelProps> = ({
  session,
  onCreate,
  onClose,
}) => {
  const [focusedUser, setFocusedUser] = useState(0);
  const [inputText, setInputText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const searchCallback = useRef(
    _.debounce(
      async (query: string) => {
        setUsers([]);
        setFocusedUser(0);
        const _users = await findUsers(session.client, query, [
          { last_active: -1 },
          { id: 1 },
        ]);
        if (_users) {
          setUsers(_users);
        }
      },
      100,
      { leading: true, trailing: true }
    )
  ).current;

  useEffect(() => {
    const clickListener = () => setInputText("");
    document.addEventListener("click", clickListener);
    return () => document.removeEventListener("click", clickListener);
  }, []);

  const createChannel = async () => {
    setInputText("");
    setLoading(true);
    const selectedUsersIds = selectedUsers.map((user) => user.id);
    const channel = await session.client.channel("messaging", {
      members: [...selectedUsersIds, session.client.userID!],
    });
    await channel.create();
    onCreate(channel);
  };

  const addUser = (user: User) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
    setInputText("");
    inputRef.current?.focus();
  };

  const removeUser = (userId: string) => {
    const newUsers = selectedUsers.filter((item) => item.id !== userId);
    setSelectedUsers(newUsers);
    inputRef.current?.focus();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedUser((prevFocused) => {
        return prevFocused == 0 ? users.length - 1 : prevFocused - 1;
      });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedUser((prevFocused) => {
        return prevFocused == users.length - 1 ? 0 : prevFocused + 1;
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (focusedUser >= 0 && focusedUser < users.length) {
        addUser(users[focusedUser]);
      }
    }
  };

  const renderTag: TagRenderer = ({ value, onRemove }) => {
    const user = selectedUsers.find((obj) => obj.id === value);
    if (!user) return null;

    return (
      <div className="inline-flex items-center rounded-full bg-background-blue cursor-pointer mr-1 my-1 pl-2 pr-3 py-2">
        <ChatAvatar
          user={user}
          size={24}
          showStatus={false}
          clickable={false}
        />
        <div className="text-white text-xs mx-4">{user.name}</div>
        <XButton color="white" onClick={onRemove} />
      </div>
    );
  };

  return (
    <div className="w-full py-4 lg:border-l border-white/[.15]">
      <div className="mb-1 px-4 py-2">
        <div className="flex items-center">
          <Button
            variant="text"
            className="text-white lg:hidden mr-4"
            onClick={onClose}
          >
            <CaretLeft size={24} color="currentColor" />
          </Button>
          <div className="text-white">New Message</div>
        </div>
      </div>
      <header className="border-t border-white/[.15] pt-2">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center px-4">
          <span className="text-white">To:</span>
          <div className="flex-grow relative lg:mx-3">
            <TagInput
              ref={inputRef}
              className="text-sm py-3"
              value={inputText}
              onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                setInputText(event.target.value);
                await searchCallback(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type username"
              tags={selectedUsers.map((user) => user.id)}
              renderTag={renderTag}
              onRemoveTag={(tag) => removeUser(tag)}
            />
            {inputText && (
              <div className="w-80 bg-background-header rounded-lg shadow overflow-hidden absolute z-20 mt-2">
                <div className="divide-y divide-inherit border-white/[.12] max-h-96 overflow-y-auto">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer hover:bg-primary-overlay/[.2] transition-all ${
                        focusedUser == index ? "bg-primary-overlay/[.2]" : ""
                      }`}
                      onClick={() => addUser(user)}
                    >
                      <div className="flex items-center px-6 py-3">
                        <ChatAvatar user={user} size={48} clickable={false} />
                        <div className="ml-4">
                          <div className="text-base text-white font-semibold">
                            {user.name}
                          </div>
                          <div className="text-sm text-white/[.6]"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="gradient-primary"
            className="flex-shrink-0 text-sm text-white font-medium uppercase mt-8 lg:mt-0"
            disabled={selectedUsers.length == 0}
            loading={loading}
            onClick={createChannel}
          >
            Start Chat
          </Button>
        </div>
      </header>
    </div>
  );
};

export default CreateChannel;
