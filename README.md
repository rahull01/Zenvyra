# Zenvyra

AI-Powered Compliance Automation SaaS Platform

## Overview

Zenvyra helps AI startups achieve EU AI Act compliance in minutes — scan AI systems, fix gaps, generate policies, and issue shareable compliance certificates.

### Key Features

- **EU AI Act Scanner**: Free, shareable scanner for AI Act readiness
- **AI System Inventory**: Track high-risk and GPAI models under one roof
- **AI Act Readiness Reports**: Export system cards and assessment summaries
- **Shareable Compliance Badge**: Issue a public certificate/embed for your AI product
- **AI-Powered Policy Generation**: Generate privacy policies, terms of service, and other legal documents
- **Rate-Limited Scanning**: Tier-based per-user and organization limits to prevent abuse
- **OpenAI Resilience & Cost Alerts**: Timeout/retry/fallback + daily spend alerts
- **Team Collaboration**: Multi-user support with role-based access
- **Payment Integration**: Subscription management with Dodo Payments
- **Dashboard Analytics**: Comprehensive compliance scoring and reporting

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2 (Java 21)
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: JWT
- **AI**: OpenAI GPT-4
- **Payments**: Dodo Payments
- **Email**: SMTP/Resend

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Ready for AWS/GCP/Azure

## Quick Start

### Prerequisites

- Java 21
- Node.js 18+
- Docker & Docker Compose
- MongoDB (local or Atlas)
- Redis (local or Cloud)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd Zenvyra
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# Required: OpenAI API key, MongoDB URI, Redis URL
```

### 3. Run with Docker Compose

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 4. Manual Development Setup

#### Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Docs**: http://localhost:8080/swagger-ui.html

## API Documentation

### Authentication
```bash
# Signup
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "fullName": "John Doe",
  "companyName": "Acme Corp"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

### Compliance Scanning
```bash
# Free scan
GET /api/scan/free?url=https://example.com

# Full scan (authenticated)
POST /api/scan/full
{
  "url": "https://example.com",
  "name": "My Website"
}
```

### Policy Generation
```bash
POST /api/policy/generate
{
  "type": "privacy-policy",
  "companyName": "Acme Corp",
  "industry": "Technology",
  "language": "en"
}
```

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Production Setup

1. **Configure Environment**
   - Set production values in `.env`
   - Configure domain and SSL certificates

2. **Database Setup**
   - Create MongoDB Atlas cluster
   - Setup Redis Cloud instance

3. **Build and Deploy**
   ```bash
   docker compose -f docker-compose.yml up -d --build
   ```

4. **SSL & Domain**
   - Configure reverse proxy (nginx/caddy)
   - Setup SSL certificates (Let's Encrypt)

### Cloud Deployment

#### AWS
- **ECS Fargate**: Containerized deployment
- **RDS**: Managed MongoDB
- **ElastiCache**: Redis
- **API Gateway**: API management

#### GCP
- **Cloud Run**: Serverless containers
- **Firestore**: NoSQL database
- **Memorystore**: Redis
- **Cloud Endpoints**: API management

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `OPENAI_COST_ALERT_THRESHOLD_USD` | Daily OpenAI spend alert threshold | No (default 50) |
| `OPENAI_COST_ALERT_RECIPIENT` | Email recipient for OpenAI cost alerts | No (default ops) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `REDIS_URL` | Redis connection URL | Yes |
| `JWT_SECRET` | JWT signing secret (64 chars) | Yes |
| `DODO_API_KEY` | Dodo payment API key | Yes |
| `EMAIL_HOST` | SMTP host | Yes |
| `APP_OPS_ALERT_EMAIL` | Ops alert email address | No (default ops) |
| `SENTRY_DSN` | Backend Sentry DSN | No (optional; Sentry only reports when set) |
| `SENTRY_ENVIRONMENT` | Backend Sentry environment | No (defaults to active Spring profile) |
| `SENTRY_TRACES_SAMPLE_RATE` | Backend Sentry transaction sample rate (0-1) | No (default 0.1) |
| `NEXT_PUBLIC_SENTRY_DSN` | Frontend Sentry DSN | No (optional; Sentry only reports when set) |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Frontend Sentry transaction sample rate (0-1) | No (default 0.1) |

> Sentry is optional across the stack. The backend Spring Boot starter, logback integration, Next.js client/server instrumentation, and error handlers all guard on the DSN being configured; nothing is reported when these variables are left blank.

See `.env.example` for complete configuration.

## Development

### Project Structure

```
Zenvyra/
├── backend/                 # Spring Boot application
│   ├── src/main/java/Zenvyra/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── model/           # Domain models
│   │   ├── dto/             # Data transfer objects
│   │   ├── config/          # Configuration classes
│   │   ├── security/        # Security components
│   │   └── util/            # Utility classes
│   └── src/test/            # Unit tests
├── frontend/                # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
├── shared/                  # Shared types/constants
├── docs/                    # Documentation
└── docker-compose.yml       # Local development
```

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## Security

- JWT-based authentication
- Password encryption (BCrypt)
- Input validation and sanitization
- Strict CORS configuration with explicit methods/headers
- Tier-based per-user and organization rate limiting
- CSRF protection for cookie/session flows
- Security headers (helmet)

## Monitoring

- Health checks: `/api/health`
- Application metrics: Spring Boot Actuator
- Error tracking: Sentry integration
- Logging: SLF4J with Logback

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@zenvyra.com

## Roadmap

- [x] EU AI Act compliance scanning & reports
- [x] Shareable compliance badge/certificate
- [x] OpenAI resilience, rate limiting & cost alerts
- [ ] Product Hunt launch
- [ ] Sentry monitoring
- [ ] MongoDB Atlas backups & restore drill
- [ ] Multi-language document generation
- [ ] Integration APIs (Zapier, Slack)
- [ ] Enterprise SSO
- [ ] White-label solution
- [ ] Compliance audit trails
