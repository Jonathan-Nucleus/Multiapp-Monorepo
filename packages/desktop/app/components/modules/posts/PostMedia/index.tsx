import { Media as MediaType } from "shared/graphql/fragments/post";
import { FC } from "react";
import Media from "../../../common/Media";

interface PostMediaProps {
  userId: string;
  postId?: string;
  media: MediaType;
}

const PostMedia: FC<PostMediaProps> = ({ userId, media, postId }) => {
  const key = postId ? `${postId}/${media.url}` : `${media.url}`;
  const url = `${process.env.NEXT_PUBLIC_AWS_BUCKET}/posts/${userId}/${key}`;
  return <Media url={url} aspectRatio={media.aspectRatio} />;
};

export default PostMedia;
