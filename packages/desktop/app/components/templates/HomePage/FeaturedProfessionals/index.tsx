import { FC } from "react";
import Card from "../../../common/Card";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { Professional } from "mobile/src/graphql/query/user/useProfessionals";
import ProfessionalItem from "./ProfessionalItem";
import Button from "desktop/app/components/common/Button";
import { ArrowCircleRight } from "phosphor-react";

interface FeaturedProfessionalsProps {
  professionals: Professional[];
}

const FeaturedProfessionals: FC<FeaturedProfessionalsProps> = ({ professionals }) => {
  return (
    <>
      <div className="font-medium text-xl text-white">
        Featured Professionals
      </div>
      <Card className="border-0 overflow-visible mt-5 px-4 pt-4 pb-0">
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
            {professionals.map((professional, index) => (
              <SplideSlide key={index}>
                <div className="mx-2">
                  <ProfessionalItem professional={professional} />
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
          <div className="splide__arrows">
            <Button
              variant="text"
              className="splide__arrow--prev text-gray-600 py-0 absolute !-left-8 top-16"
            >
              <ArrowCircleRight
                color="currentColor"
                weight="fill"
                size={50}
              />
            </Button>
            <Button
              variant="text"
              className="splide__arrow--next text-gray-600 py-0 absolute !-right-8 top-16"
            >
              <ArrowCircleRight
                color="currentColor"
                weight="fill"
                size={50}
              />
            </Button>
          </div>
        </Splide>
      </Card>
    </>
  );
};

export default FeaturedProfessionals;
