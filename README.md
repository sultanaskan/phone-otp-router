# SMSRouter

SMSRouter is a lightweight Express service for receiving, retrieving, and deleting SMS message records. It stores messages in MySQL and does not send SMS itself.

## Requirements

- Node.js 18 or later
- MySQL 5.7+ or a compatible MySQL server
- npm

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the database connection values.
3. Create the configured MySQL database and grant the configured user access.
4. Start with `npm start`; use `npm run dev` during development.

The server authenticates to MySQL and runs Sequelize synchronization before accepting requests. It also removes messages older than five minutes at startup and once per minute. Expired messages are excluded from retrieval immediately, even before physical cleanup.

## Configuration

| Variable | Required | Default | Meaning |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | HTTP listen port |
| `DB_HOST` | Yes | — | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_NAME` | Yes | — | Database name |
| `DB_USER` | Yes | — | Database username |
| `DB_PASSWORD` | Yes | — | Database password |

Keep `.env` local and never commit credentials.

## API

### Health

`GET /health` checks that the service responds and can connect to MySQL. It returns `200` with `{ "status": "ok", "checks": { "server": "ok", "database": "ok" } }` when healthy, or `503` when the database check fails. It does not access stored message contents.

```bash
curl -i https://your-domain.example/health
```

### Save a message

`POST /sms/set` with JSON:

```json
{
  "sender": "+15550001111",
  "receiver": "+15550002222",
  "message": "Your delivery is scheduled for tomorrow"
}
```

All fields are required. A successful request returns `201` and the saved record.

### Retrieve a message

`GET /sms/get?sender=%2B15550001111&receiver=%2B15550002222`

Both query parameters are required. The service checks immediately, then retries every two seconds for up to 30 seconds. It returns the newest matching message created within the last five minutes, or `404` if none is found. Matching currently uses substring matching. On success, all records matching the sender and receiver substring conditions are deleted.

### Delete messages for a receiver

`DELETE /sms/receiver?receiver=...` permanently deletes all records whose receiver exactly matches the supplied number. It returns `200` with `deletedCount`; a missing or blank receiver returns `400`.

```bash
curl -X DELETE 'https://your-domain.example/sms/receiver?receiver=%2B15550002222'
```

This endpoint has no authentication. Keep it on a trusted network or place it behind an access-controlled proxy; do not expose it to untrusted clients or the public internet.

## Project map

- `server.js` — Express setup, route mounting, database startup, and listener.
- `routes/smsRoutes.js` — message API routes.
- `controllers/smsController.js` — validation, polling, persistence, and response behavior.
- `models/SmsMessage.js` — stored message fields (`sender`, `receiver`, `message`, timestamps).
- `services/messageCleanup.js` and `config/messageRetention.js` — five-minute retention and scheduled cleanup.
- `config/database.js` — Sequelize MySQL connection and pool configuration.

## Maintenance notes

- Keep API paths and response shapes documented when they change.
- Clients should use the `/sms` API routes documented above.
- Existing installations keep their current database table mapping so stored records remain available after this application rename.
- Production schema changes should use migrations rather than relying on automatic synchronization.
- No automated test or lint command is currently configured.
- The service has no authentication, SMS delivery integration, rate limiting, or request throttling. Review access controls before public deployment.
