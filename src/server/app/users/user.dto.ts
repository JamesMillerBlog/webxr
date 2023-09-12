import { UserMode } from '@shared/types';

export class UserDto {
  uid: string;
  avatar: string;
  userMode: UserMode;
  role: string;
  image: string;
}

export class UpdateUserDto {
  uid: string;
  avatar?: string;
  userMode?: UserMode;
  role?: string;
  image?: string;
}
