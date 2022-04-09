import { FC } from "react";
import Card from "../../../common/Card";
import Label from "../../../common/Label";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import Image from "next/image";

const friends = [
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://media.istockphoto.com/photos/mature-beautiful-woman-with-red-hair-picture-id1221755378?k=20&m=1221755378&s=612x612&w=0&h=rZkb0wrSR4-Qfl-MIDbD8_2L_V2KYWOf0P_EqUveAAA=",
  "https://media.istockphoto.com/photos/front-view-of-a-woman-wearing-a-suit-and-smiling-picture-id1180926769?k=20&m=1180926769&s=612x612&w=0&h=-W0mKhAfjfMbwq3ZBTtbHrjGpLvHyp0a2rl4W6xFkUs=",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
];

const InviteFriends: FC = () => {
  return (
    <Card className="p-0">
      <div className="text-white border-b border-white/[.12] p-4">
        Invite Your Friends
      </div>
      <div className="p-4">
        <Label htmlFor="email">Enter (up to 2 more) Email Addresses</Label>
        <Input id="email" type="email" />
      </div>
      <div className="text-xs text-white mt-5 px-4">
        We want to seed this platform with those who really have a passion for
        financial markets, economics and great ideas.
      </div>
      <div className="flex items-center justify-between mt-4 mb-4 px-4">
        <div className="flex items-center -mx-1">
          {friends.map((item, index) => (
            <div key={index} className="mx-1">
              <Image
                key={index}
                loader={() => item}
                src={item}
                alt=""
                width={24}
                height={24}
                className="object-cover rounded-full"
                unoptimized={true}
              />
            </div>
          ))}
        </div>
        <Button variant="primary">INVITE</Button>
      </div>
    </Card>
  );
};

export default InviteFriends;
