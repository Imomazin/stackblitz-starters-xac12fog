// app/store/auth.ts - Authentication and user management

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole, AuthSession } from "@/app/types";

interface AuthState {
  session: AuthSession | null;
  users: User[]; // For admin user management

  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  canPerformAction: (action: keyof User["permissions"]) => boolean;
}

// Role-based permissions preset
const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case "admin":
      return {
        canEditScenarios: true,
        canDeleteScenarios: true,
        canRunSimulations: true,
        canManageUsers: true,
        canViewAllData: true,
        canExportData: true,
        canAccessCompliance: true,
      };
    case "risk_manager":
      return {
        canEditScenarios: true,
        canDeleteScenarios: true,
        canRunSimulations: true,
        canManageUsers: false,
        canViewAllData: true,
        canExportData: true,
        canAccessCompliance: true,
      };
    case "risk_analyst":
      return {
        canEditScenarios: true,
        canDeleteScenarios: false,
        canRunSimulations: true,
        canManageUsers: false,
        canViewAllData: false,
        canExportData: true,
        canAccessCompliance: false,
      };
    case "executive":
      return {
        canEditScenarios: false,
        canDeleteScenarios: false,
        canRunSimulations: false,
        canManageUsers: false,
        canViewAllData: true,
        canExportData: true,
        canAccessCompliance: false,
      };
    case "compliance":
      return {
        canEditScenarios: false,
        canDeleteScenarios: false,
        canRunSimulations: true,
        canManageUsers: false,
        canViewAllData: false,
        canExportData: true,
        canAccessCompliance: true,
      };
    case "auditor":
      return {
        canEditScenarios: false,
        canDeleteScenarios: false,
        canRunSimulations: false,
        canManageUsers: false,
        canViewAllData: true,
        canExportData: true,
        canAccessCompliance: true,
      };
  }
};

// Demo users with passwords (In production, use proper auth!)
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "user_admin_001",
    email: "admin@rlumina.com",
    password: "admin123",
    name: "Sarah Chen",
    role: "admin",
    department: "IT & Risk",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("admin"),
  },
  {
    id: "user_rm_001",
    email: "rmanager@rlumina.com",
    password: "risk123",
    name: "Michael Rodriguez",
    role: "risk_manager",
    department: "Enterprise Risk Management",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("risk_manager"),
  },
  {
    id: "user_analyst_001",
    email: "analyst@rlumina.com",
    password: "analyst123",
    name: "Emma Thompson",
    role: "risk_analyst",
    department: "Risk Analytics",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("risk_analyst"),
  },
  {
    id: "user_exec_001",
    email: "ceo@rlumina.com",
    password: "exec123",
    name: "James Patterson",
    role: "executive",
    department: "C-Suite",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("executive"),
  },
  {
    id: "user_comp_001",
    email: "compliance@rlumina.com",
    password: "comp123",
    name: "Olivia Martinez",
    role: "compliance",
    department: "Compliance & Regulatory",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("compliance"),
  },
  {
    id: "user_audit_001",
    email: "auditor@rlumina.com",
    password: "audit123",
    name: "David Kim",
    role: "auditor",
    department: "Internal Audit",
    organization: "R_LUMINA Demo Corp",
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    permissions: getRolePermissions("auditor"),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      users: DEMO_USERS.map(({ password, ...user }) => user),

      login: (email: string, password: string) => {
        const user = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return false;

        const { password: _, ...userWithoutPassword } = user;
        const session: AuthSession = {
          user: { ...userWithoutPassword, lastLogin: Date.now() },
          token: `token_${Date.now()}_${Math.random()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        set({ session });
        return true;
      },

      logout: () => {
        set({ session: null });
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          createdAt: Date.now(),
          permissions: getRolePermissions(userData.role),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
      },

      updateUser: (userId, updates) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  ...updates,
                  permissions: updates.role
                    ? getRolePermissions(updates.role)
                    : u.permissions,
                }
              : u
          ),
        }));
      },

      canPerformAction: (action) => {
        const session = get().session;
        return session?.user.permissions[action] ?? false;
      },
    }),
    {
      name: "rlumina_auth",
    }
  )
);
