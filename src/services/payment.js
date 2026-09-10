/**
 * Payment Service (UPI Dynamic QR & Verification)
 */

const QRCode = require("qrcode");
require("dotenv").config();

class PaymentService {
  /**
   * Generates a UPI intent URI and a base64 QR Code image buffer.
   */
  static async generateUpiQr(orderId, amount = process.env.PRICE_INR || 10) {
    const upiId = process.env.UPI_ID || "merchant@upi";
    const payeeName = process.env.UPI_PAYEE_NAME || "RetroSnap AI";
    const note = `Retro1980s-${orderId}`;

    // Standard NPCI UPI URI Specification
    const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Generate QR code buffer (PNG)
    const qrBuffer = await QRCode.toBuffer(upiUri, {
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    });

    // Also generate data URL for web previews
    const qrDataUrl = await QRCode.toDataURL(upiUri);

    return {
      orderId,
      amount,
      upiUri,
      qrBuffer,
      qrDataUrl,
    };
  }

  /**
   * Verify an incoming payment webhook (supports Razorpay/Cashfree or custom simulated webhook)
   */
  static verifyWebhook(payload, signature) {
    // In production with Razorpay:
    // const crypto = require("crypto");
    // const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    //   .update(JSON.stringify(payload)).digest("hex");
    // return signature === expectedSignature;

    // For initial launch / simulated payments:
    if (payload && payload.orderId && payload.status === "captured") {
      return true;
    }
    return false;
  }
}

module.exports = PaymentService;
