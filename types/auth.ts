export type AuthUser = {
  _id: string;
  phone: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email?: string;
  city?: string;
};

export type SignInResponse = {
  success: true;
  token: string;
  user: AuthUser;
};
