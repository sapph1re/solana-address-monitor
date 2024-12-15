import { 
    Connection,
    PublicKey,
    TransactionResponse,
    LogsCallback,
    Logs
} from '@solana/web3.js';
import { CONFIG } from '../config';
import { TransactionProcessor } from './TransactionProcessor';

export class BlockchainService {
    private connection: Connection;
    private accountPublicKey: PublicKey;
    private processor: TransactionProcessor;

    constructor() {
        this.connection = new Connection(CONFIG.RPC_ENDPOINT);
        this.accountPublicKey = new PublicKey(CONFIG.ACCOUNT_ADDRESS);
        this.processor = new TransactionProcessor();
    }

    async start() {
        // Start historical data retrieval
        await this.fetchHistoricalTransactions();
        
        // Start real-time monitoring
        this.subscribeToAccount();
    }

    private async fetchHistoricalTransactions(limit: number = 1000) {
        try {
            const signatures = await this.connection.getSignaturesForAddress(
                this.accountPublicKey,
                { limit }
            );
            for (const sigInfo of signatures) {
                await this.processTransaction(sigInfo.signature);
            }
        } catch (error) {
            console.error('Error fetching historical transactions:', error);
        }
    }

    private async processTransaction(signature: string) {
        try {
            const transaction = await this.connection.getTransaction(signature, {
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed'
            });
            if (transaction) {
                await this.processor.processTransaction(transaction as TransactionResponse);
            }
        } catch (error) {
            console.error(`Error processing transaction ${signature}:`, error);
        }
    }

    private subscribeToAccount() {
        const logsCallback: LogsCallback = async (logs: Logs) => {
            if (logs.err) {
                console.error('Transaction failed:', logs);
                return;
            }
            await this.processTransaction(logs.signature);
        };
        this.connection.onLogs(
            this.accountPublicKey,
            logsCallback,
            'confirmed'
        );
    }
} 