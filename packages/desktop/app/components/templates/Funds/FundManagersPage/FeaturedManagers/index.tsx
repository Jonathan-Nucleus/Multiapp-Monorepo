import { FC } from "react";
import { ArrowRight } from "phosphor-react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Button from "desktop/app/components/common/Button";
import Card from "desktop/app/components/common/Card";
import FeaturedManager from "./FeaturedManager";
import {
  useFundManagers,
} from "shared/graphql/query/marketplace/useFundManagers";

const FeaturedManagers: FC = () => {
  const { data: { fundManagers } = {} } = useFundManagers(); // Temporarily use all managers

  if (!fundManagers?.managers) {
    return <></>;
  }

  return (
    <>
      <Card className="overflow-visible border-brand-overlay/[.1] rounded">
        <div className="flex items-center font-medium text-xs">
          <div className="text-white text-tiny tracking-widest ml-2">
            Featured Fund Managers •
          </div>
          <Button
            variant="text"
            className="text-tiny text-primary font-medium ml-1 py-0"
          >
            Follow All
          </Button>
        </div>
        <div className="mt-3">
          <Splide
            options={{
              autoWidth: true,
              rewind: false,
              lazyLoad: "nearby",
              cover: true,
              pagination: false,
            }}
            hasTrack={false}
          >
            <SplideTrack>
              {fundManagers?.managers.map((manager) => (
                <SplideSlide key={manager._id}>
                  <FeaturedManager manager={manager} />
                </SplideSlide>
              ))}
            </SplideTrack>
            <div className="splide__arrows">
              <Button
                variant="text"
                className="splide__arrow--prev w-12 h-12 flex items-center bg-gradient-to-r from-[#844AFF] to-primary disabled:bg-none disabled:bg-gray-600 rounded-full py-0 absolute !-left-10 top-12 text-background"
              >
                <ArrowRight
                  color="currentColor"
                  weight="bold"
                  size={30}
                />
              </Button>
              <Button
                variant="text"
                className="splide__arrow--next w-12 h-12 flex items-center bg-gradient-to-r from-[#844AFF] to-primary disabled:bg-none disabled:bg-gray-600 rounded-full py-0 absolute !-right-10 top-12 text-background"
              >
                <ArrowRight
                  color="currentColor"
                  weight="bold"
                  size={30}
                />
              </Button>
            </div>
          </Splide>
        </div>
      </Card>
    </>
  );
};

export default FeaturedManagers;
