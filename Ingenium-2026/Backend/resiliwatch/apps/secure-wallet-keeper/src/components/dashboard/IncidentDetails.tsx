import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Clock, Shield, Zap, Check, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { Incident } from '@/lib/api';

interface IncidentDetailsProps {
  incident: Incident | null;
  onClose: () => void;
  autoResponse: boolean;
  onApproveAction: (incidentId: string) => void;
}

const phases = ['normal', 'suspicious', 'confirmed', 'isolated', 'stabilized'] as const;

const phaseConfig = {
  normal: { label: 'Normal', color: 'emerald', icon: Check },
  suspicious: { label: 'Suspicious', color: 'amber', icon: AlertTriangle },
  confirmed: { label: 'Confirmed', color: 'red', icon: AlertTriangle },
  isolated: { label: 'Isolated', color: 'violet', icon: Shield },
  stabilized: { label: 'Stabilized', color: 'cyan', icon: Zap },
};

export function IncidentDetails({ incident, onClose, autoResponse, onApproveAction }: IncidentDetailsProps) {
  if (!incident) return null;

  const currentPhaseIndex = phases.indexOf(incident.phase || 'normal');

  return (
    <Sheet open={!!incident} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <SheetHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Incident Details
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${
                  incident.severity === 'SEV1' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  incident.severity === 'SEV2' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                } border`}>
                  {incident.severity}
                </Badge>
                <Badge className={`${
                  incident.status === 'active' ? 'bg-red-500/20 text-red-400' :
                  incident.status === 'contained' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {incident.status}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{incident.type}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(incident.startedAt).toLocaleString()}
                </span>
              </div>
              {(incident.ip || incident.userId) && (
                <div className="flex gap-4 text-sm">
                  {incident.ip && <span><strong>IP:</strong> {incident.ip}</span>}
                  {incident.userId && <span><strong>User:</strong> {incident.userId}</span>}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Incident Timeline
              </h4>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div className="space-y-0">
                  {phases.map((phase, index) => {
                    const config = phaseConfig[phase];
                    const Icon = config.icon;
                    const isActive = index <= currentPhaseIndex;
                    const isCurrent = index === currentPhaseIndex;

                    return (
                      <motion.div
                        key={phase}
                        className="relative flex items-center gap-4 py-2"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: isActive ? 1 : 0.4 }}
                      >
                        <motion.div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isCurrent 
                              ? `bg-${config.color}-500/20 border-${config.color}-500 text-${config.color}-400`
                              : isActive 
                                ? 'bg-muted border-muted-foreground/50 text-muted-foreground'
                                : 'bg-background border-border text-muted-foreground/50'
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span className={`font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {config.label}
                        </span>
                        {isCurrent && (
                          <Badge className="bg-primary/20 text-primary text-xs">Current</Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Explainable Reasons */}
            {incident.reasons && incident.reasons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Detection Reasons
                </h4>
                <div className="space-y-3">
                  {incident.reasons.map((reason, index) => (
                    <Card key={index} className="p-4 bg-muted/30 border-border/50">
                      <p className="font-medium text-sm mb-2">{reason.ruleName}</p>
                      <p className="text-sm text-muted-foreground mb-3">{reason.explanation}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-background/50 rounded px-2 py-1">
                          <span className="text-muted-foreground">Observed:</span>{' '}
                          <span className="font-mono font-bold">{reason.observedValue}</span>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1">
                          <span className="text-muted-foreground">Threshold:</span>{' '}
                          <span className="font-mono font-bold">{reason.threshold}</span>
                        </div>
                        <div className="bg-background/50 rounded px-2 py-1">
                          <span className="text-muted-foreground">Window:</span>{' '}
                          <span className="font-mono font-bold">{reason.windowSec}s</span>
                        </div>
                        {reason.deltaPct !== undefined && (
                          <div className="bg-background/50 rounded px-2 py-1">
                            <span className="text-muted-foreground">Delta:</span>{' '}
                            <span className="font-mono font-bold text-red-400">+{reason.deltaPct}%</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {incident.actions && incident.actions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Mitigation Actions
                </h4>
                <div className="space-y-2">
                  {incident.actions.map((action, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${action.auto ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                        <div>
                          <p className="font-medium text-sm">{action.type}</p>
                          {action.details && (
                            <p className="text-xs text-muted-foreground">{action.details}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {action.auto ? 'Auto' : 'Manual'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approve Button */}
            {!autoResponse && incident.pendingActions && (
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                onClick={() => onApproveAction(incident.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Pending Actions
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
