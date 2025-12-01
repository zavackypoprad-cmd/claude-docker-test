# Claude Docker Test - Full-Stack TODO Application

## Popis
Full-stack TODO aplikace demonstrující integraci Docker, Node.js, PostgreSQL, Express.js a moderního frontendu s Tailwind CSS.

## Tech Stack
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL 16 (Docker container)
- **Backend**: Express.js + REST API
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Tools**: GitHub CLI, Docker Compose

## Architektura

### Backend (server.js)
- Node.js Express server běží lokálně (port 3000)
- PostgreSQL 16 běží v Docker containeru (port 5432)
- REST API endpointy pro CRUD operace
- CORS middleware pro cross-origin requests
- Express.static middleware pro serving frontendu

### Database (PostgreSQL)
- Tabulka `todos`:
  - `id` - SERIAL PRIMARY KEY
  - `title` - VARCHAR(255) NOT NULL
  - `completed` - BOOLEAN DEFAULT false
  - `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- Automatické migrations při startu přes `/docker-entrypoint-initdb.d`

### Frontend (public/)
- **index.html**: Moderní UI s Tailwind CSS
- **app.js**: Vanilla JavaScript aplikace
- Responzivní design (mobile-first)
- Realtime updates bez refreshe stránky
- Loading states a error handling

## Struktura Projektu

```
claude-docker-test/
├── migrations/
│   └── 001_create_todos.sql    # Database schema
├── public/
│   ├── index.html               # Frontend UI
│   └── app.js                   # Frontend logic
├── docker-compose.yml           # PostgreSQL container
├── package.json                 # Node.js dependencies
├── server.js                    # Express API server
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── CLAUDE.MD                    # This file
└── README.md                    # User documentation
```

## API Endpointy

### Health & Test
- `GET /health` - Server health check
- `GET /api/test` - Database connection test

### TODO CRUD Operations
- `GET /api/todos` - Vrátí všechny todos (seřazené DESC)
- `POST /api/todos` - Vytvoří nový todo
  - Body: `{ "title": "text" }`
- `PATCH /api/todos/:id` - Přepne completed status
- `DELETE /api/todos/:id` - Smaže todo

### Response Format
```json
{
  "status": "success" | "error",
  "message": "Human readable message",
  "data": { ... }
}
```

## Jak spustit

### 1. Spustit PostgreSQL s migrations
```bash
docker compose up -d
```
Migrations se spustí automaticky při prvním startu.

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spustit server
```bash
npm run dev
```

### 4. Otevřít aplikaci
Otevřete browser na: **http://localhost:3000**

## Příkazy

### Docker
- `docker compose up -d` - spustit PostgreSQL na pozadí
- `docker compose down` - zastavit a odstranit kontejnery
- `docker compose down -v` - odstranit i volumes (reset databáze)
- `docker compose logs postgres` - zobrazit logy PostgreSQL
- `docker compose ps` - zobrazit stav kontejnerů

### Node.js
- `npm run dev` - spustit v dev režimu s nodemon
- `npm start` - spustit normálně

### Database
```bash
# Přímý přístup do PostgreSQL
docker compose exec postgres psql -U testuser -d testdb

# Zobrazit všechny todos
SELECT * FROM todos ORDER BY created_at DESC;

# Reset databáze
docker compose down -v
docker compose up -d
```

## Vlastnosti Aplikace

### Frontend Features
- ✅ Přidávání nových úkolů
- ✅ Označování úkolů jako hotové/nehotové
- ✅ Mazání úkolů
- ✅ Realtime statistiky (celkem, aktivní, hotové)
- ✅ Responzivní design
- ✅ Loading states
- ✅ Error handling
- ✅ Úspěšné zprávy
- ✅ Empty state když nejsou žádné úkoly
- ✅ Časové značky s relativním formátem

### Backend Features
- ✅ REST API s validací
- ✅ CORS podpora
- ✅ Error handling (400, 404, 500)
- ✅ SQL injection prevence (prepared statements)
- ✅ Automatic database migrations
- ✅ Health checks

### Security
- ✅ XSS prevence (HTML escaping)
- ✅ SQL injection prevence
- ✅ Input validace (title max 255 chars)
- ✅ CORS konfigurace

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

### Database migrations se nespustily
```bash
# Reset databáze a znovu spustit
docker compose down -v
docker compose up -d
```

### Frontend se nenačte
```bash
# Zkontrolovat, že public/ složka existuje
ls -la public/

# Zkontrolovat server logy
npm run dev
```

## Vývoj

### Přidání nové migrace
1. Vytvoř soubor `migrations/002_description.sql`
2. Zastavit a smazat volume: `docker compose down -v`
3. Spustit znovu: `docker compose up -d`

### Změna databázové struktury
Pozor: Migrations se spustí pouze při prvním startu. Pro změny je třeba:
- Buď resetovat volume (`docker compose down -v`)
- Nebo přidat novou migraci s ALTER TABLE

### Hot Reload
- Backend: nodemon automaticky restartuje při změnách
- Frontend: refresh browser stránky
- Database: není potřeba restart

## Testing

### API Testing
```bash
# Health check
curl http://localhost:3000/health

# Database test
curl http://localhost:3000/api/test

# Get todos
curl http://localhost:3000/api/todos

# Create todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test úkol"}'

# Toggle completed
curl -X PATCH http://localhost:3000/api/todos/1

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1
```

### Browser Testing
1. Otevřít http://localhost:3000
2. Přidat nový úkol
3. Označit úkol jako hotový
4. Smazat úkol
5. Zkontrolovat statistiky

## Performance

- Database: Indexy na `created_at` pro rychlejší řazení
- Frontend: Vanilla JS bez frameworku overhead
- API: Connection pooling pro PostgreSQL
- Static files: Served přímo přes Express

## Budoucí Vylepšení

- [ ] Přidat filtrování (all/active/completed)
- [ ] Přidat řazení (date/title/status)
- [ ] Přidat kategorii/tags
- [ ] Přidat due date
- [ ] Přidat priority
- [ ] Přidat drag & drop
- [ ] Přidat dark mode
- [ ] Přidat export/import
- [ ] Přidat search
- [ ] Přidat pagination

## Licence

MIT
