# Azure Event Hub Demo Web Application

This web application demonstrates real-time event ingestion using Azure Event Hubs. It includes a web interface for submitting messages and a load tester for generating high-volume test traffic.

## Features

- Web interface for submitting messages to Azure Event Hub
- QR code generation for easy access to the web interface
- Message tagging to distinguish between attendee messages and load test data
- Load tester that generates multiple events per second

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the following variables in `.env`:
     - `EVENTHUB_CONNECTION_STRING`: Your Azure Event Hub connection string
     - `EVENTHUB_NAME`: Your Event Hub name
     - `PORT`: The port to run the web server on (default: 3000)

## Running the Application

1. Start the web server:
   ```bash
   npm start
   ```

2. Run the load tester (in a separate terminal):
   ```bash
   node src/loadTester.js
   ```

3. Access the web interface at `http://localhost:3000`

## Message Tags

- Attendee messages are tagged with `attendee`
- Load test messages are tagged with `loadtest`

Use these tags to filter messages in your Event Hub consumer applications.