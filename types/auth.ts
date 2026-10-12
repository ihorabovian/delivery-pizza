export type AuthUser = {
  _id: string;
  phone: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email?: string;
  city?: string;
};

// Editable profile fields; the phone is the sign-in identifier and can't be changed
export type UpdateProfileRequest = Partial<Omit<AuthUser, "_id" | "phone">>;

export type SignInResponse = {
  success: true;
  token: string;
  user: AuthUser;
};
