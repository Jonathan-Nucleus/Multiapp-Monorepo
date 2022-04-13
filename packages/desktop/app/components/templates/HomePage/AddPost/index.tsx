import { FC, useState } from "react";
import Card from "../../../common/Card";
import Image from "next/image";
import Avatar from "desktop/app/components/common/Avatar";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import { Plus, Image as ImageIcon } from "phosphor-react";
import CreatePostModal from "./CreatePostModal";

interface AddPostProps {
  setShowPostModal: (val: boolean) => void;
}
const AddPost: FC<AddPostProps> = (props) => {
  return (
    <Card className="bg-background-popover p-4">
      <div className="flex items-center">
        <Avatar size={56} />
        <Input
          placeholder="Animated suggestions..."
          className="rounded-3xl mx-4 px-5"
        />
        <Button
          variant="gradient-primary"
          className="w-12 h-12 rounded-full"
          onClick={() => props.setShowPostModal(true)}
        >
          <Plus color="white" size={24} />
        </Button>
      </div>
      <div className="mx-16 mt-2">
        <Button variant="text" onClick={() => props.setShowPostModal(true)}>
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
