import axios from 'axios'
import FormData from 'form-data'
import { readFileSync } from 'fs'

const AI_URL = process.env.AI_URL || 'http://ai:5001'

export const sendToAIService = async (jobName: string, filePath: string) => {
  const formData = new FormData()
  formData.append('audio', readFileSync(filePath), { filename: 'audio.wav' })

  try {
    const response = await axios.post(`${AI_URL}/${jobName}`, formData, {
      headers: { ...formData.getHeaders() },
    })
    return response.data
  } catch (error) {
    console.error(`[ERROR] Failed AI job: ${jobName}`, error)
    throw new Error('AI processing failed.')
  }
}
