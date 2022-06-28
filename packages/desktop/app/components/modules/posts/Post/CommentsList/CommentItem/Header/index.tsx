import { FC } from "react";
import Avatar from "../../../../../../common/Avatar";
import { Menu } from "@headlessui/react";
import Button from "../../../../../../common/Button";
import { DotsThreeOutlineVertical, Pen, Trash } from "phosphor-react";
import { Comment } from "shared/graphql/query/post/usePost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useAccountContext } from "shared/context/Account";

dayjs.extend(relativeTime);

interface HeaderProps {
  comment: Comment;
  isMyComment: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const Header: FC<HeaderProps> = ({
  comment,
  isMyComment,
  onEdit,
  onDelete,
}) => {
  const account = useAccountContext();
  return (
    <>
      <div className="flex items-center">
        <Link
          href={
            comment.user._id == account._id
              ? "/profile/me"
              : `/profile/${comment.user._id}`
          }
        >
          <a>
            <div className="flex-shrink-0">
              <Avatar user={comment.user} size={36} />
            </div>
          </a>
        </Link>
        <div className="ml-3">
          <div className="text-sm text-white/[.6]">
            {comment.user.firstName} {comment.user.lastName}
          </div>
          <div className="text-xs text-white/[.38]">
            {comment.user.position && comment.user.company && (
              <>
                {comment.user.position} • {comment.user.company.name}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center ml-auto">
          <div className="text-xs text-white/[.38]">
            {dayjs(comment.createdAt).fromNow(true)}
          </div>
          <div className={`${isMyComment ? "" : "hidden"} ml-3`}>
            <Menu as="div" className="relative">
              <Menu.Button as="div">
                <Button variant="text" className="flex">
                  <DotsThreeOutlineVertical
                    size={16}
                    weight="fill"
                    className="block opacity-60"
                  />
                </Button>
              </Menu.Button>
              <Menu.Items className="z-10 absolute right-0 w-48 bg-background-popover shadow-md shadow-black rounded py-2">
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={onDelete}
                  >
                    <Trash size={16} />
                    <span className="text-sm ml-3">Delete</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={onEdit}
                  >
                    <Pen size={18} color="currentColor" />
                    <span className="text-sm ml-3">Edit</span>
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
