import { useState } from "react";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";

export type BuildingRecord = {
    id: string;
    name: string;
    typeName: string;
    zoneName: string;
    tileLabel: string;
    outputMoney: number;
    upkeep: number;
    intelLevel: number;
    status: "SECURED" | "EXPOSED";
};

type BuildingStatusFilter = "all" | "secured" | "exposed";
type BuildingSort =
    | "name_asc"
    | "name_desc"
    | "output_desc"
    | "output_asc"
    | "intel_desc"
    | "intel_asc";
type BuildingGroupBy = "none" | "zone" | "type" | "status";

function formatMoney(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

function sortBuildingRecords(
    records: BuildingRecord[],
    sortBy: BuildingSort,
): BuildingRecord[] {
    return [...records].sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "output_desc") return b.outputMoney - a.outputMoney;
        if (sortBy === "output_asc") return a.outputMoney - b.outputMoney;
        if (sortBy === "intel_desc") return b.intelLevel - a.intelLevel;
        return a.intelLevel - b.intelLevel;
    });
}

interface EmpireBuildingsTabProps {
    buildings: BuildingRecord[];
    selectedBuildingId: string | null;
    onSelectBuilding: (buildingId: string) => void;
}

export function EmpireBuildingsTab({
    buildings,
    selectedBuildingId,
    onSelectBuilding,
}: EmpireBuildingsTabProps) {
    const [buildingSearch, setBuildingSearch] = useState("");
    const [buildingStatusFilter, setBuildingStatusFilter] =
        useState<BuildingStatusFilter>("all");
    const [buildingSortBy, setBuildingSortBy] =
        useState<BuildingSort>("name_asc");
    const [buildingGroupBy, setBuildingGroupBy] =
        useState<BuildingGroupBy>("none");

    const filteredBuildings = buildings.filter((building) => {
        const searchValue = buildingSearch.trim().toLowerCase();
        const searchMatches =
            searchValue.length === 0 ||
            [
                building.name,
                building.typeName,
                building.zoneName,
                building.tileLabel,
                building.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchValue);

        const statusMatches =
            buildingStatusFilter === "all" ||
            (buildingStatusFilter === "secured" &&
                building.status === "SECURED") ||
            (buildingStatusFilter === "exposed" &&
                building.status === "EXPOSED");

        return searchMatches && statusMatches;
    });

    const sortedBuildings = sortBuildingRecords(
        filteredBuildings,
        buildingSortBy,
    );

    const groupedBuildings = (() => {
        if (buildingGroupBy === "none") {
            return [{ groupLabel: "ALL BUILDINGS", rows: sortedBuildings }];
        }

        const groupMap = new Map<string, BuildingRecord[]>();
        for (const building of sortedBuildings) {
            const groupKey =
                buildingGroupBy === "zone"
                    ? building.zoneName
                    : buildingGroupBy === "type"
                      ? building.typeName
                      : building.status;
            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, []);
            }
            groupMap.get(groupKey)!.push(building);
        }

        return Array.from(groupMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([groupLabel, rows]) => ({ groupLabel, rows }));
    })();

    const inputClass =
        "font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red";

    return (
        <Panel title="EMPIRE BUILDINGS">
            <div className="flex flex-wrap gap-2 mb-3 items-center">
                <input
                    type="text"
                    value={buildingSearch}
                    onChange={(event) => setBuildingSearch(event.target.value)}
                    placeholder="SEARCH BUILDINGS..."
                    className={`${inputClass} min-w-56`}
                />

                <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                    Sort by
                    <select
                        aria-label="Sort by"
                        value={buildingSortBy}
                        onChange={(event) =>
                            setBuildingSortBy(
                                event.target.value as BuildingSort,
                            )
                        }
                        className={inputClass}
                    >
                        <option value="name_asc">NAME (A-Z)</option>
                        <option value="name_desc">NAME (Z-A)</option>
                        <option value="output_desc">OUTPUT (HIGH-LOW)</option>
                        <option value="output_asc">OUTPUT (LOW-HIGH)</option>
                        <option value="intel_desc">INTEL (HIGH-LOW)</option>
                        <option value="intel_asc">INTEL (LOW-HIGH)</option>
                    </select>
                </label>

                <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                    Group by
                    <select
                        aria-label="Group by"
                        value={buildingGroupBy}
                        onChange={(event) =>
                            setBuildingGroupBy(
                                event.target.value as BuildingGroupBy,
                            )
                        }
                        className={inputClass}
                    >
                        <option value="none">NONE</option>
                        <option value="zone">ZONE</option>
                        <option value="type">TYPE</option>
                        <option value="status">STATUS</option>
                    </select>
                </label>

                <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                    Status
                    <select
                        aria-label="Status filter"
                        value={buildingStatusFilter}
                        onChange={(event) =>
                            setBuildingStatusFilter(
                                event.target.value as BuildingStatusFilter,
                            )
                        }
                        className={inputClass}
                    >
                        <option value="all">ALL</option>
                        <option value="secured">SECURED</option>
                        <option value="exposed">EXPOSED</option>
                    </select>
                </label>

                <div className="ml-auto text-[10px] text-text-muted font-mono">
                    {sortedBuildings.length} / {buildings.length} BUILDINGS
                </div>
            </div>

            {sortedBuildings.length === 0 ? (
                <div className="text-text-muted text-[11px] py-2">
                    No empire buildings match the current controls.
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedBuildings.map((group) => (
                        <section key={group.groupLabel}>
                            {buildingGroupBy !== "none" && (
                                <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted mb-1.5">
                                    {`${group.groupLabel.toUpperCase()} (${group.rows.length})`}
                                </div>
                            )}
                            <table className="w-full border-collapse text-[12px]">
                                <thead>
                                    <tr>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            BUILDING
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            TYPE
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            ZONE
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            TILE
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            OUTPUT
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            UPKEEP
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                            INTEL
                                        </th>
                                        <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 border-b border-border-subtle font-normal">
                                            STATUS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.rows.map((building) => (
                                        <tr
                                            key={building.id}
                                            data-testid="empire-building-row"
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={
                                                selectedBuildingId ===
                                                building.id
                                            }
                                            onClick={() =>
                                                onSelectBuilding(building.id)
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === "Enter" ||
                                                    event.key === " "
                                                ) {
                                                    event.preventDefault();
                                                    onSelectBuilding(
                                                        building.id,
                                                    );
                                                }
                                            }}
                                            className={`border-b border-bg-elevated cursor-pointer outline-none transition-colors duration-fast ${
                                                selectedBuildingId ===
                                                building.id
                                                    ? "bg-bg-selected"
                                                    : "hover:bg-bg-hover"
                                            }`}
                                        >
                                            <td className="py-1.5 pr-2 align-middle text-text-primary">
                                                {building.name}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary">
                                                {building.typeName}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary">
                                                {building.zoneName}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                {building.tileLabel}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                {formatMoney(
                                                    building.outputMoney,
                                                )}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                {formatMoney(building.upkeep)}
                                            </td>
                                            <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                {building.intelLevel}
                                            </td>
                                            <td className="py-1.5 align-middle text-text-secondary">
                                                <Tag
                                                    variant={
                                                        building.status ===
                                                        "SECURED"
                                                            ? "stable"
                                                            : "unrest"
                                                    }
                                                >
                                                    {building.status}
                                                </Tag>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    ))}
                </div>
            )}
        </Panel>
    );
}
