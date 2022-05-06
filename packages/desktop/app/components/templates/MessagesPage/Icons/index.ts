import { ChannelMemberResponse } from "stream-chat";
import defaultAvatar from "./default.jpeg";

export { GetStartedIcon } from "./GetStartedIcon";
export { CloseThreadIcon } from "./CloseThreadIcon";
export { CommandIcon } from "./CommandIcon";
export { LightningBoltSmall } from "./LightningBoltSmall";

export const getCleanImage = (member: ChannelMemberResponse) => {
  let cleanImage = member.user?.image || "";

  if (!cleanImage) {
    cleanImage = defaultAvatar;
  }

  return cleanImage;
};
