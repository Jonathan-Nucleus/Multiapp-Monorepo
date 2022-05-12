import { ChangeEvent, FC, Fragment, useState } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../Button";
import Checkbox from "../../Checkbox";
import Label from "../../Label";
import Textarea from "../../Textarea";
import { useReportPost } from "shared/graphql/mutation/posts";
import { PostViolationOptions } from "backend/schemas/user";

interface ReportPostModalProps {
  post: PostSummary;
  show: boolean;
  onClose: () => void;
}

const violationItems = Object.keys(PostViolationOptions)
  .map(key => ({ key, ...PostViolationOptions[key] }));

const ReportPostModal: FC<ReportPostModalProps> = ({ post, show, onClose }) => {
  const [violations, setViolations] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [reportPost] = useReportPost();
  const reportPostCallback = async () => {
    await reportPost({
      variables: {
        report: {
          violations: violations,
          comments: comments,
          postId: post._id,
        },
      },
    });
    onClose();
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
                  Which guidelines does this post violate?
                </div>
                <div className="mt-4">
                  {violationItems.map((item, index) => (
                    <div key={index} className="my-2">
                      <div className="flex items-center">
                        <Checkbox
                          id={`violation-${item.value}`}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (event.target.checked) {
                              setViolations([...violations, item.key]);
                            } else {
                              const _violations = [...violations];
                              _violations.splice(_violations.indexOf(item.key), 1);
                              setViolations(_violations);
                            }
                          }}
                        />
                        <Label
                          className="text-sm text-white font-medium ml-3"
                          htmlFor={`violation-${item.value}`}
                        >
                          {item.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Label
                    className="block text-sm text-white font-medium"
                    htmlFor="comments"
                  >
                    Other comments
                  </Label>
                  <Textarea
                    id="comments"
                    className="block w-full bg-white rounded-2xl text-sm text-black px-3 py-2"
                    rows={5}
                    value={comments}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setComments(event.target.value);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-8">
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
                    onClick={reportPostCallback}
                  >
                    REPORT POST
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

export default ReportPostModal;
