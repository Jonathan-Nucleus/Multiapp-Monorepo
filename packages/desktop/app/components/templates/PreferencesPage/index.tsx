import { ChangeEvent, FC, useState } from "react";
import Checkbox from "../../common/Checkbox";
import Label from "../../common/Label";
import Button from "../../common/Button";

const PreferencesPage: FC = () => {
  const preferences = [
    "News",
    "ESG",
    "Politics",
    "Venture Capital",
    "Ideas",
    "Financials",
    "Education",
    "Energy",
    "Questions",
    "Crypto",
    "Tech",
    "Private Equity",
    "Consumer",
    "Hedge Funds",
    "Industrials",
    "Entertainment",
    "Healthcare",
    "OpEd",
  ];
  const [selections, setSelections] = useState<string[]>([]);
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <div className="text-white">One last thing...</div>
        <h1 className="text-white text-2xl mt-4">
          Select at least 3 topics to help us personalize your experience.
        </h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.map((preference) => (
            <div
              key={preference}
              className="bg-primary-solid/[.3] rounded-full flex flex-row items-center px-3 py-2"
            >
              <Checkbox
                id={`preference-${preference}`}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const _selections = [...selections];
                  const index = _selections.indexOf(preference);
                  if (event.target.checked) {
                    if (index == -1) {
                      _selections.push(preference);
                    }
                  } else {
                    if (index != -1) {
                      _selections.splice(index, 1);
                    }
                  }
                  setSelections(_selections);
                }}
              />
              <Label htmlFor={`preference-${preference}`} className="ml-2">
                {preference}
              </Label>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-row justify-between md:pl-24 pb-10">
          <div className="md:mx-auto">
            <Button variant="text" className="text-primary">
              SKIP
            </Button>
          </div>
          <div>
            <Button
              variant="gradient-primary"
              className="w-24"
              disabled={selections.length < 3}
            >
              FINISH
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
