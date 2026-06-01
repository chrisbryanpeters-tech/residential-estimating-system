import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createAppServer } from "../server.mjs";

async function withTestServer(fn) {
  const dataDir = await mkdtemp(path.join(tmpdir(), "zaks-webhook-"));
  const server = createAppServer({
    port: 0,
    webhookSecret: "test-secret",
    dataDir,
    publicDir: process.cwd(),
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    await fn({ baseUrl: `http://127.0.0.1:${port}`, dataDir });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
}

function postInquiry(baseUrl, body, secret = "test-secret") {
  return fetch(`${baseUrl}/api/webhooks/hubspot/inquiry`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": secret,
    },
    body: JSON.stringify(body),
  });
}

test("accepts a valid HubSpot inquiry payload", async () => {
  await withTestServer(async ({ baseUrl, dataDir }) => {
    const response = await postInquiry(baseUrl, {
      firstname: "Taylor",
      lastname: "Smith",
      email: "Taylor@example.com",
      phone: "306-555-0100",
      project_type: "RTM",
      message: "I would like pricing for an RTM.",
      hs_object_id: "12345",
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.status, "created");

    const leads = JSON.parse(await readFile(path.join(dataDir, "web-inquiries.json"), "utf8"));
    assert.equal(leads.length, 1);
    assert.equal(leads[0].customerName, "Taylor Smith");
    assert.equal(leads[0].email, "taylor@example.com");
    assert.equal(leads[0].leadSource, "Website / HubSpot");
    assert.equal(leads[0].rawWebhookPayloads.length, 1);
  });
});

test("rejects missing required fields", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await postInquiry(baseUrl, {
      firstname: "Taylor",
      message: "",
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error, "Missing required fields.");
    assert.ok(body.missing.includes("email or phone"));
    assert.ok(body.missing.includes("message"));
  });
});

test("updates an existing lead instead of duplicating by email", async () => {
  await withTestServer(async ({ baseUrl, dataDir }) => {
    await postInquiry(baseUrl, {
      firstname: "Taylor",
      lastname: "Smith",
      email: "Taylor@example.com",
      phone: "306-555-0100",
      project_type: "RTM",
      message: "First inquiry.",
    });

    const response = await postInquiry(baseUrl, {
      firstname: "Taylor",
      lastname: "Smith",
      email: "taylor@example.com",
      phone: "306-555-0100",
      project_type: "Site Build",
      message: "Second inquiry.",
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, "updated");

    const leads = JSON.parse(await readFile(path.join(dataDir, "web-inquiries.json"), "utf8"));
    assert.equal(leads.length, 1);
    assert.equal(leads[0].websiteInquiryHistory.length, 2);
    assert.equal(leads[0].projectType, "Site Build");
  });
});

test("rejects requests with an invalid secret", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await postInquiry(
      baseUrl,
      {
        firstname: "Taylor",
        lastname: "Smith",
        email: "Taylor@example.com",
        message: "Please contact me.",
      },
      "wrong-secret",
    );

    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error, "Invalid webhook secret.");
  });
});
