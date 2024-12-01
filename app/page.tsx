import { SensorMonitor } from '@/components/sensor-monitor';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter">Sensor Monitor</h1>
          <p className="text-muted-foreground">
            Real-time temperature monitoring system
          </p>
        </div>
        <SensorMonitor />
      </div>
    </main>
  );
}