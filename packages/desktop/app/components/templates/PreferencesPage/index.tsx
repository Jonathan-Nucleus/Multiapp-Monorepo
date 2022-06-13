import { ChangeEvent, FC, useState } from "react";
import Checkbox from "../../common/Checkbox";
import Label from "../../common/Label";
import Button from "../../common/Button";
import Link from "next/link";
import { PostCategoryOptions } from "backend/schemas/post";
import { UPDATE_SETTINGS } from "shared/graphql/mutation/account";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const categories = Object.keys(PostCategoryOptions);

const PreferencesPage: FC = () => {
  const [selections, setSelections] = useState<string[]>([]);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async () => {
    setLoading(true);
    const { data } = await updateSettings({
      variables: {
        settings: {
          interests: selections,
        },
      },
    });
    if (data && data.updateSettings) {
      await router.replace("/");
    }
    setLoading(false);
  };
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-white text-2xl mt-4">
          Select at least 3 topics to help us personalize your experience.
        </h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((key) => (
            <div
              key={key}
              className="flex items-center bg-background rounded-full overflow-hidden relative cursor-pointer"
            >
              <div
                className="w-full bg-primary-solid/[.24]"
                onClick={() => {
                  if (!selections.includes(key)) {
                    setSelections([...selections, key]);
                  } else {
                    setSelections(selections.filter((item) => item != key));
                  }
                }}
              >
                <div
                  className={`text-sm hover:bg-white/[.08] ${
                    selections.includes(key) ? "bg-white/[.08]" : ""
                  } transition pl-10 py-2`}
                >
                  {PostCategoryOptions[key].label}
                </div>
              </div>
              <Checkbox
                className="absolute left-3"
                checked={selections.includes(key)}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    setSelections([...selections, key]);
                  } else {
                    setSelections(selections.filter((item) => item != key));
                  }
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-row justify-between md:pl-24 pb-10">
          <div className="md:mx-auto">
            <Link href={"/"}>
              <a>
                <Button variant="text" className="text-xs text-primary">
                  Skip
                </Button>
              </a>
            </Link>
          </div>
          <div>
            <Button
              variant="gradient-primary"
              className="w-32 text-sm font-medium"
              disabled={selections.length < 3}
              loading={loading}
              onClick={onSubmit}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
