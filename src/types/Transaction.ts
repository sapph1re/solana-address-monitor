export interface NormalizedTransaction {
    signature: string;
    timestamp: number;
    slot: number;
    status: 'success' | 'failed';
    amount?: number;
    fee: number;
    sender?: string;
    receiver?: string;
    rawTransaction: any;
} 