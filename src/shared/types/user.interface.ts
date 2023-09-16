export interface UserKey {
    uid: string;
}
export interface User extends UserKey {
    role: string;
    avatar: string;
    userMode: UserMode;
    image: string;
}

export enum UserMode {
    AVATAR = 'avatar',
    IMAGE = 'image',
}