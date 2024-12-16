# ID Processing Service

A Node.js service that processes IDs using Bull queue and Redis.

## Features
- Queue-based ID processing
- Redis-backed caching system
- Pub/Sub notification system
- Docker deployment

## Requirements
- Docker
- Docker Compose

## Installation & Running

1. Clone the repository
2. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Usage

Send a POST request to `/process-ids` with a JSON body:

json
{
"ids": [12345, 67890]
}

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```