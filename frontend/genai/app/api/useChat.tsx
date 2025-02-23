"use client";

import axios from 'axios';

export async function generatePPT(messages: Array<{ role: string; content: string }>): Promise<string>  {
    try {
      // const response = await axios.post('https://backend-production-5c3f.up.railway.app/generate-ppt', { userInput });
      const response = await axios.post('http://127.0.0.1:5000/generate-ppt', { messages });
      return response.data['data'];
    } catch (error) {
      console.error('Error generating PPT:', error);
      throw error;
    }
}

export async function generateTemplatePPT(messages: Array<{ role: string; content: string }>): Promise<string>  {
    try {
      // const response = await axios.post('https://backend-production-5c3f.up.railway.app/generate-ppt', { userInput });
      const response = await axios.post('http://127.0.0.1:5000/generate-template', { messages });
      return response.data['data'];
    } catch (error) {
      console.error('Error generating PPT:', error);
      throw error;
    }
}
