import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getDashboard } from '../../api/dashboardApi';
import type { DashboardMetrics } from '../../types';
import { useSocketEvent } from '../../hooks/useSocket';

const STATUS_ORDER = [
  'draft', 'confirmed', 'partially_delivered', 'partially_received',
  'in_progress', 'to_close', 'fully_delivered', 'fully_received', 'done', 'late', 'cancelled',
];

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  partially_delivered: 'Partially Delivered',
  fully_delivered: 'Delivered',
  partially_received: 'Partially Received',
  fully_received: 'Received',
  in_progress: 'In Progress',
  to_close: 'To Close',
  done: 'Done',
  late: 'Late',
  cancelled: 'Cancelled',
};

function StatusPill({ label, count, isLate, isActive }: { label: string; count: number; isLate?: boolean; isActive?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-w-[68px] px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isActive
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/15 ring-2 ring-blue-300/50 shadow-md scale-105'
          : isLate
          ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:scale-105 hover:shadow-md'
          : 'border-border bg-secondary/60 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:scale-105 hover:shadow-md'
      }`}
    >
      <span className={`text-xl font-bold tracking-tight ${isLate ? 'text-red-600 dark:text-red-400' : isActive ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>
        {count}
      </span>
      <span className={`text-[10px] text-center leading-tight mt-0.5 font-medium ${isLate ? 'text-red-500 dark:text-red-400' : isActive ? 'text-blue-500' : 'text-foreground/50'}`}>
        {label}
      </span>
    </div>
  );
}

const MODULE_CONFIG: Record<string, { icon: string; gradient: string; accent: string; hoverShadow: string }> = {
  '/sales': {
    icon: '🛒',
    gradient: 'from-blue-500/8 via-transparent to-transparent',
    accent: 'bg-blue-500',
    hoverShadow: 'hover:shadow-[0_20px_60px_-12px_rgba(59,130,246,0.2)]',
  },
  '/purchase': {
    icon: '📦',
    gradient: 'from-violet-500/8 via-transparent to-transparent',
    accent: 'bg-violet-500',
    hoverShadow: 'hover:shadow-[0_20px_60px_-12px_rgba(139,92,246,0.2)]',
  },
  '/manufacturing': {
    icon: '🏭',
    gradient: 'from-emerald-500/8 via-transparent to-transparent',
    accent: 'bg-emerald-500',
    hoverShadow: 'hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)]',
  },
};

function ModuleCard({
  title,
  basePath,
  all,
  my,
  activeStatus,
  onSelectStatus,
}: {
  title: string;
  basePath: string;
  all: Record<string, number>;
  my: Record<string, number>;
  activeStatus: string | null;
  onSelectStatus: (basePath: string, status: string) => void;
}) {
  const navigate = useNavigate();
  const statuses = STATUS_ORDER.filter((s) => s in all || s in my);
  const config = MODULE_CONFIG[basePath];
  const totalAll = Object.values(all).reduce((a, b) => a + b, 0);

  return (
    <div
      className={`group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 ease-out
        hover:-translate-y-2 hover:border-blue-400/60 ${config.hoverShadow}
        shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]`}
    >
      {/* Animated blue scanning line at top on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle colored gradient that fades in on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />



      <div className="relative p-6">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{config.icon}</span>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight leading-tight">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">{totalAll} total orders</p>
            </div>
          </div>
          <Button
            onClick={() => navigate(`${basePath}/new`)}
            className="gap-1.5 h-8 px-3 text-xs group-hover:shadow-md transition-shadow duration-200"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>

        {/* ALL section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-1.5 h-1.5 rounded-full ${config.accent}`} />
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">All Orders</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => onSelectStatus(basePath, s)}>
                <StatusPill
                  label={STATUS_LABELS[s]}
                  count={all[s] ?? 0}
                  isLate={s === 'late'}
                  isActive={activeStatus === `${basePath}:${s}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 my-4" />

        {/* MY section */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">My Orders</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => onSelectStatus(basePath, s)}>
                <StatusPill
                  label={STATUS_LABELS[s]}
                  count={my[s] ?? 0}
                  isLate={s === 'late'}
                  isActive={activeStatus === `${basePath}:${s}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState('');
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const refresh = () => getDashboard().then(setMetrics).catch((e) => setError(e.message));

  useEffect(() => {
    refresh();
  }, []);

  useSocketEvent('order:status_changed', refresh);
  useSocketEvent('stock:updated', refresh);

  const handleSelectStatus = (basePath: string, status: string) => {
    setActiveStatus(`${basePath}:${status}`);
    navigate(`${basePath}?status=${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time order status across Sales, Purchase, and Manufacturing.</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-xl">
          {error}
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ModuleCard title="Sale Orders" basePath="/sales" all={metrics.sales.all} my={metrics.sales.my} activeStatus={activeStatus} onSelectStatus={handleSelectStatus} />
          <ModuleCard title="Purchase Orders" basePath="/purchase" all={metrics.purchase.all} my={metrics.purchase.my} activeStatus={activeStatus} onSelectStatus={handleSelectStatus} />
          <ModuleCard title="Manufacturing Orders" basePath="/manufacturing" all={metrics.manufacturing.all} my={metrics.manufacturing.my} activeStatus={activeStatus} onSelectStatus={handleSelectStatus} />
        </div>
      )}
    </div>
  );
}
