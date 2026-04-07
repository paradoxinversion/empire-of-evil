import type { AgentJob } from '@empire-of-evil/engine';
import { useGameState } from '../../hooks/useGameState';
import { Panel } from '../../components/Panel/Panel';
import { Tag } from '../../components/Tag/Tag';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import type { TagVariant } from '../../components/Tag/Tag';

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
  operative:     'operative',
  scientist:     'scientist',
  troop:         'troop',
  administrator: 'admin',
  unassigned:    'unassigned',
};

interface InnerCircleTabProps {
  onSelectPerson: (id: string) => void;
}

export function InnerCircleTab({ onSelectPerson }: InnerCircleTabProps) {
  const gameState = useGameState();
  const { persons, empire } = gameState;

  const members = empire.innerCircleIds
    .map(id => persons[id])
    .filter((p): p is NonNullable<typeof p> => !!p && !p.dead);

  if (members.length === 0) {
    return (
      <Panel>
        <div className="text-text-muted text-[11px]">No inner circle members appointed.</div>
      </Panel>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {members.map(person => {
        const top3Attrs = Object.entries(person.attributes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        const loyalty = person.loyalties[empire.id] ?? 0;

        return (
          <Panel key={person.id}>
            <div
              className="cursor-pointer hover:bg-bg-elevated -m-3 p-3 transition-colors"
              onClick={() => onSelectPerson(person.id)}
            >
              <div className="font-mono text-[12px] text-text-primary mb-1">{person.name}</div>
              {person.agentStatus && (
                <Tag variant={JOB_TAG_VARIANT[person.agentStatus.job]}>
                  {person.agentStatus.job.toUpperCase()}
                </Tag>
              )}

              {top3Attrs.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {top3Attrs.map(([key, value]) => (
                    <div key={key} className="flex justify-between font-mono text-[10px]">
                      <span className="text-text-muted">{key.toUpperCase()}</span>
                      <span className="text-text-secondary">{Math.round(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-text-muted">LOYALTY</span>
                  <span className="font-mono text-text-secondary">{Math.round(loyalty)}</span>
                </div>
                <ProgressBar
                  value={Math.min(100, loyalty)}
                  color={loyalty >= 60 ? 'positive' : loyalty >= 30 ? 'warning' : 'evil'}
                  height={2}
                />
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
