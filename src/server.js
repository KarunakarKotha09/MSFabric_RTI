const express = require('express');
const { EventHubProducerClient } = require('@azure/event-hubs');
const path = require('path');
const QRCode = require('qrcode');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connection string and event hub name from environment variables
const connectionString = process.env.EVENTHUB_CONNECTION_STRING;
const eventHubName = process.env.EVENTHUB_NAME;

// Event Hub client options
const clientOptions = {
    connectionTimeout: 60000,  // 60 seconds
    operationTimeout: 60000    // 60 seconds
};

let producer = null;

// Initialize Event Hub producer
async function initializeEventHubProducer() {
    try {
        if (connectionString && eventHubName) {
            console.log('Attempting to connect to Event Hub...');
            console.log('Event Hub Name:', eventHubName);
            console.log('Creating producer client with SAS authentication...');
            
            // Create the producer using connection string
            producer = new EventHubProducerClient(
                connectionString,
                eventHubName,
                clientOptions
            );
            
            // Verify the connection by creating a test batch
            console.log('Testing Event Hub connection...');
            try {
                const testBatch = await producer.createBatch();
                console.log('Successfully created test batch');
                console.log('Event Hub producer client initialized and tested');
            } catch (batchError) {
                console.error('Failed to create test batch:', batchError);
                producer = null;
            }
        } else {
            console.log('Event Hub configuration missing. Running in test mode.');
        }
    } catch (error) {
        console.error('Failed to initialize Event Hub producer:', error.message);
        producer = null;
        console.log('Running in test mode due to Event Hub connection failure');
    }
}

// Simulated message storage for test mode
const messages = [];

// Initialize the server
async function initializeServer() {
    try {
        await initializeEventHubProducer();
    } catch (error) {
        console.log('Starting server in test mode');
    }

    app.use(express.json());
    app.use(express.static('public'));

    // Serve the main page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Generate QR code
    app.get('/qr', async (req, res) => {
        const url = `${req.protocol}://${req.get('host')}`;
        try {
            const qrCode = await QRCode.toDataURL(url);
            res.json({ qrCode });
        } catch (err) {
            res.status(500).json({ error: 'Failed to generate QR code' });
        }
    });

    // Handle message submission
    app.post('/message', async (req, res) => {
        try {
            console.log('Received message request:', req.body);
            
            const message = {
                text: req.body.message,
                timestamp: new Date().toISOString(),
                tag: 'attendee',
            };

            if (producer) {
                // Try to send to Event Hub
                try {
                    console.log('Creating batch for message:', message);
                    const batch = await producer.createBatch();
                    console.log('Batch created successfully');

                    const addResult = batch.tryAdd({ body: message });
                    if (!addResult) {
                        throw new Error('Message too large to fit in a batch');
                    }
                    console.log('Message added to batch');

                    console.log('Sending batch to Event Hub...');
                    await producer.sendBatch(batch);
                    console.log('Message sent successfully to Event Hub');
                } catch (err) {
                    console.error('Failed to send to Event Hub, storing locally:', err.message);
                    messages.push(message);
                }
            } else {
                // Store message locally in test mode
                console.log('Running in test mode, storing message locally');
                messages.push(message);
            }

            res.json({ 
                success: true,
                mode: producer ? 'event-hub' : 'test',
                messagesStored: messages.length
            });
        } catch (err) {
            console.error('Error processing message:', err);
            res.status(500).json({ 
                error: 'Failed to process message',
                details: err.message,
                mode: producer ? 'event-hub' : 'test'
            });
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Mode: ${producer ? 'Event Hub' : 'Test (Local Storage)'}`);
    });
}

// Start the server
initializeServer();