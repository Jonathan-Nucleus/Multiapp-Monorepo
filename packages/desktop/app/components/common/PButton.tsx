import React from "react";
import clsx from "clsx";

import styles from "./PButton.module.css";

type PButtonType = {
  label: any;
  onClick: () => void;
  className?: string;
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "submit" | "button" | "reset";
};

const PButton: React.FC<PButtonType> = (props: PButtonType) => {
  const { label, onClick, className, type } = props;
  return (
    <button
      onClick={onClick}
      className={clsx(styles.button, className)}
      type={type}
    >
      {label}
    </button>
  );
};

export default PButton;
