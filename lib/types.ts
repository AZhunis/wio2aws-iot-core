export interface InitialResponse {
  statusCode: number;
  body: string;
}

export interface TemperatureResponse {
  id: string;
  temperatures: number[];
}

export interface ImageResponse {
  message: string;
  image_url: string;
}

export interface TemperatureStats {
  current: number;
  average: number;
  min: number;
  max: number;
}