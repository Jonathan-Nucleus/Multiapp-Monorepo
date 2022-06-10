import { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "phosphor-react";

interface DisclosureModalProps {
  show: boolean;
  onClose: () => void;
}

const DisclosureModal: FC<DisclosureModalProps> = ({ show, onClose }) => {
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          open={show}
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => onClose()}
        >
          <div className="min-h-screen flex items-center justify-center text-sm">
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
              <div className="w-full bg-background-card max-w-xl rounded-lg p-10">
                <div className="text-xl text-white font-medium">
                  Promentheus Disclosures
                  <div
                    className="float-right cursor-pointer"
                    onClick={() => onClose()}
                  >
                    <X color="white" size={24} />
                  </div>
                </div>
                <div className="mt-4">
                  Content provided is for educational purposes only. All
                  investments involve risk, including the possible loss of
                  capital. Private placements, also referred to as alternative
                  investments, are complex, speculative, illiquid and carry a
                  high degree of risk, including the potential loss of your
                  entire investment and are not suitable for all investors. View
                  our{" "}
                  <a
                    href="https://www.prometheusalts.com/importantdisclosure.html"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Important Disclosure
                  </a>{" "}
                  for additional disclosures and information.
                  <br />
                  <br />
                  Prometheus means Prometheus Alternative Investments, Inc., and
                  its in-application and web experiences with its family of
                  wholly owned subsidiaries, which includes Prometheus
                  Financial, LLC, Prometheus Financial Advisors, LLC, Prometheus
                  Access Administrator, LLC and Studio Prometheus, LLC.
                  <br />
                  <br />
                  The Marketplace and investment opportunities offered by
                  Prometheus Financial Advisors, LLC, a Registered Investment
                  Advisor (RIA). See Prometheus Financial Advisors, LLC’s Form
                  ADV Part 2A for more information regarding the RIA. Securities
                  products and services offered are private placements only sold
                  to accredited investors.
                  <br />
                  <br />
                  Securities transactions executed by Prometheus Financial, LLC,
                  a registered broker-dealer, member{" "}
                  <a
                    href="https://www.finra.org/"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    FINRA
                  </a>
                  /
                  <a
                    href="https://www.sipc.org/"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    SIPC
                  </a>
                  . See Prometheus Financial, LLC’s{" "}
                  <a
                    href="https://www.prometheusalts.com/brokeragerelationshipsummary.html"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Brokerage Form CRS Relationship Summary
                  </a>{" "}
                  for a summary of the types of services the broker dealer
                  provides and what they cost.
                  <br />
                  <br />
                  You can access all our disclosures in our{" "}
                  <a
                    href="https://www.prometheusalts.com/legals/disclosure-library"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Disclosure Library
                  </a>
                  . Click{" "}
                  <a
                    href="https://help.prometheusalts.com/hc/en-us/articles/4414447421851-Glossary-Terms"
                    className="text-primary"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    here
                  </a>{" "}
                  for definitions and acronyms of financial terminology you may
                  encounter in our content.
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DisclosureModal;
