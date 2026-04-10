import {
    LayoutDashboard,
    Globe,
    Users,
    DollarSign,
    FlaskConical,
    Target,
    Activity,
    ScrollText,
    Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGameState } from "../../hooks/useGameState";
import { useNavigationStore } from "../../store/navigationStore";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { getEvilTier, getEvilTierProgress } from "../../utils/evilTier";

interface NavItem {
    key: string;
    label: string;
    Icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
    { key: "empire", label: "EMPIRE", Icon: LayoutDashboard },
    { key: "intel", label: "INTEL", Icon: Globe },
    { key: "personnel", label: "PERSONNEL", Icon: Users },
    { key: "captives", label: "CAPTIVES", Icon: Lock },
    { key: "economy", label: "ECONOMY", Icon: DollarSign },
    { key: "science", label: "SCIENCE", Icon: FlaskConical },
    { key: "plots", label: "PLOTS", Icon: Target },
    { key: "activities", label: "ACTIVITIES", Icon: Activity },
    { key: "events", label: "EVENTS", Icon: ScrollText },
];

// Infrastructure cap is managed by the infrastructure resource value vs a cap.
// For MVP the cap isn't exposed in GameState yet; use a default of 20.
const INFRA_CAP = 20;

export function Sidebar() {
    const gameState = useGameState();
    const activeScreen = useNavigationStore((s) => s.activeScreen);
    const setActiveScreen = useNavigationStore((s) => s.setActiveScreen);

    const { empire, zones } = gameState;
    const evilScore = empire.evil.perceived;
    const tier = getEvilTier(evilScore);
    const tierProgress = getEvilTierProgress(evilScore);
    const infraZones = Object.keys(zones).length;
    const infraPercent = (infraZones / INFRA_CAP) * 100;

    return (
        <nav className="bg-bg-surface border-r border-border-subtle w-[200px] flex-shrink-0 flex flex-col py-2">
            {NAV_ITEMS.map(({ key, label, Icon }) => {
                const isActive = activeScreen === key;
                return (
                    <div
                        key={key}
                        data-nav-item
                        data-active={isActive ? "true" : undefined}
                        onClick={() => setActiveScreen(key)}
                        className={`
              flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-[12px] tracking-[0.05em]
              border-l-2 transition-colors duration-fast
              ${
                  isActive
                      ? "bg-bg-selected text-text-primary border-l-accent-red"
                      : "text-text-secondary border-l-transparent hover:bg-bg-elevated hover:text-text-primary"
              }
            `}
                    >
                        <Icon size={14} className="opacity-70 flex-shrink-0" />
                        {label}
                    </div>
                );
            })}

            {/* Bottom widgets */}
            <div className="mt-auto px-3.5 pb-3 pt-3 border-t border-border-subtle">
                {/* EVIL score widget */}
                <div className="mb-3">
                    <div className="font-mono text-[9px] tracking-[0.12em] text-text-muted mb-1">
                        EVIL RATING
                    </div>
                    <div
                        className="font-mono text-[22px] leading-none mb-0.5"
                        style={{ color: tier.color }}
                    >
                        {evilScore}
                    </div>
                    <div
                        className="font-mono text-[9px] tracking-[0.12em] mb-1.5"
                        style={{ color: tier.color }}
                    >
                        {tier.name.toUpperCase()}
                    </div>
                    <ProgressBar value={tierProgress} color="evil" height={2} />
                </div>

                {/* Infrastructure widget */}
                <div>
                    <div className="font-mono text-[9px] tracking-[0.12em] text-text-muted mb-1">
                        INFRASTRUCTURE
                    </div>
                    <div
                        className={`font-mono text-[11px] mb-1 ${infraPercent >= 100 ? "text-negative" : infraPercent >= 80 ? "text-warning" : "text-positive"}`}
                    >
                        {infraZones} / {INFRA_CAP} ZONES
                    </div>
                    <ProgressBar
                        value={infraPercent}
                        color={
                            infraPercent >= 100
                                ? "negative"
                                : infraPercent >= 80
                                  ? "warning"
                                  : "positive"
                        }
                        height={2}
                    />
                </div>
            </div>
        </nav>
    );
}
