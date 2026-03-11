
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { GeneratedOutput, SheetData } from '../types';

// This function assumes XLSX is loaded from a script tag in index.html
declare var XLSX: any;

const generateExcelBase64 = (sheetsData: SheetData): string => {
    try {
        const workbook = XLSX.utils.book_new();
        for (const sheetName in sheetsData) {
            if (Object.prototype.hasOwnProperty.call(sheetsData, sheetName)) {
                const worksheet = XLSX.utils.json_to_sheet(sheetsData[sheetName]);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
        }
        const base64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
        return base64;
    } catch (error) {
        console.error("Failed to generate Excel file:", error);
        return ""; // Return empty string on failure
    }
};

export const generateProductArchitecture = async (brdText: string): Promise<GeneratedOutput> => {
    // Check multiple possible key names for maximum compatibility
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.VITE_API_KEY_BSA || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY, VITE_API_KEY, or VITE_API_KEY_BSA in Settings.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const model = 'gemini-3-flash-preview';
    const fullPrompt = `${SYSTEM_PROMPT}\n\nHere is the BRD:\n\n{{BRD_TEXT}}\n${brdText}`;

    try {
        console.log("Starting generation with model:", model);
        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: fullPrompt,
            config: {
                temperature: 0.0,
                maxOutputTokens: 8192,
                seed: 42,
            }
        });

        let rawText = '';
        let chunkCount = 0;
        try {
            for await (const chunk of responseStream) {
                chunkCount++;
                if (chunk.text) {
                    rawText += chunk.text;
                    if (chunkCount % 10 === 0) {
                        console.log(`Received ${chunkCount} chunks...`);
                    }
                }
            }
        } catch (streamError) {
            console.error("Stream processing error:", streamError);
            throw new Error("Connection lost while receiving data from AI. This often happens with very large BRDs or unstable connections.");
        }
        
        console.log(`Generation complete. Total chunks: ${chunkCount}. Total length: ${rawText.length}`);
        
        if (!rawText) {
            throw new Error("The AI returned an empty response. This might be a temporary API issue. Please try again.");
        }
        const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!match || !match[1]) {
            throw new Error("Could not find a valid JSON code block in the response.");
        }
        const jsonString = match[1];

        let parsedData: GeneratedOutput;
        try {
            parsedData = JSON.parse(jsonString);
            if (!parsedData.epics || parsedData.epics.length === 0) {
                console.warn("Gemini returned an empty epics array. This might be due to a very brief BRD or a generation error.");
            }
        } catch (e) {
            console.error("Failed to parse JSON:", e);
            console.error("Received string:", jsonString);
            throw new Error("Invalid JSON format received from the API.");
        }

        // --- FIX: Overwrite timestamp with current client time for accuracy ---
        parsedData.meta.generated_at = new Date().toISOString();
        
        // Generate Excel file in base64 and add it to the response object
        if (parsedData.tables_for_excel && parsedData.tables_for_excel.sheets) {
            const excelBase64 = generateExcelBase64(parsedData.tables_for_excel.sheets);
            if (excelBase64) {
                 parsedData.files.excel_base64 = excelBase64;
            }
        }

        return parsedData;

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        
        let message = "An unknown error occurred while communicating with the Gemini API.";
        
        if (error?.message) {
            message = error.message;
            // The Gemini SDK often returns a stringified JSON for 400/403 errors
            try {
                const jsonStart = message.indexOf('{');
                if (jsonStart !== -1) {
                    const jsonPart = message.substring(jsonStart);
                    const parsed = JSON.parse(jsonPart);
                    if (parsed?.error?.message) {
                        message = parsed.error.message;
                    } else if (parsed?.[0]?.error?.message) {
                        message = parsed[0].error.message;
                    }
                }
            } catch (e) {
                // If parsing fails, we keep the original message but clean it up
                message = message.replace(/^Gemini API Error: /i, '');
            }
        }
        
        throw new Error(message);
    }
};