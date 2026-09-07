import { ReactNode } from "react";
import { Sidebar, MobileBottomNav } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header title={title} />
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
