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
import { useInvites } from "mobile/src/graphql/query/account/useInvites";
import { useAccount } from "mobile/src/graphql/query/account/useAccount";

const MAX_INVITES = 10;

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
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const { data: invitesData } = useInvites();
  const invitedFriends = invitesData?.account?.invitees;
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
        <div className="flex items-center justify-between flex-wrap mt-5 mb-4 px-4">
          <div className="flex items-center flex-wrap -mx-1 mb-3">
            {[...Array(MAX_INVITES)].map((ignored, index) => (
              <div key={index} className="mx-1 my-1">
                <InvitationCoin user={invitedFriends?.[index]} />
              </div>
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
