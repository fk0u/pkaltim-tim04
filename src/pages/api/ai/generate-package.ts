import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// Ensure process.env.GEMINI_API_KEY is set in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { title, location, type = 'package' } = req.body;

    if (!title || !location) {
        return res.status(400).json({ message: 'Title and Location are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: 'Server configuration error: Missing API Key' });
    }

    try {
        // User requested GEMINI_2.5_FLASH, but falling back to stable 1.5-flash to fix 500 error
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let prompt = '';

        if (type === 'event') {
            prompt = `
              Act as a professional Event Organizer Copywriter.
              Create a detailed event description and schedule for:
              
              Event Title: "${title}"
              Location: "${location}"

              Output must be strictly valid JSON with this structure:
              {
                "description": "Engaging marketing description (approx 100 words)",
                "tags": ["list", "of", "5", "relevant", "tags"],
                "schedule": [
                    { "time": "09:00", "title": "Opening", "description": "Details..." },
                    { "time": "12:00", "title": "Break", "description": "Details..." }
                ]
              }
              
              Do not include markdown formatting like \`\`\`json. Just the raw JSON.
              Use Bahasa Indonesia language.
            `;
        } else {
            prompt = `
              Act as a professional Travel Agent Copywriter.
              Create a detailed tour package description and itinerary for:
              
              Title: "${title}"
              Location: "${location}"

              Output must be strictly valid JSON with this structure:
              {
                "description": "Engaging marketing description (approx 100 words)",
                "facilities": ["list", "of", "5", "key", "facilities"],
                "priceEstimate": 000000 (number only, estimation in IDR),
                "duration": "X Hari Y Malam",
                "itinerary": [
                    { "day": 1, "title": "Arrival", "activity": "Detailed activity..." },
                    { "day": 2, "title": "Exploration", "activity": "Detailed activity..." }
                ]
              }
              
              Do not include markdown formatting like \`\`\`json. Just the raw JSON.
              Use Bahasa Indonesia language.
            `;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Raw Response:', text); // Debugging

        // Clean up if markdown is present
        let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Remove any leading text before the first { and any trailing text after the last }
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        let data;
        try {
            data = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Failed JSON string:', jsonStr);
            return res.status(500).json({ message: 'Failed to parse AI response', raw: text });
        }

        res.status(200).json(data);
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate content', error: error.message });
    }
}
