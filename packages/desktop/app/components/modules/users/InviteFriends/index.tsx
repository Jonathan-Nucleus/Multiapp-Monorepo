import React, { FC, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Card from "../../../common/Card";
import Field from "../../../common/Field";
import Button from "../../../common/Button";
import InvitationCoin from "./InvitationCoin";
import { INVITE_USER } from "mobile/src/graphql/mutation/account";
import { X } from "phosphor-react";
import Skeleton from "./Skeleton";
import { useInviteesStated } from "mobile/src/graphql/query/account/useInvites";
import { useCachedAccount } from "mobile/src/graphql/query/account/useAccount";

const MAX_INVITES = 10;
const variants = ["primary", "error", "secondary", "info", "success"];

type FormValues = { email: string };
const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required(),
  })
  .required();

interface InviteFriendsProps {
  onClose?: () => void;
}

const InviteFriends: FC<InviteFriendsProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const account = useCachedAccount();
  const invitedFriends = useInviteesStated();
  const [inviteUser] = useMutation(INVITE_USER, {
    refetchQueries: ["Invites"],
  });
  const { register, handleSubmit, formState, reset } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  if (!account || !invitedFriends) {
    return <Skeleton />;
  }

  const label = account?.role === "PROFESSIONAL" ?
    "Enter Email Addresses"
    :
    `Enter (up to ${MAX_INVITES - invitedFriends.length} more) Email Addresses`;
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (
      account?.role !== "PROFESSIONAL" &&
      MAX_INVITES - invitedFriends.length <= 0
    ) {
      return;
    }

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
      <div className="flex items-center border-b border-white/[.12] p-4">
        <div className="text-white">Invite Your Friends</div>
        {onClose && (
          <div className="flex ml-auto">
            <Button
              variant="text"
              className="opacity-60 py-0"
              onClick={onClose}
            >
              <X color="white" weight="bold" size={24} />
            </Button>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <Field
            type="email"
            name="email"
            label={label}
            register={register}
            state={formState}
          />
        </div>
        <div className="text-xs text-white/80 px-4 -mt-2 tracking-wide">
          We want to seed this platform with those who really have a passion for
          financial markets, economics and great ideas.
        </div>
        <div className="flex items-center justify-between flex-wrap mt-6 mb-4 px-4">
          <div className="flex items-center -mx-1 mb-4">
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
            Invite
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default InviteFriends;
