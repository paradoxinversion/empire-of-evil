import { useEffect, useState } from "react";
import {
    type GameState,
    type AgentJob,
    getPersonsInZone,
} from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { TileMap } from "../../components/TileMap/TileMap";
import { TILE_TYPE_NAMES } from "../../utils/mapUtils";
import { Panel } from "../../components/Panel/Panel";
import { DataTable } from "../../components/DataTable/DataTable";
import { FeedEntry } from "../../components/FeedEntry/FeedEntry";
import { TabBar } from "../../components/TabBar/TabBar";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import type { Row } from "../../components/DataTable/DataTable";
import type { TagVariant } from "../../components/Tag/Tag";
import { DataLine } from "../../components";

// ─── Constants ───────────────────────────────────────────────────────────────

const INTEL_CITIZENS_THRESHOLD = 20;
const INTEL_NAMES_THRESHOLD = 40;

const LAYER_LABELS: Record<"political" | "intel", string> = {
    political: "POLITICAL",
    intel: "INTEL LEVEL",
};

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
    operative: "operative",
    scientist: "scientist",
    troop: "troop",
    administrator: "admin",
    unassigned: "unassigned",
};

// ─── World State Panel ───────────────────────────────────────────────────────

const ORGS_COLUMNS = [
    { key: "nation", label: "NATION" },
    { key: "org", label: "GOVERNING ORG" },
    { key: "zones", label: "ZONES" },
    { key: "status", label: "STATUS" },
];

function WorldStatePanel({ gameState }: { gameState: GameState }) {
    const { nations, zones, governingOrganizations, eventLog, empire } =
        gameState;

    const orgRows: Row[] = Object.values(nations)
        .filter((n) => n.governingOrganizationId !== empire.id)
        .map((n) => ({
            _key: n.id,
            nation: n.name,
            org: governingOrganizations[n.governingOrganizationId]?.name ?? "—",
            zones: String(
                Object.values(zones).filter((z) => z.nationId === n.id).length,
            ),
            status: <Tag variant="neutral">UNKNOWN</Tag>,
        }));

    const recentFeed = [...eventLog].reverse().slice(0, 10);

    return (
        <div className="flex flex-col gap-3">
            <Panel title="GOVERNING ORGANIZATIONS">
                <DataTable
                    columns={ORGS_COLUMNS}
                    rows={orgRows}
                    emptyText="No foreign organizations detected."
                />
            </Panel>
            <Panel title="RECENT INTEL FEED">
                {recentFeed.length === 0 ? (
                    <div className="text-text-muted text-[11px] py-2">
                        No intelligence gathered yet.
                    </div>
                ) : (
                    recentFeed.map((record) => (
                        <FeedEntry
                            key={record.event.id}
                            day={record.event.createdOnDate + 1}
                            text={record.event.title}
                            type="intel"
                        />
                    ))
                )}
            </Panel>
        </div>
    );
}

// ─── Zone Detail Panel ───────────────────────────────────────────────────────

function getZoneTerrain(
    zone: { tileIds: string[] },
    tiles: GameState["tiles"],
): string {
    const counts: Record<string, number> = {};
    for (const tileId of zone.tileIds) {
        const typeId = tiles[tileId]?.typeId ?? "";
        if (typeId) counts[typeId] = (counts[typeId] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? (TILE_TYPE_NAMES[top[0]] ?? top[0]) : "Unknown";
}

function ZoneDetailPanel({
    zoneId,
    gameState,
    onClose,
}: {
    zoneId: string;
    gameState: GameState;
    onClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<
        "overview" | "citizens" | "activity"
    >("overview");
    const { zones, nations, buildings, persons, tiles, eventLog } = gameState;

    const zone = zones[zoneId];

    useEffect(() => {
        setActiveTab("overview");
    }, [zoneId]);

    if (!zone) {
        return (
            <Panel>
                <div className="text-text-muted text-[11px]">
                    Zone not found.
                </div>
            </Panel>
        );
    }

    const nation = nations[zone.nationId];
    const terrain = getZoneTerrain(zone, tiles);
    const showCitizens = zone.intelLevel > INTEL_CITIZENS_THRESHOLD;

    const tabs = [
        { key: "overview", label: "OVERVIEW" },
        ...(showCitizens ? [{ key: "citizens", label: "CITIZENS" }] : []),
        { key: "activity", label: "ACTIVITY" },
    ];

    const knownBuildings = zone.buildingIds
        .map((id) => buildings[id])
        .filter((b): b is NonNullable<typeof b> => !!b && b.intelLevel > 0);

    const zonePersons = Object.values(persons).filter(
        (p) => p.zoneId === zoneId && !p.dead,
    );

    const activityFeed = [...eventLog]
        .reverse()
        .filter((r) => r.event.relatedEntityIds.includes(zoneId))
        .slice(0, 10);

    const citizenRows: Row[] = zonePersons.map((p) => ({
        _key: p.id,
        name: zone.intelLevel <= INTEL_NAMES_THRESHOLD ? "[UNKNOWN]" : p.name,
        status:
            p.agentStatus && zone.intelLevel > INTEL_NAMES_THRESHOLD ? (
                <Tag variant={JOB_TAG_VARIANT[p.agentStatus.job]}>
                    {p.agentStatus.job.toUpperCase()}
                </Tag>
            ) : (
                <Tag variant="neutral">CIVILIAN</Tag>
            ),
    }));

    const zoneDetailRows: Row[] = [
        {
            _key: zone.id,
            population: String(getPersonsInZone(gameState, zoneId).length),
            wealthIndex: String(Math.round(zone.generationWealth)),
            tileCount: String(zone.tileIds.length),
            economicOutput: `$${zone.economicOutput.toLocaleString()}`,
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <Panel>
                <div className="flex items-start justify-between mb-1">
                    <div className="font-mono text-sm text-text-primary">
                        {zone.name}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-mono text-[10px] text-text-muted hover:text-text-secondary tracking-[0.06em] cursor-pointer"
                    >
                        ✕ CLOSE
                    </button>
                </div>
                <div className="text-[11px] text-text-muted">
                    {nation?.name ?? "Unknown Nation"} · {terrain}
                </div>
            </Panel>

            <Panel>
                <TabBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(key) => setActiveTab(key as typeof activeTab)}
                />

                {activeTab === "overview" && (
                    <div className="space-y-3 divide-y divide-border-subtle">
                        <DataLine
                            label="Population"
                            value={String(
                                getPersonsInZone(gameState, zoneId).length,
                            )}
                        />
                        <DataLine
                            label="Economic Output"
                            value={`$${zone.economicOutput.toLocaleString()}`}
                        />
                        <DataLine
                            label="Wealth Index"
                            value={String(Math.round(zone.generationWealth))}
                        />
                        <DataLine
                            label="Tile Count"
                            value={String(zone.tileIds.length)}
                        />

                        <div>
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-text-muted">
                                    INTEL LEVEL
                                </span>
                                <span className="font-mono text-text-primary">
                                    {zone.intelLevel}%
                                </span>
                            </div>
                            <ProgressBar
                                value={zone.intelLevel}
                                color="info"
                                height={2}
                            />
                        </div>

                        <div>
                            <div className="text-text-muted text-[10px] tracking-[0.08em] mb-1.5">
                                KNOWN BUILDINGS
                            </div>
                            {knownBuildings.length === 0 ? (
                                <div className="text-text-muted text-[11px]">
                                    No known buildings.
                                </div>
                            ) : (
                                <ul className="space-y-1">
                                    {knownBuildings.map((b) => (
                                        <li
                                            key={b.id}
                                            className="text-[11px] text-text-secondary font-mono"
                                        >
                                            · {b.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "citizens" && (
                    <div className="h-48 overflow-y-scroll">
                        <DataTable
                            columns={[
                                { key: "name", label: "NAME" },
                                {
                                    key: "status",
                                    label: "STATUS",
                                    sortable: true,
                                },
                            ]}
                            rows={citizenRows}
                            emptyText="No known persons."
                        />
                    </div>
                )}

                {activeTab === "activity" &&
                    (activityFeed.length === 0 ? (
                        <div className="text-text-muted text-[11px] py-2">
                            No recorded activity.
                        </div>
                    ) : (
                        activityFeed.map((record) => (
                            <FeedEntry
                                key={record.event.id}
                                day={record.event.createdOnDate + 1}
                                text={record.event.title}
                                type="intel"
                            />
                        ))
                    ))}
            </Panel>
        </div>
    );
}

// ─── Intel Screen ─────────────────────────────────────────────────────────────

type Layer = "political" | "intel";

const DISABLED_LAYERS = ["LOYALTY", "MILITARY"];

export function IntelScreen() {
    const gameState = useGameState();
    const { tiles, zones, nations, empire } = gameState;

    const [layer, setLayer] = useState<Layer>("political");
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                INTELLIGENCE
            </div>

            <div className="flex gap-3" style={{ minHeight: "640px" }}>
                {/* Left — map */}
                <div
                    style={{ flex: "0 0 60%" }}
                    className="flex flex-col gap-2"
                >
                    {/* Layer toggle */}
                    <div className="flex gap-px">
                        {(Object.keys(LAYER_LABELS) as Layer[]).map((l) => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => setLayer(l)}
                                className={[
                                    "font-mono text-[10px] tracking-[0.08em] px-3.5 py-2 border-b-2 -mb-px transition-colors cursor-pointer",
                                    l === layer
                                        ? "text-text-primary border-accent-red"
                                        : "text-text-muted border-transparent hover:text-text-secondary",
                                ].join(" ")}
                            >
                                {LAYER_LABELS[l]}
                            </button>
                        ))}
                        {DISABLED_LAYERS.map((label) => (
                            <button
                                key={label}
                                type="button"
                                disabled
                                className="font-mono text-[10px] tracking-[0.08em] px-3.5 py-2 border-b-2 border-transparent text-text-muted opacity-40 cursor-not-allowed"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <TileMap
                        tiles={tiles}
                        zones={zones}
                        nations={nations}
                        empireId={empire.id}
                        layer={layer}
                        selectedZoneId={selectedZoneId}
                        onZoneClick={setSelectedZoneId}
                    />

                    <div className="text-[10px] text-text-muted font-mono">
                        Scroll to zoom · Drag to pan · Click to inspect
                    </div>
                </div>

                {/* Right — intel panel */}
                <div style={{ flex: "0 0 40%" }} className="overflow-y-auto">
                    {selectedZoneId ? (
                        <ZoneDetailPanel
                            zoneId={selectedZoneId}
                            gameState={gameState}
                            onClose={() => setSelectedZoneId(null)}
                        />
                    ) : (
                        <WorldStatePanel gameState={gameState} />
                    )}
                </div>
            </div>
        </div>
    );
}
