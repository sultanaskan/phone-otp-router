# Agent instructions

## Project purpose
This repository is a small Express 5 service that stores OTP message records in MySQL using Sequelize. It does not generate OTPs or send SMS. Read `README.md` for setup, API contract, and known limitations before making changes.

## Runtime map
- `server.js`: Express initialization, JSON parser, `/otp` route mount, DB authentication/sync, and HTTP listener.
- `routes/otpRoutes.js`: `GET /otp/get`, `POST /otp/set`, and `DELETE /otp/receiver` route wiring.
- `controllers/otpController.js`: validation, DB operations, 30-second polling, matching, deletion, and responses.
- `models/Otp.js`: OTP table definition and timestamps.
- `config/database.js`: MySQL Sequelize configuration from environment variables.
- `models/Sender.js` and `models/Receiver.js` are not imported by the current runtime.

## Change guidance
- Preserve existing API paths, required fields, status codes, and response shapes unless the task explicitly calls for a behavior change. Update `README.md` when the contract changes.
- Be careful with matching/deletion semantics: retrieval currently uses substring `LIKE` matches and deletes every row matching the same sender/receiver conditions. Any change needs deliberate compatibility consideration.
- Do not log OTP message contents, phone numbers, passwords, connection strings, or other secrets. Do not read, print, or commit `.env`; use `.env.example` for configuration documentation.
- Do not add credentials, real phone numbers, or live OTP values to fixtures, docs, or examples.
- The receiver-wide delete endpoint is destructive and currently unauthenticated. Do not expose it to untrusted networks; call out this exposure if deployment context makes it relevant.
- Keep database schema changes explicit. Production schema changes should use migrations; do not casually enable destructive synchronization or alter existing rows.
- Keep validation aligned with the current API and avoid returning internal stack traces or database details to clients.
- Avoid adding dependencies for functionality available in Node.js or existing dependencies. Update `package-lock.json` whenever dependencies are intentionally changed.
- Keep changes focused. Call out missing tests, migrations, security controls, or operational configuration relevant to the change.

## Validation
There is currently no test or lint script. For code changes, use relevant existing checks where available and report exactly what was run. Do not claim tests passed if none were run. `npm start` requires a configured, reachable MySQL database; do not run it as a validation step unless such a database is intentionally available.
