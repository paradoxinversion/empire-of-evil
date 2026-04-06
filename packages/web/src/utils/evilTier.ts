export type EvilTierName = 'Nuisance' | 'Irritant' | 'Threat' | 'Menace' | 'Supervillain' | 'Apocalyptic';

interface EvilTier {
  name: EvilTierName;
  min: number;
  max: number;
  color: string;
}

const EVIL_TIERS: EvilTier[] = [
  { name: 'Nuisance',    min: 0,  max: 19,  color: 'var(--color-evil-nuisance)' },
  { name: 'Irritant',   min: 20, max: 39,  color: 'var(--color-evil-irritant)' },
  { name: 'Threat',     min: 40, max: 59,  color: 'var(--color-evil-threat)' },
  { name: 'Menace',     min: 60, max: 79,  color: 'var(--color-evil-menace)' },
  { name: 'Supervillain', min: 80, max: 94, color: 'var(--color-evil-supervillain)' },
  { name: 'Apocalyptic', min: 95, max: 100, color: 'var(--color-evil-apocalyptic)' },
];

export function getEvilTier(perceived: number): EvilTier {
  return EVIL_TIERS.find(t => perceived <= t.max) ?? EVIL_TIERS[EVIL_TIERS.length - 1];
}

export function getEvilTierProgress(perceived: number): number {
  const tier = getEvilTier(perceived);
  const range = tier.max - tier.min + 1;
  return ((perceived - tier.min) / range) * 100;
}
