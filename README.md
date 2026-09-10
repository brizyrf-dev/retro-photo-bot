# 📸 1980s Retro AI Photo Editing WhatsApp Bot (₹10 Automated Micro-Business)

A 100% autonomous cloud-ready WhatsApp bot that turns ordinary modern selfies into trending **1980s Vintage Analog Film Portraits** (Kodak Portra 35mm grain, vintage flash, retro hair/wardrobe) for **₹10 INR**.

---

## ⚡ How the 100% Autonomous Workflow Works

1. **Traffic:** Customer sees your Instagram Reel / WhatsApp Status / Ad and taps your link (`wa.me/91YOURNUMBER`).
2. **Greeting:** Bot welcomes customer and prompts them to upload their photo.
3. **Payment:** Customer uploads photo; bot instantly generates a dynamic **₹10 UPI QR Code & Tap-to-Pay Link** (GPay / PhonePe / Paytm).
4. **Instant Verification:** Payment gateway / webhook confirms the ₹10 transaction in 1 second.
5. **1980s AI Transformation:** The Google Gemini / Imagen AI pipeline applies the specialized 1980s analog film aesthetic while preserving facial identity.
6. **Delivery:** The finished high-resolution retro photo is delivered back to the customer on WhatsApp automatically!

---

## 📁 Project Structure

```text
retro-photo-bot/
├── .env.example              # Template for API keys & UPI configuration
├── .env                      # Your actual active environment keys
├── package.json              # Dependencies and project scripts
├── src/
│   ├── server.js             # Express Webhook server & endpoints
│   ├── simulator.js          # Terminal simulator to test without live webhooks
│   └── services/
│       ├── aiEditor.js       # 1980s Retro Vintage AI transformation engine
│       ├── orderManager.js   # In-memory customer order state machine
│       ├── payment.js        # Dynamic UPI QR generation & webhook validation
│       └── whatsapp.js       # Meta WhatsApp Cloud API integration
└── README.md                 # Deployment & setup documentation
```

---

## 🚀 How to Deploy 24/7 to the Cloud for FREE (Render.com)

To make sure your bot runs **24/7 without needing your laptop or phone to be on**:

### Step 1: Upload Code to GitHub
1. Create a free GitHub repository at [github.com/new](https://github.com/new).
2. Push this folder to your repository.

### Step 2: Deploy to Render.com (100% Free)
1. Go to [render.com](https://render.com) and log in with GitHub.
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select your GitHub repository.
4. Settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In **Environment Variables**, add:
   - `META_VERIFY_TOKEN`: `retro_photo_secret_token_123`
   - `META_ACCESS_TOKEN`: (Your Meta Cloud API token from developers.facebook.com)
   - `META_PHONE_NUMBER_ID`: (Your Phone Number ID from Meta)
   - `GEMINI_API_KEY`: (Your Google Gemini Key from aistudio.google.com)
   - `UPI_ID`: (Your UPI ID, e.g. `yourname@okaxis`)
   - `UPI_PAYEE_NAME`: `RetroSnap AI`
   - `PRICE_INR`: `10`
6. Click **Deploy Web Service**.
7. Render will give you a live URL: `https://your-bot-name.onrender.com`.

### Step 3: Connect Meta WhatsApp Webhook
1. Go to [developers.facebook.com](https://developers.facebook.com) $\rightarrow$ Your App $\rightarrow$ **WhatsApp** $\rightarrow$ **Configuration**.
2. Click **Edit** on Webhook:
   - **Callback URL:** `https://your-bot-name.onrender.com/webhook`
   - **Verify Token:** `retro_photo_secret_token_123`
3. Click **Verify and Save**.
4. Under **Webhook fields**, click **Manage** $\rightarrow$ Subscribe to `messages`.

**That's it! Your 100% automated money machine is live 24/7 in the cloud!**
