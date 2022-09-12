import { FC, useState } from "react";
import dayjs from "dayjs";
import _omitBy from "lodash/omitBy";
import _isNil from "lodash/isNil";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { User } from "admin/app/frontend/graphql/fragments/user";
import Field from "../../../common/Field";
import Label from "../../../common/Label";
import Input from "../../../common/Input";

import {
  Accreditation,
  AccreditationOptions,
} from "admin/app/backend/graphql/enumerations.graphql";
import Button from "../../../common/Button";
import { useUpdateUser } from "../../../../graphql/mutations/useUpdateUser";

type FormValues = {
  firstName: string;
  lastName: string;
  accreditation: Accreditation;
  tagline: string | undefined;
  overview: string | undefined;
  position: string | undefined;
  website: string | undefined;
  twitter: string | undefined;
  linkedIn: string | undefined;
};

const schema = yup
  .object({
    firstName: yup.string().default("").required("Required"),
    lastName: yup.string().default("").required("Required"),
    accreditation: yup
      .mixed()
      .oneOf(AccreditationOptions.map((acc) => acc.value)),
    tagline: yup.string().notRequired(),
    overview: yup.string().notRequired(),
    position: yup.string().notRequired(),
    website: yup.string().url().notRequired(),
    twitter: yup.string().url().notRequired(),
    linkedIn: yup.string().url().notRequired(),
  })
  .required();

interface UserTabProps {
  user: User;
}

const UserTab: FC<UserTabProps> = ({ user }) => {
  const [isViewing, setIsViewing] = useState(true);
  const [updateUser] = useUpdateUser();

  const { register, formState, handleSubmit, reset } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: schema.cast(_omitBy(user, _isNil), {
      assert: false,
      stripUnknown: true,
    }),
  });

  const handleEdit = (): void => {
    setIsViewing(false);
  };

  const cancelEdit = (): void => {
    reset();
    setIsViewing(true);
  };

  const onSubmit = async (values: FormValues): Promise<void> => {
    const { data, errors } = await updateUser({
      variables: {
        userData: {
          _id: user._id,
          ...values,
        },
      },
    });

    if (data?.updateUser) {
      setIsViewing(true);
    } else {
      console.log("Error updating user data", errors);
    }
  };

  return (
    <>
      <div className="m-8 flex flex-row justify-end">
        {isViewing ? (
          <Button variant="outline-primary" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="text" onClick={cancelEdit} className="text-error">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4 my-6 mx-8">
        <Field
          name="firstName"
          register={register}
          state={formState}
          label="First Name"
          disabled={isViewing}
        />
        <Field
          name="lastName"
          register={register}
          state={formState}
          label="Last Name"
          disabled={isViewing}
        />
        <Field
          name="accreditation"
          register={register}
          state={formState}
          label="Accreditation"
          disabled={isViewing}
          selectBox={true}
          options={AccreditationOptions}
        />
        <div className="col-span-2 mb-4">
          <Label className="block">Email</Label>
          <Input value={user.email} disabled={true} />
        </div>
        <div className="mb-4">
          <Label className="block">Member Since</Label>
          <Input
            value={dayjs(user.createdAt).format("MMM D, YYYY")}
            disabled={true}
          />
        </div>
        <Field
          name="position"
          register={register}
          state={formState}
          label="Position"
          disabled={isViewing}
        />
        <Field
          name="tagline"
          register={register}
          state={formState}
          label="Tag Line"
          disabled={isViewing}
          className="col-span-2"
        />
        <Field
          name="overview"
          register={register}
          state={formState}
          label="Bio"
          textarea={true}
          rows={5}
          disabled={isViewing}
          className="col-span-3"
        />
        <Field
          name="website"
          register={register}
          state={formState}
          label="Website"
          disabled={isViewing}
        />
        <Field
          name="twitter"
          register={register}
          state={formState}
          label="Twitter"
          disabled={isViewing}
        />
        <Field
          name="linkedIn"
          register={register}
          state={formState}
          label="LinkedIn Profile"
          disabled={isViewing}
        />
        <div className="mb-4">
          <Label className="block">Post Count</Label>
          <Input value={user.postCount} disabled={true} />
        </div>
        <div className="mb-4">
          <Label className="block">Follower Count</Label>
          <Input value={user.followerCount} disabled={true} />
        </div>
        <div className="mb-4">
          <Label className="block">Following Count</Label>
          <Input value={user.followingCount} disabled={true} />
        </div>
      </div>
    </>
  );
};

export default UserTab;
