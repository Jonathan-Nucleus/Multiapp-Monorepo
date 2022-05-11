import { FC } from "react";
import { Avatar } from "stream-chat-react";
import { Circle } from "phosphor-react";
import { AvatarMember } from "../../../../types/message";

interface AvatarGroupProps {
  members: AvatarMember[];
  size?: number;
}

const AvatarGroup: FC<AvatarGroupProps> = ({ members, size = 48 }) => {
  switch (members.length) {
    case 1:
      return (
        <div className="relative">
          <Avatar image={members[0].image} name={members[0].name} size={size} />
          <div className="absolute bottom-0 right-[16%]">
            {members[0].online ? (
              <Circle weight="fill" size="16" color="#55C090" />
            ) : (
              <Circle weight="fill" size="16" color="#CD403A" />
            )}
          </div>
        </div>
      );

    case 2:
      return (
        <div
          className={`
          channel-preview__avatars two rounded-full
        `}
        >
          <span>
            <Avatar
              image={members[0].image}
              name={members[0].name}
              shape="square"
              size={size}
            />
          </span>
          <span>
            <Avatar
              image={members[1].image}
              name={members[1].name}
              shape="square"
              size={size}
            />
          </span>
        </div>
      );

    case 3:
      return (
        <div
          className={`
          channel-preview__avatars three rounded-full
        `}
        >
          <span>
            <Avatar
              image={members[0].image}
              name={members[0].name}
              shape="square"
              size={size}
            />
          </span>
          <span>
            <Avatar
              image={members[1].image}
              name={members[1].name}
              shape="square"
              size={size / 2}
            />
            <Avatar
              image={members[2].image}
              name={members[2].name}
              shape="square"
              size={size / 2}
            />
          </span>
        </div>
      );

    default:
      return (
        <div
          className={`
          channel-preview__avatars rounded-full
        `}
        >
          <span>
            <Avatar
              image={members[members.length - 1].image}
              name={members[members.length - 1].name}
              shape="square"
              size={size / 2}
            />
            <Avatar
              image={members[members.length - 2].image}
              name={members[members.length - 2].name}
              shape="square"
              size={size / 2}
            />
          </span>
          <span>
            <Avatar
              image={members[members.length - 3].image}
              name={members[members.length - 3].name}
              shape="square"
              size={size / 2}
            />
            <Avatar
              image={members[members.length - 4].image}
              name={members[members.length - 4].name}
              shape="square"
              size={size / 2}
            />
          </span>
        </div>
      );
  }
};

export default AvatarGroup;
