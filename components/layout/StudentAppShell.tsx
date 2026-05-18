import { StudentSidebar } from "./StudentSidebar";
import { StudentHeader } from "./StudentHeader";
import { AiChatDrawer } from "../ai/AiChatDrawer";

interface StudentAppShellProps {
  children: React.ReactNode;
}

export function StudentAppShell({ children }: StudentAppShellProps) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden font-manrope relative">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentHeader />
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
