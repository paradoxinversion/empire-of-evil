import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  const insolvencyDay = netDaily < 0
    ? Math.ceil(currentFunds / Math.abs(netDaily))
    : null;

  return (
    <div>
      {insolvencyDay !== null && insolvencyDay <= 30 && (
        <div className="font-mono text-[10px] text-negative mb-2 tracking-[0.06em]">
          ⚠ INSOLVENCY PROJECTED IN {insolvencyDay} DAYS
        </div>
      )}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#1f2530"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#475569' }}
            tickLine={false}
            axisLine={{ stroke: '#1f2530' }}
            label={{
              value: 'DAY',
              position: 'insideBottomRight',
              offset: -4,
              style: { fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#475569' },
            }}
          />
          <YAxis
            tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatMoney}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: '#13161a',
              border: '1px solid #1f2530',
              fontFamily: 'IBM Plex Mono',
              fontSize: 10,
              color: '#e2e8f0',
            }}
            formatter={(value: number) => [formatMoney(value), 'FUNDS']}
            labelFormatter={(label: number) => `DAY ${label}`}
          />
          <Line
            type="monotone"
            dataKey="funds"
            stroke={netDaily >= 0 ? '#16a34a' : '#c0392b'}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: '#e2e8f0' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
