import {
  UserFilters,
  PrimitiveFilter,
  UserSort,
  UserOptions,
} from 'stream-chat';
import _ from 'lodash';
import dayjs from 'dayjs';

export * from './types';

import type {
  User,
  Channel,
  Message,
  ChannelFilters,
  ChannelSort,
  Client,
  StreamType,
} from './types';

const CHANNEL_TYPE = 'messaging';

/**
 * Retreives the name of the channel or bases it on the first member of the
 * channel that is not the currently logged in user.
 *
 * @param channel   The channel.
 * @param userId    The ID of the currently authenticated user.
 *
 * @returns   A name for the channels.
 */
export function channelName(channel: Channel, userId: string): string {
  const { members } = channel.state;
  const users = Object.keys(members).filter((key) => key !== userId);
  const userNames = users
    .slice(0, 3)
    .map((id) => `${members[id].user?.firstName} ${members[id].user?.lastName}`)
    .join(', ');

  return (channel.data?.name || userNames) ?? '';
}

/**
 * Determines whether two consecutive messages should be grouped together in
 * the UI. When grouped, the user avatar and message timestamp only appears next
 * to the final message in the grouping. Messages are expected to be grouped if
 * they are from the same user and sent within 15 min of each other.
 */
function shouldGroupMessages(first: Message, second: Message): boolean {
  return (
    second.user?.id === first.user?.id &&
    dayjs(second.created_at).diff(first.created_at, 'minute') < 15
  );
}

/**
 * Processes and groups messages received from getstream. Messages returned by
 * this function have an additional property that indicates whether the message
 * is the last of a group of messages.
 *
 * @param messages  Array of stream chat messages.
 */
export function processMessages(messages: Message[]): PMessage[] {
  const processedMessages: PMessage[] = [];

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    processedMessages.push({
      ...message,
      lastMessage: messages[index + 1]
        ? !shouldGroupMessages(message, messages[index + 1])
        : true,
      firstMessage:
        index === 0 ? true : processedMessages[index - 1].lastMessage,
    });
  }

  return processedMessages.reverse();
}
export type PMessage = Message & {
  lastMessage: boolean;
  firstMessage: boolean;
};

/**
 * Adds a new stream chat message to an existing list of processed messages.
 *
 * @param message   The new message to add.
 * @param messages  The existing list of processed images.
 *
 * @returns   An updated list of processed messages that includes the new
 *            message.
 */
export function addMessage(message: Message, messages: PMessage[]): PMessage[] {
  if (messages.length === 0) {
    return [
      {
        ...message,
        firstMessage: true,
        lastMessage: true,
      },
    ];
  }

  let [prevMessage, ...otherMessages] = messages;
  const shouldGroup = shouldGroupMessages(prevMessage, message);
  if (shouldGroup) {
    prevMessage = {
      ...prevMessage,
      lastMessage: false,
    };
  }

  return [
    {
      ...message,
      lastMessage: true,
      firstMessage: prevMessage.lastMessage,
    },
    prevMessage,
    ...otherMessages,
  ];
}

export const findUsers = _.debounce(
  async (
    client: Client,
    searchText: string,
    sort: UserSort<StreamType> = [],
    options: UserOptions = {},
  ): Promise<User[]> => {
    if (!client.userID) {
      throw new Error('No user defined in chat session.');
    }

    try {
      const response = await client.queryUsers(
        {
          id: { $ne: client.userID as string },
          ...(searchText !== ''
            ? {
                $and: [
                  {
                    name: { $autocomplete: searchText },
                  } as unknown as Exclude<PrimitiveFilter<User>, null>, // Type error in getstream API
                ],
              }
            : {}),
        },
        sort,
        options,
      );

      return response.users;
    } catch (error) {
      console.log({ error });
    }

    return [];
  },
  100,
  { leading: true, trailing: true },
);

/**
 * Creates a new chat channel exclusive to the members provided.
 *
 * @param client    The stream chat client instance.
 * @param userIds`  List of IDs for members of the new channel.
 * @param name      Optional name of the channel.
 */
export async function createChannel(
  client: Client,
  userIds: string[],
  name?: string,
): Promise<Channel> {
  const channel = client.channel(CHANNEL_TYPE, {
    members: userIds,
    name,
  });

  await channel.create();
  return channel;
}
