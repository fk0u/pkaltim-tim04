import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = (s: string) => {
        const lower = s.toLowerCase();
        if (lower === 'paid' || lower === 'completed' || lower === 'verified' || lower === 'approved' || lower === 'active') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (lower === 'pending' || lower === 'waiting') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (lower === 'cancelled' || lower === 'rejected' || lower === 'expired') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (s: string) => {
        const lower = s.toLowerCase();
        if (lower === 'paid' || lower === 'completed' || lower === 'verified' || lower === 'approved' || lower === 'active') return CheckCircle;
        if (lower === 'pending' || lower === 'waiting') return Clock;
        if (lower === 'cancelled' || lower === 'rejected' || lower === 'expired') return XCircle;
        return AlertCircle;
    };

    const Icon = getStatusIcon(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
}
