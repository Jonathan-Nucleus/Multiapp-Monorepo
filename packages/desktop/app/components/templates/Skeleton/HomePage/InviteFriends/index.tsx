import { FC, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Card from "../../../../common/Card";

const InviteFriends: FC = () => {
  return (
    <Card className="p-0">
      <div className="border-b border-white/[.12] p-4" />
      <div className="p-4">
        <div className="w-1/2 h-2  bg-skeleton rounded-lg mt-4" />
        <div className="w-full h-8 bg-skeleton rounded-lg mt-4" />
        <div className="w-2/3 h-2 bg-skeleton rounded-lg mt-8" />
        <div className="w-1/2 h-2 bg-skeleton rounded-lg mt-4" />
      </div>
    </Card>
  );
};

export default InviteFriends;
