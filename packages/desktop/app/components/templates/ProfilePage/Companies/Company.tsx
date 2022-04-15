import { FC } from "react";
import Image from "next/image";
import { Chats } from "phosphor-react";

import Button from "../../../common/Button";
import Card from "../../../common/Card";
import type { Company } from "backend/graphql/companies.graphql";

interface Props {
  company: Company;
}

const CompanyItem: FC<Props> = ({ company }) => {
  return (
    <div className="flex items-center py-4">
      <div className="w-14 h-14 flex items-center justify-center">
        {company.avatar && (
          <Image
            loader={() =>
              `${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`
            }
            src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`}
            alt=""
            layout="fill"
            className="object-cover"
            unoptimized={true}
          />
        )}
      </div>
      <div className="ml-2">
        <div className="flex items-center">
          <div className="text-white">{company.name}</div>
          <Button
            variant="text"
            className="text-xs text-primary tracking-normal font-normal py-0 ml-2"
          >
            FOLLOW
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;
