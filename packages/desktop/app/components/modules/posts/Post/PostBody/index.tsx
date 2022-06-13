import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { hrefFromLink, processPost } from "shared/src/patterns";
import LinkPreview from "../../LinkPreview";
import PostMedia from "../../PostMedia";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import Post from "..";
import Button from "desktop/app/components/common/Button";

interface PostBodyProps {
  accountId: string;
  post: PostType;
  isPreview?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  accountId,
  post,
  isPreview = false,
}: PostBodyProps) => {
  const [isBodyClamped, setIsBodyClamped] = useState(false);
  const [isBodyExpanded, setIsBodyExpanded] = useState(false);
  const bodyRefCallback = useCallback((ref: HTMLDivElement) => {
    if (ref && ref.scrollHeight > ref.clientHeight) {
      setIsBodyClamped(true);
    }
  }, []);
  const elements = useMemo(() => {
    if (!post.body) {
      return [<></>];
    }
    let wordCount = 0;
    const splitBody = processPost(post.body);
    const _elements: (string | ReactElement)[] = [];
    splitBody.forEach((text) => {
      if (text.startsWith("$")) {
        _elements.push(
          <Link href={`/search/posts?query=${text.slice(1)}`}>
            <a className="text-primary">{text}</a>
          </Link>
        );
        wordCount++;
      } else if (text.startsWith("#")) {
        _elements.push(
          <Link href={`/search/posts?query=${text.slice(1)}`}>
            <a className="text-primary">{text}</a>
          </Link>
        );
        wordCount++;
      } else if (text.startsWith("@") && text.includes("|")) {
        const [name, id] = text.split("|");
        _elements.push(
          <Link href={`/profile/${accountId == id ? "me" : id}`}>
            <a className="text-primary">{name}</a>
          </Link>
        );
      } else if (text.startsWith("%%")) {
        const link = text.substring(2).trim();
        const href = hrefFromLink(link);
        _elements.push(
          <Link href={href}>
            <a
              className="text-primary break-all"
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
  }, [accountId, post.body]);
  return (
    <>
      <div className="px-4">
        <div className="pb-2">
          <div
            ref={bodyRefCallback}
            className={`text-sm text-white opacity-90 whitespace-pre-wrap break-words ${
              isBodyExpanded ? "line-clamp-none" : "line-clamp-5"
            }`}
          >
            {elements.map((element, index) => (
              <span key={index}>{element}</span>
            ))}
          </div>
          {isBodyClamped && (
            <Button
              variant="text"
              className="text-primary tracking-normal font-normal py-0"
              onClick={() => setIsBodyExpanded(!isBodyExpanded)}
            >
              {isBodyExpanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </div>
        {post.preview && !post.media && !post.sharedPost && (
          <div className="my-4">
            <LinkPreview previewData={post.preview} />
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
          <Post
            post={post.sharedPost}
            isPreview={true}
            className="shadow-none"
          />
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
