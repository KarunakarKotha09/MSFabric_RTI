# Deployment & Run Guide — MSFabric_RTI (KK_RTI_POC)

This guide explains how to run the Real Time Intelligence POC locally and deploy to Azure App Service using GitHub Actions. It also includes brief notes about MS Fabric/ACR deployment options.

Prerequisites
- Node.js 18+
- Azure subscription
- GitHub repo: https://github.com/KarunakarKotha09/MSFabric_RTI

1) Run locally

```powershell
cd C:\KK_ACE\KK_Projects\my-web-app\KK_RTI_POC
copy .env.example .env
# Edit .env to set EVENTHUB_CONNECTION_STRING and EVENTHUB_NAME
npm ci
npm start
# Visit http://localhost:3000
```

2) GitHub Actions deploy (App Service)

- Workflow: `.github/workflows/deploy-azure.yml` (runs on push to `main`)
- Add repository secrets:
  - `AZURE_WEBAPP_NAME` — your app name
  - `AZURE_WEBAPP_PUBLISH_PROFILE` — contents of publish profile XML

3) Alternative: Build Docker image and push to ACR, then deploy to Azure App Service or MS Fabric

- Build and push:

```powershell
docker build -t <registry>.azurecr.io/msfabric-rti:latest .
docker push <registry>.azurecr.io/msfabric-rti:latest
```

- Deploy from ACR to App Service or create an MS Fabric deployment (this requires additional IaC and Fabric-specific steps).

4) Post-deploy
- Configure App Settings in Azure Portal: `EVENTHUB_CONNECTION_STRING`, `EVENTHUB_NAME`.
- Monitor logs in Azure Portal → Log Stream, or via GitHub Actions deployment logs.

5) Security
- Keep `.env` out of git; use Azure Key Vault for production secrets.
