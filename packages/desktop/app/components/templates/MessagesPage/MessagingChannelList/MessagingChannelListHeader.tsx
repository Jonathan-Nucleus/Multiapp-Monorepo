import React, { useEffect, useState, FormEventHandler } from "react";
import { Pencil } from "phosphor-react";
import Button from "../../../common/Button";
import SearchInput from "../../../common/SearchInput";
import _debounce from "lodash/debounce";

/** Debounce interval in ms for performing a channel search on input. */
const DEBOUNCE_INTERVAL = 500;

type MessagingChannelListProps = {
  onCreateChannel?: () => void;
  onSearch?: (value: string) => void;
};

const MessagingChannelListHeader: React.FC<MessagingChannelListProps> = ({
  onCreateChannel,
  onSearch,
}) => {
  const [inputText, setInputText] = useState("");
  const searchChannels = (): void => onSearch?.(inputText);
  const searchChannelsDebounce = _debounce(searchChannels, 100, {
    trailing: true,
  });

  const onChange: FormEventHandler<HTMLInputElement> = (evt) => {
    const inputText = evt.currentTarget.value;
    setInputText(inputText);
    searchChannelsDebounce();
  };

  return (
    <div className="mb-4">
      <div className="flex flex-row items-center justify-between my-4">
        <div className="text-white">Messages</div>
        <Button
          type="button"
          variant="outline-primary"
          className="rounded-full border-info bg-info/[0.5] text-white hover:bg-info h-25 h-10"
          onClick={onCreateChannel}
        >
          <Pencil
            color="currentColor"
            weight="bold"
            size={24}
            className="mr-1"
          />{" "}
          <span className="uppercase font-medium">New</span>
        </Button>
      </div>
      <SearchInput placeholder="Search" onChange={onChange} />
    </div>
  );
};

export default React.memo(MessagingChannelListHeader);
