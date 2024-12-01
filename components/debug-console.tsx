'use client';

import { useState } from 'react';
import { useDebug, type DebugLog } from '@/lib/debug-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronUp, Trash2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DebugConsole() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, clearLogs } = useDebug();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300",
      isExpanded ? "h-96" : "h-12"
    )}>
      <Card className="h-full border-t rounded-none">
        <div className="flex items-center justify-between p-2 border-b bg-card">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">Debug Console</span>
            <span className="text-xs text-muted-foreground">
              ({state.logs.length} events)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearLogs()}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              <ChevronUp className={cn(
                "h-4 w-4 transition-transform",
                isExpanded ? "rotate-180" : ""
              )} />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <ScrollArea className="h-[calc(24rem-2.5rem)] p-4">
            <div className="space-y-2">
              {state.logs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}

function LogEntry({ log }: { log: DebugLog }) {
  const getLogColor = (type: DebugLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'api':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="text-sm font-mono">
      <div className="flex items-start space-x-2">
        <span className="text-muted-foreground">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span className={getLogColor(log.type)}>[{log.type.toUpperCase()}]</span>
        <span>{log.message}</span>
      </div>
      {log.details && (
        <pre className="mt-1 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
          {JSON.stringify(log.details, null, 2)}
        </pre>
      )}
    </div>
  );
}