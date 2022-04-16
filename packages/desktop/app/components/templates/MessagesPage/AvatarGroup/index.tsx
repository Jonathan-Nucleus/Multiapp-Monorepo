import { FC } from "react";
import { Channel, ChannelMemberResponse, User } from "stream-chat";
import { Avatar } from "stream-chat-react";

import { getCleanImage } from "../Icons";

interface Member {
  name?: string;
  image?: string;
}

interface AvatarGroupProps {
  members: Member[];
}

const AvatarGroup: FC<AvatarGroupProps> = ({ members }) => {
  switch (members.length) {
    case 1:
      return (
        <Avatar image={members[0].image} name={members[0].name} size={40} />
      );

    case 2:
      return (
        <div className="channel-preview__avatars two">
          <span>
            <Avatar
              image={members[0].image}
              name={members[0].name}
              shape="square"
              size={40}
            />
          </span>
          <span>
            <Avatar
              image={members[1].image}
              name={members[1].name}
              shape="square"
              size={40}
            />
          </span>
        </div>
      );

    case 3:
      return (
        <div className="channel-preview__avatars three">
          <span>
            <Avatar
              image={members[0].image}
              name={members[0].name}
              shape="square"
              size={40}
            />
          </span>
          <span>
            <Avatar
              image={members[1].image}
              name={members[1].name}
              shape="square"
              size={20}
            />
            <Avatar
              image={members[2].image}
              name={members[2].name}
              shape="square"
              size={20}
            />
          </span>
        </div>
      );

    default:
      return (
        <div className="channel-preview__avatars">
          <span>
            <Avatar
              image={members[members.length - 1].image}
              name={members[members.length - 1].name}
              shape="square"
              size={20}
            />
            <Avatar
              image={members[members.length - 2].image}
              name={members[members.length - 2].name}
              shape="square"
              size={20}
            />
          </span>
          <span>
            <Avatar
              image={members[members.length - 3].image}
              name={members[members.length - 3].name}
              shape="square"
              size={20}
            />
            <Avatar
              image={members[members.length - 4].image}
              name={members[members.length - 4].name}
              shape="square"
              size={20}
            />
          </span>
        </div>
      );
  }
};

export default AvatarGroup;
