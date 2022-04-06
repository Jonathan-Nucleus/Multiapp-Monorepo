import { FC, useState } from "react";
import Image from "next/image";
import { Plus, Image as ImageIcon } from "phosphor-react";
import Logo from "shared/assets/images/background.png";

import Input from "./Input";
import PButton from "./PButton";
import styles from "./createpost.module.css";

const CreatePost: FC = () => {
  return (
    <div className="w-full mt-5 bg-purple rounded-lg p-3">
      <div className="flex flex-row justify-between items-start">
        <Image
          src={Logo}
          width={56}
          height={56}
          className="rounded-full"
          alt=""
        />
        <div className="flex flex-col	flex-1 mr-3 ml-3">
          <Input
            type="text"
            placeholder="Animated suggestions..."
            className={styles.rounded99}
          />
          <div className="flex items-center mt-3">
            <ImageIcon size={18} />
            <div className="text-sm text-slate-300 ml-1">Photo/Video</div>
          </div>
        </div>

        <PButton
          label={<Plus size={14} />}
          onClick={() => {}}
          className={styles.button}
        />
      </div>
    </div>
  );
};

export default CreatePost;
