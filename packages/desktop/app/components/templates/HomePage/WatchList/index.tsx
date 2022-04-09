import { FC, useState } from "react";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Image from "next/image";
import { Star } from "phosphor-react";

const tempData = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQha3uvPpSbN50PaGo-DL6937g63MaAgTz9RobAq7ghhNj-PbudoD8JCKpYjjz9hvBvTpo&usqp=CAU",
    title: "Vibrant Ventures Fund",
    company: "Vibrant Ventures",
    following: true,
  },
  {
    image:
      "data:image/png;base64,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",
    title: "Good Soil Accelerated Opportunities L.P.",
    company: "Good Soil Investment",
    following: false,
  },
];

const WatchList: FC = () => {
  const [banks, setBanks] = useState(tempData);
  return (
    <Card className="p-0 border-white/[.12] divide-y divide-inherit">
      <div className="text-white border-b border-white/[.12] p-4">
        Watch List
      </div>
      {banks.map((item, index) => (
        <div key={index} className="flex items-center p-4">
          <div className="flex-shrink-0">
            <Image
              key={index}
              loader={() => item.image}
              src={item.image}
              alt=""
              width={48}
              height={48}
              className="bg-white object-cover rounded"
              unoptimized={true}
            />
          </div>
          <div className="ml-3">
            <div className="text-white leading-4">{item.title}</div>
            <div className="text-xs text-white opacity-60">{item.company}</div>
          </div>
          <div className="ml-auto">
            <Button
              variant="text"
              className={item.following ? "text-primary-medium" : "text-white"}
              onClick={() => {
                const _banks = [...banks];
                _banks[index].following = !_banks[index].following;
                setBanks(_banks);
              }}
            >
              <Star
                color="currentColor"
                weight={item.following ? "fill" : "light"}
                size={16}
              />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default WatchList;
