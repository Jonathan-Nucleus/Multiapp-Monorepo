import { FC } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Image from "next/image";

import Card from "../../../common/Card";
import Label from "../../../common/Label";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import { INVITE_USER } from "../../../../graphql/mutations/account";

const friends = [
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://media.istockphoto.com/photos/mature-beautiful-woman-with-red-hair-picture-id1221755378?k=20&m=1221755378&s=612x612&w=0&h=rZkb0wrSR4-Qfl-MIDbD8_2L_V2KYWOf0P_EqUveAAA=",
  "https://media.istockphoto.com/photos/front-view-of-a-woman-wearing-a-suit-and-smiling-picture-id1180926769?k=20&m=1180926769&s=612x612&w=0&h=-W0mKhAfjfMbwq3ZBTtbHrjGpLvHyp0a2rl4W6xFkUs=",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
];
type FormValues = { email: string };
const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required(),
  })
  .required();

const InviteFriends: FC = () => {
  const [inviteUser] = useMutation(INVITE_USER);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await inviteUser({
        variables: {
          email: data.email,
        },
      });
    } catch (err) {
      console.log("invite user error", err);
    }
  };

  return (
    <Card className="p-0">
      <div className="text-white border-b border-white/[.12] p-4">
        Invite Your Friends
      </div>
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <Label htmlFor="email">Enter (up to 2 more) Email Addresses</Label>
          <Input id="email" type="email" {...register("email")} />
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
          <Button variant="primary" type="submit">
            INVITE
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default InviteFriends;
