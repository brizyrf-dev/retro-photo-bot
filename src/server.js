/**
 * Main Express Server
 * WhatsApp Webhook & Autonomous 1980s Retro Photo Bot
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const WhatsAppService = require("./services/whatsapp");
const PaymentService = require("./services/payment");
const AIEditorService = require("./services/aiEditor");
const OrderManager = require("./services/orderManager");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Meta Webhook Verification Handshake
// ==========================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.META_VERIFY_TOKEN || "retro_photo_secret_token_123";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ [Meta Webhook Verified Successfully!]");
    return res.status(200).send(challenge);
  }

  console.warn("❌ [Webhook Verification Failed] Token mismatch.");
  return res.sendStatus(403);
});

// ==========================================
// 2. Incoming WhatsApp Message Handler
// ==========================================
app.post("/webhook", async (req, res) => {
  // Always acknowledge Meta with 200 immediately
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") return;

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return; // Status update / delivery receipt, ignore

    const from = message.from; // Customer's phone number
    const messageType = message.type;

    console.log(`📩 [Incoming Message from ${from} | Type: ${messageType}]`);

    // CASE A: Customer sends an Image / Photo
    if (messageType === "image") {
      const mediaId = message.image.id;
      const mediaMime = message.image.mime_type || "image/jpeg";

      console.log(`📸 Customer ${from} sent a photo (Media ID: ${mediaId})`);

      // 1. Download image from Meta
      const media = await WhatsAppService.downloadMedia(mediaId);

      // 2. Create Order & save photo buffer
      const order = OrderManager.setPhoto(from, mediaId, media.buffer, mediaMime);

      // 3. Generate UPI QR Code for ₹10
      const qrData = await PaymentService.generateUpiQr(order.orderId);

      // 4. Send customer payment instructions & QR
      const instructions = `📸 Photo received! Order ID: #${order.orderId}

✨ To generate your authentic 1980s Vintage Film portrait:
💵 Amount: ₹${qrData.amount} INR only

📲 Tap to Pay with UPI (GPay / PhonePe / Paytm):
${qrData.upiUri}

⚡ As soon as your ₹10 payment is completed, our AI will automatically create and deliver your 1980s retro portrait in 20 seconds!`;

      await WhatsAppService.sendTextMessage(from, instructions);
      return;
    }

    // CASE B: Customer sends Text message
    if (messageType === "text") {
      const text = message.text.body.trim().toLowerCase();
      const existingOrder = OrderManager.getOrder(from);

      // If customer asks for status or just said Hi
      const welcome = `🌟 *Welcome to RetroSnap AI!* 📸

Turn your modern selfie into a viral **1980s Vintage Film Portrait** (35mm Kodak Portra film grain, retro flash, and 80s styling) in just 30 seconds!

💰 *Price:* Only ₹10 per photo.
🚀 *How it works:*
1. Send your photo/selfie here.
2. Scan the ₹10 UPI QR.
3. Receive your HD 1980s Retro Photo instantly!

👉 *Send your photo now to get started!*`;

      await WhatsAppService.sendTextMessage(from, welcome);
    }
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
  }
});

// ==========================================
// 3. Payment Confirmation Webhook
// ==========================================
app.post("/payment-webhook", async (req, res) => {
  const { orderId, amount, status } = req.body;

  console.log(`💳 [Payment Webhook Received] Order: ${orderId} | Status: ${status}`);

  if (status !== "captured" && status !== "success") {
    return res.status(400).json({ error: "Payment not successful" });
  }

  // 1. Mark order paid
  const order = OrderManager.markPaid(orderId || "ANY_LATEST");
  if (!order) {
    console.warn(`⚠️ No pending order found for ID: ${orderId}`);
    return res.status(404).json({ error: "Order not found or already processed" });
  }

  res.json({ success: true, message: "Payment verified, AI processing started" });

  // 2. Notify customer on WhatsApp
  const phone = order.phone;
  await WhatsAppService.sendTextMessage(
    phone,
    `✅ Payment of ₹${order.amount || 10} verified! 🎨\nCreating your 1980s Retro Vintage Photo right now... please wait ~20 seconds!`
  );

  // 3. Trigger 1980s AI Transformation
  try {
    const aiResult = await AIEditorService.transformTo1980sRetro(order.photoBuffer, order.mimeType);

    // 4. Deliver finished photo back to customer on WhatsApp
    const deliveryCaption = `✨ Here is your 1980s Retro Vintage Portrait! 🎞️\nHope you love your classic look! Share it on Instagram with #1980sRetro!`;

    const targetUrl = aiResult.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
    await WhatsAppService.sendImage(phone, targetUrl, deliveryCaption);

    // 5. Complete Order
    OrderManager.markCompleted(phone, targetUrl);
    console.log(`🎉 [Order #${order.orderId} Completed & Delivered to ${phone}!]`);
  } catch (aiErr) {
    console.error(`❌ AI Generation failed for ${phone}:`, aiErr);
    await WhatsAppService.sendTextMessage(
      phone,
      "⚠️ We encountered a small delay in editing your photo. Our team is generating it and will deliver shortly!"
    );
  }
});

// ==========================================
// 4. Quick Testing Simulator Endpoint
// ==========================================
app.get("/pay-simulate/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const order = OrderManager.markPaid(orderId);

  if (!order) {
    return res.send(`<h2>Order ${orderId} not found or already paid.</h2>`);
  }

  res.send(`<h2>✅ Simulated Payment of ₹10 Successful for Order #${orderId}!</h2><p>Check WhatsApp or server console to see the AI photo being generated and delivered!</p>`);

  // Trigger processing
  try {
    await WhatsAppService.sendTextMessage(
      order.phone,
      `✅ Payment of ₹10 received! 🎨 Generating your 1980s Retro Photo now...`
    );

    const aiResult = await AIEditorService.transformTo1980sRetro(order.photoBuffer, order.mimeType);
    const targetUrl = aiResult.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

    await WhatsAppService.sendImage(
      order.phone,
      targetUrl,
      `✨ Here is your 1980s Retro Vintage Portrait! 🎞️\nOrder #${order.orderId} Completed!`
    );

    OrderManager.markCompleted(order.phone, targetUrl);
  } catch (err) {
    console.error("Simulation error:", err);
  }
});

// ==========================================
// 5. Health Check & Diagnostics
// ==========================================
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "1980s Retro AI Photo Bot",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 1980s Retro Photo Bot Server is running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook URL:  http://localhost:${PORT}/webhook`);
  console.log(`======================================================\n`);
});
