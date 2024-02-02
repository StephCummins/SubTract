export default interface ErrorMessage {
  log: string;
  status?: number;
  message: { error: string };
}
