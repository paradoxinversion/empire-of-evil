import { Bell } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { useGameStore } from '../../store/gameStore';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { formatGameDate } from '../../utils/formatDate';
import { getEvilTier } from '../../utils/evilTier';

function formatMoney(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

function formatCashflow(amount: number): string {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatMoney(amount)}/day`;
}

export function Topbar() {
  const gameState = useGameState();
  const status = useGameStore(s => s.status);
  const advanceTo = useGameStore(s => s.advanceTo);
  const pauseAdvance = useGameStore(s => s.pauseAdvance);

  const { date, empire, pendingEvents } = gameState;
  const { resources, evil } = empire;
  const tier = getEvilTier(evil.perceived);
  const notificationCount = pendingEvents.length;

  const isRunning = status === 'running';

  const handleAdvancePause = () => {
    if (isRunning) {
      pauseAdvance();
    } else {
      advanceTo(date + 1);
    }
  };

  return (
    <header className="bg-bg-surface border-b border-border-subtle h-12 flex items-center px-4 gap-0 flex-shrink-0 z-10">
      {/* Left */}
      <div className="font-mono text-[13px] text-text-secondary flex-1">
        EMPIRE OF EVIL INC.
      </div>

      {/* Center */}
      <div className="font-mono text-[11px] text-text-muted tracking-[0.06em] absolute left-1/2 -translate-x-1/2">
        {formatGameDate(date)}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <div className="relative cursor-pointer">
          <Bell size={14} stroke="#94a3b8" strokeWidth={1.5} />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-accent-red rounded-full w-3.5 h-3.5 font-mono text-[8px] flex items-center justify-center text-white">
              {notificationCount}
            </div>
          )}
        </div>

        {/* EVIL tier pill */}
        <div
          className="font-mono text-[10px] tracking-[0.1em] px-2 py-0.5 rounded-sm bg-accent-red-subtle border border-accent-red-muted"
          style={{ color: tier.color }}
        >
          {tier.name.toUpperCase()}
        </div>

        {/* Money */}
        <div>
          <span className="font-mono text-[12px] text-text-primary">
            {formatMoney(resources.money)}
          </span>
        </div>

        {/* Advance / Pause */}
        <ActionButton variant="primary" onClick={handleAdvancePause}>
          {isRunning ? 'PAUSE' : 'ADVANCE ▾'}
        </ActionButton>
      </div>
    </header>
  );
}
