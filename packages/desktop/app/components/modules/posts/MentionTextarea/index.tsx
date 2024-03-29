import {
  DataFunc,
  Mention,
  MentionsInput as MentionsInputReact17,
  MentionsInputProps,
} from "react-mentions";
import postStyles from "./post.module.scss";
import commentStyles from "./comment.module.scss";
import { ShieldCheck } from "phosphor-react";

import {
  useController,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";
import * as yup from "yup";
import Avatar from "../../../common/Avatar";
import { useUsers } from "shared/graphql/query/user/useUsers";
import { useAccountContext } from "shared/context/Account";

// TODO: Stopgap measure to address breaking type changes for fragments ({})
// in React 18.
const MentionsInput =
  MentionsInputReact17 as unknown as React.FC<MentionsInputProps>;

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
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  type: "post" | "comment" | "chat";
  placeholder?: string;
  disabled?: boolean;
  inputRef?: MentionsInputProps["inputRef"];
  onKeyDown?: MentionsInputProps["onKeyDown"];
  suggestionsContainer?: Element;
};

function MentionTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(controllerProps: MentionTextareaProps<TFieldValues, TName>) {
  const mentionsController = useController<TFieldValues, TName>({
    ...controllerProps,
    name: `${controllerProps.name}.mentions` as TName,
  });
  const account = useAccountContext();
  const { data: { users: allUsers = [] } = {} } = useUsers();
  const users =
    controllerProps.type != "chat"
      ? allUsers.filter((user) => user._id != account?._id)
      : [];

  const dataFunc: DataFunc = (query, callback) => {
    const items = users
      .filter(
        ({ firstName, lastName }) =>
          firstName.toLowerCase().includes(query.toLowerCase()) ||
          lastName.toLowerCase().includes(query.toLowerCase())
      )
      .map(({ _id, firstName, lastName }) => ({
        id: _id,
        display: `${firstName} ${lastName}`,
      }));
    callback(items);
  };

  return (
    <div className="caret-primary">
      <Controller
        {...controllerProps}
        name={`${controllerProps.name}.body` as TName}
        render={({ field }) => (
          <MentionsInput
            inputRef={controllerProps.inputRef}
            value={field.value}
            onChange={(evtIgnored, newValue) => field.onChange(newValue)}
            placeholder={controllerProps.placeholder}
            classNames={
              controllerProps.type == "post" ? postStyles : commentStyles
            }
            allowSuggestionsAboveCursor={true}
            suggestionsPortalHost={controllerProps.suggestionsContainer}
            onKeyDown={controllerProps.onKeyDown}
            disabled={controllerProps.disabled}
          >
            <Mention
              trigger="@"
              data={dataFunc}
              className="text-primary relative z-10"
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
              renderSuggestion={(suggestion) => {
                const user = users.find((user) => user._id == suggestion.id);
                return (
                  <div className="flex items-center p-2">
                    <Avatar user={user} size={56} />
                    <div className="ml-2">
                      <div className="flex items-center">
                        <div className="text-white">
                          {user?.firstName} {user?.lastName}
                        </div>
                        {user?.role == "PROFESSIONAL" && (
                          <div className="flex items-center">
                            <div className="text-success ml-2">
                              <ShieldCheck
                                color="currentColor"
                                weight="fill"
                                size={16}
                              />
                            </div>
                            <div className="text-white text-tiny ml-1.5">
                              PRO
                            </div>
                          </div>
                        )}
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
