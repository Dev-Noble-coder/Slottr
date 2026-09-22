import ProviderLayout from '../../components/layouts/ProviderLayout';
import { Sparkles, ArrowLeft, Clock, CreditCard, Users, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
    title: string;
    subtitle: string;
    featureName: string;
    icon: 'users' | 'payments' | 'audit';
    highlights: string[];
}

export const ComingSoon = ({ title, subtitle, featureName, icon, highlights }: ComingSoonProps) => {
    const IconComponent = icon === 'users' ? Users : icon === 'payments' ? CreditCard : FileText;

    return (
        <ProviderLayout>
            <div className="max-w-4xl mx-auto py-8">
                {/* Back button */}
                <Link
                    to="/provider/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-accent mb-6 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-2xs transition-all hover:bg-slate-50 hover:border-accent/30"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                </Link>

                {/* Hero Card - Styled with Slottr Brand Colors & Modest Soft Accents */}
                <div className="bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 rounded-3xl border border-slate-200/90  relative overflow-hidden">
                    {/* Top Decorative Gradient Accent Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-accent via-indigo-500 to-sky-400" />
                    
                    {/* Soft background ambient glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

                    <div className="p-8 sm:p-10 relative z-10 max-w-2xl">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-extrabold tracking-wide uppercase mb-6 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                            Coming Soon
                        </div>

                        {/* Title & Icon Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-sky-400 text-white flex items-center justify-center shadow-md shadow-accent/25 shrink-0">
                                <IconComponent className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                                <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                            We're currently finalizing the <strong className="text-slate-900 font-bold">{featureName}</strong> engine to give you full control over your operations with enterprise-grade security and automated workflows.
                        </p>

                        {/* Feature Highlights */}
                        <div className="mt-8 pt-6 border-t border-slate-200/70">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Planned Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:border-accent/40 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span>{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex items-center gap-3">
                            <Link
                                to="/provider/dashboard"
                                className="bg-accent hover:bg-accent/90 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-accent/20 hover:shadow-accent/30 inline-flex items-center gap-2 cursor-pointer"
                            >
                                Return to Dashboard
                            </Link>
                            <Link
                                to="/provider/bookings"
                                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-accent border border-slate-200 hover:border-accent/40 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 shadow-2xs cursor-pointer"
                            >
                                <Clock className="w-4 h-4 text-accent" /> View Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
};

export const UsersPage = () => (
    <ComingSoon
        title="Team & User Management"
        subtitle="Manage staff accounts, permissions, and service assignments."
        featureName="Multi-User & Role Management"
        icon="users"
        highlights={[
            "Role-based access control (Manager, Staff, Read-only)",
            "Staff scheduling and service assignment",
            "Individual staff activity logs",
            "Team invitation via magic link"
        ]}
    />
);

export const PaymentsPage = () => (
    <ComingSoon
        title="Payouts & Direct Banking"
        subtitle="Track disbursements, settlement schedules, and automated invoicing."
        featureName="Automated Payouts & Financials"
        icon="payments"
        highlights={[
            "Direct bank account settlement integrations",
            "Automated weekly & instant payout options",
            "Downloadable tax and revenue invoices (PDF/CSV)",
            "Fee breakdown and transaction dispute resolution"
        ]}
    />
);

export const AuditPage = () => (
    <ComingSoon
        title="Audit Logs & Compliance"
        subtitle="Comprehensive event traceability and security monitoring."
        featureName="Audit Log & Security Engine"
        icon="audit"
        highlights={[
            "Real-time logging of listing and booking modifications",
            "Provider login and IP address tracking",
            "Customer communication audit history",
            "Exportable compliance records"
        ]}
    />
);
