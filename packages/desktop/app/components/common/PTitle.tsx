import React from "react";
import Image from "next/image";

import styles from "./PTitle.module.css";

type PTitleType = {
  title: string;
};

const PTitle: React.FC<PTitleType> = (props: PTitleType) => {
  const { title } = props;
  return <div className={styles.message}>{title}</div>;
};

export default PTitle;
