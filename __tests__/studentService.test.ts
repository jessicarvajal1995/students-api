import { listStudents, getStudent, createStudent, updateStudent, deleteStudent, StudentCreateSchema, StudentUpdateSchema } from '../src/application/studentService';
import { prisma } from '../src/infrastructure/db/prisma';

// Mock prisma client
jest.mock('../src/infrastructure/db/prisma', () => ({
  prisma: {
    student: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Student Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('listStudents', () => {
    it('should return a list of students with pagination info', async () => {
      const mockStudents = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }];
      (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);
      (prisma.student.count as jest.Mock).mockResolvedValue(1);

      const result = await listStudents(1, 10);

      expect(prisma.student.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.student.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        items: mockStudents,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('getStudent', () => {
    it('should return a single student if found', async () => {
      const mockStudent = { id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' };
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);

      const result = await getStudent('1');

      expect(prisma.student.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockStudent);
    });

    it('should return null if student is not found', async () => {
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getStudent('999');

      expect(prisma.student.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
      expect(result).toBeNull();
    });
  });

  describe('createStudent', () => {
    it('should create and return a new student', async () => {
      const newStudentInput = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        birthDate: '2000-01-01T00:00:00.000Z',
      };
      const createdStudent = { id: '2', ...newStudentInput, birthDate: new Date(newStudentInput.birthDate) };
      (prisma.student.create as jest.Mock).mockResolvedValue(createdStudent);

      const result = await createStudent(newStudentInput);

      expect(prisma.student.create).toHaveBeenCalledWith({
        data: {
          ...newStudentInput,
          birthDate: new Date(newStudentInput.birthDate),
        },
      });
      expect(result).toEqual(createdStudent);
    });
  });

  describe('updateStudent', () => {
    it('should update and return the updated student', async () => {
      const updateInput = { email: 'john.doe@example.com' };
      const updatedStudent = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      (prisma.student.update as jest.Mock).mockResolvedValue(updatedStudent);

      const result = await updateStudent('1', updateInput);

      expect(prisma.student.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updateInput });
      expect(result).toEqual(updatedStudent);
    });

    it('should handle partial updates including birthDate', async () => {
      const updateInput = { birthDate: '2001-02-02T00:00:00.000Z' };
      const updatedStudent = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: new Date(updateInput.birthDate) };
      (prisma.student.update as jest.Mock).mockResolvedValue(updatedStudent);

      const result = await updateStudent('1', updateInput);

      expect(prisma.student.update).toHaveBeenCalledWith({ 
        where: { id: '1' }, 
        data: { ...updateInput, birthDate: new Date(updateInput.birthDate) }
      });
      expect(result).toEqual(updatedStudent);
    });

    it('should return null if student to update is not found', async () => {
      (prisma.student.update as jest.Mock).mockRejectedValue(new Error('Student not found')); // Simulate not found

      await expect(updateStudent('999', { firstName: 'NonExistent' })).rejects.toThrow('Student not found');
      expect(prisma.student.update).toHaveBeenCalledWith({ where: { id: '999' }, data: { firstName: 'NonExistent' } });
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student and return the deleted student', async () => {
      const deletedStudent = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      (prisma.student.delete as jest.Mock).mockResolvedValue(deletedStudent);

      const result = await deleteStudent('1');

      expect(prisma.student.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(deletedStudent);
    });

    it('should throw an error if student to delete is not found', async () => {
      (prisma.student.delete as jest.Mock).mockRejectedValue(new Error('Student not found'));

      await expect(deleteStudent('999')).rejects.toThrow('Student not found');
      expect(prisma.student.delete).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });
}); 