import { ChannelMemberResponse } from "stream-chat";
import defaultAvatar from "./default.jpeg";

export { GetStartedIcon } from "./GetStartedIcon";
export { ChannelInfoIcon } from "./ChannelInfoIcon";
export { ChannelSaveIcon } from "./ChannelSaveIcon";
export { CloseThreadIcon } from "./CloseThreadIcon";
export { CommandIcon } from "./CommandIcon";
export { EmojiIcon } from "./EmojiIcon";
export { LightningBoltSmall } from "./LightningBoltSmall";
export { SendIcon } from "./SendIcon";

export const getCleanImage = (member: ChannelMemberResponse) => {
  let cleanImage = member.user?.image || "";

  if (!cleanImage) {
    cleanImage = defaultAvatar;
  }

  return cleanImage;
};
