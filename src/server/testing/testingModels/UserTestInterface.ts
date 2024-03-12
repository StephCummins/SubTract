export default interface UserTest {
  userId?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: boolean;
  picture?: string | null;
  dateCreated?: string;
  newPassword?: string;
}
