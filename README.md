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

## CI / Auto-deploy via GitHub Actions

This repository includes a GitHub Actions workflow that can deploy to Azure App Service automatically on push to `main`. The workflow file is located at `.github/workflows/deploy-azure.yml`.

Steps to enable auto-deploy:

1. In the Azure Portal, go to your Web App → Overview → **Get publish profile** and download the `.PublishSettings` file.
2. In your GitHub repo, go to **Settings → Secrets and variables → Actions** and add two repository secrets:
   - `AZURE_WEBAPP_NAME` — the name of your Web App
   - `AZURE_WEBAPP_PUBLISH_PROFILE` — the full contents of the publish profile file (open the file and copy the XML)
3. Push to `main` — the workflow `.github/workflows/deploy-azure.yml` will run, build, and deploy your app.

Note: You can also use `AZURE_CREDENTIALS` (service principal JSON) instead of a publish profile; update the workflow accordingly.
