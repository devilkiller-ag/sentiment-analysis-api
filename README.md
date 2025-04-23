# Sentiment Analysis Server

This is a sentiment analysis server built using Express Js and Hugging Face's Inference API. It provides an API endpoint to analyze the sentiment of given set of sentences.

## Endpoints

### `POST /input`

**Description**: Store sentences for sentiment analysis.

#### Request Body

```json
{
  "sentences": ["I love working on exciting projects.", "This experience was frustrating and disappointing."],
  "webhook": "https://yourdomain.com/webhook-endpoint" // Optional
}
```

- `sentences`: Array of strings
- `webhook`: _(Optional)_ A public URL where the result will be sent once processed

#### Response

```json
{
  "message": "Sentences received and stored.",
  "count": 2
}
```

---

### `GET /sentiments`

**Description**: Process stored sentences, determine sentiment, and return results. Also sends webhook (if provided earlier).

#### Response

```json
[
  {
    "sentence": "I love working on exciting projects.",
    "sentiment": "POSITIVE"
  },
  {
    "sentence": "This experience was frustrating and disappointing.",
    "sentiment": "NEGATIVE"
  }
]
```

Notes:

- Only processes entries that haven't been analyzed yet (`sentiment = null`)
- If a webhook was provided, results are sent there via `POST`

---

### Webhook Delivery (Optional)

If a webhook URL was provided in `POST /input`, the server will `POST` results to that URL after processing.

#### Webhook Payload

```json
[
  {
    "sentence": "I love working on exciting projects.",
    "sentiment": "POSITIVE"
  },
  {
    "sentence": "This experience was frustrating and disappointing.",
    "sentiment": "NEGATIVE"
  }
]
```

- Sent to the webhook URL as `application/json`
- Happens right after analysis during `GET /sentiments`

## Project Setup

### Prerequisites

- Node.js (v22 or higher recommended)
- npm package manager

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/devilkiller-ag/sentiment-analysis-api.git
   cd sentiment-analysis-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your environment variables:
   ```bash
   # Add your environment variables here
   PORT=8000
   ```

### Development

Run the project in development mode with hot reloading:

```bash
npm run dev
```

### Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the TypeScript project
- `npm run start` - Run the built application in production mode
- `npm run type-check` - Check TypeScript types without emitting files
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if code is formatted according to Prettier

### Production

To deploy to production:

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Code Quality

This project uses:

- TypeScript for type checking
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- lint-staged for running linters on staged files

To ensure your code meets the project standards before committing:

```bash
npm run lint
npm run format:check
```
