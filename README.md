# 📝 TODO App - Full-Stack Application

> Moderní TODO aplikace postavená na Docker, Node.js, PostgreSQL a Tailwind CSS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Rychlý Start

```bash
# 1. Spustit PostgreSQL
docker compose up -d

# 2. Instalovat závislosti
npm install

# 3. Spustit aplikaci
npm run dev

# 4. Otevřít v prohlížeči
open http://localhost:3000
```

## 📋 Požadavky

- Node.js 20+ (`node --version`)
- Docker a Docker Compose (`docker --version`)
- GitHub CLI (`gh --version`)

## 🎯 Features

- ✅ Vytvářet, upravovat a mazat úkoly
- ✅ Označovat úkoly jako hotové
- ✅ Realtime statistiky (celkem, aktivní, hotové)
- ✅ Responzivní design (mobile-first)
- ✅ Moderní UI s Tailwind CSS
- ✅ PostgreSQL databáze s migrations
- ✅ REST API s validací
- ✅ Error handling a loading states

## 🏗️ Tech Stack

- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 16 (Docker)
- **Tools**: Docker Compose, GitHub CLI

## 📦 Instalace

### Klonování repozitáře
```bash
git clone https://github.com/zavackypoprad-cmd/claude-docker-test.git
cd claude-docker-test
```

### Setup databáze
```bash
# Spustit PostgreSQL (migrations se spustí automaticky)
docker compose up -d

# Ověřit, že kontejner běží
docker compose ps
```

### Instalace dependencies
```bash
npm install
```

## 🎮 Použití

### Spuštění aplikace

```bash
# Development mode s auto-reload
npm run dev

# Production mode
npm start
```

Aplikace běží na **http://localhost:3000**

### Správa databáze

```bash
# Přístup do PostgreSQL CLI
docker compose exec postgres psql -U testuser -d testdb

# Zobrazit všechny todos
SELECT * FROM todos ORDER BY created_at DESC;

# Reset databáze (smaže všechna data!)
docker compose down -v
docker compose up -d
```

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### GET /api/todos
Vrátí všechny todos seřazené podle data vytvoření (nejnovější první).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Můj první úkol",
      "completed": false,
      "created_at": "2025-12-01T22:00:00.000Z"
    }
  ]
}
```

#### POST /api/todos
Vytvoří nový todo.

**Request:**
```json
{
  "title": "Nový úkol"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Todo created successfully",
  "data": {
    "id": 1,
    "title": "Nový úkol",
    "completed": false,
    "created_at": "2025-12-01T22:00:00.000Z"
  }
}
```

**Validation:**
- `title` je povinný
- `title` nesmí být prázdný
- `title` max 255 znaků

#### PATCH /api/todos/:id
Přepne completed status (toggle).

**Response:**
```json
{
  "status": "success",
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "title": "Můj úkol",
    "completed": true,
    "created_at": "2025-12-01T22:00:00.000Z"
  }
}
```

#### DELETE /api/todos/:id
Smaže todo.

**Response:**
```json
{
  "status": "success",
  "message": "Todo deleted successfully",
  "data": {
    "id": 1,
    "title": "Smazaný úkol",
    "completed": false,
    "created_at": "2025-12-01T22:00:00.000Z"
  }
}
```

### Error Responses

```json
{
  "status": "error",
  "message": "Error description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testování

### API Testing s curl

```bash
# Health check
curl http://localhost:3000/health

# Získat všechny todos
curl http://localhost:3000/api/todos

# Vytvořit nový todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test úkol z API"}'

# Přepnout completed status
curl -X PATCH http://localhost:3000/api/todos/1

# Smazat todo
curl -X DELETE http://localhost:3000/api/todos/1
```

### Frontend Testing

1. Otevřít http://localhost:3000
2. Přidat nový úkol pomocí formuláře
3. Kliknout na checkbox pro označení jako hotový
4. Kliknout na "Smazat" pro odstranění
5. Zkontrolovat statistiky v horní liště

## 📁 Struktura Projektu

```
claude-docker-test/
├── migrations/              # Database migrations
│   └── 001_create_todos.sql
├── public/                  # Frontend files
│   ├── index.html          # Main UI
│   └── app.js              # JavaScript logic
├── docker-compose.yml       # PostgreSQL container
├── package.json            # Node.js dependencies
├── server.js               # Express API server
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── CLAUDE.MD               # Developer documentation
└── README.md               # This file
```

## 🐳 Docker Commands

```bash
# Spustit služby
docker compose up -d

# Zastavit služby
docker compose down

# Zastavit a smazat volumes (reset DB)
docker compose down -v

# Zobrazit logy
docker compose logs -f postgres

# Zobrazit běžící kontejnery
docker compose ps

# Restartovat PostgreSQL
docker compose restart postgres
```

## 🔧 Environment Variables

Zkopírujte `.env.example` na `.env` a upravte podle potřeby:

```env
# PostgreSQL
POSTGRES_USER=testuser
POSTGRES_PASSWORD=testpass
POSTGRES_DB=testdb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Server
PORT=3000
NODE_ENV=development
```

## 🛠️ Troubleshooting

### Port už je používán

```bash
# Zjistit, co běží na portu 3000
sudo lsof -i :3000

# Nebo na portu 5432
sudo lsof -i :5432
```

### PostgreSQL se nespustí

```bash
# Zkontrolovat logy
docker compose logs postgres

# Zkusit restart
docker compose restart postgres

# Nebo reset
docker compose down -v
docker compose up -d
```

### Migrations se nespustily

Migrations se spustí pouze při prvním vytvoření databáze. Pro reset:

```bash
docker compose down -v
docker compose up -d
```

### Frontend se nenačte

Zkontrolujte, že:
1. Server běží (`npm run dev`)
2. Složka `public/` existuje
3. Žádná firewall neblokuje port 3000

## 📝 Licence

MIT - viz [LICENSE](LICENSE)

## 👨‍💻 Autor

**Marek Závacký**

## 🔗 Odkazy

- GitHub Repository: https://github.com/zavackypoprad-cmd/claude-docker-test
- Live Demo: http://localhost:3000 (po spuštění)

## 📚 Další Dokumentace

Pro detailní technickou dokumentaci viz [CLAUDE.MD](./CLAUDE.MD)

---

**Vytvořeno s Claude Code** 🤖
