// User database (in-memory for demo)
import * as bcrypt from 'bcryptjs';

export type Role =
  | 'EXECUTIVE'
  | 'ANALYST'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'AUDITOR'
  | 'ADMIN'
  | 'OWNER';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
};

// Hash password for demo users (password: demo1234)
const DEMO_PASSWORD_HASH = bcrypt.hashSync('demo1234', 10);

// Demo users - seeded on startup
export const DEMO_USERS: User[] = [
  {
    id: 'user_1',
    email: 'executive@rlumina.io',
    name: 'Executive User',
    role: 'EXECUTIVE',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_2',
    email: 'analyst@rlumina.io',
    name: 'Risk Analyst',
    role: 'ANALYST',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_3',
    email: 'ops@rlumina.io',
    name: 'Operations Manager',
    role: 'OPERATIONS',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_4',
    email: 'finance@rlumina.io',
    name: 'Finance Controller',
    role: 'FINANCE',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_5',
    email: 'auditor@rlumina.io',
    name: 'Auditor',
    role: 'AUDITOR',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_6',
    email: 'admin@rlumina.io',
    name: 'Administrator',
    role: 'ADMIN',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user_7',
    email: 'owner@rlumina.io',
    name: 'System Owner',
    role: 'OWNER',
    password: DEMO_PASSWORD_HASH,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Simple in-memory database
let users: User[] = [...DEMO_USERS];

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) {
        return users.find((u) => u.email === where.email) || null;
      }
      if (where.id) {
        return users.find((u) => u.id === where.id) || null;
      }
      return null;
    },
    findMany: async () => {
      return users;
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const newUser: User = {
        ...data,
        id: `user_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Omit<User, 'id' | 'createdAt'>>;
    }) => {
      const index = users.findIndex((u) => u.id === where.id);
      if (index === -1) return null;

      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      };
      return users[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = users.findIndex((u) => u.id === where.id);
      if (index === -1) return null;

      const deleted = users[index];
      users = users.filter((u) => u.id !== where.id);
      return deleted;
    },
  },
};
