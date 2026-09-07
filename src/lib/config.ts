// ─── Application Configuration ────────────────────────────────────────────────
// Environment-specific configuration.
// Replace import.meta.env values with real environment variables when connecting
// to a backend. All values should come through this file — never hardcode URLs
// or keys directly in components or services.

// TODO: Set VITE_API_URL in your .env file when connecting to a backend
export const API_URL = import.meta.env.VITE_API_URL ?? "";

// TODO: Set VITE_STORAGE_URL when connecting to file storage (S3, Supabase, etc.)
export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL ?? "";

// TODO: Set VITE_AUTH_PROVIDER to "supabase" | "firebase" | "auth0" | "custom"
export const AUTH_PROVIDER = import.meta.env.VITE_AUTH_PROVIDER ?? "mock";

// TODO: Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY when using Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// App metadata
export const APP_NAME = "Landlord HQ";
export const APP_VERSION = "1.0.0";

// Feature flags — toggle to enable/disable in-development features
export const FEATURES = {
  notifications: true,
  globalSearch: true,
  documentUpload: false, // TODO: Enable when cloud storage is connected
  realTimeUpdates: false, // TODO: Enable when WebSocket/Supabase realtime is connected
} as const;

export const IS_MOCK = AUTH_PROVIDER === "mock";
