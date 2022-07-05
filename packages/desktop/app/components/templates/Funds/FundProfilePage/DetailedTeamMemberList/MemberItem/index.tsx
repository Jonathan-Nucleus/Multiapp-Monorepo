import { FC } from "react";
import { DetailedTeamMemberListProps } from "../index";
import Avatar from "../../../../../common/Avatar";
import Link from "next/link";
import { useAccountContext } from "shared/context/Account";
import ReactMarkdown from "react-markdown";

interface MemberItemProps {
  member: DetailedTeamMemberListProps["members"][number];
}

const MemberItem: FC<MemberItemProps> = ({ member }) => {
  const account = useAccountContext();
  const followers = member.followerIds?.length ?? 0;
  const posts = member.postIds?.length ?? 0;
  return (
    <>
      <Link
        href={
          account._id == member._id ? "/profile/me" : `/profile/${member._id}`
        }
      >
        <a>
          <div className="flex items-center">
            <Avatar user={member} size={96} />
            <div className="ml-4">
              <div className="text-sm text-white font-medium">
                {member.firstName} {member.lastName}
              </div>
              <div className="text-xs text-white/[.6]">
                {member.position || ""}
              </div>
              <div className="text-xs text-white/[.6]">
                {`${followers} ${
                  followers === 1 ? "Follower" : "Followers"
                }  •  ${posts} ${posts === 1 ? "Post" : "Posts"}`}
              </div>
            </div>
          </div>
        </a>
      </Link>
      {member.profile && member.profile.length > 0 && (
        <div className="mt-4">
          <div className="divide-y divide-inherit border-white/[.12]">
            {member.profile?.map((section, index) => (
              <div key={index} className="py-4">
                <div className="text-tiny text-white/[.6] font-medium uppercase">
                  {section.title}
                </div>
                <div className="text-sm text-white mt-1">
                  <ReactMarkdown className="whitespace-pre-wrap break-words">
                    {section.desc}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MemberItem;
