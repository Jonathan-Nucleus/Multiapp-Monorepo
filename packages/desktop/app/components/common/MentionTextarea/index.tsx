import { FC } from "react";
import {
  DataFunc,
  Mention,
  MentionsInput,
  OnChangeHandlerFunc,
} from "react-mentions";
import styles from "./index.module.scss";
import Image from "next/image";
import { ShieldCheck } from "phosphor-react";

import {
  useController,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";
import * as yup from "yup";

const users = [
  {
    id: 1,
    name: "Michelle Jordan",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "7d9d80b7-90dd-42e8-b3e2-a7a37d6cd1ba.png",
  },
  {
    id: 2,
    name: "Brian McAdams",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "614f6093-f67e-40f4-84ea-32c3bacb44f4.png",
  },
  {
    id: 3,
    name: "Enrique Javier Abeyta Ubilios",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "58ec51e9-57a0-4d86-97d2-3d42e8f823ba.png",
  },
  {
    id: 4,
    name: "Thomas Franklin",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "ab3efdcb-5549-4962-bf5c-511a4d11ac18.png",
  },
  {
    id: 5,
    name: "Peter Avellone",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "5b2809ef-cba3-4dca-bb2e-64861926df61.png",
  },
  {
    id: 6,
    name: "Mariah Carey",
    position: "CEO @ HedgeFunds ‘R’ Us",
    type: "PRO",
    avatar: "ae31d937-d8a6-4942-bbd4-26ac4d7e0f6d.png",
  },
];

export const mentionTextSchema = yup
  .object({
    body: yup.string().default(""),
    mentions: yup
      .array()
      .of(
        yup
          .object({
            id: yup.string().required(),
            name: yup.string().required(),
          })
          .required()
      )
      .default([]),
  })
  .required();

type MentionTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, "render">;

function MentionTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(controllerProps: MentionTextareaProps<TFieldValues, TName>) {
  const mentionsController = useController<TFieldValues, TName>({
    ...controllerProps,
    name: `${controllerProps.name}.mentions` as TName,
  });

  const dataFunc: DataFunc = (query, callback) => {
    const items = users
      .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
      .map(({ id, name }) => ({
        id,
        display: name,
      }));
    callback(items);
  };
  return (
    <div className="text-sm text-white h-full">
      <Controller
        {...controllerProps}
        name={`${controllerProps.name}.body` as TName}
        render={({ field }) => (
          <MentionsInput
            value={field.value}
            onChange={(evtIgnored, newValue) => field.onChange(newValue)}
            placeholder={
              "Create a post\nUse $ before ticker symbols: ex: $TSLA\nUse @ to tag a user, page or fund"
            }
            classNames={styles}
          >
            <Mention
              trigger="@"
              data={dataFunc}
              appendSpaceOnAdd
              onAdd={(id, display) => {
                mentionsController.field.onChange([
                  ...mentionsController.field.value,
                  {
                    id,
                    name: display,
                  },
                ]);
              }}
              renderSuggestion={(suggestion, search, highlightedDisplay) => {
                const user = users.find((item) => item.id == suggestion.id);
                return (
                  <div className="flex items-center p-2">
                    <div className="flex items-center">
                      <Image
                        loader={() =>
                          `${process.env.NEXT_PUBLIC_AVATAR_URL}/${user?.avatar}`
                        }
                        src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${user?.avatar}`}
                        alt=""
                        width={56}
                        height={56}
                        className="object-cover rounded-full"
                        unoptimized={true}
                      />
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center">
                        <div className="text-base">{highlightedDisplay}</div>
                        <div className="text-success ml-2">
                          <ShieldCheck
                            color="currentColor"
                            weight="fill"
                            size={16}
                          />
                        </div>
                        <div className="text-xs text-white ml-1">
                          {user?.type}
                        </div>
                      </div>
                      <div className="text-white text-xs opacity-60">
                        {user?.position}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </MentionsInput>
        )}
      />
    </div>
  );
}

export default MentionTextarea;
