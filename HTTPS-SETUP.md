# HTTPS Setup for Local Development

## Why HTTPS?

The voice agent requires microphone access, which browsers only allow over HTTPS (or localhost). Since you're accessing the app via your network IP (`10.10.2.116`), you need HTTPS enabled.

## Quick Setup

### Step 1: Generate SSL Certificates

Run the setup script:

```bash
./setup-https.sh
```

Or manually:

```bash
mkdir -p certs
cd certs
openssl req -x509 -newkey rsa:4096 \
  -keyout localhost-key.pem \
  -out localhost.pem \
  -days 365 \
  -nodes \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:10.10.2.116,IP:127.0.0.1"
cd ..
```

### Step 2: Start the HTTPS Server

```bash
npm run dev:https
```

### Step 3: Access the App

Open your browser and navigate to:
- **Local:** `https://localhost:3001`
- **Network:** `https://10.10.2.116:3001`

### Step 4: Accept the Security Warning

Since this is a self-signed certificate, your browser will show a security warning:

1. Click **"Advanced"** or **"Show Details"**
2. Click **"Proceed to localhost (unsafe)"** or **"Accept the Risk and Continue"**
3. The app will now load with HTTPS enabled

## Troubleshooting

### Certificate Not Found Error

If you see an error about missing certificates, make sure you ran the setup script:

```bash
./setup-https.sh
```

### Browser Still Shows Security Warning

This is normal for self-signed certificates. You need to manually accept the warning each time you:
- Clear your browser cache
- Use a different browser
- The certificate expires (after 365 days)

### Microphone Still Not Working

1. Make sure you're accessing via `https://` (not `http://`)
2. Check that your browser has microphone permissions enabled
3. Verify no other app is using the microphone

## Alternative: Use Localhost

If you don't want to set up HTTPS, you can access the app via:

```
http://localhost:3001
```

**Note:** This only works on the same machine where the dev server is running.

## Regular Development (HTTP)

For regular development without voice features, you can still use:

```bash
npm run dev
```

This runs on `http://localhost:3001` without HTTPS.
