# SSL Certificate Configuration

Before using the Nginx production profile, add SSL certificates here:

1. Generate Let's Encrypt certificates:
   ```
   docker run --rm -v $(pwd)/nginx/ssl:/etc/letsencrypt -p 80:80 certbot/certbot certonly --standalone -d your-domain.com -d www.your-domain.com
   ```

2. Or place your existing certificates:
   - `cert.pem` - SSL certificate
   - `key.pem` - SSL private key

3. Uncomment the SSL directives in `nginx/nginx.conf` and update paths if needed.

4. Start with production profile:
   ```
   docker compose --profile production up -d
   ```

Note: The certificates are gitignored via the `.gitignore` pattern `*.pem`, `*.key`, `*.crt`, `*.p12`, `*.pfx`.

For development without SSL:
   - Use HTTP without Nginx: `docker compose up -d`
   - The backend and frontend containers connect directly without encryption
