import type { User } from "../../types";
import type { IAuthService, AuthCredentials, SignupData } from "../interfaces";

// TODO: Replace with real auth (Supabase, Firebase, Auth0, etc.)
const MOCK_USER: User = {
  id: "mock-user-1",
  email: "landlord@example.com",
  fullName: "John Landlord",
  role: "owner",
  createdAt: "2026-01-01",
};

let currentUser: User | null = MOCK_USER;

export const mockAuthService: IAuthService = {
  async login(_credentials: AuthCredentials) {
    // TODO: Validate credentials against auth provider
    currentUser = MOCK_USER;
    return MOCK_USER;
  },

  async signup(data: SignupData) {
    // TODO: Create account in auth provider, then create user profile
    currentUser = { ...MOCK_USER, email: data.email, fullName: data.fullName };
    return currentUser;
  },

  async logout() {
    // TODO: Invalidate session in auth provider
    currentUser = null;
  },

  async getCurrentUser() {
    return currentUser;
  },

  async getSession() {
    if (!currentUser) return null;
    return { user: currentUser };
  },
};
