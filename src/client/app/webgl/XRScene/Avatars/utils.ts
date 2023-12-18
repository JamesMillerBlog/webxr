import { User } from "@shared/types";

export const extractUserData = (
  selectedUser: string,
  data: User[]
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

export const findCurrentUser = (user: User, currentUser: string) => {
  return user.uid === currentUser;
};
