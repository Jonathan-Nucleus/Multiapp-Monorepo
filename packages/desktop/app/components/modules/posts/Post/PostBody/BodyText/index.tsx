import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { hrefFromLink, processPost } from "shared/src/patterns";
import Link from "next/link";
import Button from "../../../../../common/Button";

interface BodyTextProps {
  text: string;
  accountId: string;
}

const BodyText: FC<BodyTextProps> = ({ text, accountId }) => {
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
          onClick={() => setIsBodyExpanded(!isBodyExpanded)}
        >
          {isBodyExpanded ? "Read Less" : "Read More"}
        </Button>
      )}
    </>
  );
};

export default BodyText;
