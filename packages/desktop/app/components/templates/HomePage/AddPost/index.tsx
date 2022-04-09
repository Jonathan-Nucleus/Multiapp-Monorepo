import { FC } from "react";
import Card from "../../../common/Card";
import Image from "next/image";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import { Plus, Image as ImageIcon } from "phosphor-react";

const profileImage =
  "https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg";

interface CreatePostProps {
  onClick: () => void;
}

const AddPost: FC<CreatePostProps> = (props) => {
  return (
    <Card className="bg-background-popover p-4">
      <div className="flex items-center">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            loader={() => profileImage}
            src={profileImage}
            alt=""
            width={56}
            height={56}
            className="object-cover rounded-full"
            unoptimized={true}
          />
        </div>
        <Input
          placeholder="Animated suggestions..."
          className="rounded-3xl mx-4"
        />
        <Button
          variant="gradient-primary"
          className="w-12 h-12 rounded-full"
          onClick={props.onClick}
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
  );
};

export default AddPost;
