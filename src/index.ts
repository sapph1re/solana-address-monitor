import { BlockchainService } from './services/BlockchainService';

async function main() {
    const service = new BlockchainService();
    
    try {
        await service.start();
        console.log('Blockchain service started successfully');
    } catch (error) {
        console.error('Failed to start blockchain service:', error);
        process.exit(1);
    }
}

main(); 