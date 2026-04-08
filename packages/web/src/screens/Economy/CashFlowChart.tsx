import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { Tooltip } from "../../components/Tooltip/Tooltip";

interface CashFlowChartProps {
    currentFunds: number;
    netDaily: number;
}

function formatMoney(value: number): string {
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${Math.round(value)}`;
}

export function CashFlowChart({ currentFunds, netDaily }: CashFlowChartProps) {
    const data = Array.from({ length: 31 }, (_, i) => ({
        day: i,
        funds: Math.max(0, currentFunds + netDaily * i),
    }));

    const insolvencyDay =
        netDaily < 0 ? Math.ceil(currentFunds / Math.abs(netDaily)) : null;

    return (
        <div>
            <div className="mb-2 flex items-center gap-1">
                <Tooltip
                    variant="rich"
                    richTitle="PROJECTION MODEL"
                    content="Projection extends current funds using net daily cash flow. Negative trajectories are clamped at zero to reflect insolvency cutoff."
                >
                    <button
                        type="button"
                        aria-label="Projection help"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border-subtle bg-bg-hover text-[9px] text-text-secondary"
                    >
                        ?
                    </button>
                </Tooltip>
                <span className="font-mono text-[10px] tracking-[0.06em] text-text-muted">
                    CASH FLOW GUIDANCE
                </span>
            </div>
            {insolvencyDay !== null && insolvencyDay <= 30 && (
                <div className="mb-2 flex items-center gap-1 font-mono text-[10px] tracking-[0.06em] text-negative">
                    <span>⚠ INSOLVENCY PROJECTED IN {insolvencyDay} DAYS</span>
                    <Tooltip
                        variant="rich"
                        richTitle="INSOLVENCY FORECAST"
                        content="Projected insolvency day assumes net daily stays constant. Any intervention that raises net cash flow extends this runway."
                    >
                        <button
                            type="button"
                            aria-label="Insolvency warning help"
                            className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-negative/40 bg-bg-hover text-[9px] text-negative"
                        >
                            ?
                        </button>
                    </Tooltip>
                </div>
            )}
            <ResponsiveContainer width="100%" height={180}>
                <LineChart
                    data={data}
                    margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="2 4"
                        stroke="#1f2530"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="day"
                        tick={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 9,
                            fill: "#475569",
                        }}
                        tickLine={false}
                        axisLine={{ stroke: "#1f2530" }}
                        label={{
                            value: "DAY",
                            position: "insideBottomRight",
                            offset: -4,
                            style: {
                                fontFamily: "IBM Plex Mono",
                                fontSize: 9,
                                fill: "#475569",
                            },
                        }}
                    />
                    <YAxis
                        tick={{
                            fontFamily: "IBM Plex Mono",
                            fontSize: 9,
                            fill: "#475569",
                        }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatMoney}
                        width={48}
                    />
                    <RechartsTooltip
                        contentStyle={{
                            background: "#13161a",
                            border: "1px solid #1f2530",
                            fontFamily: "IBM Plex Mono",
                            fontSize: 10,
                            color: "#e2e8f0",
                        }}
                        formatter={(value: number) => [
                            formatMoney(value),
                            "FUNDS",
                        ]}
                        labelFormatter={(label: number) => `DAY ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="funds"
                        stroke={netDaily >= 0 ? "#16a34a" : "#c0392b"}
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 3, fill: "#e2e8f0" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
