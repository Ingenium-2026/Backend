import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnomalyPanelProps {
  anomalyScore: number;
}

export function AnomalyPanel({ anomalyScore = 0 }: AnomalyPanelProps) {
  const score = anomalyScore ?? 0;
  
  const getScoreLevel = (s: number) => {
    if (s < 30) return { level: 'Normal', color: 'emerald' };
    if (s < 60) return { level: 'Elevated', color: 'amber' };
    return { level: 'Critical', color: 'red' };
  };

  const { level, color } = getScoreLevel(score);

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Anomaly Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-4xl font-bold ${
              color === 'emerald' ? 'text-emerald-400' :
              color === 'amber' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {score.toFixed(1)}
            </span>
            <motion.div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
              animate={color !== 'emerald' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {level}
            </motion.div>
          </div>
          
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                color === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                color === 'amber' ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {color !== 'emerald' && (
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  color === 'amber' ? 'bg-amber-400/50' : 'bg-red-400/50'
                }`}
                style={{ width: `${Math.min(score, 100)}%` }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>Threshold: 30</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
