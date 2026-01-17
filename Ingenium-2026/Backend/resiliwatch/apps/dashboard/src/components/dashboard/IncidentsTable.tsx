import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, Clock, User, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IncidentDetails } from './IncidentDetails';
import type { Incident } from '@/lib/api';

interface IncidentsTableProps {
  incidents: Incident[];
  autoResponse: boolean;
  onApproveAction: (incidentId: string) => void;
}

const severityColors = {
  SEV1: 'bg-red-500/20 text-red-400 border-red-500/30',
  SEV2: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  SEV3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const statusColors = {
  active: 'bg-red-500/20 text-red-400',
  contained: 'bg-amber-500/20 text-amber-400',
  resolved: 'bg-emerald-500/20 text-emerald-400',
};

export function IncidentsTable({ incidents, autoResponse, onApproveAction }: IncidentsTableProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  const sortedIncidents = [...incidents].sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return (
    <>
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Active Incidents
            {incidents.filter(i => i.status === 'active').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {incidents.filter(i => i.status === 'active').length} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            {sortedIncidents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No incidents detected</p>
                <p className="text-sm mt-1">System is operating normally</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                <AnimatePresence>
                  {sortedIncidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Badge className={`${severityColors[incident.severity]} border shrink-0`}>
                            {incident.severity}
                          </Badge>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{incident.type}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              {incident.ip && (
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {incident.ip}
                                </span>
                              )}
                              {incident.userId && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {incident.userId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <Badge className={statusColors[incident.status]}>
                              {incident.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />
                              {new Date(incident.startedAt).toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {!autoResponse && incident.pendingActions && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApproveAction(incident.id);
                              }}
                            >
                              Approve
                            </Button>
                          )}
                          
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <IncidentDetails
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        autoResponse={autoResponse}
        onApproveAction={onApproveAction}
      />
    </>
  );
}
