export interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  couple?: { id: string };
}

export interface Box {
  id: string;
  name: string;
  description?: string;
  coupleId: string | null;
  createdByUserId: string;
  createdAt: string;
}

export interface Item {
  id: string;
  content: string;
  boxId: string;
  createdByUserId: string;
  createdAt: string;
  completed: boolean;
  createdBy: {
    id: string;
    nickname: string;
  };
}

export interface BoxWithItems extends Box {
  items: Item[]
}

export interface ApiError {
  error: string;
  statusCode: number;
}

