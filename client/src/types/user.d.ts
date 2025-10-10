export interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
}
export type UserForm = {
  email: string;
  password: string;
  login_incorrect?: string;
};
