'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorImageProps {
  imageUrl: string;
}

export function SensorImage({ imageUrl }: SensorImageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Temperature Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden scale-[1.5]">
          <Image
            src={imageUrl}
            alt="Temperature Heatmap"
            fill
            className="object-contain"
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}