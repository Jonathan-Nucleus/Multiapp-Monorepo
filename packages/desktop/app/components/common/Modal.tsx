import { FC, HTMLProps } from "react";
import { XCircle } from "phosphor-react";

import Button from "./Button";

interface ModalProps extends HTMLProps<HTMLButtonElement> {
  title: string;
  nextLabel: string;
  onClose: () => void;
  handleNext: () => void;
}

const Modal: FC<ModalProps> = (props) => {
  return (
    <div className="fixed bottom-0 top-0 left-0 right-0 z-50 flex items-center justify-center bg-dark">
      <div className="rounded-lg  w-full bg-purple max-w-3xl max-h-full overflow-auto">
        <div className="flex justify-between items-center p-4">
          <div>{props.title}</div>
          <Button onClick={props.onClose} variant="text">
            <XCircle size={32} />
          </Button>
        </div>
        <div className="border-y p-4">{props.children}</div>
        <div className="flex justify-between items-center p-4">
          <Button onClick={props.onClose} variant="text">
            <div className="text-blue-600">Cancel</div>
          </Button>
          <Button onClick={props.handleNext} variant="gradient-primary">
            {props.nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
