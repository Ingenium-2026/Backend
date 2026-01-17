import { motion } from 'framer-motion';
import { Activity, Zap, Clock, AlertCircle, Gauge, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Metrics } from '@/lib/api';

interface MetricsCardsProps {
  metrics: Metrics;
}

const metricConfigs = [
  { 
    key: 'ingestEps' as const, 
    label: 'Ingest Rate', 
    unit: 'events/s', 
    icon: Activity,
    color: 'cyan' 
  },
  { 
    key: 'rps' as const, 
    label: 'Request Rate', 
    unit: 'req/s', 
    icon: Zap,
    color: 'violet' 
  },
  { 
    key: 'avgLatencyMs' as const, 
    label: 'Avg Latency', 
    unit: 'ms', 
    icon: Clock,
    color: 'blue' 
  },
  { 
    key: 'errorRate' as const, 
    label: 'Error Rate', 
    unit: '%', 
    icon: AlertCircle,
    color: 'red' 
  },
  { 
    key: 'detectionLatencyMs' as const, 
    label: 'Detection', 
    unit: 'ms', 
    icon: Gauge,
    color: 'amber' 
  },
  { 
    key: 'responseLatencyMs' as const, 
    label: 'Response', 
    unit: 'ms', 
    icon: Timer,
    color: 'emerald' 
  },
];

const colorClasses = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
};

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metricConfigs.map((config, index) => {
        const Icon = config.icon;
        const colors = colorClasses[config.color];
        const value = metrics[config.key];

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-4 ${colors.bg} ${colors.border} border backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${colors.text}`} />
                <span className="text-xs text-muted-foreground truncate">{config.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <motion.span
                  key={value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className={`text-2xl font-bold ${colors.text}`}
                >
                  {typeof value === 'number' ? value.toFixed(config.key === 'errorRate' ? 2 : 0) : value}
                </motion.span>
                <span className="text-xs text-muted-foreground">{config.unit}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
