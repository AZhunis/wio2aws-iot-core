'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorDisplayProps {
  data: number[];
}

export function SensorDisplay({ data }: SensorDisplayProps) {
  const stats = {
    current: data[0],
    average: Number((data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)),
    min: Math.min(...data),
    max: Math.max(...data)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sensor Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem label="Current" value={stats.current} />
        <StatItem label="Average" value={stats.average} />
        <StatItem label="Minimum" value={stats.min} />
        <StatItem label="Maximum" value={stats.max} />
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value.toFixed(1)}°C</p>
    </div>
  );
}