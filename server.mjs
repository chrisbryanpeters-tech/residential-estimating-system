import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  port: Number(process.env.PORT || 8000),
  webhookSecret: process.env.HUBSPOT_WEBHOOK_SECRET || "",
  dataDir: process.env.APP_DATA_DIR || path.join(__dirname, "data"),
  publicDir: __dirname,
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

function jsonResponse(res, statusCode, body) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function requestSecret(req) {
  const authorization = req.headers.authorization || "";
  if (authorization.toLowerCase().startsWith("bearer ")) return authorization.slice(7).trim();
  return req.headers["x-webhook-secret"] || req.headers["x-hubspot-webhook-secret"] || "";
}

function requireWebhookSecret(req, res, serverConfig = config) {
  if (!serverConfig.webhookSecret) {
    jsonResponse(res, 500, { error: "Webhook secret is not configured." });
    return false;
  }
  if (requestSecret(req) !== serverConfig.webhookSecret) {
    jsonResponse(res, 401, { error: "Invalid webhook secret." });
    return false;
  }
  return true;
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJsonFile(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizePhone(value) {
  return normalizeText(value).replace(/[^\d+]/g, "");
}

function hubspotValue(payload, keys) {
  for (const key of keys) {
    if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") return payload[key];
    if (payload.properties?.[key] !== undefined && payload.properties?.[key] !== null && payload.properties?.[key] !== "") return payload.properties[key];
  }
  return "";
}

function inquiryFromHubspotPayload(payload) {
  const firstName = normalizeText(hubspotValue(payload, ["first_name", "firstname", "firstName"]));
  const lastName = normalizeText(hubspotValue(payload, ["last_name", "lastname", "lastName"]));
  const email = normalizeEmail(hubspotValue(payload, ["email"]));
  const phone = normalizeText(hubspotValue(payload, ["phone", "mobilephone"]));
  const projectType = normalizeText(hubspotValue(payload, ["project_type", "projectType", "type_of_project"]));
  const message = normalizeText(hubspotValue(payload, ["message", "comments", "notes", "project_message"]));
  const hubspotContactId = normalizeText(hubspotValue(payload, ["hubspot_contact_id", "contact_id", "vid", "hs_object_id"]));
  const hubspotDealId = normalizeText(hubspotValue(payload, ["hubspot_deal_id", "deal_id"]));
  const submittedAt = normalizeText(hubspotValue(payload, ["submitted_at", "createdate", "created_at"])) || new Date().toISOString();

  return {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    project_type: projectType,
    message,
    source: "Website / HubSpot",
    hubspot_contact_id: hubspotContactId,
    hubspot_deal_id: hubspotDealId,
    submitted_at: submittedAt,
  };
}

function validateInquiry(inquiry) {
  const missing = [];
  if (!inquiry.email && !inquiry.phone) missing.push("email or phone");
  if (!inquiry.first_name && !inquiry.last_name) missing.push("first_name or last_name");
  if (!inquiry.message) missing.push("message");
  return missing;
}

function createLeadRecord(inquiry, rawPayload) {
  const now = new Date().toISOString();
  const fullName = [inquiry.first_name, inquiry.last_name].filter(Boolean).join(" ").trim() || "Website Inquiry";
  return {
    id: `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectName: inquiry.project_type || "Website Inquiry",
    customerName: fullName,
    projectType: inquiry.project_type || "RTM",
    status: "New",
    owner: "Sales",
    phone: inquiry.phone,
    email: inquiry.email,
    leadSource: inquiry.source,
    hubspotContactId: inquiry.hubspot_contact_id,
    hubspotDealId: inquiry.hubspot_deal_id,
    websiteInquiryHistory: [
      {
        message: inquiry.message,
        submittedAt: inquiry.submitted_at,
        receivedAt: now,
      },
    ],
    rawWebhookPayloads: [
      {
        receivedAt: now,
        payload: rawPayload,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

function findDuplicateLead(leads, inquiry) {
  const email = normalizeEmail(inquiry.email);
  const phone = normalizePhone(inquiry.phone);
  const hubspotContactId = normalizeText(inquiry.hubspot_contact_id);
  return leads.find((lead) => {
    if (hubspotContactId && normalizeText(lead.hubspotContactId) === hubspotContactId) return true;
    if (email && normalizeEmail(lead.email) === email) return true;
    if (phone && normalizePhone(lead.phone) === phone) return true;
    return false;
  });
}

function mergeInquiryIntoLead(lead, inquiry, rawPayload) {
  const now = new Date().toISOString();
  lead.customerName = lead.customerName || [inquiry.first_name, inquiry.last_name].filter(Boolean).join(" ").trim();
  lead.projectName = inquiry.project_type || lead.projectName || "Website Inquiry";
  lead.projectType = inquiry.project_type || lead.projectType || "RTM";
  lead.phone = inquiry.phone || lead.phone || "";
  lead.email = inquiry.email || lead.email || "";
  lead.leadSource = "Website / HubSpot";
  lead.hubspotContactId = inquiry.hubspot_contact_id || lead.hubspotContactId || "";
  lead.hubspotDealId = inquiry.hubspot_deal_id || lead.hubspotDealId || "";
  lead.websiteInquiryHistory = Array.isArray(lead.websiteInquiryHistory) ? lead.websiteInquiryHistory : [];
  lead.websiteInquiryHistory.push({
    message: inquiry.message,
    submittedAt: inquiry.submitted_at,
    receivedAt: now,
  });
  lead.rawWebhookPayloads = Array.isArray(lead.rawWebhookPayloads) ? lead.rawWebhookPayloads : [];
  lead.rawWebhookPayloads.push({
    receivedAt: now,
    payload: rawPayload,
  });
  lead.updatedAt = now;
  return lead;
}

async function saveHubspotInquiry(payload, serverConfig = config) {
  const inquiry = inquiryFromHubspotPayload(payload);
  const missing = validateInquiry(inquiry);
  if (missing.length) {
    return { statusCode: 400, body: { error: "Missing required fields.", missing } };
  }

  const leadsFile = path.join(serverConfig.dataDir, "web-inquiries.json");
  const leads = await readJsonFile(leadsFile, []);
  const duplicate = findDuplicateLead(leads, inquiry);

  if (duplicate) {
    mergeInquiryIntoLead(duplicate, inquiry, payload);
    await writeJsonFile(leadsFile, leads);
    return { statusCode: 200, body: { status: "updated", leadId: duplicate.id } };
  }

  const lead = createLeadRecord(inquiry, payload);
  leads.unshift(lead);
  await writeJsonFile(leadsFile, leads);
  return { statusCode: 201, body: { status: "created", leadId: lead.id } };
}

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) return {};
  return JSON.parse(rawBody);
}

async function serveStatic(req, res, serverConfig = config) {
  const requestUrl = new URL(req.url, "http://localhost");
  const requestedPath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const filePath = path.normalize(path.join(serverConfig.publicDir, requestedPath));
  if (!filePath.startsWith(serverConfig.publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "content-type": contentTypes[ext] || "application/octet-stream" });
    res.end(await readFile(filePath));
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    console.error("Static file error", error);
    res.writeHead(500);
    res.end("Server error");
  }
}

export function createAppServer(serverConfig = config) {
  return createServer(async (req, res) => {
    const requestUrl = new URL(req.url, "http://localhost");
    try {
      if (req.method === "GET" && requestUrl.pathname === "/api/health") {
        jsonResponse(res, 200, { ok: true });
        return;
      }

      if (req.method === "GET" && requestUrl.pathname === "/api/inquiries") {
        if (!requireWebhookSecret(req, res, serverConfig)) return;
        const leads = await readJsonFile(path.join(serverConfig.dataDir, "web-inquiries.json"), []);
        jsonResponse(res, 200, { leads });
        return;
      }

      if (req.method === "POST" && requestUrl.pathname === "/api/webhooks/hubspot/inquiry") {
        if (!requireWebhookSecret(req, res, serverConfig)) return;
        const payload = await readRequestJson(req);
        const result = await saveHubspotInquiry(payload, serverConfig);
        jsonResponse(res, result.statusCode, result.body);
        return;
      }

      if (req.method === "GET" || req.method === "HEAD") {
        await serveStatic(req, res, serverConfig);
        return;
      }

      jsonResponse(res, 405, { error: "Method not allowed." });
    } catch (error) {
      console.error("Request failed", error);
      jsonResponse(res, 500, { error: "Server error." });
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createAppServer().listen(config.port, () => {
    console.log(`Residential Estimating System listening on http://127.0.0.1:${config.port}`);
  });
}
