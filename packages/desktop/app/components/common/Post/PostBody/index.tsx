import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import Link from "next/link";
import { UserProfile } from "backend/graphql/users.graphql";
import { LINK_PATTERN, processPost } from "shared/src/patterns";
import Image from "next/image";

interface PostBodyProps {
  account: Pick<UserProfile, "_id"> | undefined;
  post: PostSummary;
}

const PostBody: FC<PostBodyProps> = ({
  account,
  post: { body },
}: PostBodyProps) => {
  const [previews, setPreviews] = useState<{ logo: string, title: string, image: string }[]>([]);
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
    if (!body) {
      return [<></>];
    }

    const splitBody = processPost(body);
    const _elements: (string | ReactElement)[] = [];
    splitBody.map((text, index) => {
      if (text.startsWith("$")) {
        _elements.push(
          <Link key={`${text}-${index}`} href={`/search?stock=${text.slice(1)}`}>
            <a className="text-primary">{text}</a>
          </Link>,
        );
      } else if (text.startsWith("#")) {
        _elements.push(
          <Link key={`${text}-${index}`} href={`/search?tag=${text.slice(1)}`}>
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
  }, [account?._id, body]);
  useEffect(() => {
    const fetchPreview = async (link: string) => {
      const response = await fetch("/api/scrap",
        { method: "POST", body: JSON.stringify({ url: link }) },
      );
      return await response.json();
    };
    const loadPreviews = async () => {
      const result = body?.matchAll(LINK_PATTERN);
      if (result) {
        const matches = Array.from(result);
        if (matches.length > 0) {
          const _previews: any[] = [];
          for (const match of matches) {
            const preview = await fetchPreview(match[0]);
            if (preview.logo && preview.title && preview.image) {
              _previews.push({
                logo: preview.logo,
                title: preview.title,
                image: preview.image,
              });
            }
          }
          if (_previews.length > 0) {
            setPreviews(_previews);
          }
        }
      }
    };
    loadPreviews();
  }, [body]);
  return (
    <>
      <div className="text-sm text-white opacity-90 whitespace-pre-wrap">
        {elements.map((element, index) => (
          <span key={index}>{element}</span>
        ))}
      </div>
      {previews.length > 0 &&
        <>
          {previews.map((preview, index) => (
            <div key={index} className="my-4">
              <div className="border-l-2 border-primary pl-2">
                <div className="flex items-center relative">
                  <Image
                    loader={() => preview.logo}
                    src={preview.logo}
                    alt=""
                    width={24}
                    height={24}
                    objectFit="cover"
                  />
                  <div className="text-sm text-white ml-2">{preview.title}</div>
                </div>
                <div className="h-64 relative mt-2">
                  <Image
                    loader={() => preview.image}
                    src={preview.image}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      }
    </>
  );
};

export default PostBody;
