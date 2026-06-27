type Props = {
    label: string;
    value: number | string;
};

export default function MetricCard({ label, value }: Props) {
    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <span className="text-3xl font-bold text-gray-900">{value}</span>
        </div>
    );
}
