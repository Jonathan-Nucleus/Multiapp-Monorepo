import { FC } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import CompanyHeader from "./CompanyHeader";
import UserHeader from "./UserHeader";
import dayjs from "dayjs";

interface HeaderProps {
  post: PostSummary;
  accountId: string | undefined;
}

const Header: FC<HeaderProps> = ({
  post: { user, company, createdAt },
  accountId,
}: HeaderProps) => {
  return (
    <>
      {company ? (
        <CompanyHeader
          company={company}
          createdAt={dayjs(createdAt).format("MMM DD")}
        />
      ) : (
        <UserHeader
          user={user!}
          accountId={accountId}
          createdAt={dayjs(createdAt).format("MMM DD")}
        />
      )}
    </>
  );
};

export default Header;
