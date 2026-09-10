/**
 * Meta WhatsApp Cloud API Service
 */

const axios = require("axios");
require("dotenv").config();

class WhatsAppService {
  static get baseUrl() {
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    return `https://graph.facebook.com/v21.0/${phoneId}`;
  }

  static get headers() {
    return {
      Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Send a simple text message.
   */
  static async sendTextMessage(to, text) {
    if (!process.env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN.startsWith("your_")) {
      console.log(`💬 [Simulated WhatsApp Send to ${to}]:\n"${text}"\n`);
      return { success: true, simulated: true };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { body: text },
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error("❌ [WhatsApp Send Text Error]:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send an image with caption via URL.
   */
  static async sendImage(to, imageUrl, caption = "") {
    if (!process.env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN.startsWith("your_")) {
      console.log(`🖼️ [Simulated WhatsApp Send Image to ${to}]:\nImage: ${imageUrl}\nCaption: "${caption}"\n`);
      return { success: true, simulated: true };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "image",
          image: {
            link: imageUrl,
            caption: caption,
          },
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error("❌ [WhatsApp Send Image Error]:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Downloads media (customer photo) sent on WhatsApp via Meta media ID.
   */
  static async downloadMedia(mediaId) {
    if (!process.env.META_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN.startsWith("your_")) {
      console.log(`📥 [Simulated Media Download for ID: ${mediaId}]`);
      return { buffer: Buffer.from("mock_image"), mimeType: "image/jpeg" };
    }

    try {
      // Step 1: Get media URL
      const metaRes = await axios.get(`https://graph.facebook.com/v21.0/${mediaId}`, {
        headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` },
      });

      const mediaUrl = metaRes.data.url;
      const mimeType = metaRes.data.mime_type || "image/jpeg";

      // Step 2: Download raw binary buffer
      const fileRes = await axios.get(mediaUrl, {
        headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` },
        responseType: "arraybuffer",
      });

      return {
        buffer: Buffer.from(fileRes.data),
        mimeType,
      };
    } catch (error) {
      console.error("❌ [Media Download Error]:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = WhatsAppService;
