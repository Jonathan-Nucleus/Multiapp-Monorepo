import React from "react";
import { GetStartedIcon, CreateChannelIcon } from "./Icons";

import Button from "../../common/Button";

export type GetStartedChannelProps = {
  onCreateChannel: () => void;
};


const GetStartedChannel: React.FC<GetStartedChannelProps> = (props) => {
  const { onCreateChannel } = props;

  return (
    <div className="w-full flex flex-col items-center">
      <GetStartedIcon />
      <Button type="button" variant="gradient-primary" onClick={onCreateChannel}>
        <CreateChannelIcon />
        &nbsp;Start A Conversation
      </Button>
    </div>
  );
};

export default GetStartedChannel;
