import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { UserSummary } from "shared/graphql/fragments/user";
import Button from "../../../../common/Button";
import { useHideUser } from "shared/graphql/mutation/account";

type User = Pick<UserSummary, "_id" | "firstName" | "lastName">;
interface ConfirmHideUserModalProps {
  user: User;
  show: boolean;
  onClose: () => void;
}

const ConfirmHideUserModal: FC<ConfirmHideUserModalProps> = ({
  user,
  show,
  onClose,
}) => {
  const [hideUser] = useHideUser();
  const hideUserCallback = async () => {
    const { data } = await hideUser({
      variables: { hide: true, userId: user._id },
    });
    if (data?.hideUser) {
      onClose();
    } else {
      // TODO: Present error in UI
      console.log("Error hiding user");
    }
  };
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          open={show}
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => onClose()}
        >
          <div className="min-h-screen flex items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-full bg-background-card max-w-md rounded-lg px-8 py-6">
                <div className="text-xl text-white font-medium">
                  Hide {user.firstName} {user.lastName}?
                </div>
                <div className="text-sm text-white mt-4">
                  Are you sure you want to hide this user? You won&apos;t see
                  posts from this user or be able to see their user profile, but
                  they can still see your profile and posts.
                </div>
                <div className="text-sm text-white font-semibold mt-5">
                  This cannot be undone.
                </div>
                <div className="flex items-center justify-between mt-5">
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal py-0"
                    onClick={onClose}
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="text"
                    className="text-sm text-error tracking-normal py-0"
                    onClick={hideUserCallback}
                  >
                    HIDE USER
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConfirmHideUserModal;
