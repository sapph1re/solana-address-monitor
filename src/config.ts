import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RPC_ENDPOINT) {
    throw new Error('RPC_ENDPOINT is required in environment variables');
}

if (!process.env.ACCOUNT_ADDRESS) {
    throw new Error('ACCOUNT_ADDRESS is required in environment variables');
}

export const CONFIG = {
    ACCOUNT_ADDRESS: process.env.ACCOUNT_ADDRESS,
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
} as const;
