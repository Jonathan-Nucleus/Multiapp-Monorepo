import { FC, useState } from "react";

import Member from "./Member";
import Button from "../../../../components/common/Button";
import MembersModal from "./MembersModal";
import type { User } from "backend/graphql/users.graphql";

import { useAccount } from "desktop/app/graphql/queries";
import { useFollowUserAsCompany } from "desktop/app/graphql/mutations/profiles";
import type { Company } from "backend/graphql/companies.graphql";
interface MembersModalProps {
  company: Company;
}

const TeamMembersList: FC<MembersModalProps> = ({ company }) => {
  const { data: userData, loading: userLoading, refetch } = useAccount();
  const [isVisible, setVisible] = useState(false);
  const [followUser] = useFollowUserAsCompany();
  const members = company.members;

  const toggleFollowingUser = async (
    id: string,
    follow: boolean
  ): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: follow, userId: id, asCompanyId: company._id },
      });
      if (data?.followUser) {
        refetch();
      } else {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

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
          <Member member={member} toggleFollowingUser={toggleFollowingUser} />
        </div>
      ))}
      <MembersModal
        members={members}
        onClose={() => setVisible(false)}
        show={isVisible}
        toggleFollowingUser={toggleFollowingUser}
      />
    </div>
  );
};

export default TeamMembersList;
