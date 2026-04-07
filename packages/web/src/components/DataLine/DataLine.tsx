export type DataLineProps = {
    label: string;
    value: string;
};
export function DataLine({ label, value }: DataLineProps) {
    return (
        <div className="flex w-full justify-between">
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-primary">{value}</span>
        </div>
    );
}
