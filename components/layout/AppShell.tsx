import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AiChatDrawer } from "../ai/AiChatDrawer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden font-manrope relative">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <AiChatDrawer />
    </div>
  );
}
