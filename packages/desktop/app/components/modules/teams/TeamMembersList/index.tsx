import { FC, useState } from "react";
import Button from "../../../../components/common/Button";
import MembersModal from "./MembersModal";
import UserItem, { UserItemProps } from "../../../modules/users/UserItem";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import Avatar from "../../../common/Avatar";

type UserType = UserItemProps["user"];

interface TeamMembersListProps {
  direction?: "vertical" | "horizontal";
  members: UserType[];
  showChat?: boolean;
}

const TeamMembersList: FC<TeamMembersListProps> = ({
  direction = "vertical",
  members,
  showChat,
}: TeamMembersListProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {direction == "vertical" && (
        <div>
          <div className="flex items-center">
            <div className="text-xl text-white tracking-wide font-medium">
              Team Members
            </div>
            <div className="text-sm text-primary mx-2">•</div>
            <div>
              <Button
                variant="text"
                className="text-sm text-primary tracking-widest font-medium py-0"
                onClick={() => setShowModal(true)}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-white divide-opacity-20">
            {members.map((member) => (
              <div key={member._id} className="py-1">
                <div className="hover:bg-primary-overlay/[.24] rounded transition-all -mx-2 px-2 py-5">
                  <UserItem user={member} showChat={showChat} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {direction == "horizontal" && (
        <div>
          <div className="flex items-center mx-2">
            <div className="text-white font-medium">Team Members</div>
          </div>
          <div className="-mx-2 mt-2">
            <Splide
              options={{
                autoWidth: true,
                rewind: true,
                lazyLoad: "nearby",
                cover: true,
                pagination: false,
                arrows: false,
              }}
            >
              <SplideTrack>
                {members.map((member, index) => (
                  <SplideSlide key={index}>
                    <div className="mx-2">
                      <div className="w-40 h-44 flex flex-col items-center bg-black rounded-xl p-2">
                        <Avatar user={member} size={80} shape="circle" />
                        <div className="w-full text-center flex-grow overflow-hidden mt-5">
                          <div className="text-sm text-white font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-white/[.7]">
                            {member.position}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>
                ))}
              </SplideTrack>
            </Splide>
          </div>
        </div>
      )}
      <MembersModal
        show={showModal}
        onClose={() => setShowModal(false)}
        members={members}
      />
    </>
  );
};

export default TeamMembersList;
