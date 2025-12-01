# Claude Docker Test Project

## Popis
Testovací projekt demonstrující integraci Docker, Node.js a PostgreSQL s GitHub CLI.

## Tech Stack
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL 16 (Docker container)
- **Framework**: Express.js
- **Tools**: GitHub CLI, Docker Compose

## Architektura
- Node.js server běží lokálně (port 3000)
- PostgreSQL běží v Docker containeru (port 5432)
- Server se připojuje k PostgreSQL přes localhost:5432

## Jak spustit

### 1. Spustit PostgreSQL
```bash
docker compose up -d
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spustit server
```bash
npm run dev
```

### 4. Test endpointů
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/test
```

## Příkazy

### Docker
- `docker compose up -d` - spustit PostgreSQL na pozadí
- `docker compose down` - zastavit a odstranit kontejnery
- `docker compose logs postgres` - zobrazit logy PostgreSQL
- `docker compose ps` - zobrazit stav kontejnerů

### Node.js
- `npm run dev` - spustit v dev režimu s nodemon
- `npm start` - spustit normálně

## Troubleshooting

### PostgreSQL se nepřipojí
```bash
# Zkontrolovat, zda běží
docker compose ps

# Zkontrolovat logy
docker compose logs postgres

# Restartovat
docker compose restart postgres
```

### Port již používán
```bash
# Zjistit, co běží na portu 5432
sudo lsof -i :5432

# Nebo na portu 3000
sudo lsof -i :3000
```
