import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Avatar from "../../common/Avatar";
import BackgroundImage from "../../common/Background";
import CommonPageLayout from "../../layouts/CommonPageLayout";
import Filter from "../../common/Filter";
import ListTile from "../../common/ListTile";
import Loading from "../../common/Loading";
import ModalDialog from "../../common/ModalDialog";
import Search from "../../common/Search";
import Tabs from "../../common/Tabs";

import SortHeader from "./SortHeader";

import UserTab from "./ProfileTab";
import ActivityTab from "./ActivityTab";
import FundsTab from "./FundsTab";

import {
  useUsers,
  useUser,
  useSearchUsers,
  UserSummary,
  User,
} from "../../../graphql/queries/users";
import {
  useUpdateUser,
  useFetchUploadLink,
} from "../../../graphql/mutations/useUpdateUser";
import { UserRoleOptions } from "admin/app/backend/graphql/enumerations.graphql";

const UsersPage: FC = () => {
  const { data: { users = [] } = {}, loading } = useUsers();
  const [fetchUser] = useUser();
  const [searchUser] = useSearchUsers();
  const [updateUser] = useUpdateUser();
  const [fetchUploadLink] = useFetchUploadLink();

  const [searchedUsers, setSearchedUsers] = useState<UserSummary[]>();
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedProperty, setSelectedProperty] = useState<
    "avatar" | "background"
  >();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const filterOptions = [
    { label: "All", value: "ALL" },
    ...UserRoleOptions,
  ] as const;
  const [userFilter, setUserFilter] =
    useState<typeof filterOptions[number]["value"]>("ALL");

  const filteredUsers = useMemo(() => {
    const filteredUsers = searchedUsers ? searchedUsers : users;
    if (userFilter === "ALL") return filteredUsers;
    return filteredUsers.filter((user) => user.role === userFilter);
  }, [users, searchedUsers, userFilter]);

  const toggleModal = (property?: typeof selectedProperty) => {
    setSelectedProperty(property);
    setModalVisible(!!property);
  };

  const groupedUsers = useMemo(() => {
    const sortedUsers: Record<string, UserSummary[]> = {};
    filteredUsers.forEach((user) => {
      const firstLetter = user.firstName.charAt(0).toUpperCase();
      if (!sortedUsers[firstLetter]) {
        sortedUsers[firstLetter] = [];
      }

      sortedUsers[firstLetter].push(user);
    });

    return sortedUsers;
  }, [filteredUsers]);

  const selectUser = useCallback(
    async (user: UserSummary): Promise<void> => {
      setUserLoading(true);
      const { data } = await fetchUser({ variables: { userId: user._id } });
      if (data?.user) {
        setSelectedUser(data.user);
      }
      setUserLoading(false);
    },
    [fetchUser]
  );

  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      selectUser(users[0]);
    }
  }, [selectedUser, users, selectUser]);

  const searchHandler = async (text: string): Promise<void> => {
    if (text === "") {
      setSearchedUsers(undefined);
      return;
    }
    const { data } = await searchUser({ variables: { search: text } });
    if (data?.searchUsers) {
      setSearchedUsers(data.searchUsers);
    }
  };

  const uploadMedia = async () => {
    const userId = selectedUser?._id;
    if (!userId || !selectedFile || !selectedProperty) {
      return;
    }

    setIsLoading(true);
    const mediaType =
      selectedProperty === "background" ? "BACKGROUND" : "AVATAR";
    const { data } = await fetchUploadLink({
      variables: {
        localFilename: selectedFile.name,
        type: mediaType,
        id: userId,
      },
    });
    if (!data?.uploadLink) {
      console.log("Failed to upload file");
      return;
    }
    const { remoteName, uploadUrl } = data.uploadLink;

    await fetch(uploadUrl, {
      method: "PUT",
      body: selectedFile,
    });
    if (mediaType === "AVATAR") {
      await updateUser({
        variables: {
          userData: {
            _id: userId,
            [selectedProperty]: remoteName,
          },
        },
      });
    } else if (mediaType === "BACKGROUND") {
      await updateUser({
        variables: {
          userData: {
            _id: userId,
            background: {
              url: remoteName,
              width: 500,
              height: 200,
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        },
      });
    }

    const { data: userData } = await fetchUser({
      variables: { userId: selectedUser._id },
    });
    if (userData?.user) {
      setSelectedUser(userData.user);
    }

    toggleModal();
    setIsLoading(false);
  };

  return (
    <>
      <CommonPageLayout
        title={"Users"}
        search={<Search onSearch={searchHandler} />}
        filter={
          <Filter
            value={userFilter}
            options={filterOptions}
            onOptionSelected={(option) => setUserFilter(option)}
            className="w-[100px]"
          />
        }
        avatar={
          <Avatar
            user={selectedUser}
            size={100}
            onClick={() => toggleModal("avatar")}
            className="cursor-pointer"
          />
        }
        backgroundImage={
          <BackgroundImage
            user={selectedUser}
            className="cursor-pointer"
            onClick={() => toggleModal("background")}
          />
        }
        navCategory={
          loading ? (
            <div className="mt-4">
              <Loading />
            </div>
          ) : (
            <div className="w-full">
              {Object.keys(groupedUsers).map((letter) => {
                return (
                  <Fragment key={letter}>
                    <SortHeader letter={letter as string} />
                    {groupedUsers[letter].map((user) => {
                      return (
                        <ListTile
                          key={user._id}
                          userImage={<Avatar user={user} />}
                          userName={user.firstName + " " + user.lastName}
                          userType={user.role.toLowerCase()}
                          initFocus={user._id === selectedUser?._id}
                          onPressed={() => selectUser(user)}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          )
        }
        tabs={
          <Tabs
            tabTitles={["Profile", "Activity", "Funds"]}
            tabScreens={[
              <Fragment key="Profile">
                {!selectedUser || userLoading ? (
                  <div className="mt-4">
                    <Loading />
                  </div>
                ) : (
                  <UserTab user={selectedUser} />
                )}
              </Fragment>,
              <Fragment key="Activity">
                {!selectedUser ? (
                  <div className="mt-4">
                    <Loading />
                  </div>
                ) : (
                  <ActivityTab user={selectedUser} />
                )}
              </Fragment>,
              <Fragment key="Funds">
                {!selectedUser ? (
                  <div className="mt-4">
                    <Loading />
                  </div>
                ) : (
                  <FundsTab user={selectedUser} />
                )}
              </Fragment>,
            ]}
          />
        }
      />
      {modalVisible && (
        <ModalDialog
          show={modalVisible}
          title={`Edit ${selectedProperty}`}
          titleClass={"flex flex-row text-lg"}
          className={"h-80 w-6/12 flex flex-col justify-start"}
          onClose={toggleModal}
        >
          <>
            <div className="flex flex-col items-center">
              {isLoading && <Loading />}

              <div className="py-10">
                <input
                  type="file"
                  className="file: self-center block w-full text-base text-gray-500
                    file:ml-12 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-base file:font-regular
                    file:bg-blue-50 file:text-gray-700
                    hover:file:bg-blue-100"
                  onChange={(evt) => {
                    if (evt.target.files) {
                      setSelectedFile(evt.target.files[0]);
                    }
                  }}
                />
              </div>
              <button
                className="rounded-md bg-blue-500 p-3 mb-6 w-6/12"
                type="button"
                onClick={uploadMedia}
              >
                <p className="text-white">Upload</p>
              </button>
            </div>
          </>
        </ModalDialog>
      )}
    </>
  );
};

export default UsersPage;
