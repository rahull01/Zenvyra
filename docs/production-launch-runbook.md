# Production Launch Runbook

## Pre-Launch Checklist
1. Verify all env variables are set in `.env`
2. Run `mvn -DskipTests compile` on backend
3. Run `npm run build` on frontend
4. Verify all tests pass: `mvn test`, `npm test`, `npm run build`
5. Check CORS origins, CSRF config, rate limits, webhooks
6. Review public endpoint payload limits
7. Ensure no secrets are logged
8. Verify SSRF protections cover redirects
9. Confirm CSP and security headers are correct
10. Verify Sentry DSN is configured

## Launch Steps
1. Set `SPRING_PROFILES_ACTIVE=prod` and all production env vars
2. Start backend with `java -jar backend.jar`
3. Start frontend with `npm run start`
4. Verify health endpoints: `/health`, `/health/ready`
5. Monitor logs for any errors
6. Verify rate limits are working
7. Check webhook signature verification
8. Test checkout flow end-to-end
9. Verify subscription webhook handling
10. Confirm cancellation flow works

## Rollback Plan
1. Keep previous version of backend and frontend
2. If issues, revert to previous version
3. Update DNS if needed
4. Notify users of maintenance