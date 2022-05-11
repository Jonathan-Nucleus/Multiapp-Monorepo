import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../../../common/Avatar";
import Button from "../../../../common/Button";
import { useSession } from "next-auth/react";
import { useFollowCompany } from "mobile/src/graphql/mutation/account";
import { CompanyType } from "desktop/app/types/common-props";

interface CompanyItemProps {
  company: CompanyType;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }: CompanyItemProps) => {
  const { data: session } = useSession();
  const [followCompany] = useFollowCompany();
  const userId = session?.user?._id;
  if (!userId) {
    return <></>;
  }
  const isFollowing = company.followerIds?.includes(userId) ?? false;
  const toggleFollowing = async () => {
    try {
      await followCompany({
        variables: { follow: !isFollowing, companyId: company._id },
        refetchQueries: ["Account", "UserProfile"],
      });
    } catch (err) {}
  };
  return (
    <>
      <div className="flex items-center">
        <div className="w-14 h-14 flex flex-shrink-0 rounded-lg overflow-hidden relative">
          <Link href={`/company/${company._id}`}>
            <a>
              <Avatar user={company} shape="square" />
            </a>
          </Link>
        </div>
        <Link href={`/company/${company._id}`}>
          <a className="text-white ml-4">{company.name}</a>
        </Link>
        <Button
          variant="text"
          className="text-xs text-primary tracking-normal font-normal ml-auto px-2 py-0"
          onClick={toggleFollowing}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </>
  );
};

export default CompanyItem;
