import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'user2',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Miller',
    role: 'customer',
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 'user3',
    email: 'david@example.com',
    firstName: 'David',
    lastName: 'Lee',
    role: 'customer',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: 'manager1',
    email: 'mario@bellaitalia.com',
    firstName: 'Mario',
    lastName: 'Rossi',
    role: 'restaurantManager',
    createdAt: new Date('2022-11-05'),
  },
  {
    id: 'manager2',
    email: 'takashi@sushidelight.com',
    firstName: 'Takashi',
    lastName: 'Yamamoto',
    role: 'restaurantManager',
    createdAt: new Date('2022-10-15'),
  },
  {
    id: 'manager3',
    email: 'pierre@bistromoderne.com',
    firstName: 'Pierre',
    lastName: 'Dupont',
    role: 'restaurantManager',
    createdAt: new Date('2023-01-02'),
  },
  {
    id: 'admin1',
    email: 'admin@booktable.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date('2022-01-01'),
  },
];

// Current logged-in user (for testing)
export const currentUser: User = {
  id: 'user1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'customer',
  createdAt: new Date('2023-01-15'),
};