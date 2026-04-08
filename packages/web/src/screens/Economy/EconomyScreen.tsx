import {
    getDailyBuildingIncome,
    getBuildingIncomeByZone,
    getDailyBuildingUpkeep,
    getBuildingUpkeepByZone,
    getDailyAgentSalaries,
    getZoneTaxIncome,
    Building,
} from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { BUNDLED_CONFIG } from "../../store/gameStore";
import { Panel } from "../../components/Panel/Panel";
import { StatWidget } from "../../components/StatWidget/StatWidget";
import { DataTable } from "../../components/DataTable/DataTable";
import { CashFlowChart } from "./CashFlowChart";
import type { Row } from "../../components/DataTable/DataTable";
import { getBuildings } from "../../../../engine/src/state/queries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(value: number): string {
    if (value === 0) return "$0";
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
    return `${sign}$${Math.round(abs)}`;
}

// ─── Column definitions ───────────────────────────────────────────────────────

const BUILDING_INCOME_COLUMNS = [
    { key: "type", label: "BUILDING TYPE", sortable: true },
    { key: "count", label: "ZONES" },
    { key: "output", label: "DAILY OUTPUT" },
];

const EXPENSE_COLUMNS = [
    { key: "category", label: "CATEGORY" },
    { key: "amount", label: "DAILY COST" },
];

const ZONE_ECONOMICS_COLUMNS = [
    { key: "zone", label: "ZONE", sortable: true },
    { key: "nation", label: "NATION" },
    { key: "bldgInc", label: "BLDG INCOME" },
    { key: "taxInc", label: "TAX INCOME" },
    { key: "upkeep", label: "UPKEEP" },
    { key: "net", label: "NET" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function EconomyScreen() {
    const gameState = useGameState();
    const { buildings, zones, nations, empire, persons } = gameState;

    // ── Core calculations ──────────────────────────────────────────────────────
    const buildingIncome = getDailyBuildingIncome(gameState, BUNDLED_CONFIG);
    const buildingIncomeByZone = getBuildingIncomeByZone(
        gameState,
        BUNDLED_CONFIG,
    );
    const buildingUpkeep = getDailyBuildingUpkeep(gameState, BUNDLED_CONFIG);
    const upkeepByZone = getBuildingUpkeepByZone(gameState, BUNDLED_CONFIG);
    const agentSalaries = getDailyAgentSalaries(gameState);

    const empireZones = Object.values(zones).filter(
        (z) => z.governingOrganizationId === empire.id,
    );
    const taxIncome = empireZones.reduce((s, z) => s + getZoneTaxIncome(z), 0);

    const dailyIncome = buildingIncome + taxIncome;
    const dailyExpenses = buildingUpkeep + agentSalaries;
    const netDaily = dailyIncome - dailyExpenses;

    // ── Building income table rows ─────────────────────────────────────────────
    const buildingCountByType: Record<string, number> = {};
    const buildingOutputByType: Record<string, number> = {};
    for (const b of getBuildings(gameState, {
        governingOrganizationId: empire.id,
    }) as any as Building[]) {
        buildingCountByType[b.typeId] =
            (buildingCountByType[b.typeId] ?? 0) + 1;
        const def = BUNDLED_CONFIG.buildings.find((d) => d.id === b.typeId);
        const income = def?.resourceOutput?.money ?? 0;
        buildingOutputByType[b.typeId] =
            (buildingOutputByType[b.typeId] ?? 0) + income;
    }

    const buildingIncomeRows: Row[] = Object.entries(buildingOutputByType)
        .sort((a, b) => b[1] - a[1])
        .map(([typeId, output]) => {
            const def = BUNDLED_CONFIG.buildings.find((d) => d.id === typeId);
            return {
                _key: typeId,
                type: def?.name ?? typeId,
                count: String(buildingCountByType[typeId] ?? 0),
                output: (
                    <span
                        className={`font-mono text-[11px] ${output > 0 ? "text-positive" : "text-text-muted"}`}
                    >
                        {formatMoney(output)}
                    </span>
                ),
            };
        });

    // ── Tax income per zone ────────────────────────────────────────────────────
    const taxZoneRows: Row[] = empireZones.map((z) => ({
        _key: z.id,
        zone: z.name,
        taxRate: `${Math.round(z.taxRate * 100)}%`,
        income: (
            <span className="font-mono text-[11px] text-positive">
                {formatMoney(getZoneTaxIncome(z))}
            </span>
        ),
    }));

    // ── Expense rows ───────────────────────────────────────────────────────────
    const expenseRows: Row[] = [
        {
            _key: "salaries",
            category: "Agent Salaries",
            amount: (
                <span className="font-mono text-[11px] text-negative">
                    {formatMoney(-agentSalaries)}
                </span>
            ),
        },
        {
            _key: "upkeep",
            category: "Building Upkeep",
            amount: (
                <span className="font-mono text-[11px] text-negative">
                    {formatMoney(-buildingUpkeep)}
                </span>
            ),
        },
        {
            _key: "plots",
            category: "Active Plots",
            amount: (
                <span className="font-mono text-[11px] text-text-muted">
                    $0
                </span>
            ),
        },
        {
            _key: "activities",
            category: "Active Activities",
            amount: (
                <span className="font-mono text-[11px] text-text-muted">
                    $0
                </span>
            ),
        },
    ];

    // ── By-zone economics ──────────────────────────────────────────────────────
    const zoneEconomicsRows: Row[] = empireZones
        .map((z) => {
            const bldgInc = buildingIncomeByZone[z.id] ?? 0;
            const taxInc = getZoneTaxIncome(z);
            const upkeep = upkeepByZone[z.id] ?? 0;
            const net = bldgInc + taxInc - upkeep;
            return {
                _key: z.id,
                zone: z.name,
                nation: nations[z.nationId]?.name ?? z.nationId,
                bldgInc: (
                    <span className="font-mono text-[11px]">
                        {formatMoney(bldgInc)}
                    </span>
                ),
                taxInc: (
                    <span className="font-mono text-[11px]">
                        {formatMoney(taxInc)}
                    </span>
                ),
                upkeep: (
                    <span className="font-mono text-[11px] text-negative">
                        {formatMoney(-upkeep)}
                    </span>
                ),
                net: (
                    <span
                        className={`font-mono text-[11px] ${net >= 0 ? "text-positive" : "text-negative"}`}
                    >
                        {formatMoney(net)}
                    </span>
                ),
            };
        })
        .sort((a, b) => String(a.zone).localeCompare(String(b.zone)));

    // count agents for subvalue
    const agentCount = Object.values(persons).filter(
        (p) => p.agentStatus && !p.dead,
    ).length;

    return (
        <div>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                ECONOMY
            </div>

            {/* Top stat row */}
            <div className="flex gap-px mb-4">
                <StatWidget
                    label="CURRENT FUNDS"
                    value={formatMoney(empire.resources.money)}
                />
                <StatWidget
                    label="DAILY INCOME"
                    value={formatMoney(dailyIncome)}
                    subValue="TOTAL INCOME"
                    subVariant="positive"
                />
                <StatWidget
                    label="DAILY EXPENSES"
                    value={formatMoney(dailyExpenses)}
                    subValue={`${agentCount} AGENTS`}
                    subVariant="negative"
                />
                <StatWidget
                    label="NET DAILY"
                    value={formatMoney(netDaily)}
                    subValue={netDaily >= 0 ? "SURPLUS" : "DEFICIT"}
                    subVariant={netDaily >= 0 ? "positive" : "warning"}
                />
            </div>

            {/* Income breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <Panel title="BUILDING INCOME">
                    <div className="font-mono text-base text-positive mb-2">
                        {formatMoney(buildingIncome)}
                    </div>
                    <DataTable
                        columns={BUILDING_INCOME_COLUMNS}
                        rows={buildingIncomeRows}
                        emptyText="No buildings generating income."
                    />
                </Panel>

                <Panel title="CITIZEN TAXES">
                    <div className="font-mono text-base text-positive mb-2">
                        {formatMoney(taxIncome)}
                    </div>
                    {empireZones.length === 0 ? (
                        <div className="text-text-muted text-[11px]">
                            No empire zones.
                        </div>
                    ) : (
                        <DataTable
                            columns={[
                                { key: "zone", label: "ZONE" },
                                { key: "taxRate", label: "RATE" },
                                { key: "income", label: "DAILY" },
                            ]}
                            rows={taxZoneRows}
                            emptyText="No zones."
                        />
                    )}
                </Panel>

                <Panel title="ACTIVITY INCOME">
                    <div className="font-mono text-base text-text-muted mb-2">
                        $0
                    </div>
                    <div className="text-text-muted text-[11px]">
                        Activity income is not yet tracked.
                    </div>
                </Panel>
            </div>

            {/* Expense breakdown */}
            <div className="mb-4">
                <Panel title="EXPENSES">
                    <DataTable columns={EXPENSE_COLUMNS} rows={expenseRows} />
                </Panel>
            </div>

            {/* Zone economics */}
            <div className="mb-4">
                <Panel title="ZONE ECONOMICS">
                    {zoneEconomicsRows.length === 0 ? (
                        <div className="text-text-muted text-[11px]">
                            No empire-controlled zones.
                        </div>
                    ) : (
                        <DataTable
                            columns={ZONE_ECONOMICS_COLUMNS}
                            rows={zoneEconomicsRows}
                        />
                    )}
                </Panel>
            </div>

            {/* Cash flow projection */}
            <Panel title="30-DAY CASH FLOW PROJECTION">
                <CashFlowChart
                    currentFunds={empire.resources.money}
                    netDaily={netDaily}
                />
            </Panel>
        </div>
    );
}
