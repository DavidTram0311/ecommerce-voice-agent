const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const certDir = path.join(__dirname, 'certs');

app.prepare().then(() => {
  // Check if certificates exist
  const keyPath = path.join(certDir, 'localhost-key.pem');
  const certPath = path.join(certDir, 'localhost.pem');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error('\n❌ SSL certificates not found!');
    console.error('\nPlease run the following commands to generate certificates:');
    console.error('\n  mkdir -p certs');
    console.error('  cd certs');
    console.error('  openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:10.10.2.116,IP:127.0.0.1"\n');
    process.exit(1);
  }

  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`\n✅ HTTPS Server ready on https://${hostname}:${port}`);
      console.log(`   Local:            https://localhost:${port}`);
      console.log(`   Network:          https://10.10.2.116:${port}`);
      console.log('\n⚠️  Note: You may see a security warning in your browser.');
      console.log('   Click "Advanced" and "Proceed" to continue.\n');
    });
});
