import { FC } from "react";

import Member from "./Member";
import Button from "../../../../components/common/Button";

const members = [
  {
    image:
      "https://img.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg",
    name: "Michelle Jordan",
    type: "PRO",
    position: "CEO @ HedgeFunds ‘R’ Us",
    description: "National Basketball Association",
  },
  {
    image:
      "https://img.freepik.com/free-vector/smiling-girl-avatar_102172-32.jpg",
    name: "Michelle Jordan",
    type: "PRO",
    position: "CEO @ HedgeFunds ‘R’ Us",
    description: "National Basketball Association",
  },
];

const TeamMembersList: FC = () => {
  return (
    <div>
      <div className="flex items-center">
        <div className="text-white mr-2">Team Members</div>
        <Button
          variant="text"
          className="text-xs text-primary tracking-normal font-normal py-0"
        >
          •VIEW ALL
        </Button>
      </div>
      {members.map((member, index) => (
        <div key={index} className="border-b border-white/[.12]">
          <Member member={member} />
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
