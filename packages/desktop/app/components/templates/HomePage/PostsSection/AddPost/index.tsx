import { FC } from "react";
import Card from "desktop/app/components/common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import Input from "desktop/app/components/common/Input";
import Button from "desktop/app/components/common/Button";
import { Plus, Image as ImageIcon } from "phosphor-react";
import Skeleton from "./Skeleton";
import Label from "../../../../common/Label";
import { Account } from "shared/context/Account";

interface AddPostProps {
  account: Account;
  onClick: (file?: File) => void;
}

const AddPost: FC<AddPostProps> = ({ account, onClick }) => {
  if (!account) {
    return <Skeleton />;
  }
  return (
    <div id="home-page-add-post">
      <Card className="bg-background-blue p-4">
        <div className="flex items-center">
          <Avatar user={account} size={56} />
          <Input
            placeholder="Create a Post"
            className="text-sm rounded-3xl mx-4 px-5 h-12"
            readOnly={true}
            onClick={() => onClick()}
          />
          <Button
            variant="gradient-primary"
            className="w-12 h-12 rounded-full"
            onClick={() => onClick()}
          >
            <Plus color="white" size={24} />
          </Button>
        </div>
        <div className="mx-16 mt-2">
          <Label className="inline-flex items-center cursor-pointer hover:opacity-80 transition">
            <ImageIcon color="white" size={24} />
            <span className="text-white opacity-60 font-normal tracking-normal ml-2">
              Photo/Video
            </span>
            <Input
              type="file"
              value=""
              onInput={async (event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  onClick?.(file);
                }
              }}
              className="hidden"
              accept="image/*, video/*"
            />
          </Label>
        </div>
      </Card>
    </div>
  );
};

export default AddPost;
