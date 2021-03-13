export type User = {
  name: string;
  id: string;
  role: 0 | 1;
  profile_picture: string;
  username: string;
  isLoggedIn?: boolean;
};
