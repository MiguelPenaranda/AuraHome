import React from "react";
import BottomNav from "./BottomNav";

export type MainLayoutProps = {
  children: React.ReactNode;
};

const IconHome: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.47 2.78a.75.75 0 0 1 1.06 0l8.25 8.25a.75.75 0 0 1-.53 1.28H19.5v7.5a.75.75 0 0 1-.75.75h-3.75a.75.75 0 0 1-.75-.75v-4.5h-3v4.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-7.5H3.75a.75.75 0 0 1-.53-1.28l8.25-8.25Z" />
  </svg>
);

const IconPlus: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 4.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6A.75.75 0 0 1 12 4.5Z" />
  </svg>
);

const IconGrid: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4.5 6A1.5 1.5 0 0 1 6 4.5h3A1.5 1.5 0 0 1 10.5 6v3A1.5 1.5 0 0 1 9 10.5H6A1.5 1.5 0 0 1 4.5 9V6Zm0 9A1.5 1.5 0 0 1 6 13.5h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 9 19.5H6A1.5 1.5 0 0 1 4.5 18v-3Zm9-9A1.5 1.5 0 0 1 15 4.5h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 18 10.5h-3A1.5 1.5 0 0 1 13.5 9V6Zm0 9a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 13.5 18v-3Z" />
  </svg>
);

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[480px] min-h-screen flex flex-col">
        <main className="flex-1 px-4 py-4">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
