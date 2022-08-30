import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { hrefFromLink, processPost } from "shared/src/patterns";
import { useAccountContext } from "shared/context/Account";
import Link from "next/link";
import { Post } from "shared/graphql/query/post/usePosts";
import Button from "../../../../../common/Button";
import { logEvent } from "../../../../../../lib/ga";

interface BodyTextProps {
  text: string;
  post?: Post;
}

const BodyText: FC<BodyTextProps> = ({ text, post }) => {
  const { _id: accountId } = useAccountContext();
  const [isBodyClamped, setIsBodyClamped] = useState(false);
  const [isBodyExpanded, setIsBodyExpanded] = useState(false);
  const bodyRefCallback = useCallback((ref: HTMLDivElement) => {
    if (ref && ref.scrollHeight > ref.clientHeight) {
      setIsBodyClamped(true);
    }
  }, []);
  const elements = useMemo(() => {
    const splitBody = processPost(text);
    const _elements: (string | ReactElement)[] = [];
    splitBody.forEach((text) => {
      if (text.startsWith("$")) {
        _elements.push(
          <Link href={`/search/posts?query=${text.slice(1)}`}>
            <a className="text-primary">{text}</a>
          </Link>
        );
      } else if (text.startsWith("#")) {
        _elements.push(
          <Link href={`/search/posts?query=${text.slice(1)}`}>
            <a className="text-primary">{text}</a>
          </Link>
        );
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
  }, [accountId, text]);
  const handleExpandButton = () => {
    if (!isBodyExpanded && post) {
      logEvent({
        action: "read_more_feed",
        params: {
          event_category: "Read More In Feed",
          event_label: "Button Clicked",
          value: text.slice(0, 10),
          author: `${post.user?.firstName} ${post.user?.lastName}`,
          id: post._id,
        },
      });
    }
    setIsBodyExpanded(!isBodyExpanded);
  };
  return (
    <>
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
          onClick={handleExpandButton}
        >
          {isBodyExpanded ? "Read Less" : "Read More"}
        </Button>
      )}
    </>
  );
};

export default BodyText;
