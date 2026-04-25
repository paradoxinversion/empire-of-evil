import { useState } from "react";
import type { Captive } from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { Panel } from "../../components/Panel/Panel";
import { DataTable } from "../../components/DataTable/DataTable";
import { DataLine } from "../../components/DataLine/DataLine";
import type { Row } from "../../components/DataTable/DataTable";

// ─── Column definitions ──────────────────────────────────────────────────────

const COLUMNS = [
    { key: "name", label: "NAME", sortable: true },
    { key: "capturedDay", label: "CAPTURED", sortable: true },
    { key: "zone", label: "HELD IN" },
];

// ─── Detail panel ────────────────────────────────────────────────────────────

function CaptiveDetailPanel({ captive }: { captive: Captive }) {
    const { persons, zones, date } = useGameState();
    const person = persons[captive.personId];
    const zone = zones[captive.zoneId];
    const duration = date - captive.capturedOnDate + 1;

    return (
        <Panel title="CAPTIVE DETAILS">
            <div className="space-y-2 divide-y divide-border-subtle text-[12px]">
                <DataLine label="Name" value={person?.name ?? "Unknown"} />
                <DataLine
                    label="Captured on"
                    value={`Day ${captive.capturedOnDate + 1}`}
                />
                <DataLine
                    label="Detention"
                    value={`${duration} day${duration !== 1 ? "s" : ""}`}
                />
                <DataLine
                    label="Held in"
                    value={zone?.name ?? "Unknown Zone"}
                />
            </div>
        </Panel>
    );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function CaptivesScreen() {
    const { captives, persons, zones } = useGameState();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const captiveList = Object.values(captives);

    const rows: Row[] = captiveList.map((c) => ({
        _key: c.id,
        name: persons[c.personId]?.name ?? "Unknown",
        capturedDay: `Day ${c.capturedOnDate + 1}`,
        zone: zones[c.zoneId]?.name ?? "—",
    }));

    const selectedCaptive = selectedId != null ? captives[selectedId] : null;

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                CAPTIVES
            </div>

            <div className="flex gap-3" style={{ minHeight: "400px" }}>
                {/* Left — list */}
                <div style={{ flex: "0 0 55%" }}>
                    <Panel title="HELD CAPTIVES">
                        {captiveList.length === 0 ? (
                            <div className="text-text-muted text-[11px] py-2">
                                No captives held.
                            </div>
                        ) : (
                            <DataTable
                                columns={COLUMNS}
                                rows={rows}
                                selectedRowKey={selectedId ?? undefined}
                                onRowClick={(row) => setSelectedId(row._key)}
                                emptyText="No captives held."
                            />
                        )}
                    </Panel>
                </div>

                {/* Right — detail */}
                <div style={{ flex: "0 0 45%" }}>
                    {selectedCaptive != null ? (
                        <CaptiveDetailPanel captive={selectedCaptive} />
                    ) : (
                        <Panel>
                            <div className="text-text-muted text-[11px] py-2">
                                Select a captive to view details.
                            </div>
                        </Panel>
                    )}
                </div>
            </div>
        </div>
    );
}
