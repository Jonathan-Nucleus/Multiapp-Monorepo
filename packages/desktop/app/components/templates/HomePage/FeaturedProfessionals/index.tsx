import { FC } from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import Link from "next/link";

import { useFollowUser } from "mobile/src/graphql/mutation/account";
import { useAccount } from "mobile/src/graphql/query/account";
import { useProfessionals } from "mobile/src/graphql/query/professional";
import Button from "desktop/app/components/common/Button";
import type { User } from "backend/graphql/users.graphql";
import Card from "../../../common/Card";

const FeaturedProfessionals: FC = () => {
  const [followUser] = useFollowUser();
  const { data: featuredData } = useProfessionals();
  const { data: userData } = useAccount({ fetchPolicy: "cache-only" });

  const handleFollowUser = async (id: string): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: true, userId: id },
        refetchQueries: ["Account"],
      });

      if (!data || data.followUser) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  if (featuredData?.professionals.length === 0) {
    return null;
  }

  return (
    <>
      <div className="font-medium text-xl text-white">
        Featured Professionals
      </div>
      <Card className="border-0 mt-5">
        <Splide
          options={{
            autoWidth: true,
            rewind: true,
            lazyLoad: "nearby",
            cover: true,
            pagination: false,
          }}
        >
          {featuredData?.professionals.map((item, index) => (
            <SplideSlide key={index}>
              <div className="mx-2">
                <div className="w-40 h-40 relative">
                  <Image
                    loader={() =>
                      `${process.env.NEXT_PUBLIC_AVATAR_URL}/${item.avatar}`
                    }
                    src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${item.avatar}`}
                    alt=""
                    width={160}
                    height={160}
                    className="object-cover rounded-lg"
                    unoptimized={true}
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
                      <div className="p-3">
                        <div className="text-white">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="text-white text-xs font-semibold">
                          {item.position}
                        </div>
                        <div className="text-white text-xs">
                          {item.company?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal font-normal"
                    onClick={() => handleFollowUser(item._id)}
                  >
                    FOLLOW
                  </Button>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Card>
    </>
  );
};

export default FeaturedProfessionals;
