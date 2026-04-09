import { Tooltip } from "../Tooltip/Tooltip";

export interface ZoneSelectorOption {
    id: string;
    name: string;
    nationName: string;
    controllingOrgName: string;
    intelLevel: number;
}

interface ZoneSelectorProps {
    zones: ZoneSelectorOption[];
    selectedZoneId: string | null;
    onChange: (zoneId: string | null) => void;
}

const inputClass =
    "font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red";

export function ZoneSelector({
    zones,
    selectedZoneId,
    onChange,
}: ZoneSelectorProps) {
    const selectedZone =
        zones.find((zone) => zone.id === selectedZoneId) ?? null;
    const hasLowIntel = selectedZone !== null && selectedZone.intelLevel < 20;

    return (
        <div className="space-y-2">
            <label className="flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-widest text-text-muted">
                    TARGET ZONE
                </span>
                <select
                    aria-label="Target zone"
                    value={selectedZoneId ?? ""}
                    onChange={(event) =>
                        onChange(event.target.value ? event.target.value : null)
                    }
                    className={inputClass}
                >
                    <option value="">SELECT TARGET ZONE</option>
                    {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                            {zone.name}
                        </option>
                    ))}
                </select>
            </label>

            {selectedZone ? (
                <div className="border border-border-subtle bg-bg-elevated px-3 py-2 text-[11px] text-text-secondary">
                    <div className="font-mono text-text-primary">
                        {selectedZone.name}
                    </div>
                    <div>{selectedZone.nationName}</div>
                    <div>{selectedZone.controllingOrgName}</div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                        <span>INTEL LEVEL {selectedZone.intelLevel}</span>
                        <Tooltip
                            variant="rich"
                            richTitle="INTEL CONFIDENCE"
                            content="Intel level reflects confidence in zone data. Lower intel means higher uncertainty in operational outcomes."
                        >
                            <button
                                type="button"
                                aria-label="Intel help"
                                className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border-subtle bg-bg-hover text-[9px] text-text-secondary"
                            >
                                ?
                            </button>
                        </Tooltip>
                    </div>
                    {hasLowIntel ? (
                        <div className="mt-2 border border-warning-muted bg-warning-muted/30 px-2 py-1 font-mono text-[10px] text-warning">
                            Intel level LOW — accuracy of operations in this
                            zone is reduced.
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
