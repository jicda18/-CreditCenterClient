export interface Message {
  type: string;
  title: string;
  message: string;
  time?: number;
  infinite?: boolean;
}
