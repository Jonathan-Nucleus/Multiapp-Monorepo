import { Professional } from "mobile/src/graphql/query/user/useProfessionals";
import { FC } from "react";
import { useAccount } from "mobile/src/graphql/query/account";
import { useFollowUser } from "mobile/src/graphql/mutation/account";
import Image from "next/image";
import Button from "desktop/app/components/common/Button";

interface ProfessionalItemProps {
  professional: Professional;
}

const ProfessionalItem: FC<ProfessionalItemProps> = ({ professional }) => {
  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();
  const isFollowing = accountData?.account?.followingIds?.includes(professional._id) ?? false;
  const toggleFollowing = async () => {
    await followUser({
      variables: { follow: !isFollowing, userId: professional._id },
      refetchQueries: ["Account"],
    });
  };
  return (
    <>
      <div className="w-40 h-40 relative">
        {professional.avatar &&
          <Image
            loader={() => `${process.env.NEXT_PUBLIC_AVATAR_URL}/${professional.avatar}`}
            src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${professional.avatar}`}
            alt=""
            width={160}
            height={160}
            className="bg-background object-cover rounded-lg"
            unoptimized={true}
          />
        }
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
            <div className="p-3">
              <div className="text-white">
                {professional.firstName} {professional.lastName}
              </div>
              <div className="text-white text-xs font-semibold">
                {professional.position}
              </div>
              <div className="text-white text-xs">
                {professional.company.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center my-2">
        <Button
          variant="text"
          className="text-sm text-primary font-normal tracking-normal py-0"
          onClick={() => toggleFollowing()}
        >
          {isFollowing ? "UNFOLLOW" : "FOLLOW"}
        </Button>
      </div>
    </>
  );
};

export default ProfessionalItem;