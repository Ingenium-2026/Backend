import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import { ServiceStatusGrid } from '@/components/dashboard/ServiceStatusGrid';
import { ControlsPanel } from '@/components/dashboard/ControlsPanel';
import { AnomalyPanel } from '@/components/dashboard/AnomalyPanel';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { IncidentsTable } from '@/components/dashboard/IncidentsTable';
import { MitigationsPanel } from '@/components/dashboard/MitigationsPanel';
import { TelemetryFeed } from '@/components/dashboard/TelemetryFeed';
import { Skeleton } from '@/components/ui/skeleton';
export default function Index() {
  const {
    state,
    connected,
    loading,
    actions
  } = useAppState();
  if (loading) {
    return <div className="min-h-screen bg-background p-6 text-white">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="text-2xl font-bold text-cyan-500">INITIALIZING DASHBOARD...</div>
          <Skeleton className="h-16 w-full bg-secondary" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-40 bg-secondary" />
            <Skeleton className="h-40 bg-secondary" />
            <Skeleton className="h-40 bg-secondary" />
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background text-foreground">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <motion.header initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">Sentira</h1>
                <p className="text-sm text-muted-foreground">Healthcare Cyber Resilience Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.3
            }} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">LIVE: Attack → Detection → Isolation</span>
              </motion.div>
              <ConnectionStatus connected={connected} />
            </div>
          </motion.header>

          <ServiceStatusGrid services={state.services} />
          <MetricsCards metrics={state.metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <ControlsPanel autoResponse={state.settings.autoResponse} onSimulateNormal={actions.simulateNormal} onSimulateBruteforce={actions.simulateBruteforce} onSimulateExfil={actions.simulateExfil} onReset={actions.resetDemo} onToggleAutoResponse={actions.toggleAutoResponse} />
              <AnomalyPanel anomalyScore={state.metrics.anomalyScore} />
              <MitigationsPanel mitigations={state.mitigations} />
            </div>
            <div className="lg:col-span-5">
              <IncidentsTable incidents={state.incidents} autoResponse={state.settings.autoResponse} onApproveAction={actions.approveAction} />
            </div>
            <div className="lg:col-span-4">
              <TelemetryFeed events={state.telemetry.recent} />
            </div>
          </div>

          <footer className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            <p>ResiliWatch v1.0 • Healthcare Cyber Resilience Monitoring System</p>
          </footer>
        </div>
      </div>
    </div>;
}