import { FC, useState } from "react";
import Button from "../../../../components/common/Button";
import MembersModal from "./MembersModal";
import UserItem, { UserItemProps } from "../../../modules/users/UserItem";

type UserType = UserItemProps["user"];

interface TeamMembersListProps {
  members: UserType[];
  showChat?: boolean;
}

const TeamMembersList: FC<TeamMembersListProps> = ({ members, showChat }: TeamMembersListProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="flex items-center text-lg">
        <div className="text-xl text-white tracking-wide font-medium">
          Team Members
        </div>
        <div className="text-primary mx-2">•</div>
        <div>
          <Button
            variant="text"
            className="text-primary tracking-widest font-semibold py-0"
            onClick={() => setShowModal(true)}
          >
            VIEW ALL
          </Button>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-white divide-opacity-20">
        {members.map((member) => (
          <div key={member._id} className="py-6">
            <UserItem user={member} showChat={showChat} />
          </div>
        ))}
      </div>
      <MembersModal
        show={showModal}
        onClose={() => setShowModal(false)}
        members={members}
      />
    </>
  );
};

export default TeamMembersList;
