import { FC } from "react";
import Image from "next/image";

type CarouselItemProps = {
  id: string | number;
  image: any;
  name?: string;
  description?: string;
  company?: string;
};

const CarouselItem: FC<{ item: CarouselItemProps }> = ({ item }) => {
  return (
    <div className="mr-6 relative">
      <Image
        src={item.image}
        width={170}
        height={170}
        className="rounded-lg"
        alt=""
      />
      <div className="flex flex-col absolute bottom-5 items-center w-full">
        <div>{item.name}</div>
        <div>{item.description}</div>
        <div>{item.company}</div>
      </div>
    </div>
  );
};
export default CarouselItem;
