import { motion } from 'framer-motion';
import { Shield, Database, Calendar, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ServiceStatus {
  status: 'green' | 'yellow' | 'red';
  message: string;
}

interface ServiceStatusGridProps {
  services: {
    auth: ServiceStatus;
    ehr: ServiceStatus;
    appointments: ServiceStatus;
  };
}

const serviceConfig = {
  auth: { label: 'AUTH', icon: Shield, description: 'Authentication Service' },
  ehr: { label: 'EHR', icon: Database, description: 'Electronic Health Records' },
  appointments: { label: 'APPOINTMENTS', icon: Calendar, description: 'Scheduling System' },
};

const statusColors = {
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    pulse: false,
  },
  yellow: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    pulse: true,
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
    pulse: true,
  },
};

const statusLabels = {
  green: 'Healthy',
  yellow: 'Under Attack',
  red: 'Isolated',
};

export function ServiceStatusGrid({ services }: ServiceStatusGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(Object.entries(services) as [keyof typeof serviceConfig, ServiceStatus][]).map(([key, service]) => {
        const config = serviceConfig[key];
        const colors = statusColors[service.status];
        const Icon = config.icon;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`relative overflow-hidden p-6 ${colors.bg} ${colors.border} border-2 shadow-lg ${colors.glow}`}>
              {colors.pulse && (
                <motion.div
                  className={`absolute inset-0 ${colors.bg}`}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      service.status === 'green' ? 'bg-emerald-400' :
                      service.status === 'yellow' ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    animate={colors.pulse ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{config.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                  <Activity className="w-3 h-3" />
                  {service.message || statusLabels[service.status]}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
