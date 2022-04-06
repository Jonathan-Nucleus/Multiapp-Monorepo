import React from "react";
import Image from "next/image";

import styles from "./PErrorText.module.css";

type PErrorTextType = {
  label?: string;
};

const PErrorText: React.FC<PErrorTextType> = (props) => {
  const { label } = props;
  return (
    <div className={styles.container}>
      <Image src="/icons/error.svg" alt="error" width={20} height={20} />
      <div className={styles.message}>{label}</div>
    </div>
  );
};

export default PErrorText;
