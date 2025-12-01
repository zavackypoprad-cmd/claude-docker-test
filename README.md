# Claude Docker Test

Testovací projekt demonstrující Docker, Node.js, PostgreSQL a GitHub CLI workflow.

## Požadavky

- Node.js 20+ (`node --version`)
- Docker a Docker Compose (`docker --version`)
- GitHub CLI (`gh --version`)

## Instalace

1. **Klonovat repozitář**
   ```bash
   git clone https://github.com/zavackypoprad-cmd/claude-docker-test.git
   cd claude-docker-test
   ```

2. **Spustit PostgreSQL**
   ```bash
   docker compose up -d
   ```

3. **Instalovat závislosti**
   ```bash
   npm install
   ```

## Spuštění

```bash
npm run dev
```

Server běží na `http://localhost:3000`

## API Endpointy

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "service": "claude-docker-test"
}
```

### GET /api/test
Test databázového připojení

**Response:**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "data": {
    "current_time": "2025-12-01 10:00:00",
    "pg_version": "PostgreSQL 16.x..."
  }
}
```

## Testování

```bash
# Health check
curl http://localhost:3000/health

# Database test
curl http://localhost:3000/api/test
```

## Docker příkazy

```bash
# Spustit služby
docker compose up -d

# Zastavit služby
docker compose down

# Zobrazit logy
docker compose logs -f postgres

# Přístup do PostgreSQL CLI
docker compose exec postgres psql -U testuser -d testdb
```

## Troubleshooting

Viz [CLAUDE.MD](./CLAUDE.MD) pro detailní troubleshooting.

## Licence

MIT
