import type {
  StreamChat,
  DefaultGenerics,
  Channel as SCChannel,
  ChannelSort as SCChanelSort,
  ChannelFilters as SCChannelFilters,
  MessageResponse as SCMessage,
  UserResponse as SCUser,
} from 'stream-chat';

type UserType = Pick<
  SCUser<DefaultGenerics>,
  'id' | 'name' | 'online' | 'created_at' | 'last_active'
> & {
  image?: string;
  company?: string;
  position?: string;
};

type MessageType = Pick<
  SCMessage<DefaultGenerics>,
  'id' | 'userId' | 'attachments' | 'parent_id' | 'text' | 'user' | 'created_at'
>;

export interface StreamType extends DefaultGenerics {
  messageType: MessageType;
  userType: UserType;
}

export type User = UserType;
export type Channel = SCChannel<StreamType>;
export type Message = MessageType;
export type ChannelFilters = SCChannelFilters<StreamType>;
export type ChannelSort = SCChanelSort<StreamType>;
export type Client = StreamChat<StreamType>;
