import { FC, Fragment, useMemo } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import Link from "next/link";
import { UserProfile } from "backend/graphql/users.graphql";
import { processPost } from "shared/src/patterns";

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

    const splitBody = processPost(body);
    const elements = splitBody.map((text, index) => {
      if (text.startsWith("$") || text.startsWith("#")) {
        return (
          <Link key={`${text}-${index}`} href={`/search/${text}`}>
            <a className="text-primary">{text}</a>
          </Link>
        );
      } else if (text.startsWith("@") && text.includes("|")) {
        const [name, id] = text.split("|");
        return (
          <Link
            key={`${text}-${index}`}
            href={`/profile/${account?._id == id ? "me" : id}`}
          >
            <a className="text-primary">{name}</a>
          </Link>
        );
      } else {
        return <Fragment key={`${text}-${index}`}>{text}</Fragment>;
      }
    });
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
