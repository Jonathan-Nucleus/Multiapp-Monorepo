import { FC } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import MemberItem from "./MemberItem";

export interface DetailedTeamMemberListProps {
  members: (FundDetails["manager"] | FundDetails["team"][number])[];
}

const DetailedTeamMemberList: FC<DetailedTeamMemberListProps> = ({
  members,
}) => {
  return (
    <>
      {members.map((member) => (
        <div key={member._id} className="mb-10">
          <MemberItem member={member} />
        </div>
      ))}
    </>
  );
};

export default DetailedTeamMemberList;
