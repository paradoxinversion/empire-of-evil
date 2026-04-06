import { useState } from 'react';
import { Panel } from '../../components/Panel/Panel';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { useGameStore } from '../../store/gameStore';

interface FormValues {
  nationCount: number;
  zonesPerNation: number;
  populationDensity: number;
  mapWidth: number;
  mapHeight: number;
}

const DEFAULTS: FormValues = {
  nationCount: 5,
  zonesPerNation: 4,
  populationDensity: 10,
  mapWidth: 20,
  mapHeight: 20,
};

interface FieldConfig {
  key: keyof FormValues;
  label: string;
  min: number;
  max: number;
}

const FIELDS: FieldConfig[] = [
  { key: 'nationCount',       label: 'NATIONS',           min: 2,  max: 12 },
  { key: 'zonesPerNation',    label: 'ZONES PER NATION',  min: 2,  max: 8  },
  { key: 'populationDensity', label: 'POPULATION DENSITY',min: 1,  max: 20 },
  { key: 'mapWidth',          label: 'MAP WIDTH',         min: 10, max: 100 },
  { key: 'mapHeight',         label: 'MAP HEIGHT',        min: 10, max: 100 },
];

export function WorldGenScreen() {
  const newGame = useGameStore(s => s.newGame);
  const status = useGameStore(s => s.status);
  const isLoading = status !== 'idle';

  const [values, setValues] = useState<FormValues>(DEFAULTS);

  const handleChange = (key: keyof FormValues, raw: string) => {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      setValues(v => ({ ...v, [key]: parsed }));
    }
  };

  const handleGenerate = () => {
    newGame({
      ...values,
      minZoneSize: 4,
      maxZoneSize: 9,
      maxBuildingsPerZone: 5,
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="font-mono text-lg text-text-primary mb-5 tracking-tight">
          INITIALIZE NEW EMPIRE
        </div>

        <Panel title="PARAMETERS">
          <form
            onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}
            className="flex flex-col gap-4"
          >
            {FIELDS.map(({ key, label, min, max }) => {
              const id = `field-${key}`;
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label
                    htmlFor={id}
                    className="font-mono text-[9px] tracking-[0.12em] text-text-muted"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type="number"
                    min={min}
                    max={max}
                    value={values[key]}
                    onChange={e => handleChange(key, e.target.value)}
                    disabled={isLoading}
                    className="
                      bg-bg-elevated border border-border-default text-text-primary
                      font-mono text-[13px] px-3 py-1.5 rounded-sm
                      focus:outline-none focus:border-border-strong
                      disabled:opacity-40 w-full
                    "
                  />
                </div>
              );
            })}

            <div className="pt-2">
              <ActionButton
                variant="primary"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full text-center"
              >
                {isLoading ? 'GENERATING...' : 'GENERATE WORLD'}
              </ActionButton>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
