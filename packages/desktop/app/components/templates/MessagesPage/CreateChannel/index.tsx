import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEventHandler,
} from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { UserResponse } from "stream-chat";
import _debounce from "lodash/debounce";

import Button from "desktop/app/components/common/Button";
import TagInput, { TagRenderer } from "desktop/app/components/common/TagInput";
import UserResult from "./UserResult";
import { X as XButton } from "phosphor-react";
import { StreamType } from "../types";

type CreateChannelProps = {
  onClose?: () => void;
  toggleMobile: () => void;
};

const CreateChannel: React.FC<CreateChannelProps> = ({
  onClose,
  toggleMobile,
}) => {
  const { client, setActiveChannel } = useChatContext<StreamType>();

  const [focusedUser, setFocusedUser] = useState<number>();
  const [inputText, setInputText] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const clearState = () => {
    setInputText("");
    setResultsOpen(false);
    setSearchEmpty(false);
  };

  useEffect(() => {
    const clickListener = () => resultsOpen && clearState();
    document.addEventListener("click", clickListener);

    return () => document.removeEventListener("click", clickListener);
  }, []);

  const findUsers = _debounce(
    async () => {
      if (searching) return;
      setSearching(true);

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID as string },
            $and: [{ name: { $autocomplete: inputText } }],
          },
          { id: 1 },
          { limit: 6 }
        );

        if (!response.users.length) {
          setSearchEmpty(true);
        } else {
          setSearchEmpty(false);
          setUsers(response.users);
        }

        setResultsOpen(true);
      } catch (error) {
        console.log({ error });
      }

      setSearching(false);
    },
    100,
    { trailing: true }
  );

  const createChannel = async () => {
    const selectedUsersIds = selectedUsers.map((user) => user.id);
    if (!client.userID || selectedUsers.length === 0) return;

    const conversation = await client.channel("messaging", {
      members: [...selectedUsersIds, client.userID],
    });

    await conversation.watch();

    setActiveChannel?.(conversation);
    setSelectedUsers([]);
    setUsers([]);
    onClose?.();
  };

  const addUser = (user: UserResponse) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
    setResultsOpen(false);
    setInputText("");

    inputRef.current?.focus();
  };

  const removeUser = (userId: string) => {
    const newUsers = selectedUsers.filter((item) => item.id !== userId);
    setSelectedUsers(newUsers);
    inputRef.current?.focus();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      // check for up(ArrowUp) or down(ArrowDown) key
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? users.length - 1 : prevFocused - 1;
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === users.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (focusedUser !== undefined) {
          addUser(users[focusedUser]);
          return setFocusedUser(undefined);
        }
      }
    },
    [users, focusedUser]
  );

  const renderTag: TagRenderer = ({ value, onRemove }) => {
    const user = selectedUsers.find((obj) => obj.id === value);
    if (!user) return null;

    return (
      <div
        className={`messaging-create-channel__user items-center rounded-full
          bg-background-blue pl-2 pr-3 mr-1 inline-flex cursor-pointer`}
        onClick={onRemove}
      >
        <Avatar image={(user.image as string) ?? null} size={24} />
        <div className="text-white mr-4 text-xs">
          {user.name}
        </div>
        <XButton color="white" />
      </div>
    );
  };

  return (
    <div className="w-full py-4 border-l border-white/[.15]">
      <div className="text-white mb-1 px-4 py-2">New Message</div>
      <header className="border-t border-white/[.15] pt-2">
        <div className="flex flex-col md:flex-row md:items-center items-stretch px-4">
          <span className="text-white">To:</span>
          <div className="flex-auto ml-2">
            <TagInput
              className="h-12"
              ref={inputRef}
              value={inputText}
              onChange={(evt) => {
                setInputText(evt.currentTarget.value);
                findUsers();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type username"
              tags={selectedUsers.map((user) => user.id)}
              renderTag={renderTag}
              onRemoveTag={(tag) => removeUser(tag)}
            />
            {inputText && (
              <div className="absolute min-w-[350px] mt-2 bg-background-header">
                <ul className="messaging-create-channel__user-results">
                  {!!users?.length && !searchEmpty && (
                    <div onMouseMove={() => setFocusedUser(undefined)}>
                      {users.map((user, i) => (
                        <div
                          className={`messaging-create-channel__user-result
                                cursor-pointer ${
                                  focusedUser === i
                                    ? "bg-info"
                                    : focusedUser === undefined
                                    ? "hover:bg-info"
                                    : ""
                                }`}
                          onClick={() => addUser(user)}
                          key={user.id}
                        >
                          <UserResult user={user} />
                        </div>
                      ))}
                    </div>
                  )}
                  {searchEmpty && (
                    <div
                      onClick={() => {
                        inputRef.current?.focus();
                        clearState();
                      }}
                      className="create-channel__user-result empty text-white p-2"
                    >
                      No people found...
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="gradient-primary"
            className="ml-2 mt-8 md:mt-0"
            onClick={createChannel}
          >
            Start Chat
          </Button>
        </div>
      </header>
    </div>
  );
};

export default React.memo(CreateChannel);
