import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface GenerationRequest {
  prompt: string;
  voiceId: string;
  style: string;
}

export interface JobStatusResponse {
  id: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
}

export const api = {
  async submitTextToVideo(payload: GenerationRequest): Promise<{ jobId: string }> {
    const response = await axios.post(`${API_BASE}/generate`, payload);
    return response.data;
  },

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await axios.get(`${API_BASE}/generate/status/${jobId}`);
    return response.data;
  },

  async exportTimeline(timelinePayload: any): Promise<{ exportUrl: string }> {
    const response = await axios.post(`${API_BASE}/media/export`, timelinePayload);
    return response.data;
  }
};
