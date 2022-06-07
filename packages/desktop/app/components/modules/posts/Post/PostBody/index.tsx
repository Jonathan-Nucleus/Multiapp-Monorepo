import { FC, ReactElement, useMemo, useState } from "react";
import Link from "next/link";
import { UserProfile } from "backend/graphql/users.graphql";
import { hrefFromLink, isWebLink, processPost } from "shared/src/patterns";
import LinkPreview from "../../LinkPreview";
import PostMedia from "../../PostMedia";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import Post from "..";

interface PostBodyProps {
  account: Pick<UserProfile, "_id"> | undefined;
  post: PostType;
  isPreview?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  account,
  post,
  isPreview = false,
}: PostBodyProps) => {
  const [previewLink, setPreviewLink] = useState<string>();
  const elements = useMemo(() => {
    if (!post.body) {
      return [<></>];
    }
    const splitBody = processPost(post.body);
    const _elements: (string | ReactElement)[] = [];
    let numLinks = 0;
    splitBody.map((text, index) => {
      if (text.startsWith("$")) {
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/search/posts?query=${text.slice(1)}`}
          >
            <a className="text-primary">{text}</a>
          </Link>
        );
      } else if (text.startsWith("#")) {
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/search/posts?query=${text.slice(1)}`}
          >
            <a className="text-primary">{text}</a>
          </Link>
        );
      } else if (text.startsWith("@") && text.includes("|")) {
        const [name, id] = text.split("|");
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/profile/${account?._id == id ? "me" : id}`}
          >
            <a className="text-primary">{name}</a>
          </Link>
        );
      } else if (text.startsWith("%%")) {
        const link = text.substring(2).trim();
        const href = hrefFromLink(link);
        if (isWebLink(href)) {
          numLinks++;
          if (numLinks == 1) {
            setPreviewLink(href);
          }
        }
        _elements.push(
          <Link href={href}>
            <a
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
          </Link>
        );
      } else {
        _elements.push(text);
      }
    });
    return _elements;
  }, [account?._id, post.body]);
  return (
    <>
      <div className="px-4">
        <div className="text-sm text-white opacity-90 whitespace-pre-wrap break-all">
          {elements.map((element, index) => (
            <span key={index}>{element}</span>
          ))}
        </div>
        {previewLink && !post.media && !post.sharedPost && (
          <div className="my-4">
            <LinkPreview link={previewLink} />
          </div>
        )}
      </div>
      {post.media && (
        <div className="relative h-auto mt-5 border-b border-white/[.12]">
          <PostMedia
            media={post.media}
            userId={post.userId}
            postId={post._id}
          />
        </div>
      )}
      {post.sharedPost && (
        <div className="border border-brand-overlay/[.1] rounded overflow-hidden mx-4 mt-4">
          <Post post={post.sharedPost} isPreview={true} />
        </div>
      )}
      {!isPreview && (
        <div className="uppercase text-xs text-white font-medium opacity-60 mt-3 px-4">
          {post.categories.join(" • ")}
        </div>
      )}
    </>
  );
};

export default PostBody;
