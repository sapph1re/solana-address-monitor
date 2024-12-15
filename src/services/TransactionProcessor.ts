import { 
    TransactionResponse,
    VersionedTransactionResponse,
    PublicKey,
    Message
} from '@solana/web3.js';
import { NormalizedTransaction } from '../types/Transaction';

type SolanaTransaction = TransactionResponse | VersionedTransactionResponse;

export class TransactionProcessor {
    async processTransaction(transaction: SolanaTransaction): Promise<NormalizedTransaction> {
        const normalizedTx: NormalizedTransaction = {
            signature: transaction.transaction.signatures[0],
            timestamp: transaction.blockTime || 0,
            slot: transaction.slot,
            status: transaction.meta?.err ? 'failed' : 'success',
            fee: transaction.meta?.fee || 0,
            rawTransaction: transaction,
        };

        const { sender, receiver, amount } = this.extractTransactionDetails(transaction);
        
        if (sender) normalizedTx.sender = sender;
        if (receiver) normalizedTx.receiver = receiver;
        if (amount) normalizedTx.amount = amount;

        await this.saveTransaction(normalizedTx);

        return normalizedTx;
    }

    private extractTransactionDetails(transaction: SolanaTransaction) {
        let accountKeys: PublicKey[] = [];
        try {
            if ('version' in transaction.transaction) {
                // Versioned transaction
                const message = transaction.transaction.message;
                accountKeys = message.staticAccountKeys || [];
            } else if (transaction.transaction.message) {
                // Legacy transaction
                const message = transaction.transaction.message as Message;
                accountKeys = Array.isArray(message.accountKeys) ? 
                    message.accountKeys.map(key => new PublicKey(key)) : [];
            }
            return {
                sender: accountKeys[0]?.toBase58(),
                receiver: accountKeys[1]?.toBase58(),
                amount: this.extractAmount(transaction),
            };
        } catch (error) {
            console.error('Error extracting transaction details:', error);
            return { sender: undefined, receiver: undefined, amount: undefined };
        }
    }

    private extractAmount(transaction: SolanaTransaction): number | undefined {
        try {
            // Get the amount from transaction metadata if available
            const preBalances = transaction.meta?.preBalances || [];
            const postBalances = transaction.meta?.postBalances || [];
            
            if (preBalances.length >= 2 && postBalances.length >= 2) {
                const balanceChange = postBalances[1] - preBalances[1];
                return balanceChange > 0 ? balanceChange / 1e9 : undefined; // Convert lamports to SOL
            }
        } catch (error) {
            console.error('Error extracting amount:', error);
        }
        return undefined;
    }

    private async saveTransaction(transaction: NormalizedTransaction): Promise<void> {
        // TODO: send for usage downstream, e.g. store in DB
        console.log(
            'Transaction processed:', transaction.signature,
            'status:', transaction.status,
            'amount:', transaction.amount,
            'sender:', transaction.sender,
            'receiver:', transaction.receiver
        );
    }
} 