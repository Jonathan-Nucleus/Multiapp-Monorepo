import { FC, useCallback } from "react";
import dayjs from "dayjs";
import { CheckCircle } from "phosphor-react";

import Avatar from "../../../../common/Avatar";
import {
  User,
  Post,
  Comment,
  isPost,
} from "../../../../../graphql/fragments/user";

export type DeleteHandler = (activity: Post | Comment) => void;
export type DisableCommentHandler = (post: Post, disable: boolean) => void;

interface TimelineProps {
  user: User;
  activity: Post | Comment;
  onDelete?: DeleteHandler;
  onDisableComment?: DisableCommentHandler;
}

const Timeline: FC<TimelineProps> = ({
  activity,
  user,
  onDelete,
  onDisableComment,
}) => {
  const type = activity.__typename;

  const deleteHandler = useCallback(() => {
    onDelete?.(activity);
  }, [onDelete, activity]);

  const disableHandler = useCallback(() => {
    if (!isPost(activity)) return;
    onDisableComment?.(activity, !activity.disableComments);
  }, [onDisableComment, activity]);

  return (
    <div className="mb-10 ml-6">
      <div className="flex absolute -left-8 justify-center items-center w-16 h-16 bg-gray-200 rounded-full">
        <Avatar user={user} />
      </div>
      <div className="p-4 ml-8 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-700 dark:border-gray-600">
        <div className="justify-between items-center mb-3 sm:flex">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            {dayjs(activity.createdAt).format("MMM DD, YYYY HH:mm")}
          </time>
          <div className="text-sm font-normal text-gray-500 lex dark:text-gray-300">
            {activity.user?.firstName} {activity.user?.lastName}
            <p className="font-semibold text-gray-900 dark:text-white hover:underline">
              {type}
            </p>
          </div>
        </div>
        <div className="p-3 text-sm font-normal text-gray-500 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
          {activity.body}
        </div>
        <div className="flex flex-row mt-2">
          {type === "Post" ? (
            <button
              className="flex flex-row items-center p-2 mr-4 h-10 w-50 bg-gray-50 hover:bg-gray-100 rounded-md"
              onClick={disableHandler}
            >
              <p className="mr-4">Disable Comments</p>
              <CheckCircle
                size={24}
                weight="bold"
                color={activity?.disableComments ? "#183ee9" : "#ccc"}
              />
            </button>
          ) : null}
          <button
            className="h-10 w-20 bg-gray-50 hover:bg-gray-100 rounded-md"
            onClick={deleteHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
