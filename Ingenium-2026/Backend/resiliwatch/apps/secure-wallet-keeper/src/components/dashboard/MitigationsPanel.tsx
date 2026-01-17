import { motion } from 'framer-motion';
import { Shield, Ban, Lock, Gauge, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AppState } from '@/lib/api';

interface MitigationsPanelProps {
  mitigations: AppState['mitigations'];
}

export function MitigationsPanel({ mitigations }: MitigationsPanelProps) {
  const hasActiveMitigations = 
    mitigations.blockedIPs.length > 0 || 
    mitigations.lockedAccounts.length > 0 || 
    mitigations.rateLimits.length > 0 ||
    mitigations.degradedMode;

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Active Mitigations
          {hasActiveMitigations && (
            <Badge className="bg-violet-500/20 text-violet-400 ml-2">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mitigations.degradedMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-medium text-amber-400">Degraded Mode Active</p>
              <p className="text-xs text-amber-400/70">Non-essential features disabled for security</p>
            </div>
          </motion.div>
        )}

        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {/* Blocked IPs */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Ban className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">Blocked IPs</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {mitigations.blockedIPs.length}
                </Badge>
              </div>
              {mitigations.blockedIPs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mitigations.blockedIPs.map((ip) => (
                    <Badge 
                      key={ip}
                      className="bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs"
                    >
                      {ip}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No blocked IPs</p>
              )}
            </div>

            {/* Locked Accounts */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Locked Accounts</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {mitigations.lockedAccounts.length}
                </Badge>
              </div>
              {mitigations.lockedAccounts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mitigations.lockedAccounts.map((account) => (
                    <Badge 
                      key={account}
                      className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs"
                    >
                      {account}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No locked accounts</p>
              )}
            </div>

            {/* Rate Limits */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Rate Limits</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {mitigations.rateLimits.length}
                </Badge>
              </div>
              {mitigations.rateLimits.length > 0 ? (
                <div className="space-y-2">
                  {mitigations.rateLimits.map((limit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-xs p-2 rounded bg-blue-500/10 border border-blue-500/30"
                    >
                      <span className="font-mono text-blue-400">{limit.route}</span>
                      {limit.ip && <Badge variant="outline" className="text-xs">{limit.ip}</Badge>}
                      {limit.userId && <Badge variant="outline" className="text-xs">{limit.userId}</Badge>}
                      <span className="ml-auto text-muted-foreground">{limit.limit} req/min</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No active rate limits</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
