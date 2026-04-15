# rangeWhisperer

A single-screen React app with a large push-to-talk control:

- Hold the center button to capture speech via the browser Web Speech API.
- Release to send the transcript to a local Express backend, which calls Anthropic Claude.
- Read transcript and response on a high-contrast dark UI designed for outdoor visibility.

## Run locally

1. Install Node.js 18+.
2. Install dependencies:
   - `npm install`
3. Create your environment file:
   - `cp .env.example .env`
4. Add your Anthropic key in `.env`:
   - `ANTHROPIC_API_KEY=...`
5. Start backend server:
   - `npm run dev:server`
6. In a second terminal, start frontend:
   - `npm run dev`

## Notes

- Best support for speech recognition is on Chromium-based browsers.
- The browser only calls your local backend (`/api/ask`), and the Anthropic API key stays server-side in `.env`.
