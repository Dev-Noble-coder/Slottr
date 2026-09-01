
import ProviderLayout from '../../components/layouts/ProviderLayout';
import { useProviderHome } from '../../hooks/useProvider.ts';
import { Loader2, DollarSign, Calendar, TrendingUp, Wallet } from 'lucide-react';

const Dashboard = () => {
    const { data: homeData, isLoading } = useProviderHome();
    
    // Mock data if backend is missing
    const stats = homeData?.data || {
        availableBalance: 0,
        nextPayoutDate: 'Not scheduled',
        todaySchedule: [],
        analytics: {
            weeklyBookings: 0,
            weeklyRevenue: 0
        }
    };

    return (
        <ProviderLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue">Provider Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your performance and schedule</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Available Balance</p>
                                <h3 className="text-2xl font-bold text-blue">${stats.availableBalance}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Next Payout</p>
                                <h3 className="text-lg font-bold text-blue">{stats.nextPayoutDate}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Weekly Bookings</p>
                                <h3 className="text-2xl font-bold text-blue">{stats.analytics.weeklyBookings}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Weekly Revenue</p>
                                <h3 className="text-2xl font-bold text-blue">${stats.analytics.weeklyRevenue}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-blue mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            Today's Schedule
                        </h3>
                        {stats.todaySchedule && stats.todaySchedule.length > 0 ? (
                            <div className="space-y-4">
                                {stats.todaySchedule.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                        <div>
                                            <p className="font-semibold text-slate-800">{item.title || 'Booking'}</p>
                                            <p className="text-sm text-slate-500">{item.time || 'All Day'}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                                            {item.customerName || 'Customer'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <p>No bookings scheduled for today.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
};

export default Dashboard;
