import axios from 'axios';
import { SensorResponse, ImageResponse } from './types';

const API_ENDPOINT = 'https://5ca8dt9kvf.execute-api.eu-central-1.amazonaws.com/Production/mqtt-message';
const IMAGE_ENDPOINT = 'https://5ca8dt9kvf.execute-api.eu-central-1.amazonaws.com/Production/generatedImage';

export class SensorAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'SensorAPIError';
  }
}

export const publishSensorData = async (): Promise<string> => {
  try {
    const response = await axios.post<SensorResponse>(API_ENDPOINT);
    
    if (response.data.statusCode !== 200) {
      throw new SensorAPIError('Failed to publish sensor data', response.data.statusCode);
    }
    
    const parsedBody = JSON.parse(response.data.body);
    return parsedBody.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new SensorAPIError(error.message, error.response?.status);
    }
    throw new SensorAPIError('Failed to connect to sensor');
  }
};

export const fetchSensorData = async (id: string) => {
  try {
    const response = await axios.get(API_ENDPOINT, {
      params: { id },
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new SensorAPIError(error.message, error.response?.status);
    }
    throw new SensorAPIError('Failed to fetch sensor data');
  }
};

export const fetchSensorImage = async (id: string): Promise<string> => {
  try {
    const response = await axios.get<ImageResponse>(IMAGE_ENDPOINT, {
      params: { id },
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data.image_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new SensorAPIError(error.message, error.response?.status);
    }
    throw new SensorAPIError('Failed to fetch sensor image');
  }
};