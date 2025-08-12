export type User = {
    id: string;
    email: string;
    name: string;
    password: string; // hashed
    createdAt: Date;
    updatedAt: Date;
  };
  