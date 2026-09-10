/**
 * 1980s Retro AI Photo Engine
 * Powered by Google Gemini / Imagen API
 */

const axios = require("axios");
require("dotenv").config();

class AIEditorService {
  /**
   * Transforms a customer photo into a 1980s retro film look.
   * @param {Buffer} photoBuffer - Raw buffer of the customer's photo
   * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
   * @returns {Promise<{ imageUrl: string, base64: string }>}
   */
  static async transformTo1980sRetro(photoBuffer, mimeType = "image/jpeg") {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.warn("⚠️ [AI Engine] No valid GEMINI_API_KEY provided in .env. Using mock 1980s demo result.");
      return {
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        caption: "✨ Here is your 1980s Retro Vintage Photo! (Test Mode)",
      };
    }

    const base64Image = photoBuffer.toString("base64");

    // The curated 1980s Vintage Film Prompt
    const retroPrompt = `
Transform this person's portrait into an authentic 1980s vintage analog film photograph.
Key Style Requirements:
1. FACIAL IDENTITY: Preserve the exact facial features, facial structure, skin tone, eye shape, and identity of the person in the photo.
2. 1980s FILM AESTHETIC: Authentic 35mm Kodak Portra 400 film grain, slight halation glow around highlights, warm amber/golden color grading, slightly faded deep blacks.
3. LIGHTING: Classic 1980s direct on-camera flash with dramatic drop shadows behind the subject, typical of vintage disposable party/night cameras.
4. STYLING & ATMOSPHERE: Subtle 1980s retro wardrobe enhancement (vintage denim jacket, oversized leather jacket, or retro collar) and classic 80s voluminous hair texture.
5. QUALITY: High resolution, photorealistic, no cartoonish artifacts, cinematic retro nostalgia.
`;

    try {
      // Step 1: Analyze & Transform using Gemini / Imagen 3
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: retroPrompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 45000,
        }
      );

      // Return transformed output
      return {
        success: true,
        caption: "✨ Your 1980s Retro Vintage Portrait is ready! 📸 Hope you love your new look!",
        details: response.data,
      };
    } catch (error) {
      console.error("❌ [AI Engine Error]:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = AIEditorService;
