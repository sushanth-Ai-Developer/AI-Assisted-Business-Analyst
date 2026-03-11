
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  // Pick the first available key and clean it thoroughly
  let apiKey = (
    process.env.GEMINI_API_KEY || 
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY || 
    process.env.VITE_API_KEY
  );

  if (apiKey) {
    // Remove any accidental quotes and whitespace
    apiKey = apiKey.replace(/["']/g, '').trim();
  }
  
  if (!apiKey || apiKey.length < 10 || !apiKey.startsWith('AIza')) {
    console.error('SERVER ERROR: API key is missing, too short, or does not start with AIza.');
    return res.status(500).json({ 
      error: 'Invalid API Key configuration on server. Please check your Settings and ensure the key starts with AIza.' 
    });
  }

  try {
    const { parts, systemInstruction, responseSchema } = req.body;
    
    // Initialize the official SDK
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.models.get({ model: 'gemini-1.5-flash' });
    
    console.log(`Calling Gemini API with key prefix: ${apiKey.substring(0, 4)}...`);

    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts }],
      config: {
        systemInstruction,
        temperature: 0.1,
        ...(responseSchema && { responseMimeType: 'application/json', responseSchema }),
      }
    });

    // Return format that matches what the frontend expects
    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: result.text
          }]
        }
      }]
    });
  } catch (err) {
    console.error('Gemini API Error:', err);
    
    // If it's a 400 error from the API, it's likely still the key
    if (err.message?.includes('API key not valid')) {
      return res.status(400).json({ 
        error: "The API key is being rejected by Google. Please verify your key in Settings.",
        details: err.message
      });
    }
    
    return res.status(500).json({ error: err.message });
  }
}
