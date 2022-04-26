import { FC } from "react";
import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Input from "desktop/app/components/common/Input";
import Button from "desktop/app/components/common/Button";
import { Plus, Image as ImageIcon } from "phosphor-react";
import { useAccount } from "mobile/src/graphql/query/account";

interface AddPostProps {
  setShowPostModal: (val: boolean) => void;
}

const AddPost: FC<AddPostProps> = ({ setShowPostModal }) => {
  const { data: accountData } = useAccount();
  return (
    <Card className="bg-background-popover p-4">
      <div className="flex items-center">
        <Avatar size={56} src={accountData?.account.avatar} />
        <Input
          placeholder="Animated suggestions..."
          className="text-sm rounded-3xl mx-4 px-5"
        />
        <Button
          variant="gradient-primary"
          className="w-12 h-12 rounded-full"
          onClick={() => setShowPostModal(true)}
        >
          <Plus color="white" size={24} />
        </Button>
      </div>
      <div className="mx-16 mt-2">
        <Button variant="text" onClick={() => setShowPostModal(true)}>
          <ImageIcon color="white" size={24} />
          <span className="text-white opacity-60 font-normal tracking-normal ml-2">
            Photo/Video
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default AddPost;
