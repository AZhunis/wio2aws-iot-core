import axios from 'axios';
import { APIError, handleAxiosError } from './error';
import { InitialResponse, TemperatureResponse, ImageResponse } from './types';

const API_BASE = 'https://5ca8dt9kvf.execute-api.eu-central-1.amazonaws.com/Production';
const MQTT_ENDPOINT = `${API_BASE}/mqtt-message`;
const IMAGE_ENDPOINT = `${API_BASE}/generatedImage`;

// Create axios instance with custom config
const apiClient = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getInitialId = async (addLog?: (log: any) => void): Promise<string> => {
  try {
    addLog?.({
      type: 'api',
      message: 'Requesting initial ID',
      details: { endpoint: MQTT_ENDPOINT }
    });

    const response = await apiClient.post<InitialResponse>(MQTT_ENDPOINT, {});
    
    if (response.data.statusCode !== 200) {
      throw new APIError('Failed to get ID', response.data.statusCode);
    }
    
    const bodyData = typeof response.data.body === 'string' 
      ? JSON.parse(response.data.body) 
      : response.data.body;

    if (!bodyData?.id) {
      throw new APIError('Invalid response: Missing ID');
    }

    addLog?.({
      type: 'info',
      message: 'Received initial ID',
      details: { id: bodyData.id }
    });

    return bodyData.id;
  } catch (error) {
    addLog?.({
      type: 'error',
      message: 'Failed to get initial ID',
      details: error
    });
    throw handleAxiosError(error);
  }
};

export const getTemperatures = async (id: string, addLog?: (log: any) => void): Promise<TemperatureResponse> => {
  if (!id) {
    throw new APIError('ID is required');
  }

  try {
    addLog?.({
      type: 'api',
      message: 'Fetching temperature data',
      details: { id, endpoint: MQTT_ENDPOINT }
    });

    const response = await apiClient.get<TemperatureResponse>(MQTT_ENDPOINT, {
      params: { id }
    });
    
    if (!Array.isArray(response.data?.temperatures)) {
      throw new APIError('Invalid response: Missing or invalid temperature data');
    }

    addLog?.({
      type: 'info',
      message: 'Received temperature data',
      details: {
        id,
        readingsCount: response.data.temperatures.length
      }
    });
    
    return response.data;
  } catch (error) {
    addLog?.({
      type: 'error',
      message: 'Failed to get temperature data',
      details: error
    });
    throw handleAxiosError(error);
  }
};

export const getHeatmapImage = async (id: string, addLog?: (log: any) => void): Promise<string> => {
  if (!id) {
    throw new APIError('ID is required');
  }

  try {
    addLog?.({
      type: 'api',
      message: 'Generating heatmap',
      details: { id, endpoint: IMAGE_ENDPOINT }
    });

    const response = await apiClient.get<ImageResponse>(IMAGE_ENDPOINT, {
      params: { id }
    });

    if (!response.data?.image_url) {
      throw new APIError('Invalid response: Missing image URL');
    }

    const imageUrl = new URL(response.data.image_url);
    imageUrl.searchParams.append('t', Date.now().toString());
    
    addLog?.({
      type: 'info',
      message: 'Received heatmap URL',
      details: { url: imageUrl.toString() }
    });

    return imageUrl.toString();
  } catch (error) {
    addLog?.({
      type: 'error',
      message: 'Failed to generate heatmap',
      details: error
    });
    throw handleAxiosError(error);
  }
};