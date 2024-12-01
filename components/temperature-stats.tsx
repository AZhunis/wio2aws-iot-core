import { TemperatureStats as Stats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemperatureStatsProps {
  stats: Stats;
}

export function TemperatureStats({ stats }: TemperatureStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Temperature Statistics</CardTitle>
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
      <p className="text-2xl font-bold tracking-tight">{value}°C</p>
    </div>
  );
}