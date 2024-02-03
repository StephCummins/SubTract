export default interface User {
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: boolean | null;
  picture: string | null;
  dateCreated?: string | null;
}
