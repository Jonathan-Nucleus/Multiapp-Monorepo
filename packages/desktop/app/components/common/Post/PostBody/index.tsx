import { FC, ReactElement, useMemo } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import Link from "next/link";
import { UserProfile } from "backend/graphql/users.graphql";

interface PostBodyProps {
  account: Pick<UserProfile, "_id"> | undefined;
  post: PostSummary;
}

const PostBody: FC<PostBodyProps> = ({
  account,
  post: { body },
}: PostBodyProps) => {
  const elements = useMemo(() => {
    if (!body) {
      return [<></>];
    }
    const elements: (string | ReactElement)[] = [];
    const result = body.matchAll(/@\[[a-zA-Z\s]+]\([a-fA-F\d]+\)/g);
    const matches = Array.from(result);
    if (matches.length > 0) {
      let startIndex = 0;
      matches.forEach((match) => {
        const text = match[0];
        const name = text.match(/@\[([a-zA-Z\s]+)]/)![1];
        const id = text.match(/\(([a-fA-F\d]+)\)/)![1];
        const prefix = body.slice(startIndex, match.index);
        elements.push(prefix);
        elements.push(
          <Link href={`/profile/${account?._id == id ? "me" : id}`}>
            <a className="text-primary">{name}</a>
          </Link>,
        );
        startIndex = match.index! + text.length;
      });
      elements.push(body.slice(startIndex, body.length));
    } else {
      elements.push(body);
    }
    return elements;
  }, [account?._id, body]);
  return (
    <>
      <div className="text-sm text-white opacity-90">
        {elements.map((element, index) => (
          <span key={index}>{element}</span>
        ))}
      </div>
    </>
  );
};

export default PostBody;
