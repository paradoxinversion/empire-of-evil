import { ActionButton } from '../../components/ActionButton/ActionButton';

interface LoginScreenProps {
  onNewGame: () => void;
}

export function LoginScreen({ onNewGame }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="bg-bg-surface border border-border-subtle rounded-sm p-10 flex flex-col items-center gap-6 min-w-[320px]">
        <div className="text-center">
          <div className="font-mono text-2xl text-text-primary tracking-tight mb-2">
            EMPIRE OF EVIL INC.
          </div>
          <div className="text-[12px] text-text-muted">
            Global Operations Management System
          </div>
        </div>

        <div className="w-full border-t border-border-subtle" />

        <ActionButton variant="primary" onClick={onNewGame} className="w-full text-center">
          NEW GAME
        </ActionButton>
      </div>
    </div>
  );
}
