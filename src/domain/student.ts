export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: Date | null;
    grade?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  