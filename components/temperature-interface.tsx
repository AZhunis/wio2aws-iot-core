'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getInitialId, getTemperatures } from '@/lib/api';
import { getErrorMessage } from '@/lib/error';
import { calculateTemperatureStats } from '@/lib/temperature';
import { TemperatureStats } from './temperature-stats';
import { Loader2, RefreshCw, Thermometer } from 'lucide-react';

export function TemperatureInterface() {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [temperatures, setTemperatures] = useState<number[]>([]);
  const { toast } = useToast();

  const handleGetId = async () => {
    setLoading(true);
    try {
      const newId = await getInitialId();
      setId(newId);
      setTemperatures([]);
      toast({
        title: 'Success',
        description: `Connected to sensor ${newId.slice(0, 8)}...`,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetTemperatures = async () => {
    if (!id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please connect to a sensor first',
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getTemperatures(id);
      setTemperatures(data.temperatures);
      toast({
        title: 'Success',
        description: `Retrieved ${data.temperatures.length} readings`,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = calculateTemperatureStats(temperatures);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Button
          onClick={handleGetId}
          disabled={loading}
          variant="default"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Connect to Sensor
            </>
          )}
        </Button>
        
        <Button
          onClick={handleGetTemperatures}
          disabled={loading || !id}
          variant="secondary"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Thermometer className="mr-2 h-4 w-4" />
              Get Readings
            </>
          )}
        </Button>
      </div>

      {id && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm text-muted-foreground">
            Connected to sensor: <span className="font-mono">{id.slice(0, 8)}...</span>
          </p>
        </div>
      )}

      {temperatures.length > 0 && <TemperatureStats stats={stats} />}
    </div>
  );
}