import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import Skeleton from "./Skeleton";
import UserItem from "../../../modules/users/UserItem";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import ItemView from "./ItemView";

interface UsersPageProps {
  users: GlobalSearchData["globalSearch"]["users"] | undefined;
}

const UsersPage: FC<UsersPageProps> = ({ users }) => {
  if (!users) {
    return <Skeleton />;
  }
  if (users.length == 0) {
    return <></>;
  }
  return (
    <>
      {users.map((user, index) => (
        <div key={index} className="mb-4">
          <ItemView user={user} />
        </div>
      ))}
    </>
  );
};

export default UsersPage;