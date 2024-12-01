'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDebug } from '@/lib/debug-context';
import { getInitialId, getTemperatures, getHeatmapImage } from '@/lib/api';
import { Thermometer, RefreshCw, Loader2, LineChart } from 'lucide-react';
import { SensorDisplay } from './sensor-display';
import { SensorImage } from './sensor-image';
import { getErrorMessage } from '@/lib/error';

export function SensorMonitor() {
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState<number[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { addLog } = useDebug();

  const handleCapture = async () => {
    setLoading(true);
    try {
      const id = await getInitialId(addLog);
      setEventId(id);
      setSensorData([]);
      setImageUrl(null);
      toast({
        title: 'Sensor Connected',
        description: `Event ID: ${id}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!eventId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No active sensor connection',
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getTemperatures(eventId, addLog);
      setSensorData(data.temperatures);
      toast({
        title: 'Data Retrieved',
        description: `${data.temperatures.length} readings loaded`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Query Failed',
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetImage = async () => {
    if (!eventId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No active sensor connection',
      });
      return;
    }

    setLoading(true);
    try {
      const url = await getHeatmapImage(eventId, addLog);
      setImageUrl(url);
      toast({
        title: 'Success',
        description: 'Temperature heatmap generated',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Heatmap',
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="grid gap-4">
        <Button
          onClick={handleCapture}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Capture Reading
            </>
          )}
        </Button>

        <Button
          onClick={handleQuery}
          disabled={loading || !eventId}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Thermometer className="mr-2 h-4 w-4" />
              Query Sensor Data
            </>
          )}
        </Button>

        <Button
          onClick={handleGetImage}
          disabled={loading || !eventId || !sensorData.length}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <LineChart className="mr-2 h-4 w-4" />
              Generate Heatmap
            </>
          )}
        </Button>
      </div>

      {eventId && (
        <div className="rounded-md bg-muted/40 p-4 border border-border">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Event ID</p>
            <p className="font-mono text-sm break-all">{eventId}</p>
          </div>
        </div>
      )}

      {sensorData.length > 0 && <SensorDisplay data={sensorData} />}
      {imageUrl && <SensorImage imageUrl={imageUrl} />}
    </Card>
  );
}