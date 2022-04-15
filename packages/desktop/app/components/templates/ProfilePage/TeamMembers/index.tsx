import { FC, useState } from "react";

import Member from "./Member";
import Button from "../../../../components/common/Button";
import MembersModal from "./MembersModal";
import type { User } from "backend/graphql/users.graphql";

interface MembersModalProps {
  members: User[];
}

const TeamMembersList: FC<MembersModalProps> = ({ members }) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center">
        <div className="text-white mr-2">Team Members</div>
        <Button
          variant="text"
          className="text-xs text-primary tracking-normal font-normal py-0"
          onClick={() => setVisible(true)}
        >
          •VIEW ALL
        </Button>
      </div>
      {members.map((member, index) => (
        <div key={index} className="border-b border-white/[.12]">
          <Member member={member} />
        </div>
      ))}
      <MembersModal
        members={members}
        onClose={() => setVisible(false)}
        show={isVisible}
      />
    </div>
  );
};

export default TeamMembersList;
