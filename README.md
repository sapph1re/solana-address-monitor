# Solana Address Monitor

Real-time and historical transaction monitoring service for Solana.

## Prerequisites
- Node.js (v16+)
- Yarn
- Solana RPC endpoint (e.g., Helius API key)

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    yarn install
    ```
3. Build the project:
    ```bash
    yarn build
    ```
4. Set up your Solana RPC endpoint (e.g., Helius API key)
5. Run the service:
    ```bash
    ACCOUNT_ADDRESS=YOUR_ACCOUNT_ADDRESS RPC_ENDPOINT=YOUR_RPC_ENDPOINT yarn start
    ```

## One-Command Start
```bash
ACCOUNT_ADDRESS=YOUR_ACCOUNT_ADDRESS RPC_ENDPOINT=YOUR_RPC_ENDPOINT yarn start:fresh
```

This command will:
1. Install dependencies
2. Build the project
3. Start the service

## Tech Stack
- TypeScript
- @solana/web3.js
- Node.js
- Helius RPC

## Architecture
- BlockchainService is the entry point for the service. It subscribes to the account and processes transactions.
- TransactionProcessor processes transactions and extracts relevant information.

## Considerations
- We should account for websocket disconnections by implementing a reconnection logic, and by storing the last processed slot to make sure we don't miss any transactions
- We should check for RPC errors and implement a retry logic there too, with backoff in case of rate limiting
- We may have to make sure txs are processed in the right order, by looking at the slot
- We may want to check for duplicates
- For potentially large number of txs, we should consider:
    - Pagination for fetching historical txs
    - Separate service to process txs

