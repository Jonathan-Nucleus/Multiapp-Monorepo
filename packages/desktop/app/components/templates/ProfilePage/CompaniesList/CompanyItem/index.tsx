import { FC } from "react";
import { Company } from "backend/graphql/companies.graphql";
import Image from "next/image";
import Button from "../../../../common/Button";
import { useSession } from "next-auth/react";
import { useFollowCompany } from "../../../../../graphql/mutations/profiles";
import { useProfileDispatch } from "../../../../../contexts/ProfileContext";

interface CompanyItemProps {
  company: Company;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }: CompanyItemProps) => {
  const { data: session } = useSession();
  const [followCompany] = useFollowCompany();
  const { dispatch } = useProfileDispatch();
  const userId = session?.user?._id;
  if (!userId) {
    return <></>;
  }
  const isFollowing = company.followerIds?.includes(userId) ?? false;
  const toggleFollowing = async () => {
    try {
      const { data } = await followCompany({
        variables: { follow: !isFollowing, companyId: company._id },
      });
      if (data?.followCompany) {
        dispatch("reload");
      }
    } catch (err) {}
  };
  return (
    <>
      <div className="flex items-center">
        <div className="w-14 h-14 flex flex-shrink-0 rounded-lg overflow-hidden relative">
          {company.avatar && (
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`
              }
              src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`}
              alt=""
              layout="fill"
              className="object-cover"
              unoptimized={true}
            />
          )}
        </div>
        <div className="text-white ml-4">{company.name}</div>
        <Button
          variant="text"
          className="text-xs text-primary tracking-normal font-normal ml-auto px-2 py-0"
          onClick={toggleFollowing}
        >
          {isFollowing ? "UNFOLLOW" : "FOLLOW"}
        </Button>
      </div>
    </>
  );
};

export default CompanyItem;
