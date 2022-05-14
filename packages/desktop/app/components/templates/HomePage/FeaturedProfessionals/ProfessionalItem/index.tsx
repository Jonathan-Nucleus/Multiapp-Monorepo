import { Professional } from "shared/graphql/query/user/useProfessionals";
import { FC } from "react";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import Image from "next/image";
import Button from "desktop/app/components/common/Button";
import Link from "next/link";
import { useAccount } from "shared/graphql/query/account/useAccount";

interface ProfessionalItemProps {
  professional: Professional;
}

const ProfessionalItem: FC<ProfessionalItemProps> = ({ professional }) => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const { isFollowing, toggleFollow } = useFollowUser(professional._id);
  const isMyProfile = account?._id == professional._id;
  return (
    <>
      <Link href={`/profile/${isMyProfile ? "me" : professional._id}`}>
        <a>
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
        </a>
      </Link>
      <div className="text-center my-2">
        <div className={(isMyProfile || isFollowing) ? "invisible" : ""}>
          <Button
            variant="text"
            className="text-sm text-primary font-normal tracking-normal py-0"
            onClick={toggleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfessionalItem;