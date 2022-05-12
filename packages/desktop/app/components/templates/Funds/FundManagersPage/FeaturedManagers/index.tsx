import { FC } from "react";
import { ArrowCircleRight } from "phosphor-react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Button from "desktop/app/components/common/Button";
import Card from "desktop/app/components/common/Card";
import FeaturedManager from "./FeaturedManager";
import { useFundManagers } from "shared/graphql/query/marketplace/useFundManagers";

const FeaturedManagers: FC = () => {
  const { data: managersData } = useFundManagers(); // Temporarily use all managers
  const { managers } = managersData?.fundManagers ?? {
    managers: [],
  };

  return (
    <>
      <Card className="overflow-visible">
        <div className="flex items-center font-medium text-xs">
          <div className="text-white uppercase text-tiny tracking-widest ml-2">
            Featured Fund managers •
          </div>
          <Button
            variant="text"
            className="text-tiny text-primary font-medium ml-1 py-0 uppercase"
          >
            follow all
          </Button>
        </div>
        <div className="mt-3">
          <Splide
            options={{
              autoWidth: true,
              rewind: true,
              lazyLoad: "nearby",
              cover: true,
              pagination: false,
            }}
            hasTrack={false}
          >
            <SplideTrack>
              {managers?.map((manager) => (
                <SplideSlide key={manager._id}>
                  <FeaturedManager manager={manager} />
                </SplideSlide>
              ))}
            </SplideTrack>
            <div className="splide__arrows">
              <Button
                variant="text"
                className="splide__arrow--prev text-gray-600 py-0 absolute !-left-10 top-16"
              >
                <ArrowCircleRight
                  color="currentColor"
                  weight="fill"
                  size={50}
                />
              </Button>
              <Button
                variant="text"
                className="splide__arrow--next text-gray-600 py-0 absolute !-right-10 top-16"
              >
                <ArrowCircleRight
                  color="currentColor"
                  weight="fill"
                  size={50}
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
