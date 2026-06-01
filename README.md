# Residential Estimating System

Prototype web app for Zak's Homes & Cottages RTM and site-built estimating, CRM, scheduling, project tasks, proposal output, and contract preview.

## Run Locally

Open `index.html` in a browser, or serve the folder with any simple static web server.

To run the app with the HubSpot webhook API:

```powershell
$env:HUBSPOT_WEBHOOK_SECRET="choose-a-long-random-secret"
npm start
```

Then open `http://127.0.0.1:8000/`.

## HubSpot / WordPress Web Inquiries

The app includes a backend webhook endpoint for website inquiries captured by WordPress and administered through HubSpot.

Endpoint:

```text
POST /api/webhooks/hubspot/inquiry
```

Required security header:

```text
x-webhook-secret: your-shared-secret
```

Supported payload fields:

- `first_name` or `firstname`
- `last_name` or `lastname`
- `email`
- `phone`
- `project_type`
- `message`
- `hubspot_contact_id`, `contact_id`, `vid`, or `hs_object_id`
- `hubspot_deal_id` or `deal_id`
- `submitted_at`, `createdate`, or `created_at`

The endpoint stores web inquiries in `data/web-inquiries.json`, saves the raw HubSpot payload, and prevents duplicates by HubSpot contact ID, email, or phone. Duplicate inquiries update the existing lead and append the new message to its inquiry history.

HubSpot setup:

1. In HubSpot, create a workflow that enrolls contacts or deals created from your WordPress inquiry form.
2. Add a webhook action that sends a `POST` request to your hosted app URL, for example `https://your-app-domain.com/api/webhooks/hubspot/inquiry`.
3. Add the shared secret as the `x-webhook-secret` request header.
4. Map the HubSpot properties into the payload fields listed above.
5. Send a HubSpot test webhook and confirm the response is `201` for a new lead or `200` for an updated duplicate.

Local test example:

```powershell
$body = @{
  firstname = "Taylor"
  lastname = "Smith"
  email = "taylor@example.com"
  phone = "306-555-0100"
  project_type = "RTM"
  message = "I would like pricing for an RTM."
  hs_object_id = "12345"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/api/webhooks/hubspot/inquiry" `
  -ContentType "application/json" `
  -Headers @{ "x-webhook-secret" = $env:HUBSPOT_WEBHOOK_SECRET } `
  -Body $body
```

Run tests:

```powershell
npm test
```

## GitHub Pages

This app is currently static and can be hosted from GitHub Pages. It uses browser storage for prototype data, so data is stored locally in each browser until a real backend is added.

Required files for hosting:

- `index.html`
- `app.js`
- `styles.css`
- `estimate_library_extract.json`
- `assets/zaks-homes-cottages-logo.jpg`

