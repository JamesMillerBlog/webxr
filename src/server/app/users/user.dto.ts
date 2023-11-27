import { UserMode } from '@shared/types';

export class UserKeyDto {
  uid: string;
}

export class UserDto extends UserKeyDto {
  avatar: string;
  userMode: UserMode;
  role: string;
  image: string;
}

export class UpdateUserDto {
  avatar?: string;
  userMode?: UserMode;
  role?: string;
  image?: string;
}
