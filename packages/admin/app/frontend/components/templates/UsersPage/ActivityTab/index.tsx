import { FC, useMemo, useState } from "react";
import dayjs from "dayjs";

import Filter from "../../../common/Filter";
import Search from "../../../common/Search";

import Timeline, { DeleteHandler, DisableCommentHandler } from "./Timeline";

import { User, Post, Comment } from "admin/app/frontend/graphql/fragments/user";
import { useUserActivity } from "../../../../graphql/queries/users/useActivity";
import {
  useDeleteComment,
  useDisableComments,
  useDeletePost,
} from "../../../../graphql/mutations/posts";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Posts", value: "posts" },
  { label: "Comments", value: "comments" },
] as const;
type FilterOption = typeof FILTER_OPTIONS[number]["value"];

interface ActivityTabProps {
  user: User;
}

const ActivityTab: FC<ActivityTabProps> = ({ user }) => {
  const { data: { user: activityData } = {} } = useUserActivity(user._id);
  const [deletePost] = useDeletePost();
  const [deleteComment] = useDeleteComment();
  const [disableComment] = useDisableComments();

  const [activityFilter, setActivityFilter] = useState<FilterOption>("all");
  const [searchText, setSearchText] = useState("");

  const activity = useMemo(() => {
    let activity: Array<Post | Comment> = [];
    if (activityFilter === "all" || activityFilter === "posts") {
      activity = [...(activityData?.posts ?? [])];
    }
    if (activityFilter === "all" || activityFilter === "comments") {
      activity = [...activity, ...(activityData?.comments ?? [])];
    }
    if (searchText !== "") {
      const lowercaseText = searchText.toLowerCase();
      activity = activity.filter((activity) =>
        activity.body?.toLowerCase().includes(lowercaseText)
      );
    }

    return activity.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
  }, [activityData, activityFilter, searchText]);

  const deleteHandler: DeleteHandler = async (activity) => {
    if (activity.__typename === "Post") {
      const { data } = await deletePost({
        variables: { postId: activity._id },
      });
      if (!data?.deletePost) {
        console.log("Error deleting post");
      }
    } else {
      const { data } = await deleteComment({
        variables: { commentId: activity._id },
      });
      if (!data?.deleteComment) {
        console.log("Error deleting comment");
      }
    }
  };

  const disableHandler: DisableCommentHandler = async (post, disable) => {
    const { data } = await disableComment({
      variables: {
        postId: post._id,
        disable: disable,
      },
    });
    if (!data?.disableComments) {
      console.log("Error disabling comments for post");
    }
  };

  return (
    <>
      <div className="flex flex-row w-full bg-gray-200 h-16 justify-between  items-center pl-3">
        <div className="w-3/12 bg-blue">
          <Search onSearch={(text) => setSearchText(text)} />
        </div>
        <div className="flex w-3/12 justify-end mr-6">
          <Filter
            className="w-[125px]"
            options={FILTER_OPTIONS}
            value={activityFilter}
            onOptionSelected={(option) => setActivityFilter(option)}
          />
        </div>
      </div>
      <div className="h-100 w-full p-12">
        <div className="relative border-l border-gray-200 dark:border-gray-700">
          {activity.map((val) => {
            return (
              <Timeline
                key={val._id}
                user={user}
                activity={val}
                onDelete={deleteHandler}
                onDisableComment={disableHandler}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ActivityTab;
