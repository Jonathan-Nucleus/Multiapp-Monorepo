import { toast as toaster } from "react-hot-toast";
import { CheckCircle } from "phosphor-react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Toast = {
  success: (message: string) => {
    toaster.custom(
      (t) => (
        <Transition
          as={Fragment}
          show={t.visible}
          appear
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <div className="inline-block w-80 min-w-fit bg-black rounded-lg mt-10 z-20">
            <div className="flex items-center px-3 py-2 bg-success/[.7] rounded-lg">
              <CheckCircle className="text-white" size={32} weight="light" />
              <div className="text-sm text-white ml-2 mr-5">{message}</div>
            </div>
          </div>
        </Transition>
      ),
      { duration: 5000 }
    );
  },
};
