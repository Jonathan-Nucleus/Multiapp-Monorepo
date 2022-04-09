import { FC } from "react";
import Card from "../../../common/Card";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Peter Avellone",
    position: "CIO & Founder",
    company: "Cartenna Capital",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
  {
    image:
      "https://media.istockphoto.com/photos/smiling-man-outdoors-in-the-city-picture-id1179420343?k=20&m=1179420343&s=612x612&w=0&h=G2UGMVSzAXGAQs3pFZpvWlHNRAzwPIWIVtSOxZHsEuc=",
    name: "Mike Wang",
    position: "Founder, Investor",
    company: "Prometheus",
  },
];

const FeaturedProfessionals: FC = () => {
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
          {items.map((item, index) => (
            <SplideSlide key={index}>
              <div className="mx-2">
                <div className="w-40 h-40 relative">
                  <Image
                    loader={() => item.image}
                    src={item.image}
                    alt=""
                    width={160}
                    height={160}
                    className="object-cover rounded-lg"
                    unoptimized={true}
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    <div className="bg-gradient-to-b from-transparent to-black w-full h-full flex flex-col justify-end rounded-lg">
                      <div className="p-3">
                        <div className="text-white">{item.name}</div>
                        <div className="text-white text-xs font-semibold">
                          {item.position}
                        </div>
                        <div className="text-white text-xs">{item.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <Link href="/">
                    <a className="text-xs text-primary font-normal">FOLLOW</a>
                  </Link>
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
