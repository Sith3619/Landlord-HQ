import { RouterProvider } from "react-router";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </ThemeProvider>
  );
}
