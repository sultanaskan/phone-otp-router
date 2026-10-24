# Agent instructions

## Project purpose
SMSRouter is a small Express service that stores SMS message records in MySQL using Sequelize. It does not send SMS. Read `README.md` for setup, API behavior, retention, and known limitations before making changes.

## Runtime map
- `server.js`: Express initialization, `/health` and `/sms` route mounting, database startup/sync, cleanup startup, and HTTP listener.
- `routes/smsRoutes.js`: message retrieval, save, and receiver-wide delete routes.
- `controllers/smsController.js`: validation, DB operations, polling, matching, deletion, and responses.
- `models/SmsMessage.js`: stored message fields and timestamps.
- `services/messageCleanup.js` and `config/messageRetention.js`: five-minute retention and periodic cleanup.
- `config/database.js`: MySQL Sequelize configuration from environment variables.

## Change guidance
- Preserve existing API paths, required fields, status codes, and response shapes unless the task explicitly calls for a behavior change. Update `README.md` when the contract changes.
- Message retrieval currently uses substring matching and deletes every row matching those sender/receiver conditions. Treat changes to this behavior as compatibility-sensitive.
- Messages expire five minutes after `createdAt`; retrieval must exclude expired records even if scheduled cleanup has not run yet.
- The receiver-wide delete endpoint is destructive and unauthenticated. Do not expose it to untrusted networks; call out this exposure if deployment context makes it relevant.
- Do not log message contents, phone numbers, passwords, connection strings, or other secrets. Do not read, print, or commit `.env`; use `.env.example` for configuration documentation.
- Do not add credentials, real phone numbers, or private message contents to fixtures or docs.
- Keep database schema changes explicit. Production schema changes should use migrations; do not casually enable destructive synchronization or alter existing rows.
- Keep validation aligned with the API and avoid returning internal stack traces or database details to clients.
- Avoid unnecessary dependencies. Update `package-lock.json` whenever dependencies are intentionally changed.
- Keep changes focused. Call out missing tests, migrations, security controls, or operational configuration relevant to the change.

## Validation
There is currently no test or lint script. For code changes, use relevant existing checks where available and report exactly what was run. Do not claim tests passed if none were run. `npm start` requires a configured, reachable MySQL database; do not run it unless such a database is intentionally available.
