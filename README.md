# FCC Quality Assurance — Sudoku Solver

Express API that validates, places digits into, and solves 9×9 sudoku puzzles, built for the FreeCodeCamp Quality Assurance certification.

## Features

- `POST /api/solve` — accepts an 81-character puzzle string and returns the solved puzzle or an error
- `POST /api/check` — validates whether a digit can be placed at a given coordinate without conflicts in row, column, or 3×3 region
- Returns structured conflict arrays (`row`, `column`, `region`) when placement is invalid
- Rejects puzzles with invalid characters, wrong length, or unsolvable configurations
- Unit tests cover validation, placement checks, and the solver algorithm
- Functional tests cover all endpoint cases including invalid inputs via `chai-http`

## Tech Stack

- Node.js
- Express
- Babel
- Chai / Mocha

## Requirements

- Node.js 16+
- Yarn 1.x or npm 8+

## Installation

```bash
yarn install
```

## Environment Variables

- `PORT` — server port (defaults to `3000`)
- `NODE_ENV` — `development` | `test` | `production`

## Usage

```bash
yarn start
```

Server listens on `http://localhost:3000`.

## Testing

```bash
NODE_ENV=test yarn start
```

## API

- `POST /api/solve` — body: `{ puzzle }` — returns `{ solution }` or `{ error }`
- `POST /api/check` — body: `{ puzzle, coordinate, value }` — returns `{ valid }` or `{ valid, conflict }`

## Project Structure

```
.
├── controllers/
├── routes/
├── tests/
├── public/
├── views/
├── server.js
└── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
