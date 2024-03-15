export default interface Session {
  messages: Message[];
}

interface Message {
  role: string;
  content: string;
}
