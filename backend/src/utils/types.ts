export interface Chat {
    message: string;
    mine?: boolean;
    userId: string;
    username: string;
  }

export type RoomMap = Map<string, string[]>;