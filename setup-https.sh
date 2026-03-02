#!/bin/bash

echo "🔐 Setting up HTTPS for local development..."
echo ""

# Create certs directory if it doesn't exist
mkdir -p certs

# Generate self-signed certificate
echo "📝 Generating self-signed SSL certificate..."
openssl req -x509 -newkey rsa:4096 \
  -keyout certs/localhost-key.pem \
  -out certs/localhost.pem \
  -days 365 \
  -nodes \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:10.10.2.116,IP:127.0.0.1"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SSL certificates generated successfully!"
  echo ""
  echo "📁 Certificates saved to:"
  echo "   - certs/localhost-key.pem (private key)"
  echo "   - certs/localhost.pem (certificate)"
  echo ""
  echo "🚀 You can now run: npm run dev:https"
  echo ""
  echo "⚠️  Important:"
  echo "   - Your browser will show a security warning"
  echo "   - Click 'Advanced' and 'Proceed to localhost (unsafe)'"
  echo "   - This is normal for self-signed certificates"
  echo ""
else
  echo ""
  echo "❌ Failed to generate certificates"
  echo "Please make sure OpenSSL is installed on your system"
  exit 1
fi
