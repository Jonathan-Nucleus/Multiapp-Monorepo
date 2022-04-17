import { FC, useState } from "react";

import Member from "./Member";
import Button from "../../../../components/common/Button";
import MembersModal from "./MembersModal";
import type { User } from "backend/graphql/users.graphql";

import { useAccount } from "desktop/app/graphql/queries";
import type { Company } from "backend/graphql/companies.graphql";
interface MembersModalProps {
  company: Company;
}

const TeamMembersList: FC<MembersModalProps> = ({ company }) => {
  const { data: userData, loading: userLoading, refetch } = useAccount();
  const [isVisible, setVisible] = useState(false);
  const members = company.members.map((member) => ({
    ...member,
    company, // Inject company data
  }));

  return (
    <div>
      <div className="flex items-center text-lg">
        <div className="text-white tracking-wider">Team Members</div>
        <span className="text-primary mx-2">•</span>
        <Button
          variant="text"
          className="text-primary tracking-widest font-semibold py-0"
          onClick={() => setVisible(true)}
        >
          VIEW ALL
        </Button>
      </div>
      <div className="flex flex-col divide-y divide-white divide-opacity-20">
        {members.map((member, index) => (
          <Member key={member._id} member={member} />
        ))}
      </div>
      <MembersModal
        members={members}
        onClose={() => setVisible(false)}
        show={isVisible}
      />
    </div>
  );
};

export default TeamMembersList;
