import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import Link from "next/link";
import { UserProfile } from "backend/graphql/users.graphql";
import { LINK_PATTERN, processPost } from "shared/src/patterns";
import LinkPreview from "../../LinkPreview";
import Media from "../../../../common/Media";

interface PostBodyProps {
  account: Pick<UserProfile, "_id"> | undefined;
  post: PostSummary;
}

const PostBody: FC<PostBodyProps> = ({
  account,
  post,
}: PostBodyProps) => {
  const [links, setLinks] = useState<string[]>([]);
  const processLinks = (body: string) => {
    const result = body.matchAll(LINK_PATTERN);
    const matches = Array.from(result);
    if (matches.length > 0) {
      let startIndex = 0;
      const elements: (string | ReactElement)[] = [];
      matches.forEach((match) => {
        const text = match[0];
        const prefix = body.slice(startIndex, match.index);
        elements.push(prefix);
        elements.push(
          <Link href={text}>
            <a className="text-primary" target="_blank">{text}</a>
          </Link>,
        );
        startIndex = match.index! + text.length;
      });
      elements.push(body.slice(startIndex, body.length));
      return elements;
    } else {
      return [body];
    }
  };
  const elements = useMemo(() => {
    if (!post.body) {
      return [<></>];
    }
    const splitBody = processPost(post.body);
    const _elements: (string | ReactElement)[] = [];
    splitBody.map((text, index) => {
      if (text.startsWith("$")) {
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/search/posts?query=${text.slice(1)}`}
          >
            <a className="text-primary">{text}</a>
          </Link>,
        );
      } else if (text.startsWith("#")) {
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/search/posts?query=${text.slice(1)}`}
          >
            <a className="text-primary">{text}</a>
          </Link>,
        );
      } else if (text.startsWith("@") && text.includes("|")) {
        const [name, id] = text.split("|");
        _elements.push(
          <Link
            key={`${text}-${index}`}
            href={`/profile/${account?._id == id ? "me" : id}`}
          >
            <a className="text-primary">{name}</a>
          </Link>,
        );
      } else {
        _elements.push(...processLinks(text));
      }
    });
    return _elements;
  }, [account?._id, post.body]);
  useEffect(() => {
    const result = post.body?.matchAll(LINK_PATTERN);
    if (result) {
      const matches = Array.from(result).map(match => match[0]);
      if (matches.length > 0) {
        setLinks(matches);
      }
    }
  }, [post.body]);
  return (
    <>
      <div className="text-sm text-white opacity-90 whitespace-pre-wrap break-all">
        {elements.map((element, index) => (
          <span key={index}>{element}</span>
        ))}
      </div>
      {links.length > 0 && !post.media &&
        <div className="my-4">
          <LinkPreview link={links[0]} size="lg" />
        </div>
      }
      <div className="flex flex-wrap -mx-1 mt-3 px-4">
        {post.categories.map((category) => (
          <div
            key={category}
            className={`bg-white/[.25] uppercase rounded-full text-xs text-white font-medium mx-1 my-1 px-4 py-1`}
          >
            {category}
          </div>
        ))}
      </div>
      {post.media && (
        <div className="relative h-auto mt-5 border-b border-white/[.12]">
          <Media media={post.media} />
        </div>
      )}
    </>
  );
};

export default PostBody;
