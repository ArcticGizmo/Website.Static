export interface Profile {
  id: string;
  roles: string[];
  userInfo: UserInfo;
}

export interface UserInfo {
  sub: string;
  name: string;
  email: string;
}
