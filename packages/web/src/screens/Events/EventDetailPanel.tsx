import React from "react";
import { Panel } from "../../components/Panel/Panel";

type EventDetailPanelProps = {
    enriched: any | null;
    availableAgents?: any[];
    unlockedResearchIds?: string[];
};

export default function EventDetailPanel({ enriched }: EventDetailPanelProps) {
    if (!enriched) {
        return (
            <Panel title="EVENT DETAIL">
                <div className="text-text-secondary text-sm">
                    Select an event from the list to view details.
                </div>
            </Panel>
        );
    }

    // AAR special case
    if (enriched.isAAR && enriched.aar) {
        const aar = enriched.aar;
        return (
            <Panel title="AFTER ACTION REPORT">
                <div className="font-mono text-base text-text-primary mb-2">
                    {enriched.title}
                </div>
                <div className="text-[11px] text-text-muted mb-4">
                    {enriched.date}
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-sm text-text-primary">
                        EXECUTIVE SUMMARY
                    </div>
                    <div className="text-text-secondary mt-2">
                        {aar.executiveSummary}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-sm text-text-primary">
                        OPERATIONAL LOG
                    </div>
                    <ol className="list-decimal list-inside text-text-secondary mt-2">
                        {aar.operationalLog.map((line: string, idx: number) => (
                            <li key={idx}>{line}</li>
                        ))}
                    </ol>
                </div>

                <div className="mb-4">
                    <div className="font-semibold text-sm text-text-primary">
                        PERSONNEL REPORT
                    </div>
                    <div className="text-text-secondary mt-2">
                        <table className="w-full text-left text-[11px]">
                            <thead>
                                <tr>
                                    <th className="pr-4">Name</th>
                                    <th className="pr-4">Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aar.personnelReport.map((p: any) => (
                                    <tr
                                        key={p.name}
                                        className="border-t border-bg-elevated"
                                    >
                                        <td className="py-2 pr-4">{p.name}</td>
                                        <td className="py-2 pr-4">{p.role}</td>
                                        <td className="py-2">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1 rounded-sm bg-bg-elevated border border-border-subtle text-text-primary">
                        CLOSE REPORT
                    </button>
                    <button className="px-3 py-1 rounded-sm bg-accent-red text-text-inverse">
                        VIEW PERSONNEL RECORDS
                    </button>
                </div>
            </Panel>
        );
    }

    return (
        <Panel title="EVENT">
            <div className="font-mono text-base text-text-primary mb-2">
                {enriched.title}
            </div>
            <div className="text-[11px] text-text-muted mb-4">
                {enriched.date}
            </div>

            <div
                className="text-text-secondary mb-4"
                dangerouslySetInnerHTML={{ __html: enriched.text }}
            />

            {enriched.mechanics && (
                <div className="mb-4">
                    <div className="font-semibold text-sm text-text-primary">
                        MECHANICAL EFFECTS
                    </div>
                    <ul className="text-text-secondary list-disc list-inside mt-2">
                        {enriched.mechanics.map((m: string, i: number) => (
                            <li key={i}>{m}</li>
                        ))}
                    </ul>
                </div>
            )}

            {enriched.choices && (
                <div className="flex gap-2">
                    {enriched.choices.map((c: any, i: number) => (
                        <button
                            key={i}
                            className="px-3 py-1 rounded-sm border border-border-subtle text-text-primary bg-bg-elevated/60"
                            disabled
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            )}
        </Panel>
    );
}
