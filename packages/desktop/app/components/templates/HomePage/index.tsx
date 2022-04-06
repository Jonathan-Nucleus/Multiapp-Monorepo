import { FC, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Logo from "shared/assets/images/background.png";

import { Navbar } from "../../common/Navbar";
import CarouselItem from "./CarouselItem";
import Filter from "./Filter";
import CreatePost from "../../common/CreatePost";
import PostDetail from "./PostDetails";
import UserInfo from "./UserInfo";
import Follow from "./Follow";

const Items = [
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 1,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 51,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 41,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 31,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 21,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Logo,
    id: 11,
  },
];

const HomePage: FC = () => {
  const [isVisible, setVisible] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex flex-row px-2">
        <div className="basis-1/4 hidden lg:block">
          <UserInfo />
        </div>

        <div className="w-full rounded-md overflow-auto	pr-4 pl-4">
          <div className="text-center font-bold text-white mb-3">
            Featured Professionals
          </div>
          <div className="border border-gray bg-dark rounded-md p-2">
            <Splide
              aria-label="My Favorite Images"
              options={{
                autoWidth: true,
                rewind: true,
                lazyLoad: "nearby",
                cover: true,
              }}
            >
              {Items.map((item, i) => (
                <SplideSlide key={i}>
                  <CarouselItem item={item} key={i} />
                </SplideSlide>
              ))}
            </Splide>
          </div>
          <div className="hidden md:block">
            <CreatePost />
          </div>
          <Filter
            onClick={() => setVisible(!isVisible)}
            isVisible={isVisible}
          />
          <PostDetail />
        </div>
        <div className="basis-1/4 hidden lg:block">
          <Follow />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
