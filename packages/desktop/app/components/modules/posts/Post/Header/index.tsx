import { FC } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import CompanyHeader from "./CompanyHeader";
import UserHeader from "./UserHeader";
import dayjs from "dayjs";

interface HeaderProps {
  post: PostSummary;
  accountId: string | undefined;
  highlighted?: boolean;
}

const Header: FC<HeaderProps> = ({
  post: { user, company, createdAt, highlighted = false },
  accountId,
}: HeaderProps) => {
  return (
    <>
      {company ? (
        <CompanyHeader
          company={company}
          createdAt={dayjs(createdAt).format("MMM DD")}
          highlighted={highlighted}
        />
      ) : (
        <UserHeader
          user={user!}
          accountId={accountId}
          createdAt={dayjs(createdAt).format("MMM DD")}
          highlighted={highlighted}
        />
      )}
    </>
  );
};

export default Header;
