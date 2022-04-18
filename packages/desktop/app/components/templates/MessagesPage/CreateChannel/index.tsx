import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { UserResponse } from "stream-chat";
import _debounce from "lodash/debounce";

import Button from "desktop/app/components/common/Button";
import Input from "desktop/app/components/common/Input";
import UserResult from "./UserResult";
import { XButton } from "../Icons";
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

  const findUsers = async () => {
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
  };

  const findUsersDebounce = _debounce(findUsers, 100, {
    trailing: true,
  });

  useEffect(() => {
    if (inputText) {
      findUsersDebounce();
    }
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const removeUser = (user: UserResponse) => {
    const newUsers = selectedUsers.filter((item) => item.id !== user.id);
    setSelectedUsers(newUsers);
    inputRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // check for up(ArrowUp) or down(ArrowDown) key
      if (event.key === "ArrowUp") {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? users.length - 1 : prevFocused - 1;
        });
      }
      if (event.key === "ArrowDown") {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === users.length - 1 ? 0 : prevFocused + 1;
        });
      }
      if (event.key === "Enter") {
        event.preventDefault();
        if (focusedUser !== undefined) {
          addUser(users[focusedUser]);
          return setFocusedUser(undefined);
        }
      }
    },
    [users, focusedUser] // eslint-disable-line
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full p-4 border-b border-white/[.15]">
      <div className="text-white mb-1">New Message</div>
      <header className="border-y-1 border-white/[.15]">
        <div className="flex flex-row items-start justify-between">
          <div className="text-white mt-2 mr-4">To</div>
          <div className="flex-auto px-2">
            <form>
              <div className="relative">
                <input
                  autoFocus
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={!selectedUsers.length ? "Type username" : ""}
                  type="text"
                  className="w-full h-12"
                />
                {inputText && (
                  <div className="absolute min-w-[350px] mt-2 bg-background-header">
                    <ul className="messaging-create-channel__user-results">
                      {!!users?.length && !searchEmpty && (
                        <div>
                          {users.map((user, i) => (
                            <div
                              className={`messaging-create-channel__user-result cursor-pointer hover:bg-info ${
                                focusedUser === i && "focused"
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
                          className="messaging-create-channel__user-result empty text-white p-2"
                        >
                          No people found...
                        </div>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </form>
            {!!selectedUsers?.length && (
              <div className="messaging-create-channel__users mt-2 flex flex-wrap">
                {selectedUsers.map((user) => (
                  <div
                    className="messaging-create-channel__user flex items-center rounded-full bg-info px-2 mx-1"
                    onClick={() => removeUser(user)}
                    key={user.id}
                  >
                    <Avatar image={(user.image as string) ?? null} size={20} />
                    <div className="messaging-create-channel__user-text text-white mr-2">
                      {user.name}
                    </div>
                    <XButton />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="gradient-primary"
            className="create-channel-button"
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
