const { EventHubProducerClient } = require('@azure/event-hubs');
require('dotenv').config();

const connectionString = process.env.EVENTHUB_CONNECTION_STRING;
const eventHubName = process.env.EVENTHUB_NAME;
const eventsPerSecond = 100; // Adjust this value as needed

async function sendTestEvents() {
    const producer = new EventHubProducerClient(connectionString, eventHubName);

    try {
        setInterval(async () => {
            const batch = await producer.createBatch();
            
            const message = {
                text: `Test message ${Date.now()}`,
                timestamp: new Date().toISOString(),
                tag: 'loadtest'
            };

            batch.tryAdd({ body: message });
            await producer.sendBatch(batch);
            console.log('Test message sent');
        }, 1000 / eventsPerSecond);
    } catch (err) {
        console.error('Error in load tester:', err);
        await producer.close();
    }
}

console.log('Starting load tester...');
sendTestEvents().catch(console.error);