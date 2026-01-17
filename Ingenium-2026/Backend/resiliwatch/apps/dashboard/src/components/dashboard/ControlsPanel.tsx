import { motion } from 'framer-motion';
import { Play, Skull, FileWarning, RotateCcw, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ControlsPanelProps {
  autoResponse: boolean;
  onSimulateNormal: () => void;
  onSimulateBruteforce: () => void;
  onSimulateExfil: () => void;
  onReset: () => void;
  onToggleAutoResponse: () => void;
}

export function ControlsPanel({
  autoResponse,
  onSimulateNormal,
  onSimulateBruteforce,
  onSimulateExfil,
  onReset,
  onToggleAutoResponse,
}: ControlsPanelProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onSimulateNormal}
              variant="outline"
              className="w-full h-auto py-3 flex flex-col items-center gap-1 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400"
            >
              <Play className="w-5 h-5" />
              <span className="text-xs">Normal Traffic</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onSimulateBruteforce}
              variant="outline"
              className="w-full h-auto py-3 flex flex-col items-center gap-1 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-400"
            >
              <Skull className="w-5 h-5" />
              <span className="text-xs">Bruteforce</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onSimulateExfil}
              variant="outline"
              className="w-full h-auto py-3 flex flex-col items-center gap-1 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400"
            >
              <FileWarning className="w-5 h-5" />
              <span className="text-xs">Exfiltration</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onReset}
              variant="outline"
              className="w-full h-auto py-3 flex flex-col items-center gap-1 bg-secondary/50 border-border hover:bg-secondary text-muted-foreground"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs">Reset Demo</span>
            </Button>
          </motion.div>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {autoResponse ? (
                <Bot className="w-4 h-4 text-cyan-400" />
              ) : (
                <User className="w-4 h-4 text-amber-400" />
              )}
              <Label htmlFor="auto-response" className="text-sm font-medium cursor-pointer">
                {autoResponse ? 'Auto Response' : 'Human-in-the-Loop'}
              </Label>
            </div>
            <Switch
              id="auto-response"
              checked={autoResponse}
              onCheckedChange={onToggleAutoResponse}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {autoResponse 
              ? 'Threats are automatically mitigated' 
              : 'Manual approval required for actions'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
