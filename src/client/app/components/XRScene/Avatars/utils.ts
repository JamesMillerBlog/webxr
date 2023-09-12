import { UserData } from "../../../common";

export const extractUserData = (
  selectedUser: string,
  data: UserData[]
): {
  userImage: string;
  userAvatar: string;
} => {
  const currentUser = data.find((user) => findCurrentUser(user, selectedUser));

  const { image, avatar } = currentUser;
  return {
    userImage: image,
    userAvatar: avatar,
  };
};

export const findCurrentUser = (user: UserData, currentUser: string) => {
  return user.uid === currentUser;
};
