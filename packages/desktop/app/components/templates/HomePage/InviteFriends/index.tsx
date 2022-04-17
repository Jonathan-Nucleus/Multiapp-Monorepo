import { FC, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Image from "next/image";

import Card from "../../../common/Card";
import Label from "../../../common/Label";
import Field from "../../../common/Field";
import Button from "../../../common/Button";
import InvitationCoin from "./InvitationCoin";

import { useInvites } from "mobile/src/graphql/query/account";
import { INVITE_USER } from "../../../../graphql/mutations/account";

const MAX_INVITES = 5;
const variants = ["primary", "error", "secondary", "info", "success"];

type FormValues = { email: string };
const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required(),
  })
  .required();

const InviteFriends: FC = () => {
  const [loading, setLoading] = useState(false);
  const { data: accountData } = useInvites();
  const [inviteUser] = useMutation(INVITE_USER, {
    refetchQueries: ["Invites"],
  });
  const { register, handleSubmit, formState, reset } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const invitedFriends = accountData?.account.invitees ?? [];

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (MAX_INVITES - invitedFriends.length <= 0) return;

    setLoading(true);
    try {
      await inviteUser({
        variables: {
          email: data.email,
        },
      });
      reset({ email: "" });
    } catch (err) {
      console.log("invite user error", err);
    }
    setLoading(false);
  };

  return (
    <Card className="p-0">
      <div className="text-white border-b border-white/[.12] p-4">
        Invite Your Friends
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <Field
            type="email"
            name="email"
            label={`Enter (up to ${
              MAX_INVITES - invitedFriends.length
            } more) Email
            Addresses`}
            register={register}
            state={formState}
          />
        </div>
        <div className="text-xs text-white px-4 -mt-2">
          We want to seed this platform with those who really have a passion for
          financial markets, economics and great ideas.
        </div>
        <div className="flex items-center justify-between mt-6 mb-4 px-4">
          <div className="flex items-center -mx-1">
            {[...Array(MAX_INVITES)].map((ignored, index) => (
              <InvitationCoin
                key={`friend-${index}`}
                avatar={invitedFriends?.[index]?.avatar}
                email={invitedFriends?.[index]?.email}
                firstName={invitedFriends?.[index]?.firstName}
                lastName={invitedFriends?.[index]?.lastName}
                variant={variants[index]}
              />
            ))}
          </div>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            className="w-24"
          >
            INVITE
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default InviteFriends;
