import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, Pause, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TelemetryEvent } from '@/lib/api';

interface TelemetryFeedProps {
  events: TelemetryEvent[];
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-amber-500/20 text-amber-400',
  DELETE: 'bg-red-500/20 text-red-400',
  PATCH: 'bg-violet-500/20 text-violet-400',
};

const getStatusColor = (status: number) => {
  if (status >= 500) return 'text-red-400';
  if (status >= 400) return 'text-amber-400';
  if (status >= 300) return 'text-blue-400';
  return 'text-emerald-400';
};

export function TelemetryFeed({ events }: TelemetryFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [pausedEvents, setPausedEvents] = useState<TelemetryEvent[]>([]);

  const displayEvents = isPaused ? pausedEvents : events;

  const handleTogglePause = () => {
    if (!isPaused) {
      setPausedEvents(events);
    }
    setIsPaused(!isPaused);
  };

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live Telemetry Feed
            {!isPaused && (
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400 ml-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            {isPaused && (
              <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400/50">
                Paused
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePause}
            className={isPaused ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 mr-1" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="font-mono text-xs">
            <AnimatePresence mode="popLayout">
              {displayEvents.map((event, index) => (
                <motion.div
                  key={`${event.ts}-${index}`}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-2 border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(event.ts).toLocaleTimeString()}
                    </span>
                    <Badge className={`${methodColors[event.method] || 'bg-muted'} shrink-0`}>
                      {event.method}
                    </Badge>
                    <span className="text-foreground truncate flex-1 min-w-0">{event.route}</span>
                    <span className={`font-bold shrink-0 ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-muted-foreground shrink-0">{event.latency}ms</span>
                    <span className="text-cyan-400 shrink-0">{event.ip}</span>
                    {event.role && (
                      <Badge variant="outline" className="text-xs shrink-0">{event.role}</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {displayEvents.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Waiting for telemetry...</p>
                <p className="text-sm mt-1">Events will appear here in real-time</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
