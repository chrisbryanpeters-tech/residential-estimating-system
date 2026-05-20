import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "C:/Users/Chris/Documents/Codex/2026-05-16/i-am-trying-to-create-a";
const extract = JSON.parse(await fs.readFile(`${root}/estimate_library_extract.json`, "utf8"));

const workbook = Workbook.create();

function setHeader(range) {
  range.format = {
    fill: "#1F4E5F",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
}

function setTitle(sheet, title, subtitle) {
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    font: { bold: true, size: 18, color: "#1F2937" },
  };
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    font: { italic: true, color: "#4B5563" },
  };
}

function writeSheet(name, title, subtitle, headers, rows, widths = {}) {
  const sheet = workbook.worksheets.add(name);
  setTitle(sheet, title, subtitle);
  sheet.getRangeByIndexes(3, 0, 1, headers.length).values = [headers];
  setHeader(sheet.getRangeByIndexes(3, 0, 1, headers.length));
  if (rows.length) {
    sheet.getRangeByIndexes(4, 0, rows.length, headers.length).values = rows;
  }
  const usedRows = Math.max(rows.length + 4, 5);
  const table = sheet.tables.add(`A4:${String.fromCharCode(64 + headers.length)}${usedRows}`, true, `${name.replace(/[^A-Za-z0-9]/g, "")}Table`);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  for (let i = 0; i < headers.length; i++) {
    const col = String.fromCharCode(65 + i);
    sheet.getRange(`${col}:${col}`).format.columnWidthPx = widths[headers[i]] ?? 140;
  }
  return sheet;
}

const summaryRows = [
  ["Source workbook", extract.source_workbook],
  ["Source sheet", extract.source_sheet],
  ["Estimate format", "Shared RTM and site-built format"],
  ["Normal margin", "18%, adjustable by project and section"],
  ["PST", "6% default"],
  ["GST", "5% default"],
  ["Sections extracted", extract.sections.length],
  ["Line items extracted", extract.line_items.length],
  ["Cost codes extracted", extract.cost_codes.length],
  ["Broken formula references found", extract.broken_references.length],
];
writeSheet("Summary", "Estimate Library Extract", "Clean starting point for the web app estimating engine.", ["Item", "Value"], summaryRows, { Item: 220, Value: 620 });

writeSheet(
  "Sections",
  "Estimate Sections",
  "Shared section structure for RTM and site-built jobs.",
  ["Sort", "Section", "Default Margin %", "Active Margin Formula", "Cost Formula", "Retail Formula", "Billing Formula"],
  extract.sections.map((s) => [
    s.sort_order,
    s.section_name,
    s.default_margin_pct,
    s.active_margin_formula,
    s.cost_formula,
    s.retail_formula,
    s.billing_formula,
  ]),
  { Sort: 60, Section: 190, "Default Margin %": 130, "Active Margin Formula": 170, "Cost Formula": 150, "Retail Formula": 150, "Billing Formula": 150 },
);

writeSheet(
  "Line Items",
  "Estimate Line Item Library",
  "Default RTM line items extracted from the current estimating sheet.",
  [
    "Section",
    "Source Row",
    "Cost Code",
    "Category",
    "Description",
    "Pricing Note",
    "Default Quantity",
    "Unit",
    "Default Unit Cost",
    "Cost Formula",
    "Retail Formula",
    "PST Taxable",
    "GST Taxable",
    "Customer Visible",
    "Optional",
  ],
  extract.line_items.map((i) => [
    i.section,
    i.source_row,
    i.cost_code,
    i.category,
    i.description,
    i.pricing_note,
    i.default_quantity,
    i.unit,
    i.default_unit_cost,
    i.cost_formula,
    i.retail_formula,
    i.tax_pst_default ? "Yes" : "No",
    i.tax_gst_default ? "Yes" : "No",
    i.customer_visible_default ? "Yes" : "No",
    i.optional_default ? "Yes" : "No",
  ]),
  {
    Section: 160,
    "Source Row": 80,
    "Cost Code": 90,
    Category: 90,
    Description: 300,
    "Pricing Note": 420,
    "Default Quantity": 130,
    Unit: 110,
    "Default Unit Cost": 130,
    "Cost Formula": 150,
    "Retail Formula": 180,
  },
);

writeSheet(
  "Cost Codes",
  "Cost Codes",
  "Construction cost code summary from hidden rows in the current RTM sheet.",
  ["Cost Code", "Cost Code Name"],
  extract.cost_codes.map((c) => [c.cost_code, c.cost_code_name]),
  { "Cost Code": 100, "Cost Code Name": 360 },
);

writeSheet(
  "Categories",
  "Categories and Units",
  "Controlled lists to use in the app instead of free typing.",
  ["List Type", "Value", "Meaning / Notes"],
  [
    ...extract.categories.map((c) => ["Category", c, c === "M" ? "Material" : c === "L" ? "Labor" : c === "M&L" ? "Material and labor" : "Current workbook value"]),
    ...extract.units.map((u) => ["Unit", u, ""]),
  ],
  { "List Type": 120, Value: 180, "Meaning / Notes": 300 },
);

writeSheet(
  "Tax Margin Rules",
  "Tax and Margin Rules",
  "Default business rules for the estimating engine.",
  ["Rule", "Default", "Adjustable?", "Notes"],
  [
    ["Project margin", "18%", "Yes", "Can be overridden on project and section."],
    ["Section margin", "18% starting target", "Yes", "Current sheet has section-specific defaults."],
    ["PST", "6%", "Yes", "Default taxable flag should be editable by line."],
    ["GST", "5%", "Yes", "Default taxable flag should be editable by line."],
    ["RTM/site-built format", "Shared", "Yes", "Use one estimate engine with project type defaults."],
  ],
  { Rule: 180, Default: 180, "Adjustable?": 120, Notes: 460 },
);

writeSheet(
  "Broken References",
  "Broken Formula References",
  "Items to review before rebuilding the logic in the app.",
  ["Cell", "Formula"],
  extract.broken_references.map((b) => [b.cell, b.formula]),
  { Cell: 100, Formula: 520 },
);

writeSheet(
  "App Fields",
  "Recommended App Fields",
  "Database field list for the first estimating prototype.",
  ["Record", "Field", "Type", "Notes"],
  [
    ["Estimate", "project_type", "choice", "RTM or site-built"],
    ["Estimate", "target_margin_pct", "percent", "Default 18%"],
    ["Estimate", "pst_rate", "percent", "Default 6%"],
    ["Estimate", "gst_rate", "percent", "Default 5%"],
    ["Section", "default_margin_pct", "percent", "Can be adjusted"],
    ["Line Item", "cost_code", "choice", "Use extracted cost code table"],
    ["Line Item", "category", "choice", "M, L, M&L, allowance, subcontract, project cost"],
    ["Line Item", "quantity", "number", "Manual or calculator-fed"],
    ["Line Item", "unit", "choice", "Use extracted unit table"],
    ["Line Item", "unit_cost", "currency", "Manual, template, or calculator-fed"],
    ["Line Item", "pst_taxable", "boolean", "Default yes, editable"],
    ["Line Item", "gst_taxable", "boolean", "Default yes, editable"],
    ["Allowance", "allowance_amount", "currency", "Tracked separately from base estimate"],
    ["Change Order", "approved_price", "currency", "Can affect schedule and QuickBooks export"],
  ],
  { Record: 140, Field: 190, Type: 120, Notes: 420 },
);

for (const sheet of workbook.worksheets.items) {
  sheet.getUsedRange()?.format.autofitRows();
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
const output = `${root}/RTM Site Estimate Library.xlsx`;
await xlsx.save(output);
console.log(output);
