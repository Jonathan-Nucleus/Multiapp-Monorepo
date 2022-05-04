import { FC } from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";

import Card from "../../../../common/Card";

const FeaturedProfessionals: FC = () => {
  return (
    <Card className="border-0 overflow-visible p-4 mb-8">
      <Splide
        options={{
          autoWidth: true,
          rewind: true,
          lazyLoad: "nearby",
          cover: true,
          pagination: false,
          arrows: false,
        }}
        hasTrack={false}
      >
        <SplideTrack>
          {[1, 2, 3, 4, 5].map((professional, index) => (
            <SplideSlide key={index}>
              <div className="mx-2">
                <div className="w-40 h-40 relative rounded-lg bg-skeleton"></div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>
    </Card>
  );
};

export default FeaturedProfessionals;
