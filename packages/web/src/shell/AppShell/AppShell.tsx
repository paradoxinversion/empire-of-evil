import type { ReactNode } from 'react';
import { Topbar } from '../Topbar/Topbar';
import { Sidebar } from '../Sidebar/Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5 bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
