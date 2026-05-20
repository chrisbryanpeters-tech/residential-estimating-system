# RTM Estimating, CRM, and Scheduling System Blueprint

Based on the current workbook `RTM & Site Calc Template July 20251.xlsx`, especially the `RTM Calc` sheet.

## What the Current RTM Sheet Already Does

The RTM sheet is a full estimating engine, not just a quote worksheet. It currently handles:

- Project-level inputs: project name, house square footage, garage square footage, travel distance.
- Section-level estimating: materials, framing, roofing, plumbing/mechanical, electrical, exterior, insulation, drywall, mud/tape, paint, finishing, cabinets, flooring, custom work, miscellaneous, and project costs.
- Line-item estimating: each line has code, category, description, quantity, unit, price, cost, retail, billing percent, and billing dollars.
- Margin logic: each section has an adjustable margin. The usual target is around 18%, but the system must allow both project-level and section-level margin adjustments.
- Tax logic: PST is 6% and GST is 5%. The system needs tax controls by line item because some items may need different tax handling.
- Billing logic: hidden columns track billing percentages and billing dollars.
- Cost-code reporting: hidden rows summarize costs, retail, and billing by construction code.
- Side calculators: windows, doors, roofing, siding, drywall board feet, paint, travel, and fixture allowances.
- Linked supporting tabs: site calculator, upcharge/budget, project summary, paint calculators, travel calculators, door calculator, mover/simple-home calculators.
- Common categories are already represented in the sheet and should become a controlled list in the app rather than free-typed values.
- RTM and site-built jobs currently use the same estimate format, so the first system should use one shared estimate engine for both.

## Current RTM Estimate Sections

These should become configurable estimate sections in the new system:

1. Project Materials
2. Framing
3. Roofing
4. Plumbing/Mechanical
5. Electrical
6. Exterior
7. Insulation
8. Drywall
9. Mud & Tape
10. Paint
11. Finishing
12. Cabinets
13. Flooring
14. Custom Work
15. Miscellaneous
16. Project Costs

Each section needs:

- Section name
- Default margin, usually 18%
- Active margin
- Cost subtotal
- Retail subtotal
- PST
- GST
- Tax total
- Retail total including tax, where appropriate
- Billing percent
- Billing amount
- Sort order
- Whether it appears on customer quote

## Estimate Line Item Structure

Each estimating line should become a record with these fields:

- Estimate
- Section
- Cost code
- Category: material, labor, material and labor, allowance, subcontract, project cost
- Description
- Notes/internal pricing guidance
- Quantity
- Unit
- Unit cost
- Cost formula type
- Cost subtotal
- Margin
- Retail total
- PST taxable yes/no
- GST taxable yes/no
- PST amount
- GST amount
- Customer price including tax, where appropriate
- Billing percent
- Billing amount
- Customer visible yes/no
- Optional yes/no
- Included/excluded status
- Supplier/trade/vendor
- Source: manual, template, calculator, imported quote, allowance

## Key Calculators to Preserve

The web app should not simply copy the worksheet layout. It should preserve the calculators as guided estimate helpers:

- Window package calculator
- Door package calculator
- Roofing calculator
- Siding/exterior calculator
- Drywall board-foot calculator
- Paint calculator
- Fixture allowance calculator
- Travel budget calculator
- RTM move/delivery calculator
- PM/service/contingency calculators

Each calculator should feed a normal estimate line item so the final estimate stays clean.

## Suggested Version 1 App Screens

### 1. Lead Board

Statuses:

- New
- Contacted
- Needs estimate
- Estimate in progress
- Quote sent
- Follow-up
- Won
- Lost

### 2. Customer / Project Profile

Store:

- Customer info
- Site address
- Project type: RTM or site-built
- Salesperson
- Project manager
- Project stage
- Notes
- Linked estimates
- Linked schedule
- Linked documents

### 3. Estimate Builder

This should feel familiar to the current sheet, but cleaner:

- Sections stacked vertically
- Expand/collapse section details
- Fast line-item entry
- Reusable item library
- Quantity/unit/price/cost/retail columns
- Margin controls by project and by section, with 18% as the normal starting target
- PST and GST controls, defaulting to 6% PST and 5% GST
- Project-level total, margin, and dollars per square foot
- Internal notes separate from customer notes
- Optional items and allowances clearly marked

### 4. Estimate Review

Owner/manager review screen:

- Cost by section
- Retail by section
- Margin by section
- Overall project margin
- Dollars per square foot
- Large allowances
- Manually entered items
- Low-margin warnings
- Taxable/non-taxable warnings
- Missing quantities/prices
- Broken or incomplete calculator inputs

### 5. Quote Output

Customer-facing quote should show:

- Project summary
- Scope included
- Allowances
- Options/upgrades
- Exclusions
- Total price
- Quote version/date
- Signature/approval area

### 6. Project Schedule

Schedule layers:

- Sales appointments
- Estimate deadlines
- Production phases
- Crew/trade scheduling
- Site work
- Inspections
- RTM move/delivery
- Customer meetings

### 7. Production Board

Statuses:

- Sales/estimating
- Awaiting approval
- Contract signed
- Planning/permitting
- Materials ordering
- In production
- Site work
- Delivery/setup
- Finishing
- Complete

## Database Tables

Minimum tables for the first web prototype:

- Users
- Customers
- Leads
- Projects
- Estimates
- EstimateVersions
- EstimateSections
- EstimateLineItems
- EstimateTemplates
- EstimateTemplateSections
- EstimateTemplateLineItems
- Calculators
- CalculatorInputs
- CostCodes
- Categories
- Allowances
- ChangeOrders
- Taxes
- ScheduleItems
- Tasks
- Notes
- Files
- QuickBooksExports

## Important Data to Extract From Excel

From the current workbook, we should extract:

- Section list and default margins
- Line item descriptions
- Cost codes
- Category values such as M, L, and M&L
- Units
- Default prices
- Pricing notes
- Calculator formulas
- Quote summary formulas
- Cost-code summary mappings
- Common categories used by the estimating team
- Tax handling assumptions for PST and GST

## Items That Need Cleanup Before Rebuilding

The workbook has some signs of spreadsheet aging that should be cleaned up as we convert it:

- Some named ranges point to `#REF!`.
- Some formulas reference `#REF!`.
- Billing columns are hidden, which makes billing logic easy to miss.
- Several calculators are embedded beside the estimate instead of stored as reusable logic.
- Some formulas appear to reference nearby retail lines in ways that should be reviewed during migration.
- Site-built and RTM workflows are similar but not identical, so they should share a base estimate engine with project-type-specific templates.

## Recommended Build Order

1. Extract RTM section and line-item library from Excel.
2. Extract shared categories, units, and cost codes.
3. Build a clickable web prototype of the shared RTM/site-built estimate builder.
4. Add project/customer records around the estimate.
5. Recreate the main RTM calculators as guided helpers.
6. Add allowance and change-order workflows.
7. Add quote PDF/export.
8. Add lead board and project dashboard.
9. Add basic scheduling.
10. Add QuickBooks export.
11. Add customer portal later.

## First Prototype Goal

The first prototype should answer one question:

Can someone create an RTM estimate faster and more clearly than they can in the current Excel sheet, while keeping the same costing logic?

If yes, then CRM, scheduling, approvals, and QuickBooks integration can be built around it.

## Allowances and Change Orders

Allowances and change orders should be integrated into the system, but tracked separately from the base estimate.

Allowances should support:

- Allowance name
- Original estimate line or section
- Allowance amount
- Selected actual amount
- Difference from allowance
- Customer approval status
- Whether the overage/credit becomes a change order

Change orders should support:

- Change order number
- Project
- Customer
- Related estimate/version
- Related allowance, if applicable
- Description of change
- Internal cost
- Margin
- PST/GST handling
- Customer price
- Approval status
- Approved date
- Impact on schedule
- Impact on QuickBooks export
