import { FC } from "react";
import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Input from "desktop/app/components/common/Input";
import Button from "desktop/app/components/common/Button";
import { Plus, Image as ImageIcon } from "phosphor-react";
import { UserProfileProps } from "../../../../types/common-props";
import Skeleton from "./Skeleton";

interface AddPostProps extends UserProfileProps {
  onClick: () => void;
}

const AddPost: FC<AddPostProps> = ({ user, onClick }) => {
  if (!user) {
    return <Skeleton />;
  }
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <Card className="pointer-events-none bg-background-blue p-4">
        <div className="flex items-center">
          <Avatar size={56} src={user?.avatar} />
          <Input
            placeholder="Create a Post"
            className="text-sm rounded-3xl mx-4 px-5 h-12"
          />
          <Button
            variant="gradient-primary"
            className="w-12 h-12 rounded-full"
          >
            <Plus color="white" size={24} />
          </Button>
        </div>
        <div className="mx-16 mt-2">
          <Button variant="text">
            <ImageIcon color="white" size={24} />
            <span className="text-white opacity-60 font-normal tracking-normal ml-2">
            Photo/Video
          </span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddPost;
