import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import clsx from 'clsx';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type?: AlertType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Alert({ type = 'info', title, children, className }: AlertProps) {
    const styles = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
    };

    return (
        <div className={clsx("p-4 rounded-xl border flex gap-3", styles[type], className)}>
            {icons[type]}
            <div>
                {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
                <div className="text-sm opacity-90 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}
