import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import type { LaboratoryRecord } from "./ScienceSelectors";

function formatScience(n: number): string {
    return n.toLocaleString("en-US") + " SCI";
}

type LaboratoriesTabProps = {
    laboratories: LaboratoryRecord[];
    selectedLaboratoryId: string | null;
    onSelectLaboratory: (laboratoryId: string) => void;
};

export function LaboratoriesTab({
    laboratories,
    selectedLaboratoryId,
    onSelectLaboratory,
}: LaboratoriesTabProps) {
    return (
        <Panel title="LABORATORIES">
            {laboratories.length === 0 ? (
                <div className="text-text-muted text-[11px] py-2">
                    No science-producing laboratories available.
                </div>
            ) : (
                <table className="w-full border-collapse text-[12px]">
                    <thead>
                        <tr>
                            <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                FACILITY
                            </th>
                            <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                ZONE
                            </th>
                            <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                SCIENCE
                            </th>
                            <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 border-b border-border-subtle font-normal">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {laboratories.map((laboratory) => (
                            <tr
                                key={laboratory.id}
                                role="button"
                                tabIndex={0}
                                aria-pressed={
                                    selectedLaboratoryId === laboratory.id
                                }
                                onClick={() =>
                                    onSelectLaboratory(laboratory.id)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        onSelectLaboratory(laboratory.id);
                                    }
                                }}
                                className={`border-b border-bg-elevated cursor-pointer outline-none transition-colors duration-fast ${
                                    selectedLaboratoryId === laboratory.id
                                        ? "bg-bg-selected"
                                        : "hover:bg-bg-hover"
                                }`}
                            >
                                <td className="py-1.5 pr-2 align-middle text-text-primary">
                                    {laboratory.name}
                                </td>
                                <td className="py-1.5 pr-2 align-middle text-text-secondary">
                                    {laboratory.zoneName}
                                </td>
                                <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                    {formatScience(laboratory.outputScience)}
                                </td>
                                <td className="py-1.5 align-middle text-text-secondary">
                                    <Tag
                                        variant={
                                            laboratory.status === "SECURED"
                                                ? "stable"
                                                : "unrest"
                                        }
                                    >
                                        {laboratory.status}
                                    </Tag>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Panel>
    );
}
