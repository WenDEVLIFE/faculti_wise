import * as React from "react";
import { TeacherSidebar } from "./TeacherSidebar";
import { Header } from "./Header";
import { AiChatDrawer } from "../ai/AiChatDrawer";

interface TeacherAppShellProps {
  children: React.ReactNode;
}

export function TeacherAppShell({ children }: TeacherAppShellProps) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden font-manrope relative">
      <TeacherSidebar />
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
