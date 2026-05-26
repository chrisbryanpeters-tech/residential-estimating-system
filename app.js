const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

const els = {};
const state = {
  library: null,
  lines: [],
  expanded: new Set(),
  openCalcLineId: null,
  calcValues: {},
  allowanceValues: {},
  crm: {
    activeRecordId: null,
    records: [],
    status: "Needs Estimate",
    owner: "Sales",
    followupDate: "",
    phone: "",
    email: "",
    leadSource: "Walk-in",
    salesperson: "Chris Peters",
    interestedModels: "",
    projectAddress: "",
    billingStages: [],
    notes: [],
    warranty: {
      complete: false,
      notes: "",
      deficiencies: [],
    },
    tasks: [
      { text: "Confirm project scope", done: false },
      { text: "Review estimate margin", done: false },
      { text: "Schedule customer follow-up", done: false },
    ],
  },
  schedule: {
    startDate: "",
    owner: "Production",
    items: [],
    calendarMonth: "",
    selectedItemId: "",
    scope: "current",
    tradeFilter: "All trades",
    editorOpen: false,
    dayPopupDate: "",
    resizeDrag: null,
    moveDrag: null,
    pendingResize: null,
  },
  selections: [],
  activeSelectionCategory: "",
  output: {
    estimateVersionId: "current",
    estimateDate: "",
    providedBy: "",
    location: "",
    intro: "",
    movingNotes: "",
    exclusions: "",
    descriptions: {},
    manual: {},
    descriptionsManual: {},
    scopeItems: [],
  },
  contract: {
    date: "",
    estimateVersionId: "current",
    customerName: "",
    location: "",
    depositTerms: "Deposit and payment schedule to be confirmed with Zak's Homes & Cottages prior to production start.",
    approval: {
      status: "Pending review",
      approvedBy: "",
      approvedRole: "",
      approvedAt: "",
      note: "",
      signature: "",
    },
    inclusions: {},
    exclusions: {},
  },
  purchaseOrders: [],
  selectedPurchaseOrderId: "",
  purchaseOrderFilter: "all",
  purchaseOrderProjectFilter: "current",
  changeOrders: [],
  selectedChangeOrderId: "",
  jobFiles: [],
  vendors: [],
  selectedVendorId: "",
  openJobFilePreviewId: "",
  openJobFilePreviewProjectId: "",
  jobFilePreviewObjectUrl: "",
  jobFilePreviewRenderToken: 0,
  estimateVersions: [],
  sentEstimateVersionId: "",
  openEstimateVersionId: "",
  taskFilters: {
    projectId: "current",
    owner: "All owners",
    sort: "due",
  },
  selectedProjectTask: null,
  warranty: {
    selectedProjectId: "current",
  },
  taskBreakdown: null,
  managementBreakdown: null,
  auth: {
    currentUser: null,
    profiles: {},
    accountPanelOpen: false,
  },
  view: "crm",
};

const users = [
  { id: "chris", name: "Chris Peters", role: "Owner", password: "zaks", permissions: ["all"] },
  { id: "angela", name: "Angela Kiedrowski", role: "Sales", password: "zaks", permissions: ["crm", "estimate", "output", "contract", "tasks", "schedule", "selections", "vendors", "jobFiles", "warranty", "billingStages", "allowances", "purchaseOrders", "changeOrders", "review"] },
  { id: "office", name: "Office Team", role: "Office", password: "zaks", permissions: ["crm", "contract", "tasks", "schedule", "selections", "vendors", "jobFiles", "warranty", "billingStages", "purchaseOrders", "changeOrders", "review"] },
  { id: "production", name: "Production Team", role: "Production", password: "zaks", permissions: ["contract", "tasks", "schedule", "selections", "vendors", "jobFiles", "warranty", "billingStages", "purchaseOrders", "changeOrders", "review"] },
  { id: "accounting", name: "Accounting Team", role: "Accounting", password: "zaks", permissions: ["vendors", "billingStages", "allowances", "purchaseOrders", "changeOrders", "review"] },
];

const selectionTemplate = [
  ["Customer Checklist", "Exterior details reviewed"],
  ["Customer Checklist", "Plumbing specs reviewed"],
  ["Customer Checklist", "Electrical / lighting specs reviewed"],
  ["Customer Checklist", "Flooring layout reviewed"],
  ["Customer Checklist", "Paint layout reviewed"],
  ["Customer Checklist", "Finish details reviewed"],
  ["Customer Checklist", "Cabinetry / fireplace / custom work reviewed"],
  ["Blueprint Checklist", "Window details"],
  ["Blueprint Checklist", "Door details"],
  ["Blueprint Checklist", "Siding, trims, soffit and fascia"],
  ["Blueprint Checklist", "Roofing and attic access"],
  ["Blueprint Checklist", "Deck nailers and downspout locations"],
  ["Blueprint Checklist", "Floor plan and wall height"],
  ["Blueprint Checklist", "Drywall bead and ceiling finish"],
  ["Blueprint Checklist", "Flooring transitions"],
  ["Blueprint Checklist", "Railing type"],
  ["Blueprint Checklist", "Closet / shelving details"],
  ["Blueprint Checklist", "Exterior lighting and doorbell"],
  ["Blueprint Checklist", "Central vac and sweep locations"],
  ["Blueprint Checklist", "Ventilation and range hood"],
  ["Blueprint Checklist", "Switch / plug type and locations"],
  ["Blueprint Checklist", "Pot lights, vanity lights and ceiling fans"],
  ["Blueprint Checklist", "Panel location"],
  ["Exterior & Foundation", "Foundation supplied by"],
  ["Exterior & Foundation", "House foundation"],
  ["Exterior & Foundation", "Garage foundation"],
  ["Exterior & Foundation", "Deck piles / deck railing"],
  ["Exterior & Foundation", "Siding areas and trims"],
  ["Exterior & Foundation", "Soffit, fascia, eavestrough, downspouts"],
  ["Exterior & Foundation", "Roofing"],
  ["Exterior & Foundation", "Exterior doors and windows details"],
  ["Plumbing", "Plumbing rough-ins"],
  ["Plumbing", "Foundation type"],
  ["Plumbing", "Water supply"],
  ["Plumbing", "Waterlines"],
  ["Plumbing", "Water heater"],
  ["Plumbing", "Gas type and gas appliances"],
  ["Plumbing", "Furnace / boiler / ventilation"],
  ["Plumbing", "Fixture supply"],
  ["Electrical", "Central vac rough-in"],
  ["Electrical", "Switch and plug style"],
  ["Electrical", "Under cabinet lights"],
  ["Electrical", "Range hood"],
  ["Electrical", "TV outlets / phone jacks"],
  ["Electrical", "Site information"],
  ["Electrical", "Lighting selections"],
  ["Flooring, Tile & Backsplash", "Main flooring"],
  ["Flooring, Tile & Backsplash", "Ensuite shower tile"],
  ["Flooring, Tile & Backsplash", "Kitchen backsplash"],
  ["Flooring, Tile & Backsplash", "Stair flooring style"],
  ["Fireplace & Woodwork", "Fireplace make/model"],
  ["Fireplace & Woodwork", "Fireplace stone / mantle / hearth"],
  ["Fireplace & Woodwork", "Pine ceilings and trims"],
  ["Fireplace & Woodwork", "Feature walls / beams / railing"],
  ["Paint & Finishing", "Main paint colours"],
  ["Paint & Finishing", "Feature wall colours"],
  ["Paint & Finishing", "Ceiling details"],
  ["Paint & Finishing", "Drywall finish"],
  ["Paint & Finishing", "Interior doors and trims"],
  ["Paint & Finishing", "Door hardware"],
  ["Paint & Finishing", "Bathroom hardware / mirrors / shelving"],
  ["Cabinets & Railing", "Kitchen perimeter cabinets"],
  ["Cabinets & Railing", "Kitchen island cabinets"],
  ["Cabinets & Railing", "Vanities"],
  ["Cabinets & Railing", "Countertops"],
  ["Cabinets & Railing", "Railing details"],
  ["Moving & Service", "RTM service information"],
  ["Moving & Service", "Moving information"],
].map(([category, item], index) => ({
  id: `selection-${index + 1}`,
  category,
  item,
  selection: "",
  status: "Needed",
  assignedTo: "Sales",
  dueDate: "",
  notes: "",
}));

const scheduleTrades = [
  "Sales",
  "Office",
  "Foundation",
  "Framing",
  "Roofing",
  "Windows & Doors",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Insulation",
  "Drywall",
  "Paint",
  "Cabinets",
  "Flooring",
  "Finishing",
  "Exterior",
  "Site Work",
  "Move",
  "Accounting",
];

const scheduleTemplate = [
  { name: "Contract signed / deposit", department: "Sales", trade: "Sales", offset: 0 },
  { name: "Final estimate review", department: "Owners", trade: "Sales", offset: 5 },
  { name: "Selections and allowances locked", department: "Sales", trade: "Sales", offset: 10 },
  { name: "Drawings and permit package", department: "Office", trade: "Office", offset: 15 },
  { name: "Order long-lead materials", department: "Office", trade: "Office", offset: 20 },
  { name: "Production start", department: "Production", trade: "Framing", offset: 35 },
  { name: "Framing / rough-ins", department: "Production", trade: "Framing", offset: 50 },
  { name: "Exterior complete", department: "Production", trade: "Exterior", offset: 65 },
  { name: "Interior finishing", department: "Production", trade: "Finishing", offset: 80 },
  { name: "Move / site work coordination", department: "Production", trade: "Move", offset: 95 },
  { name: "Final walkthrough", department: "Sales", trade: "Sales", offset: 110 },
  { name: "Possession / closeout", department: "Office", trade: "Accounting", offset: 120 },
];

const billingStageTemplate = [
  { id: "framing", group: "Project Billing", label: "Completion of Framing" },
  { id: "drywall", group: "Project Billing", label: "Completion of Drywall" },
  { id: "rtm", group: "Project Billing", label: "Completion of RTM" },
  { id: "site-foundation", group: "Site Work", label: "Completion of Site Foundation" },
  { id: "site-work", group: "Site Work", label: "Completion of Site Work" },
];

const billingStageStatuses = ["Not started", "Complete", "Invoiced", "Paid"];
const billingReportStatuses = {
  ready: "Ready to invoice",
  outstanding: "Outstanding",
  paid: "Paid",
  upcoming: "Upcoming",
};

const defaultOutputExclusions = [
  "Engineering review - additional material and labor requirements",
  "Building Code review - additional material and labor requirements",
  "Mechanical review - additional material and labor requirements",
  "Building permits, surveys, licenses",
  "Foundation, beams, posts",
  "On site plumbing, heating, water, sewer",
  "Furnace, ductwork, HRV, water heater unless specifically listed",
  "On site electrical and utility costs",
  "Additional decks, deck stairs, railing unless specifically listed",
  "Attached garage unless specifically listed",
  "Appliances unless specifically listed",
  "Site services, trenching and hook-ups - water, septic, power, gas, telephone/internet",
  "Landscaping, walkways, driveways, retaining walls, sloping, finish grading and drainage",
  "Site prep or site work caused by seasonal conditions, frost, rocks, water, mud, slope remediation or unforeseen requirements",
].join("\n");

const outputGroups = [
  { title: "Framing Package", sections: ["Project Materials", "Framing"], exclude: ["siding", "shingle", "roof", "deck", "window", "door", "flooring", "fireplace"] },
  { title: "Exterior Finish", sections: ["Roofing", "Exterior", "Insulation"], includeProjectMaterials: ["windows", "doors", "siding", "shingle", "roof"] },
  { title: "Interior Finish", sections: ["Drywall", "Mud & Tape", "Paint", "Finishing", "Flooring"] },
  { title: "Fireplace", sections: ["Custom Work"], include: ["fireplace", "mantle", "stone", "hearth"] },
  { title: "Custom Cabinetry and Railing", sections: ["Cabinets", "Custom Work"], include: ["cabinet", "vanit", "counter", "backsplash", "railing", "bench"] },
  { title: "Electrical", sections: ["Electrical"] },
  { title: "Plumbing", sections: ["Plumbing/Mechanical"] },
  { title: "Base Moving Costs", sections: ["Miscellaneous", "Project Costs"], include: ["moving", "move", "delivery", "deliveries", "transport"] },
];

const proposalSectionTitles = [...outputGroups.map((group) => group.title), "Other Included Items", "Value Added Opportunities"];

const contractInclusionOptions = [
  "Project drawings and specifications attached to this agreement",
  "House construction based on selected estimate version",
  "Framing package",
  "Exterior windows and doors",
  "Roofing, soffit, fascia and exterior finishes",
  "Plumbing and mechanical allowances listed in estimate",
  "Electrical allowances listed in estimate",
  "Interior finishing allowances listed in estimate",
  "Cabinetry, countertops and selected custom work",
  "RTM moving / delivery costs listed in estimate",
  "Applicable PST and GST shown in estimate",
];

const contractExclusionOptions = defaultOutputExclusions.split("\n");

const projectColorPalette = ["#e11919", "#111111", "#2563eb", "#0f766e", "#9333ea", "#b45309", "#be123c", "#047857"];

const calculatorDefaults = {
  windows: {
    sizes: [
      ["Small (3x3)", 650],
      ["Medium (4x4)", 1000],
      ["Large (6x6)", 2000],
      ["Oversize (8x8)", 2800],
    ],
  },
  doors: {
    sizes: [
      ["No Glass", 1000],
      ["Dec Half Glass", 1450],
      ["Full Glass", 1350],
      ["Full Glass/Blinds", 1550],
      ["Sidelight Add On", 1050],
      ["Transom Add On", 1050],
      ["5' Door", 3200],
      ["5' Door/Blinds", 3600],
      ["5' Patio Door", 1750],
      ["8' Door Add On", 550],
      ["Int. Blinds Add On", 200],
    ],
  },
  roof: {
    slopes: [
      [2, 1.01],
      [3, 1.03],
      [4, 1.05],
      [5, 1.08],
      [6, 1.12],
      [8, 1.2],
      [10, 1.3],
      [12, 1.41],
    ],
  },
  siding: {
    items: [
      ["Vinyl", 1.5],
      ["Vinyl (2 Story)", 1.7],
      ["Vinyl B&B", 2],
      ["Hardie/Canexcel/LP", 3],
      ["Hardie B&B", 4.7],
      ["Shakes", 4.7],
      ["Openings To Trim", 50],
      ["Post Clad (Each)", 60],
      ["Beam Clad (Ft)", 5],
      ["O/H Door Clad (Each)", 80],
    ],
  },
  travel: {
    crew: 3.5,
    nights: 0,
    mileageRate: 1.5,
    trailerRate: 2.5,
    crewKmRate: 0.8,
    meals: 100,
    accommodations: 175,
  },
  fixtures: {
    sinkToiletRate: 350,
    tubShowerRate: 1200,
  },
  flooring: {
    rows: [
      ["Vinyl plank", 8],
      ["Laminate", 7],
      ["Carpet", 6],
      ["Tile", 18],
      ["Hardwood", 14],
      ["Sheet vinyl", 5],
    ],
  },
  tileShower: {
    tileLevels: {
      Econo: 8,
      Mid: 14,
      High: 22,
      Premium: 32,
    },
    baseTypes: {
      Acrylic: 1200,
      "Tile base": 2800,
      "Schluter/base system": 2200,
    },
    installRate: 30,
  },
  backsplash: {
    tileLevels: {
      Econo: 8,
      Mid: 14,
      High: 22,
      Premium: 32,
    },
    installRate: 28,
    minInstall: 500,
  },
  paintDoorsTrim: {
    doorHeights: {
      '80"': 40,
      '96"': 55,
    },
    doorColours: {
      "Light Paint": 10,
      "Dark Paint": 15,
      Stain: 45,
    },
    trimFinishes: {
      "Reg. Paint": 0.16,
      "Reg. Stain": 0.46,
      "Tall Paint": 0.3,
      "Tall Stain": 0.65,
    },
  },
  moveRegular: {
    widthRates: [
      { label: "< 17'", short: 22, long: 26 },
      { label: "17'-19'", short: 25, long: 30 },
      { label: "19'-21'", short: 27, long: 32.5 },
      { label: "21'-23'", short: 28.5, long: 34 },
      { label: "23'-25'", short: 30.5, long: 35.5 },
      { label: "25'-27'", short: 34.5, long: 38.5 },
      { label: "27'-29'", short: 36.5, long: 40 },
    ],
    fuel: {
      "Under $1.46": 0,
      "$1.46 - $1.55": 0.75,
      "$1.56 - $1.65": 1.5,
      "$1.66 - $1.75": 2.25,
      "$1.76 - $1.85": 3,
      "$1.86 - $1.95": 3.75,
      "$1.96 - $2.05": 4.5,
      "$2.06 - $2.15": 5.25,
      "$2.16 - $2.25": 6,
    },
  },
  moveSimple: {
    fuel: {
      "< $1.55": 0,
      "$1.55 - $1.64": 0.15,
      "$1.65 - $1.74": 0.3,
      "$1.75 - $1.84": 0.45,
      "$1.85 - $1.94": 0.6,
      "$1.95 - $2.04": 0.75,
    },
  },
};

const distanceLookupKm = {
  "aberdeen|sk": 58,
  "battleford|sk": 121,
  "biggar|sk": 117,
  "calgary|ab": 649,
  "canora|sk": 294,
  "dalmeny|sk": 34,
  "edmonton|ab": 467,
  "humboldt|sk": 88,
  "lloydminster|sk": 266,
  "lloydminster|ab": 266,
  "martensville|sk": 39,
  "melfort|sk": 200,
  "moose jaw|sk": 294,
  "north battleford|sk": 126,
  "prince albert|sk": 116,
  "regina|sk": 326,
  "rosthern|sk": 38,
  "saskatoon|sk": 47,
  "swift current|sk": 380,
  "tisdale|sk": 226,
  "warman|sk": 36,
  "winnipeg|mb": 825,
  "yorkton|sk": 348,
};

function byId(id) {
  return document.getElementById(id);
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function addDaysIso(dateText, days) {
  const [year, month, day] = (dateText || todayIso()).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${nextMonth}-${nextDay}`;
}

function dayDiff(startDate, endDate) {
  const [startYear, startMonth, startDay] = (startDate || todayIso()).split("-").map(Number);
  const [endYear, endMonth, endDay] = (endDate || startDate || todayIso()).split("-").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  return Math.round((end - start) / 86400000);
}

function dateRangeIncludes(dateText, startDate, endDate) {
  if (!dateText || !startDate) return false;
  const end = endDate || startDate;
  return dateText >= startDate && dateText <= end;
}

function prettyDate(dateText) {
  if (!dateText) return "Not set";
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes) {
  const value = num(bytes);
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function monthKey(dateText = todayIso()) {
  return dateText.slice(0, 7);
}

function monthTitle(monthText) {
  const [year, month] = (monthText || monthKey()).split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });
}

function shiftMonth(monthText, amount) {
  const [year, month] = (monthText || monthKey()).split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function projectInputs() {
  return {
    houseSqft: num(els.houseSqft.value),
    garageSqft: num(els.garageSqft.value),
    travelDistance: num(els.travelDistance.value),
    targetMargin: num(els.targetMargin.value, 18),
    pstRate: num(els.pstRate.value, 6) / 100,
    gstRate: num(els.gstRate.value, 5) / 100,
  };
}

function syncProjectLevelAvailability() {
  const isSimpleHome = els.projectType?.value === "Simple Home";
  if (!els.projectLevel) return;
  els.projectLevel.disabled = isSimpleHome;
  if (isSimpleHome) els.projectLevel.value = "Standard";
}

function projectServiceHours() {
  if (els.projectType?.value === "Simple Home") return 40;
  if (els.projectType?.value === "RTM") {
    return els.projectLevel?.value === "Standard" ? 80 : 120;
  }
  return els.projectLevel?.value === "Standard" ? 80 : 120;
}

function projectCostPercent() {
  if (els.projectType?.value === "Simple Home") return 1;
  if (els.projectType?.value === "Site-built") return 4;
  return 3;
}

function distanceKey(town, province) {
  return `${String(town || "").trim().toLowerCase()}|${String(province || "").trim().toLowerCase()}`;
}

function lookupDistance() {
  const key = distanceKey(els.destinationTown.value, els.destinationProvince.value);
  const distance = distanceLookupKm[key];
  if (distance === undefined) {
    els.distanceLookupNote.textContent = "No saved distance yet. Enter km manually, or add this town to the lookup list later.";
    return;
  }
  els.travelDistance.value = distance;
  els.distanceLookupNote.textContent = `Estimated one-way distance from Hague, SK: ${distance} km.`;
  setView(state.view);
}

function resolveDefaultQuantity(value, inputs) {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;
  if (value.includes("Floor_SqFt")) return inputs.houseSqft;
  if (value.includes("Garage_SqFt")) return inputs.garageSqft;
  if (value.includes("Travel_Distance")) return inputs.travelDistance;
  return num(value.replace("=", ""), 0);
}

function quantitySource(value) {
  if (typeof value !== "string") return null;
  if (value.includes("Floor_SqFt")) return "houseSqft";
  if (value.includes("Garage_SqFt")) return "garageSqft";
  if (value.includes("Travel_Distance")) return "travelDistance";
  return null;
}

function cleanCategory(category) {
  if (category === "M") return "Material";
  if (category === "L") return "Labor";
  if (category === "M&L") return "Material & Labor";
  if (!category) return "Material & Labor";
  return category;
}

function defaultLineType(item) {
  const description = String(item.description || "").toLowerCase();
  if (description.includes("allowance")) return "Allowance";
  return cleanCategory(item.category);
}

function calculatorType(line) {
  const text = `${line.section} ${line.description}`.toLowerCase();
  if (text.includes("doors/trim")) return "paintDoorsTrim";
  if (ratePickOptions(line)) return null;
  if (text.includes("shower door allowance")) return null;
  if (text.includes("custom tile shower") || text.includes("tile shower allowance")) return "tileShower";
  if (text.includes("backsplash")) return "backsplash";
  if (text.includes("flooring") && text.includes("house allowance")) return "flooring";
  if (text.includes("rtm move")) return "move";
  if (text.includes("deliveries")) return "deliveryKm";
  if (text.includes("pm & ss fees") || text.includes("contingency")) return "projectPercent";
  if (text.includes("fixtures allowance")) return "fixtures";
  if (text.includes("window") && text.includes("color")) return "windowDoorUpgrade";
  if (text.includes("windows")) return "windows";
  if (text.includes("doors") || text.includes("door")) return "doors";
  if (text.includes("roof") || text.includes("shingles") || text.includes("tuff rib") || text.includes("snaplock")) return "roof";
  if (text.includes("siding") || text.includes("soffit") || text.includes("eavestrough")) return "siding";
  if (text.includes("travel budget") || text.includes("deliveries") || text.includes("rtm move")) return "travel";
  return null;
}

function defaultCalcValues(type, line = null) {
  if (type === "windows") return { quantities: [0, 0, 0, 0] };
  if (type === "doors") return { quantities: Array(calculatorDefaults.doors.sizes.length).fill(0) };
  if (type === "roof") {
    const sqft = projectInputs().houseSqft;
    const width = 28;
    return { length: Math.round(sqft / width), width, overhangInches: 12, slope: 6, wastePercent: 15 };
  }
  if (type === "siding") return { quantities: Array(calculatorDefaults.siding.items.length).fill(0) };
  if (type === "travel") return { distance: projectInputs().travelDistance, trailerDistance: 0, crew: 3.5, nights: 0, misc: 0 };
  if (type === "windowDoorUpgrade") return { percent: 15, includeWindows: true, includeDoors: true };
  if (type === "fixtures") return { sinkToiletQty: 0, tubShowerQty: 0 };
  if (type === "flooring") {
    return {
      rows: calculatorDefaults.flooring.rows.map(([name, rate], index) => ({
        name,
        sqft: index === 0 ? projectInputs().houseSqft : 0,
        rate,
      })),
    };
  }
  if (type === "tileShower") {
    return {
      width: 3,
      depth: 5,
      height: 8,
      openWidth: 3,
      tileLevel: "Mid",
      baseType: "Acrylic",
      nicheCount: 0,
      bench: false,
      extraLabor: 0,
    };
  }
  if (type === "backsplash") {
    return {
      lengthFt: 12,
      heightInches: 18,
      tileLevel: "Mid",
      installRate: calculatorDefaults.backsplash.installRate,
    };
  }
  if (type === "paintDoorsTrim") {
    return {
      doorQty: 0,
      doorHeight: '80"',
      doorColour: "Light Paint",
      trimFinish: "Reg. Paint",
      mouldingLf: Math.round(projectInputs().houseSqft * 0.88),
      misc: 0,
    };
  }
  if (type === "move") {
    return {
      moveType: "Regular RTM",
      widthBucket: "23'-25'",
      lengthClass: "Less than 57'",
      eavesWidth: 24,
      sqft: projectInputs().houseSqft,
      kms: projectInputs().travelDistance,
      fuelBracket: "$1.66 - $1.75",
      siteVisit: false,
      additionalHours: 0,
      highLift46: false,
      highLiftOver6: 0,
      extraEscort: false,
      petrofka: false,
      backwards: false,
      beamPockets: false,
      albertaPermit: false,
      simpleHeightClass: "<4.1m (13' 6\")",
      simpleLoadedKms: projectInputs().travelDistance,
      simpleDemobKms: 0,
      simpleFuelBracket: "< $1.55",
    };
  }
  if (type === "deliveryKm") return { trips: 1, kms: projectInputs().travelDistance, rate: 6.5 };
  if (type === "projectPercent") {
    const text = line?.description?.toLowerCase?.() || "";
    return { percent: text.includes("contingency") ? 4 : 2, base: "construction" };
  }
  return {};
}

function getCalcValues(line) {
  const type = calculatorType(line);
  if (!type) return {};
  if (!state.calcValues[line.id]) state.calcValues[line.id] = defaultCalcValues(type, line);
  return state.calcValues[line.id];
}

function ratePickOptions(line) {
  const description = line.description.toLowerCase();
  const section = line.section.toLowerCase();
  const picks = [
    {
      match: () => description === "pine ceiling",
      options: [
        ["Knotty pine", 2.75],
        ["Primed pine", 4.25],
      ],
    },
    {
      match: () => description === "metal roof upgrade",
      options: [
        ["Tuff-Rib", 2],
        ["Snaplock", 4],
      ],
    },
    {
      match: () => description === "upgraded siding",
      options: [
        ["Hardie", 4],
        ["CanExel / SmartSide", 5],
      ],
    },
    {
      match: () => description === "decking materials",
      options: [
        ["ACQ", 4.5],
        ["Fir Select", 5],
        ["Composite", 18.75],
      ],
    },
    {
      match: () => description === "deck framing materials (dni stairs)",
      options: [
        ["Standard deck", 8],
        ["Covered deck", 25],
        ["Covered deck premium", 30],
      ],
    },
    {
      match: () => description === "upgraded shingles",
      options: [
        ["Low upgrade", 10],
        ["Mid upgrade", 15],
        ["High upgrade", 20],
      ],
    },
    {
      match: () => description === "tall walls",
      options: [
        ["9 ft walls", 2],
        ["10 ft walls", 4],
      ],
    },
    {
      match: () => description.includes("soffit") && description.includes("fas"),
      options: [
        ["1 story", 2],
        ["2 story", 2.5],
      ],
    },
    {
      match: () => description === "parging",
      options: [
        ["Standard grey", 6.5],
        ["Acrylic color", 7.5],
      ],
    },
    {
      match: () => description === "waterproof decking",
      options: [
        ["Roll on", 15],
        ["Tufdek", 18],
      ],
    },
    {
      match: () => description === "deck railing" && section === "exterior",
      options: [
        ["ACQ", 15],
        ["Regal", 25],
        ["Regal glass", 55],
      ],
    },
    {
      match: () => description === "decking install",
      options: [
        ["Treated / cedar", 2.5],
        ["Composite", 3.5],
      ],
    },
    {
      match: () => description === "house" && section === "finishing",
      options: [
        ["Good", 3],
        ["Better", 4],
        ["Best", 5.5],
      ],
    },
    {
      match: () => description === "pine ceilings" && section === "finishing",
      options: [
        ["8 ft - 10 ft", 3.5],
        ["11 ft - 13 ft", 4.5],
        ["14 ft - 20 ft", 5.5],
      ],
    },
  ];
  return picks.find((pick) => pick.match())?.options || null;
}

function sectionMargin(sectionName) {
  return projectInputs().targetMargin;
}

function createEstimateLines({ blank = false } = {}) {
  const inputs = projectInputs();
  return state.library.line_items.map((item, index) => {
    const line = {
      id: `${item.section_sort}-${item.source_row}-${index}`,
      section: item.section,
      sourceRow: item.source_row,
      code: item.cost_code || "",
      category: defaultLineType(item),
      description: cleanDefaultDescription(item.description || ""),
      customerDescription: "",
      note: item.pricing_note || "",
      quantity: blank ? "" : resolveDefaultQuantity(item.default_quantity, inputs),
      quantitySource: quantitySource(item.default_quantity),
      quantityManual: blank,
      unit: item.unit || "Package",
      unitCost: blank ? "" : typeof item.default_unit_cost === "number" ? item.default_unit_cost : 0,
      margin: blank ? "" : sectionMargin(item.section),
      pst: item.tax_pst_default !== false,
      gst: item.tax_gst_default !== false,
      visible: item.customer_visible_default !== false,
      includeProposal: item.customer_visible_default !== false,
      includeContract: item.customer_visible_default !== false,
      proposalSort: (index + 1) * 10,
      proposalIndent: 0,
    };
    line.proposalSection = defaultProposalSection(line);
    return line;
  });
}

function hydrateLines() {
  state.lines = createEstimateLines();
  state.calcValues = {};
  state.allowanceValues = {};
  state.openCalcLineId = null;
  moveContingencyUnderPmFees();
  state.library.sections.forEach((section) => state.expanded.add(section.section_name));
}

function hydrateBlankEstimate() {
  state.lines = createEstimateLines({ blank: true });
  state.calcValues = {};
  state.allowanceValues = {};
  state.openCalcLineId = null;
  moveContingencyUnderPmFees();
  state.library.sections.forEach((section) => state.expanded.add(section.section_name));
}

function serializeEstimateState() {
  return {
    lines: state.lines.map((line) => ({
      id: line.id,
      category: line.category,
      description: line.description,
      customerDescription: line.customerDescription || "",
      proposalSection: line.proposalSection || defaultProposalSection(line),
      proposalSort: num(line.proposalSort),
      proposalIndent: num(line.proposalIndent),
      includeProposal: line.includeProposal !== false,
      includeContract: line.includeContract !== false,
      quantity: line.quantity === "" ? "" : num(line.quantity),
      quantitySource: line.quantitySource || "",
      quantityManual: Boolean(line.quantityManual),
      unit: line.unit,
      unitCost: line.unitCost === "" ? "" : num(line.unitCost),
      margin: line.margin === "" ? "" : num(line.margin),
      pst: Boolean(line.pst),
      gst: Boolean(line.gst),
      visible: Boolean(line.visible),
    })),
    calcValues: state.calcValues || {},
    allowanceValues: state.allowanceValues || {},
  };
}

function restoreEstimateState(estimate) {
  hydrateBlankEstimate();
  const savedLines = Array.isArray(estimate?.lines) ? estimate.lines : [];
  if (!savedLines.length) return;
  const savedById = new Map(savedLines.map((line) => [line.id, line]));
  state.lines = state.lines.map((line) => {
    const saved = savedById.get(line.id);
    if (!saved) return line;
    return {
      ...line,
      category: saved.category || line.category,
      description: saved.description || line.description,
      customerDescription: saved.customerDescription || "",
      proposalSection: saved.proposalSection || line.proposalSection || defaultProposalSection(line),
      proposalSort: saved.proposalSort === "" || saved.proposalSort === undefined ? line.proposalSort : num(saved.proposalSort),
      proposalIndent: saved.proposalIndent === "" || saved.proposalIndent === undefined ? 0 : num(saved.proposalIndent),
      includeProposal: saved.includeProposal !== undefined ? Boolean(saved.includeProposal) : line.includeProposal !== false,
      includeContract: saved.includeContract !== undefined ? Boolean(saved.includeContract) : line.includeContract !== false,
      quantity: saved.quantity === "" ? "" : num(saved.quantity),
      quantitySource: saved.quantitySource ?? line.quantitySource,
      quantityManual: saved.quantityManual !== undefined ? Boolean(saved.quantityManual) : true,
      unit: saved.unit || line.unit,
      unitCost: saved.unitCost === "" ? "" : num(saved.unitCost),
      margin: saved.margin === "" ? "" : num(saved.margin),
      pst: saved.pst !== undefined ? Boolean(saved.pst) : line.pst,
      gst: saved.gst !== undefined ? Boolean(saved.gst) : line.gst,
      visible: saved.visible !== undefined ? Boolean(saved.visible) : line.visible,
    };
  });
  state.calcValues = estimate?.calcValues && typeof estimate.calcValues === "object" ? estimate.calcValues : {};
  state.allowanceValues = estimate?.allowanceValues && typeof estimate.allowanceValues === "object" ? estimate.allowanceValues : {};
  moveContingencyUnderPmFees();
}

function cleanDefaultDescription(description) {
  return String(description)
    .replace(/^6"\s*/i, "")
    .replace(/^18"\s*/i, "")
    .replace(/^House Allowance$/i, "Flooring Allowances")
    .replace(/^Gas Fireplace$/i, "Gas Fireplace Allowance")
    .replace(/^Wood Fireplace$/i, "Wood Fireplace Allowance")
    .replace("Vanity Backsplash Allowance", "Vanity Backsplash Allowance")
    .replace("Kitchen Backsplash Allowance", "Kitchen Backsplash Allowance");
}

function moveContingencyUnderPmFees() {
  const pmIndex = state.lines.findIndex((line) => line.description.toLowerCase().includes("pm & ss fees"));
  const contingencyIndex = state.lines.findIndex((line) => line.description.toLowerCase() === "contingency");
  if (pmIndex === -1 || contingencyIndex === -1 || contingencyIndex === pmIndex + 1) return;
  const [contingency] = state.lines.splice(contingencyIndex, 1);
  const adjustedPmIndex = state.lines.findIndex((line) => line.description.toLowerCase().includes("pm & ss fees"));
  state.lines.splice(adjustedPmIndex + 1, 0, contingency);
}

function isPineCeilingSource(line) {
  return line.section === "Project Materials" && line.description.toLowerCase() === "pine ceiling";
}

function syncLinkedPineCeilingQuantities() {
  const source = state.lines.find(isPineCeilingSource);
  if (!source) return;
  state.lines.forEach((line) => {
    const description = line.description.toLowerCase();
    const isPaintPineStaining = line.section === "Paint" && description === "pine staining";
    const isFinishingPineCeilings = line.section === "Finishing" && description === "pine ceilings";
    if (isPaintPineStaining || isFinishingPineCeilings) {
      line.quantity = num(source.quantity);
      line.quantityManual = false;
    }
  });
}

function lineTotals(line, inputs = projectInputs()) {
  const cost = num(line.quantity) * num(line.unitCost);
  const margin = Math.min(num(line.margin) / 100, 0.95);
  const retail = margin >= 0.95 ? cost : cost / (1 - margin);
  const pst = line.pst ? retail * inputs.pstRate : 0;
  const gst = line.gst ? retail * inputs.gstRate : 0;
  return { cost, retail, pst, gst, total: retail + pst + gst };
}

function allowanceAmount(line) {
  return lineTotals(line).retail;
}

function sectionTotals(sectionName, inputs = projectInputs()) {
  return state.lines
    .filter((line) => line.section === sectionName)
    .reduce(
      (acc, line) => {
        const totals = lineTotals(line, inputs);
        acc.cost += totals.cost;
        acc.retail += totals.retail;
        acc.pst += totals.pst;
        acc.gst += totals.gst;
        acc.total += totals.total;
        return acc;
      },
      { cost: 0, retail: 0, pst: 0, gst: 0, total: 0 },
    );
}

function grandTotals() {
  return state.lines.reduce(
    (acc, line) => {
      const totals = lineTotals(line);
      acc.cost += totals.cost;
      acc.retail += totals.retail;
      acc.pst += totals.pst;
      acc.gst += totals.gst;
      acc.total += totals.total;
      return acc;
    },
    { cost: 0, retail: 0, pst: 0, gst: 0, total: 0 },
  );
}

function estimateSnapshot() {
  const totals = grandTotals();
  const lines = state.lines
    .filter((line) => line.visible && (num(line.quantity) || num(line.unitCost)))
    .map((line) => {
      const lineTotal = lineTotals(line);
      return {
        id: line.id,
        section: line.section,
        code: line.code,
        category: line.category,
        description: line.description,
        customerDescription: line.customerDescription || "",
        proposalSection: line.proposalSection || defaultProposalSection(line),
        proposalSort: num(line.proposalSort),
        proposalIndent: num(line.proposalIndent),
        includeProposal: line.includeProposal !== false,
        includeContract: line.includeContract !== false,
        quantity: num(line.quantity),
        unit: line.unit,
        unitCost: num(line.unitCost),
        margin: num(line.margin),
        pst: Boolean(line.pst),
        gst: Boolean(line.gst),
        retail: lineTotal.retail,
        total: lineTotal.total,
      };
    });
  return {
    totals,
    lines,
    fingerprint: JSON.stringify(
      lines.map((line) => [
        line.id,
        line.description,
        line.customerDescription,
        line.proposalSection,
        line.proposalSort,
        line.proposalIndent,
        line.includeProposal,
        line.includeContract,
        line.quantity,
        line.unit,
        line.unitCost,
        line.margin,
        line.pst,
        line.gst,
      ]),
    ),
  };
}

function syncProjectQuantities() {
  const inputs = projectInputs();
  state.lines.forEach((line) => {
    if (line.description.toLowerCase() === "project service work") {
      if (line.quantityManual && !num(line.quantity) && !num(line.unitCost)) return;
      line.quantity = projectServiceHours();
      line.quantityManual = false;
      return;
    }
    if (calculatorType(line) === "projectPercent") {
      if (line.quantityManual && !num(line.quantity) && !num(line.unitCost)) return;
      const values = getCalcValues(line);
      values.percent = projectCostPercent();
      values.base = "construction";
      applyCalculator(line);
      return;
    }
    if (line.quantityManual || !line.quantitySource) return;
    line.quantity = inputs[line.quantitySource] ?? line.quantity;
  });
  syncLinkedPineCeilingQuantities();

  Object.entries(state.calcValues).forEach(([lineId, values]) => {
    const line = state.lines.find((item) => item.id === lineId);
    if (!line) return;
    const type = calculatorType(line);
    if (type === "roof" && !values.roofDimensionsManual) {
      const width = num(values.width, 28) || 28;
      values.length = Math.round(inputs.houseSqft / width);
    }
    if (type === "flooring" && !values.flooringManual && values.rows?.[0]) {
      values.rows[0].sqft = inputs.houseSqft;
    }
    if (type === "paintDoorsTrim" && !values.paintDoorsTrimManual) {
      values.mouldingLf = Math.round(inputs.houseSqft * 0.88);
    }
    if (type === "move" && !values.moveManual) {
      values.sqft = inputs.houseSqft;
      values.kms = inputs.travelDistance;
      values.simpleLoadedKms = inputs.travelDistance;
    }
    if (type === "deliveryKm" && !values.deliveryManual) values.kms = inputs.travelDistance;
    if (type === "travel" && !values.distanceManual) values.distance = inputs.travelDistance;
  });
}

function updateTotals() {
  const totals = grandTotals();
  const margin = totals.retail > 0 ? (1 - totals.cost / totals.retail) * 100 : 0;
  const sqft = num(els.houseSqft.value);
  els.totalCost.textContent = money.format(totals.cost);
  els.totalRetail.textContent = money.format(totals.retail);
  els.totalPst.textContent = money.format(totals.pst);
  els.totalGst.textContent = money.format(totals.gst);
  els.grandTotal.textContent = money.format(totals.total);
  els.marginPct.textContent = `${margin.toFixed(1)}%`;
  els.priceSqft.textContent = sqft > 0 ? money.format(totals.total / sqft) : "$0";
}

function filteredSections() {
  const search = els.searchInput.value.trim().toLowerCase();
  const filter = els.sectionFilter.value;
  return state.library.sections.filter((section) => {
    if (filter !== "All" && section.section_name !== filter) return false;
    if (!search) return true;
    if (section.section_name.toLowerCase().includes(search)) return true;
    return state.lines.some(
      (line) =>
        line.section === section.section_name &&
        [line.description, line.customerDescription, line.code, line.category, line.unit]
          .join(" ")
          .toLowerCase()
          .includes(search),
    );
  });
}

function renderSections() {
  const inputs = projectInputs();
  els.sectionsList.innerHTML = "";
  for (const section of filteredSections()) {
    const totals = sectionTotals(section.section_name, inputs);
    const expanded = state.expanded.has(section.section_name);
    const wrapper = document.createElement("article");
    wrapper.className = "estimate-section";
    wrapper.innerHTML = `
      <button class="section-head" data-toggle-section="${section.section_name}">
        <div><strong>${section.section_name}</strong><br><span>${state.lines.filter((line) => line.section === section.section_name).length} line items</span></div>
        <span>Cost ${money.format(totals.cost)}</span>
        <span>Retail ${money.format(totals.retail)}</span>
        <span>Tax ${money.format(totals.pst + totals.gst)}</span>
        <span>Total ${money.format(totals.total)}</span>
      </button>
      ${expanded ? renderLineTable(section.section_name) : ""}
    `;
    els.sectionsList.appendChild(wrapper);
  }
}

function renderLineTable(sectionName) {
  const lines = state.lines.filter((line) => line.section === sectionName);
  return `
    <table class="line-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Type</th>
          <th class="desc">Description</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Unit cost</th>
          <th>Margin</th>
          <th>PST</th>
          <th>GST</th>
          <th>Retail</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${lines
          .map((line) => {
            const totals = lineTotals(line);
            const calcType = calculatorType(line);
            const rateOptions = ratePickOptions(line);
            return `
              <tr data-line="${line.id}">
                <td>${line.code}</td>
                <td>
                  <select data-field="category">
                    ${["Material", "Labor", "Material & Labor", "Allowance", "Subcontract", "Project Cost", "Calculator"]
                      .map((option) => `<option ${line.category === option ? "selected" : ""}>${option}</option>`)
                      .join("")}
                  </select>
                </td>
                <td class="desc">
                  <input data-field="description" value="${escapeAttr(line.description)}" />
                  <textarea class="line-customer-description" data-field="customerDescription" rows="2" placeholder="Proposal / contract description">${escapeAttr(line.customerDescription || "")}</textarea>
                  <div class="line-scope-controls">
                    <label>
                      Scope section
                      <select data-field="proposalSection">${proposalSectionOptionsHtml(line.proposalSection || defaultProposalSection(line))}</select>
                    </label>
                    <label>
                      Order
                      <input data-field="proposalSort" type="number" value="${line.proposalSort ?? ""}" step="1" />
                    </label>
                    <label>
                      Indent
                      <select data-field="proposalIndent">
                        <option value="0" ${num(line.proposalIndent) === 0 ? "selected" : ""}>Main bullet</option>
                        <option value="1" ${num(line.proposalIndent) === 1 ? "selected" : ""}>Sub-bullet</option>
                      </select>
                    </label>
                    <label class="line-check">
                      <input data-field="includeProposal" type="checkbox" ${line.includeProposal !== false ? "checked" : ""} />
                      Proposal
                    </label>
                    <label class="line-check">
                      <input data-field="includeContract" type="checkbox" ${line.includeContract !== false ? "checked" : ""} />
                      Contract
                    </label>
                  </div>
                  <div class="line-tools">
                    ${line.note ? `<span class="note">${line.note}</span>` : "<span></span>"}
                    ${
                      rateOptions
                        ? `<select class="rate-pick" data-rate-pick="${line.id}">
                            <option value="">Pick rate</option>
                            ${rateOptions.map(([label, rate]) => `<option value="${rate}" ${num(line.unitCost) === rate ? "selected" : ""}>${label} - ${money.format(rate)}</option>`).join("")}
                          </select>`
                        : ""
                    }
                    ${calcType ? `<button class="mini-button" data-open-calc="${line.id}" type="button">Calc</button>` : ""}
                  </div>
                </td>
                <td><input data-field="quantity" type="number" value="${line.quantity}" step="0.01" /></td>
                <td><input data-field="unit" value="${escapeAttr(line.unit)}" /></td>
                <td><input data-field="unitCost" type="number" value="${line.unitCost}" step="0.01" /></td>
                <td><input data-field="margin" type="number" value="${line.margin}" step="0.1" /></td>
                <td><input data-field="pst" type="checkbox" ${line.pst ? "checked" : ""} /></td>
                <td><input data-field="gst" type="checkbox" ${line.gst ? "checked" : ""} /></td>
                <td class="money">${money.format(totals.retail)}</td>
                <td class="money">${money.format(totals.total)}</td>
              </tr>
              ${state.openCalcLineId === line.id ? renderCalculatorPanel(line, calcType) : ""}
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderCalculatorPanel(line, type) {
  if (!type) return "";
  const values = getCalcValues(line);
  return `
    <tr class="calculator-row" data-calculator="${line.id}">
      <td colspan="11">
        <div class="calculator-panel">
          <div>
            <h4>${line.description} calculator</h4>
            <p>${calculatorHelp(type)}</p>
          </div>
          ${calculatorFields(line, type, values)}
        </div>
      </td>
    </tr>
  `;
}

function calculatorHelp(type) {
  const help = {
    windows: "Enter window quantities. The package total pushes back to this estimate line.",
    windowDoorUpgrade: "Apply a color upgrade as a percentage of the current Windows and Doors costs.",
    doors: "Enter door and add-on quantities. The package total pushes back to this estimate line.",
    fixtures: "Enter sink/toilet and tub/shower counts. The allowance pushes back to this estimate line.",
    flooring: "Enter the square footage and installed rate for each flooring type. The total pushes back to this allowance line.",
    tileShower: "Build a custom tile shower allowance from size, shower base, tile level, and install cost.",
    backsplash: "Calculate backsplash cost from length, height, tile level, and install rate.",
    paintDoorsTrim: "Calculate interior door painting, door colour upcharge, and trim/moulding painting like the original paint sheet.",
    move: "Calculate regular RTM or Simple Home moving costs using the Mantt worksheet formulas.",
    deliveryKm: "Calculate delivery cost from number of trips, one-way kilometres, and rate per km.",
    projectPercent: "Calculate this as a percentage of the construction subtotal, keeping it broken out as its own line.",
    roof: "Enter roof footprint and slope. Bundle lines use bundles; metal lines use roof square feet.",
    siding: "Enter siding, trim, and cladding quantities. The total pushes back as a package cost.",
    travel: "Estimate mileage, crew travel, meals, accommodations, and misc travel costs.",
  };
  return help[type] || "";
}

function calculatorFields(line, type, values) {
  if (type === "windows") return itemQuantityCalculator("windows", line, calculatorDefaults.windows.sizes, values.quantities);
  if (type === "doors") return itemQuantityCalculator("doors", line, calculatorDefaults.doors.sizes, values.quantities);
  if (type === "siding") return itemQuantityCalculator("siding", line, calculatorDefaults.siding.items, values.quantities);
  if (type === "fixtures") {
    const total = calculateFixtures(values);
    return `
      <div class="calc-grid compact">
        <label>Sinks / toilets
          <input data-calc-field="sinkToiletQty" type="number" value="${values.sinkToiletQty}" min="0" step="1" />
        </label>
        <div class="calc-result"><span>Rate each</span><strong>${money.format(calculatorDefaults.fixtures.sinkToiletRate)}</strong></div>
        <label>Tubs / showers
          <input data-calc-field="tubShowerQty" type="number" value="${values.tubShowerQty}" min="0" step="1" />
        </label>
        <div class="calc-result"><span>Rate each</span><strong>${money.format(calculatorDefaults.fixtures.tubShowerRate)}</strong></div>
        <div class="calc-result"><span>Allowance cost</span><strong>${money.format(total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "flooring") {
    const total = calculateFlooring(values);
    const sqftTotal = values.rows.reduce((sum, row) => sum + num(row.sqft), 0);
    return `
      <div class="flooring-calc">
        <div class="flooring-head">
          <span>Flooring type</span>
          <span>Sq ft</span>
          <span>Rate</span>
          <span>Total</span>
        </div>
        ${values.rows
          .map(
            (row, index) => `
              <div class="flooring-row">
                <input data-flooring-index="${index}" data-flooring-field="name" value="${escapeAttr(row.name)}" />
                <input data-flooring-index="${index}" data-flooring-field="sqft" type="number" value="${num(row.sqft)}" min="0" step="1" />
                <input data-flooring-index="${index}" data-flooring-field="rate" type="number" value="${num(row.rate)}" min="0" step="0.01" />
                <strong>${money.format(num(row.sqft) * num(row.rate))}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="calc-footer">
        <div class="calc-result"><span>Total sq ft</span><strong>${sqftTotal.toLocaleString()}</strong></div>
        <div class="calc-result"><span>Flooring allowance</span><strong>${money.format(total)}</strong></div>
        <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
      </div>
    `;
  }
  if (type === "tileShower") {
    const result = calculateTileShower(values);
    return `
      <div class="calc-grid compact">
        <label>Width ft <input data-calc-field="width" type="number" value="${values.width}" min="0" step="0.5" /></label>
        <label>Depth ft <input data-calc-field="depth" type="number" value="${values.depth}" min="0" step="0.5" /></label>
        <label>Tile height ft <input data-calc-field="height" type="number" value="${values.height}" min="0" step="0.5" /></label>
        <label>Opening width ft <input data-calc-field="openWidth" type="number" value="${values.openWidth}" min="0" step="0.5" /></label>
        <label>Tile level
          <select data-calc-field="tileLevel">
            ${Object.keys(calculatorDefaults.tileShower.tileLevels).map((level) => `<option ${values.tileLevel === level ? "selected" : ""}>${level}</option>`).join("")}
          </select>
        </label>
        <label>Shower base
          <select data-calc-field="baseType">
            ${Object.keys(calculatorDefaults.tileShower.baseTypes).map((base) => `<option ${values.baseType === base ? "selected" : ""}>${base}</option>`).join("")}
          </select>
        </label>
        <label>Niches <input data-calc-field="nicheCount" type="number" value="${values.nicheCount}" min="0" step="1" /></label>
        <label class="check-label"><input data-calc-field="bench" type="checkbox" ${values.bench ? "checked" : ""} /> Bench</label>
        <label>Extra labor <input data-calc-field="extraLabor" type="number" value="${values.extraLabor}" min="0" step="50" /></label>
        <div class="calc-result"><span>Tile sq ft</span><strong>${Math.round(result.tileSqft)}</strong></div>
        <div class="calc-result"><span>Tile allowance</span><strong>${money.format(result.tileAllowance)}</strong></div>
        <div class="calc-result"><span>Install/base cost</span><strong>${money.format(result.installAndBase)}</strong></div>
        <div class="calc-result"><span>Total shower</span><strong>${money.format(result.total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "backsplash") {
    const result = calculateBacksplash(values);
    return `
      <div class="calc-grid compact">
        <label>Length ft <input data-calc-field="lengthFt" type="number" value="${values.lengthFt}" min="0" step="0.5" /></label>
        <label>Height inches
          <select data-calc-field="heightInches">
            ${[4, 6, 12, 18, 24, 30, 36].map((height) => `<option value="${height}" ${num(values.heightInches) === height ? "selected" : ""}>${height}"</option>`).join("")}
          </select>
        </label>
        <label>Tile level
          <select data-calc-field="tileLevel">
            ${Object.keys(calculatorDefaults.backsplash.tileLevels).map((level) => `<option ${values.tileLevel === level ? "selected" : ""}>${level}</option>`).join("")}
          </select>
        </label>
        <label>Install rate <input data-calc-field="installRate" type="number" value="${values.installRate}" min="0" step="1" /></label>
        <div class="calc-result"><span>Backsplash sq ft</span><strong>${result.sqft.toFixed(1)}</strong></div>
        <div class="calc-result"><span>Tile allowance</span><strong>${money.format(result.tileAllowance)}</strong></div>
        <div class="calc-result"><span>Install cost</span><strong>${money.format(result.installCost)}</strong></div>
        <div class="calc-result"><span>Total backsplash</span><strong>${money.format(result.total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "paintDoorsTrim") {
    const result = calculatePaintDoorsTrim(values);
    return `
      <div class="calc-grid compact">
        <label>Interior door qty
          <input data-calc-field="doorQty" type="number" value="${values.doorQty}" min="0" step="1" />
        </label>
        <label>Door height
          <select data-calc-field="doorHeight">
            ${Object.keys(calculatorDefaults.paintDoorsTrim.doorHeights).map((height) => `<option ${values.doorHeight === height ? "selected" : ""}>${height}</option>`).join("")}
          </select>
        </label>
        <label>Door colour
          <select data-calc-field="doorColour">
            ${Object.keys(calculatorDefaults.paintDoorsTrim.doorColours).map((finish) => `<option ${values.doorColour === finish ? "selected" : ""}>${finish}</option>`).join("")}
          </select>
        </label>
        <label>Trim finish
          <select data-calc-field="trimFinish">
            ${Object.keys(calculatorDefaults.paintDoorsTrim.trimFinishes).map((finish) => `<option ${values.trimFinish === finish ? "selected" : ""}>${finish}</option>`).join("")}
          </select>
        </label>
        <label>Moulding lin ft
          <input data-calc-field="mouldingLf" type="number" value="${values.mouldingLf}" min="0" step="1" />
        </label>
        <label>Misc
          <input data-calc-field="misc" type="number" value="${values.misc}" min="0" step="25" />
        </label>
        <div class="calc-result"><span>Doors</span><strong>${money.format(result.doors)}</strong></div>
        <div class="calc-result"><span>Colour add</span><strong>${money.format(result.colour)}</strong></div>
        <div class="calc-result"><span>Trim</span><strong>${money.format(result.trim)}</strong></div>
        <div class="calc-result"><span>Total paint</span><strong>${money.format(result.total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "move") {
    const regular = calculateRegularMove(values);
    const simple = calculateSimpleMove(values);
    const result = values.moveType === "Simple Home" ? simple : regular;
    return `
      <div class="calc-grid compact">
        <label>Move type
          <select data-calc-field="moveType">
            ${["Regular RTM", "Simple Home"].map((typeName) => `<option ${values.moveType === typeName ? "selected" : ""}>${typeName}</option>`).join("")}
          </select>
        </label>
        ${
          values.moveType === "Simple Home"
            ? simpleMoveFields(values, simple)
            : regularMoveFields(values, regular)
        }
        <div class="calc-result"><span>Move subtotal</span><strong>${money.format(result.subtotal)}</strong></div>
        <div class="calc-result"><span>Permit</span><strong>${money.format(result.permit)}</strong></div>
        <div class="calc-result"><span>Fuel surcharge</span><strong>${money.format(result.fuelSurcharge)}</strong></div>
        <div class="calc-result"><span>Total move</span><strong>${money.format(result.total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "deliveryKm") {
    const result = calculateDeliveryKm(values);
    return `
      <div class="calc-grid compact">
        <label>Trips
          <input data-calc-field="trips" type="number" value="${values.trips}" min="0" step="1" />
        </label>
        <label>One-way kms
          <input data-calc-field="kms" type="number" value="${values.kms}" min="0" step="1" />
        </label>
        <label>Rate / km
          <input data-calc-field="rate" type="number" value="${values.rate}" min="0" step="0.01" />
        </label>
        <div class="calc-result"><span>Delivery cost</span><strong>${money.format(result)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "projectPercent") {
    const base = projectPercentBase(values, line);
    const total = base * (num(values.percent) / 100);
    return `
      <div class="calc-grid compact">
        <label>Percent
          <input data-calc-field="percent" type="number" value="${values.percent}" min="0" step="0.1" />
        </label>
        <label>Base
          <select data-calc-field="base">
            <option value="construction" ${values.base === "construction" ? "selected" : ""}>Construction subtotal</option>
            <option value="retail" ${values.base === "retail" ? "selected" : ""}>Retail before tax</option>
          </select>
        </label>
        <div class="calc-result"><span>Base amount</span><strong>${money.format(base)}</strong></div>
        <div class="calc-result"><span>Calculated cost</span><strong>${money.format(total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "windowDoorUpgrade") {
    const base = windowDoorBaseCost(values);
    const amount = base * (num(values.percent) / 100);
    return `
      <div class="calc-grid compact">
        <label>Upgrade %
          <input data-calc-field="percent" type="number" value="${values.percent}" min="0" step="0.1" />
        </label>
        <label class="check-label">
          <input data-calc-field="includeWindows" type="checkbox" ${values.includeWindows ? "checked" : ""} />
          Include windows
        </label>
        <label class="check-label">
          <input data-calc-field="includeDoors" type="checkbox" ${values.includeDoors ? "checked" : ""} />
          Include doors
        </label>
        <div class="calc-result"><span>Base cost</span><strong>${money.format(base)}</strong></div>
        <div class="calc-result"><span>Upgrade cost</span><strong>${money.format(amount)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "roof") {
    const slopeOptions = calculatorDefaults.roof.slopes
      .map(([slope]) => `<option value="${slope}" ${num(values.slope) === slope ? "selected" : ""}>${slope}/12</option>`)
      .join("");
    const result = calculateRoof(values);
    return `
      <div class="calc-grid compact">
        <label>Building length
          <input data-calc-field="length" type="number" value="${values.length}" min="0" step="0.5" />
        </label>
        <label>Building width
          <input data-calc-field="width" type="number" value="${values.width}" min="0" step="0.5" />
        </label>
        <label>Eaves overhang
          <select data-calc-field="overhangInches">
            ${[0, 6, 12, 16, 18, 24, 30, 36].map((inches) => `<option value="${inches}" ${num(values.overhangInches) === inches ? "selected" : ""}>${inches}"</option>`).join("")}
          </select>
        </label>
        <label>Roof pitch
          <select data-calc-field="slope">${slopeOptions}</select>
        </label>
        <label>Waste %
          <input data-calc-field="wastePercent" type="number" value="${values.wastePercent}" min="0" step="1" />
        </label>
        <div class="calc-result"><span>Adjusted footprint</span><strong>${Math.round(result.adjustedFootprint).toLocaleString()}</strong></div>
        <div class="calc-result"><span>Roof sq ft</span><strong>${Math.round(result.roofSqft).toLocaleString()}</strong></div>
        <div class="calc-result"><span>Bundles</span><strong>${Math.ceil(result.bundles).toLocaleString()}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  if (type === "travel") {
    const result = calculateTravel(values);
    return `
      <div class="calc-grid compact">
        <label>Distance no trailer <input data-calc-field="distance" type="number" value="${values.distance}" /></label>
        <label>Distance with trailer <input data-calc-field="trailerDistance" type="number" value="${values.trailerDistance}" /></label>
        <label>Crew size <input data-calc-field="crew" type="number" value="${values.crew}" step="0.5" /></label>
        <label>Nights <input data-calc-field="nights" type="number" value="${values.nights}" /></label>
        <label>Misc <input data-calc-field="misc" type="number" value="${values.misc}" /></label>
        <div class="calc-result"><span>Travel cost</span><strong>${money.format(result.total)}</strong></div>
      </div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    `;
  }
  return "";
}

function itemQuantityCalculator(type, line, rows, quantities) {
  const total = rows.reduce((sum, [, rate], index) => sum + num(quantities[index]) * rate, 0);
  return `
    <div class="calc-list">
      ${rows
        .map(
          ([label, rate], index) => `
            <label>
              <span>${label}</span>
              <input data-calc-index="${index}" type="number" value="${num(quantities[index])}" min="0" step="1" />
              <small>${money.format(rate)}</small>
            </label>
          `,
        )
        .join("")}
    </div>
    <div class="calc-footer">
      <div class="calc-result"><span>Calculated cost</span><strong>${money.format(total)}</strong></div>
      <button class="mini-button apply" data-apply-calc="${line.id}" type="button">Apply to line</button>
    </div>
  `;
}

function regularMoveFields(values, result) {
  return `
    <label>Width of base
      <select data-calc-field="widthBucket">
        ${calculatorDefaults.moveRegular.widthRates.map((row) => `<option ${values.widthBucket === row.label ? "selected" : ""}>${row.label}</option>`).join("")}
      </select>
    </label>
    <label>Length
      <select data-calc-field="lengthClass">
        ${["Less than 57'", "57' to 69'"].map((item) => `<option ${values.lengthClass === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
    <label>Width at eaves <input data-calc-field="eavesWidth" type="number" value="${values.eavesWidth}" min="0" step="0.5" /></label>
    <label>Sq ft house/decks <input data-calc-field="sqft" type="number" value="${values.sqft}" min="0" step="1" /></label>
    <label>Kms <input data-calc-field="kms" type="number" value="${values.kms}" min="0" step="1" /></label>
    <label>Fuel price
      <select data-calc-field="fuelBracket">
        ${Object.keys(calculatorDefaults.moveRegular.fuel).map((item) => `<option ${values.fuelBracket === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
    <label>Additional hrs <input data-calc-field="additionalHours" type="number" value="${values.additionalHours}" min="0" step="0.5" /></label>
    <label>High lift over 6' <input data-calc-field="highLiftOver6" type="number" value="${values.highLiftOver6}" min="0" step="50" /></label>
    <label class="check-label"><input data-calc-field="siteVisit" type="checkbox" ${values.siteVisit ? "checked" : ""} /> Site visit</label>
    <label class="check-label"><input data-calc-field="highLift46" type="checkbox" ${values.highLift46 ? "checked" : ""} /> High lift 4'-6'</label>
    <label class="check-label"><input data-calc-field="extraEscort" type="checkbox" ${values.extraEscort ? "checked" : ""} /> Extra escort</label>
    <label class="check-label"><input data-calc-field="petrofka" type="checkbox" ${values.petrofka ? "checked" : ""} /> Petrofka</label>
    <label class="check-label"><input data-calc-field="backwards" type="checkbox" ${values.backwards ? "checked" : ""} /> Swap ends</label>
    <label class="check-label"><input data-calc-field="beamPockets" type="checkbox" ${values.beamPockets ? "checked" : ""} /> Beam pockets</label>
    <label class="check-label"><input data-calc-field="albertaPermit" type="checkbox" ${values.albertaPermit ? "checked" : ""} /> Alberta permit</label>
    <div class="calc-result"><span>Distance rate</span><strong>${money.format(result.distanceRate)}/km</strong></div>
  `;
}

function simpleMoveFields(values, result) {
  return `
    <label>Height
      <select data-calc-field="simpleHeightClass">
        ${["<4.1m (13' 6\")", ">4.1m (13' 6\")"].map((item) => `<option ${values.simpleHeightClass === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
    <label>Loaded kms <input data-calc-field="simpleLoadedKms" type="number" value="${values.simpleLoadedKms}" min="0" step="1" /></label>
    <label>Demob kms <input data-calc-field="simpleDemobKms" type="number" value="${values.simpleDemobKms}" min="0" step="1" /></label>
    <label>Additional hrs <input data-calc-field="additionalHours" type="number" value="${values.additionalHours}" min="0" step="0.5" /></label>
    <label>Fuel price
      <select data-calc-field="simpleFuelBracket">
        ${Object.keys(calculatorDefaults.moveSimple.fuel).map((item) => `<option ${values.simpleFuelBracket === item ? "selected" : ""}>${item}</option>`).join("")}
      </select>
    </label>
    <label class="check-label"><input data-calc-field="siteVisit" type="checkbox" ${values.siteVisit ? "checked" : ""} /> Site visit</label>
    <div class="calc-result"><span>Load/unload</span><strong>${money.format(2850)}</strong></div>
    <div class="calc-result"><span>Loaded km cost</span><strong>${money.format(result.loadedCost)}</strong></div>
    <div class="calc-result"><span>Demob cost</span><strong>${money.format(result.demobCost)}</strong></div>
  `;
}

function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function calculateRoof(values) {
  const slope = calculatorDefaults.roof.slopes.find(([item]) => item === num(values.slope)) || [6, 1.12];
  const overhangFeet = num(values.overhangInches) / 12;
  const adjustedLength = num(values.length) + overhangFeet * 2;
  const adjustedWidth = num(values.width) + overhangFeet * 2;
  const adjustedFootprint = adjustedLength * adjustedWidth;
  const wasteFactor = 1 + num(values.wastePercent, 15) / 100;
  const roofSqft = adjustedFootprint * slope[1] * wasteFactor;
  return { adjustedFootprint, roofSqft, bundles: roofSqft / 32 };
}

function calculateTravel(values) {
  const distance = Math.max(num(values.distance) - 50, 0);
  const trailerDistance = Math.max(num(values.trailerDistance) - 50, 0);
  const crew = num(values.crew);
  const nights = num(values.nights);
  const rooms = crew <= 2 ? 1 : crew <= 4 ? 2 : 3;
  const mileage = distance * calculatorDefaults.travel.mileageRate;
  const trailer = trailerDistance * calculatorDefaults.travel.trailerRate;
  const crewTravel = crew * (distance + trailerDistance) * calculatorDefaults.travel.crewKmRate;
  const meals = crew * nights * calculatorDefaults.travel.meals;
  const accommodations = rooms * nights * calculatorDefaults.travel.accommodations;
  return { total: mileage + trailer + crewTravel + meals + accommodations + num(values.misc) };
}

function calculateFixtures(values) {
  return (
    num(values.sinkToiletQty) * calculatorDefaults.fixtures.sinkToiletRate +
    num(values.tubShowerQty) * calculatorDefaults.fixtures.tubShowerRate
  );
}

function calculateFlooring(values) {
  return values.rows.reduce((sum, row) => sum + num(row.sqft) * num(row.rate), 0);
}

function calculateTileShower(values) {
  const wallArea = Math.max((num(values.width) * 2 + num(values.depth) * 2 - num(values.openWidth)) * num(values.height), 0);
  const floorArea = num(values.width) * num(values.depth);
  const nicheArea = num(values.nicheCount) * 8;
  const benchArea = values.bench ? 15 : 0;
  const tileSqft = (wallArea + floorArea + nicheArea + benchArea) * 1.12;
  const tileRate = calculatorDefaults.tileShower.tileLevels[values.tileLevel] ?? calculatorDefaults.tileShower.tileLevels.Mid;
  const baseCost = calculatorDefaults.tileShower.baseTypes[values.baseType] ?? calculatorDefaults.tileShower.baseTypes.Acrylic;
  const tileAllowance = tileSqft * tileRate;
  const installCost = tileSqft * calculatorDefaults.tileShower.installRate + num(values.nicheCount) * 250 + (values.bench ? 600 : 0);
  const installAndBase = installCost + baseCost + num(values.extraLabor);
  return { tileSqft, tileAllowance, installCost, installAndBase, total: tileAllowance + installAndBase };
}

function calculateBacksplash(values) {
  const sqft = num(values.lengthFt) * (num(values.heightInches) / 12);
  const tileRate = calculatorDefaults.backsplash.tileLevels[values.tileLevel] ?? calculatorDefaults.backsplash.tileLevels.Mid;
  const tileAllowance = sqft * tileRate;
  const installCost = Math.max(sqft * num(values.installRate), calculatorDefaults.backsplash.minInstall);
  return { sqft, tileAllowance, installCost, total: tileAllowance + installCost };
}

function calculatePaintDoorsTrim(values) {
  const doorRate = calculatorDefaults.paintDoorsTrim.doorHeights[values.doorHeight] ?? 40;
  const colourRate = calculatorDefaults.paintDoorsTrim.doorColours[values.doorColour] ?? 10;
  const trimRate = calculatorDefaults.paintDoorsTrim.trimFinishes[values.trimFinish] ?? 0.16;
  const doors = num(values.doorQty) * doorRate;
  const colour = num(values.doorQty) * colourRate;
  const trim = num(values.mouldingLf) * trimRate;
  const total = doors + colour + trim + num(values.misc);
  return { doors, colour, trim, total };
}

function calculateRegularMove(values) {
  const rateRow = calculatorDefaults.moveRegular.widthRates.find((row) => row.label === values.widthBucket) || calculatorDefaults.moveRegular.widthRates[0];
  const isLong = values.lengthClass === "57' to 69'";
  const distanceRate = isLong ? rateRow.long : rateRow.short;
  const distanceCost = num(values.kms) * distanceRate;
  const overEavesCost = Math.max(num(values.eavesWidth) - 38, 0) * 2 * num(values.kms);
  const loadingCost = num(values.sqft) * (isLong ? 5.6 : 4.4);
  const additionalHours = num(values.additionalHours) * 695;
  const siteVisit = values.siteVisit ? 750 : 0;
  const highLift46 = values.highLift46 ? 695 * 2 : 0;
  const highLiftOver6 = num(values.highLiftOver6);
  const extraEscort = values.extraEscort ? 5 * num(values.kms) : 0;
  const petrofka = values.petrofka ? 695 : 0;
  const backwards = values.backwards ? 525 : 0;
  const beamPockets = values.beamPockets ? 695 * 2 : 0;
  const albertaPermit = values.albertaPermit ? 1350 : 0;
  const fuelRate = calculatorDefaults.moveRegular.fuel[values.fuelBracket] ?? 0;
  const fuelSurcharge = num(values.kms) * fuelRate;
  const permit = 1100 + albertaPermit;
  const subtotal =
    distanceCost +
    overEavesCost +
    loadingCost +
    additionalHours +
    siteVisit +
    highLift46 +
    highLiftOver6 +
    extraEscort +
    petrofka +
    backwards +
    beamPockets;
  return { distanceRate, subtotal, permit, fuelSurcharge, total: subtotal + permit + fuelSurcharge };
}

function calculateSimpleMove(values) {
  const loadedRate = values.simpleHeightClass === ">4.1m (13' 6\")" ? 17.5 : 14.5;
  const loadedCost = num(values.simpleLoadedKms) * loadedRate;
  const demobCost = num(values.simpleDemobKms) * 7;
  const additionalHours = num(values.additionalHours) * 475;
  const siteVisit = values.siteVisit ? 750 : 0;
  const loadUnload = 2850;
  const fuelRate = calculatorDefaults.moveSimple.fuel[values.simpleFuelBracket] ?? 0;
  const fuelSurcharge = (num(values.simpleLoadedKms) + num(values.simpleDemobKms)) * fuelRate;
  const permit = 1100;
  const subtotal = loadUnload + loadedCost + demobCost + additionalHours + siteVisit;
  return { loadedCost, demobCost, subtotal, permit, fuelSurcharge, total: subtotal + permit + fuelSurcharge };
}

function calculateDeliveryKm(values) {
  return num(values.trips) * num(values.kms) * num(values.rate);
}

function projectPercentBase(values, activeLine) {
  return state.lines.reduce((sum, line) => {
    if (line.id === activeLine.id) return sum;
    const isProjectPercent = calculatorType(line) === "projectPercent";
    if (isProjectPercent) return sum;
    if (values.base === "retail") return sum + lineTotals(line).retail;
    return sum + num(line.quantity) * num(line.unitCost);
  }, 0);
}

function windowDoorBaseCost(values) {
  return state.lines.reduce((sum, line) => {
    const description = line.description.toLowerCase().trim();
    const isWindowLine = description === "windows";
    const isDoorLine = description === "doors";
    if ((values.includeWindows && isWindowLine) || (values.includeDoors && isDoorLine)) {
      return sum + num(line.quantity) * num(line.unitCost);
    }
    return sum;
  }, 0);
}

function calculatedCost(line) {
  const type = calculatorType(line);
  const values = getCalcValues(line);
  if (type === "windows") {
    return calculatorDefaults.windows.sizes.reduce((sum, [, rate], index) => sum + num(values.quantities[index]) * rate, 0);
  }
  if (type === "doors") {
    return calculatorDefaults.doors.sizes.reduce((sum, [, rate], index) => sum + num(values.quantities[index]) * rate, 0);
  }
  if (type === "siding") {
    return calculatorDefaults.siding.items.reduce((sum, [, rate], index) => sum + num(values.quantities[index]) * rate, 0);
  }
  if (type === "travel") return calculateTravel(values).total;
  if (type === "fixtures") return calculateFixtures(values);
  if (type === "flooring") return calculateFlooring(values);
  if (type === "tileShower") return calculateTileShower(values).total;
  if (type === "backsplash") return calculateBacksplash(values).total;
  if (type === "paintDoorsTrim") return calculatePaintDoorsTrim(values).total;
  if (type === "move") {
    return values.moveType === "Simple Home" ? calculateSimpleMove(values).total : calculateRegularMove(values).total;
  }
  if (type === "deliveryKm") return calculateDeliveryKm(values);
  if (type === "projectPercent") return projectPercentBase(values, line) * (num(values.percent) / 100);
  if (type === "windowDoorUpgrade") return windowDoorBaseCost(values) * (num(values.percent) / 100);
  if (type === "roof") {
    const result = calculateRoof(values);
    return String(line.unit).toLowerCase().includes("bundle") ? Math.ceil(result.bundles) : Math.round(result.roofSqft);
  }
  return 0;
}

function applyCalculator(line) {
  const type = calculatorType(line);
  if (!type) return;
  if (type === "roof") {
    const result = calculateRoof(getCalcValues(line));
    if (String(line.unit).toLowerCase().includes("bundle")) {
      line.quantity = Math.ceil(result.bundles);
    } else {
      line.quantity = Math.round(result.roofSqft);
    }
    if (!num(line.unitCost)) line.unitCost = String(line.unit).toLowerCase().includes("bundle") ? 40 : 3;
  } else if (type === "projectPercent") {
    const values = getCalcValues(line);
    line.quantity = 1;
    line.unit = `${num(values.percent)}%`;
    line.unitCost = calculatedCost(line);
  } else {
    line.quantity = 1;
    line.unit = type === "windowDoorUpgrade" ? "Upgrade" : "Package";
    line.unitCost = calculatedCost(line);
  }
}

function renderReview() {
  const totals = grandTotals();
  const marginPct = totals.retail ? ((totals.retail - totals.cost) / totals.retail) * 100 : 0;
  els.reviewTotals.innerHTML = `
    <article><span>Total project cost</span><strong>${money.format(totals.cost)}</strong></article>
    <article><span>Retail before tax</span><strong>${money.format(totals.retail)}</strong></article>
    <article><span>PST</span><strong>${money.format(totals.pst)}</strong></article>
    <article><span>GST</span><strong>${money.format(totals.gst)}</strong></article>
    <article><span>Customer total</span><strong>${money.format(totals.total)}</strong></article>
    <article><span>Margin</span><strong>${marginPct.toFixed(1)}%</strong></article>
  `;

  els.reviewSections.innerHTML = state.library.sections
    .map((section) => {
      const totals = sectionTotals(section.section_name);
      return `<article><span>${section.section_name}</span><strong>${money.format(totals.total)}</strong></article>`;
    })
    .join("");

  const warnings = [];
  for (const line of state.lines) {
    if (line.description && num(line.unitCost) === 0) {
      warnings.push(`${line.description}: no unit cost`);
    }
    if (num(line.margin) < 10 && num(line.unitCost) > 0) {
      warnings.push(`${line.description}: margin under 10%`);
    }
  }
  els.reviewWarnings.innerHTML = warnings.length
    ? warnings.slice(0, 24).map((warning) => `<article><span>${warning}</span><span class="status-pill">Review</span></article>`).join("")
    : `<article><span>No review warnings from the current visible logic.</span><span class="status-pill">OK</span></article>`;
}

function renderEstimateVersions() {
  if (!els.estimateVersionsList) return;
  const versions = Array.isArray(state.estimateVersions) ? state.estimateVersions : [];
  const sent = versions.find((version) => version.id === state.sentEstimateVersionId);
  const current = estimateSnapshot();
  if (sent) {
    const changed = sent.fingerprint !== current.fingerprint;
    els.estimateVersionStatus.textContent = changed
      ? `Sent version: ${sent.versionName}. Working estimate has changed since it was sent.`
      : `Sent version: ${sent.versionName}. Working estimate matches the sent version.`;
  } else {
    els.estimateVersionStatus.textContent = versions.length ? "No version has been marked sent yet." : "No saved estimate versions yet.";
  }
  els.estimateVersionsList.innerHTML = versions.length
    ? versions
        .map(
          (version) => `
            <article class="${version.id === state.sentEstimateVersionId ? "sent" : ""}">
              <div>
                <strong>${escapeAttr(version.versionName)}</strong>
                <span>${escapeAttr(version.createdAtLabel)} - ${money.format(version.totals.total)}</span>
                ${version.note ? `<small>${escapeAttr(version.note)}</small>` : ""}
              </div>
              <div class="estimate-version-actions">
                <button class="secondary mini-button" type="button" data-open-estimate-version="${version.id}">Open</button>
                <button class="secondary mini-button" type="button" data-load-estimate-version="${version.id}">Load</button>
                <button class="secondary mini-button" type="button" data-rename-estimate-version="${version.id}">Rename</button>
                <button class="secondary mini-button" type="button" data-mark-estimate-sent="${version.id}">
                  ${version.id === state.sentEstimateVersionId ? "Sent" : "Mark sent"}
                </button>
              </div>
            </article>
          `,
        )
        .join("")
    : `<p class="empty-note">Save a version before sending a proposal to a customer.</p>`;
  renderEstimateVersionDocument();
}

function saveEstimateVersion() {
  const snapshot = estimateSnapshot();
  const versionNumber = (state.estimateVersions?.length || 0) + 1;
  const now = new Date();
  const version = {
    id: `estimate-version-${Date.now()}`,
    versionName: `Version ${versionNumber}`,
    note: els.estimateVersionNote.value.trim(),
    createdAt: now.toISOString(),
    createdAtLabel: now.toLocaleDateString("en-CA"),
    customerName: els.customerName.value || "",
    projectName: els.projectName.value || "",
    projectType: els.projectType.value || "",
    totals: snapshot.totals,
    lines: snapshot.lines,
    fingerprint: snapshot.fingerprint,
  };
  state.estimateVersions = [version, ...(state.estimateVersions || [])];
  els.estimateVersionNote.value = "";
  saveCrmRecord();
  renderEstimateVersions();
}

function markEstimateVersionSent(versionId) {
  if (!state.estimateVersions?.some((version) => version.id === versionId)) return;
  state.sentEstimateVersionId = versionId;
  state.output.estimateVersionId = versionId;
  saveCrmRecord();
  renderEstimateVersions();
  renderEstimateOutput();
}

function defaultProposalSection(line) {
  return outputGroupForLine(line)?.title || "Other Included Items";
}

function proposalSectionOptionsHtml(selected = "") {
  const value = selected || "Other Included Items";
  return proposalSectionTitles.map((title) => `<option ${value === title ? "selected" : ""}>${escapeAttr(title)}</option>`).join("");
}

function renameEstimateVersion(versionId) {
  const version = state.estimateVersions?.find((item) => item.id === versionId);
  if (!version) return;
  const newName = window.prompt("Rename estimate version", version.versionName || "");
  if (!newName || !newName.trim()) return;
  version.versionName = newName.trim();
  saveCrmRecord();
  renderEstimateVersions();
}

function loadEstimateVersion(versionId) {
  const version = state.estimateVersions?.find((item) => item.id === versionId);
  if (!version) return;
  const ok = window.confirm(`Load ${version.versionName || "this version"} into the working estimate? This replaces the current working estimate lines.`);
  if (!ok) return;
  restoreEstimateState({ lines: version.lines || [] });
  state.output.estimateVersionId = "current";
  state.contract.estimateVersionId = "current";
  state.openEstimateVersionId = "";
  saveActiveCrmRecordEdits();
  render();
}

function loggedInSalespersonName() {
  return currentUserProfile()?.name || els.crmSalesperson?.value || "";
}

function openEstimateVersion(versionId) {
  if (!state.estimateVersions?.some((version) => version.id === versionId)) return;
  state.openEstimateVersionId = versionId;
  renderEstimateVersionDocument();
}

function closeEstimateVersion() {
  state.openEstimateVersionId = "";
  renderEstimateVersionDocument();
}

function renderEstimateVersionDocument() {
  if (!els.estimateVersionModal || !els.estimateVersionDocument) return;
  const version = state.estimateVersions?.find((item) => item.id === state.openEstimateVersionId);
  els.estimateVersionModal.toggleAttribute("hidden", !version);
  if (!version) {
    els.estimateVersionDocument.innerHTML = "";
    return;
  }
  els.estimateVersionModalTitle.textContent = version.versionName;
  const grouped = version.lines.reduce((groups, line) => {
    if (!groups[line.section]) groups[line.section] = [];
    groups[line.section].push(line);
    return groups;
  }, {});
  els.estimateVersionDocument.innerHTML = `
    <article class="proposal-page estimate-version-page">
      <div class="proposal-page-label">Read only</div>
      <div class="proposal-logo-row">
        <img src="./assets/zaks-homes-cottages-logo.jpg" alt="Zak's Homes & Cottages" />
      </div>
      <h2>${escapeAttr(version.versionName)}</h2>
      <dl class="proposal-meta">
        <div><dt>Customer</dt><dd>${escapeAttr(version.customerName || "Not set")}</dd></div>
        <div><dt>Project</dt><dd>${escapeAttr(version.projectName || "Not set")}</dd></div>
        <div><dt>Type</dt><dd>${escapeAttr(version.projectType || "Not set")}</dd></div>
        <div><dt>Saved</dt><dd>${escapeAttr(version.createdAtLabel || "")}</dd></div>
      </dl>
      ${version.note ? `<p class="estimate-version-note">${escapeAttr(version.note)}</p>` : ""}
      <div class="estimate-version-total-grid">
        <div><span>Total project cost</span><strong>${money.format(version.totals.cost)}</strong></div>
        <div><span>Retail before tax</span><strong>${money.format(version.totals.retail)}</strong></div>
        <div><span>PST</span><strong>${money.format(version.totals.pst)}</strong></div>
        <div><span>GST</span><strong>${money.format(version.totals.gst)}</strong></div>
        <div><span>Customer total</span><strong>${money.format(version.totals.total)}</strong></div>
      </div>
      ${Object.entries(grouped)
        .map(
          ([section, lines]) => `
            <h3>${escapeAttr(section)}</h3>
            <table class="estimate-version-lines">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${lines
                  .map(
                    (line) => `
                      <tr>
                        <td>${escapeAttr(line.customerDescription || line.description)}</td>
                        <td>${formatQuantity(line.quantity)}</td>
                        <td>${escapeAttr(line.unit || "")}</td>
                        <td>${money.format(line.total)}</td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          `,
        )
        .join("")}
    </article>
  `;
}

function outputState() {
  const town = els.destinationTown?.value?.trim();
  const province = els.destinationProvince?.value || "SK";
  const address = els.crmProjectAddress?.value?.trim();
  if (!state.output.manual) state.output.manual = {};
  if (!state.output.descriptionsManual) state.output.descriptionsManual = {};
  if (!state.output.estimateVersionId) state.output.estimateVersionId = state.sentEstimateVersionId || "current";
  if (state.output.estimateVersionId !== "current" && !state.estimateVersions?.some((version) => version.id === state.output.estimateVersionId)) {
    state.output.estimateVersionId = "current";
  }
  if (!state.output.manual.estimateDate) state.output.estimateDate = state.output.estimateDate || todayIso();
  if (!state.output.manual.providedBy) state.output.providedBy = loggedInSalespersonName();
  if (!state.output.manual.location) state.output.location = address || (town ? `${town}, ${province}` : `, ${province}`);
  if (!state.output.manual.intro) {
    state.output.intro = `${num(els.houseSqft?.value || 0)} square foot ${els.projectType?.value || "RTM"} built as per National Building and Energy Code guidelines and attached preliminary drawings with the following design specifications and features:`;
  }
  if (!state.output.manual.movingNotes) {
    state.output.movingNotes = "Moving costs are subject to extra charges that may arise from adverse site conditions.\nActual pricing is subject to final costs received from utility providers for line lifts performed.";
  }
  if (!state.output.manual.exclusions) state.output.exclusions = defaultOutputExclusions;
  if (!state.output.descriptions) state.output.descriptions = {};
  state.output.scopeItems = normalizeOutputScopeItems(state.output.scopeItems);
  return state.output;
}

function normalizeOutputScopeItems(items) {
  const source = Array.isArray(items) ? items : [];
  return source.map((item, index) => ({
    id: item.id || `scope-item-${Date.now()}-${index}`,
    description: item.description || "",
    proposalSection: item.proposalSection || "Framing Package",
    proposalSort: item.proposalSort === "" || item.proposalSort === undefined ? (index + 1) * 10 : num(item.proposalSort),
    proposalIndent: num(item.proposalIndent),
    includeProposal: item.includeProposal !== false,
    includeContract: item.includeContract !== false,
  }));
}

function outputScopeItemAsLine(item) {
  return {
    id: item.id,
    section: "Additional Scope",
    description: item.description,
    customerDescription: item.description,
    proposalSection: item.proposalSection,
    proposalSort: item.proposalSort,
    proposalIndent: item.proposalIndent,
    includeProposal: item.includeProposal,
    includeContract: item.includeContract,
    quantity: "",
    unit: "",
    retail: 0,
    total: 0,
    visible: true,
    customScopeItem: true,
  };
}

function outputScopeLines(filter = "proposal") {
  const output = outputState();
  return output.scopeItems
    .filter((item) => item.description.trim())
    .filter((item) => (filter === "contract" ? item.includeContract !== false : item.includeProposal !== false))
    .map(outputScopeItemAsLine);
}

function proposalVersionOptions(selectedId) {
  const currentSnapshot = estimateSnapshot();
  return [
    `<option value="current" ${selectedId === "current" ? "selected" : ""}>Current working estimate - ${money.format(currentSnapshot.totals.total)}</option>`,
    ...(state.estimateVersions || []).map(
      (version) =>
        `<option value="${escapeAttr(version.id)}" ${selectedId === version.id ? "selected" : ""}>${escapeAttr(version.versionName)} - ${money.format(version.totals.total)}</option>`,
    ),
  ].join("");
}

function selectedProposalEstimate() {
  const output = outputState();
  const saved = state.estimateVersions?.find((version) => version.id === output.estimateVersionId);
  if (saved) return saved;
  const snapshot = estimateSnapshot();
  return {
    id: "current",
    versionName: "Current working estimate",
    customerName: els.customerName?.value || "",
    projectName: els.projectName?.value || "",
    projectType: els.projectType?.value || "",
    totals: snapshot.totals,
    lines: snapshot.lines,
  };
}

function proposalLines(estimate = selectedProposalEstimate()) {
  return [...estimate.lines.filter((line) => (line.visible === undefined || line.visible) && line.includeProposal !== false), ...outputScopeLines("proposal")]
    .sort((a, b) => num(a.proposalSort, 9999) - num(b.proposalSort, 9999) || String(a.description).localeCompare(String(b.description)));
}

function formatQuantity(value) {
  const quantity = num(value);
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function lineOutputText(line) {
  if (!state.output.descriptions) state.output.descriptions = {};
  if (!state.output.descriptionsManual) state.output.descriptionsManual = {};
  if (String(line.customerDescription || "").trim()) return String(line.customerDescription).trim();
  if (state.output.descriptionsManual[line.id]) return state.output.descriptions[line.id] || "";
  return line.description || "";
}

function outputGroupForLine(line) {
  const section = line.section;
  const description = line.description.toLowerCase();
  return outputGroups.find((group) => {
    if (group.sections?.includes(section)) {
      if (group.include && !group.include.some((word) => description.includes(word))) return false;
      if (group.exclude && group.exclude.some((word) => description.includes(word))) return false;
      return true;
    }
    if (section === "Project Materials" && group.includeProjectMaterials) {
      return group.includeProjectMaterials.some((word) => description.includes(word));
    }
    return false;
  });
}

function groupedProposalLines(estimate = selectedProposalEstimate()) {
  const groups = proposalSectionTitles.map((title) => ({ title, lines: [] }));
  const other = { title: "Other Included Items", lines: [] };
  proposalLines(estimate).forEach((line) => {
    const title = line.proposalSection || outputGroupForLine(line)?.title || "Other Included Items";
    const target = groups.find((item) => item.title === title) || other;
    target.lines.push(line);
  });
  return [...groups.filter((group) => group.lines.length), ...(other.lines.length ? [other] : [])];
}

function renderEstimateOutput() {
  if (!els.proposalPreview) return;
  const output = outputState();
  const estimate = selectedProposalEstimate();
  const totals = estimate.totals;
  const groups = groupedProposalLines(estimate);
  const projectName = estimate.projectName || els.projectName?.value || "Project";
  const customerName = estimate.customerName || els.customerName?.value || "";
  const projectType = estimate.projectType || els.projectType?.value || "";
  const estimateFor = `${els.houseSqft?.value || ""} SQ FT "${projectName}" ${projectType}`.trim();
  const estimateDateText = prettyDate(output.estimateDate);
  els.outputEstimateVersion.innerHTML = proposalVersionOptions(output.estimateVersionId);
  els.outputEstimateVersion.value = output.estimateVersionId;
  els.outputEstimateDate.value = output.estimateDate;
  els.outputProvidedBy.value = output.providedBy;
  els.outputLocation.value = output.location;
  els.outputIntro.value = output.intro;
  els.outputMovingNotes.value = output.movingNotes;
  els.outputExclusions.value = output.exclusions;
  renderOutputScopeItems();

  els.outputLineEditor.innerHTML = proposalLines(estimate)
    .map(
      (line) => `
        <label data-output-line="${line.id}">
          ${escapeAttr(line.section)} - ${escapeAttr(line.description)}
          <textarea data-output-description="${line.id}" rows="2">${escapeAttr(lineOutputText(line))}</textarea>
        </label>
      `,
    )
    .join("");

  const groupMarkup = (items) =>
    items
      .map(
        (group) => `
          <section class="proposal-section">
            <h4>${escapeAttr(group.title)}</h4>
            <ul>
              ${group.lines.map((line) => `<li class="${num(line.proposalIndent) > 0 ? "proposal-subitem" : ""}">${escapeAttr(lineOutputText(line))}</li>`).join("")}
            </ul>
          </section>
        `,
      )
      .join("");
  const splitAt = Math.max(1, Math.ceil(groups.length / 2));
  const firstPageGroups = groups.slice(0, splitAt);
  const secondPageGroups = groups.slice(splitAt);
  const pageShell = (pageNumber, pageTotal, body, includeLogo = false) => `
    <article class="proposal-page">
      <div class="proposal-page-label">Page ${pageNumber} of ${pageTotal}</div>
      ${includeLogo ? `<div class="proposal-logo-row"><img src="./assets/zaks-homes-cottages-logo.jpg" alt="Zak's Homes & Cottages" /></div>` : ""}
      <div class="proposal-signature">:sg&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Customer Signature<br><span>Upon Acceptance</span></div>
      <div class="proposal-page-body">${body}</div>
    </article>
  `;

  const pageOne = `
    <dl class="proposal-meta">
      <div><dt>Estimate provided to:</dt><dd>${escapeAttr(customerName)}</dd></div>
      <div><dt>Location:</dt><dd>${escapeAttr(output.location)}</dd></div>
      <div><dt>Estimate for:</dt><dd>${escapeAttr(estimateFor)}</dd></div>
      <div><dt>Estimate source:</dt><dd>${escapeAttr(estimate.versionName || "Current working estimate")}</dd></div>
      <div><dt>Estimate date:</dt><dd>${escapeAttr(estimateDateText)}</dd></div>
      <div><dt>Estimate provided by:</dt><dd>${escapeAttr(output.providedBy)}</dd></div>
    </dl>
    <h3>Budget Estimate Includes:</h3>
    <p>${escapeAttr(output.intro)}</p>
    ${groupMarkup(firstPageGroups)}
  `;
  const pageTwo = `
    ${secondPageGroups.length ? groupMarkup(secondPageGroups) : `<h3>Budget Estimate Includes Continued:</h3>`}
    <div class="proposal-subtotal"><span>Subtotal material & labor - Budget Pricing Only</span><strong>${money.format(totals.retail)}</strong></div>
    <p class="proposal-tax-note">Plus Applicable Taxes</p>
    <section class="proposal-section">
      <h4>Moving Notes:</h4>
      <ul>${output.movingNotes.split("\n").filter(Boolean).map((item) => `<li>${escapeAttr(item)}</li>`).join("")}</ul>
    </section>
  `;
  const pageThree = `
    <section class="proposal-section">
      <h4>Estimate Does Not Include:</h4>
      <ul>${output.exclusions.split("\n").filter(Boolean).map((item) => `<li>${escapeAttr(item)}</li>`).join("")}</ul>
    </section>
    <section class="proposal-section">
      <h4>Value Added Opportunities:</h4>
      <ul>
        <li>Course of Construction Insurance - quote can be provided upon request.</li>
      </ul>
    </section>
    <p class="proposal-fine-print">This estimate is furnished for 7-day acceptance only from ${escapeAttr(estimateDateText)}. Clerical errors and errors of omission subject to correction. Nothing whatsoever not specifically listed will be furnished under this estimated amount.</p>
    <p class="proposal-fine-print">Estimate provided is quoted as a complete project in substance. Any extra charges not included in this quotation, whether agreed to verbally or in writing, will be billed direct and are over and above the amount quoted herein.</p>
  `;
  els.proposalPreview.innerHTML = [pageShell(1, 3, pageOne, true), pageShell(2, 3, pageTwo), pageShell(3, 3, pageThree)].join("");
}

function renderOutputScopeItems() {
  if (!els.outputScopeItemsList) return;
  const output = outputState();
  els.outputScopeSection.innerHTML = proposalSectionOptionsHtml(els.outputScopeSection.value || "Framing Package");
  els.outputScopeItemsList.innerHTML = output.scopeItems.length
    ? output.scopeItems
        .map(
          (item) => `
            <article class="scope-item-row" data-output-scope-item="${escapeAttr(item.id)}">
              <label>
                Section
                <select data-output-scope-field="proposalSection">${proposalSectionOptionsHtml(item.proposalSection)}</select>
              </label>
              <label>
                Description
                <textarea data-output-scope-field="description" rows="2">${escapeAttr(item.description)}</textarea>
              </label>
              <label>
                Order
                <input data-output-scope-field="proposalSort" type="number" value="${item.proposalSort}" step="1" />
              </label>
              <label>
                Indent
                <select data-output-scope-field="proposalIndent">
                  <option value="0" ${num(item.proposalIndent) === 0 ? "selected" : ""}>Main bullet</option>
                  <option value="1" ${num(item.proposalIndent) === 1 ? "selected" : ""}>Sub-bullet</option>
                </select>
              </label>
              <label class="check-row">
                <input data-output-scope-field="includeProposal" type="checkbox" ${item.includeProposal !== false ? "checked" : ""} />
                <span>Proposal</span>
              </label>
              <label class="check-row">
                <input data-output-scope-field="includeContract" type="checkbox" ${item.includeContract !== false ? "checked" : ""} />
                <span>Contract</span>
              </label>
              <button class="secondary mini-button" type="button" data-delete-output-scope-item="${escapeAttr(item.id)}">Delete</button>
            </article>
          `,
        )
        .join("")
    : `<p class="empty-note">No added scope items yet.</p>`;
}

function addOutputScopeItem() {
  const output = outputState();
  const description = els.outputScopeDescription.value.trim();
  if (!description) return;
  output.scopeItems.push({
    id: `scope-item-${Date.now()}`,
    description,
    proposalSection: els.outputScopeSection.value || "Framing Package",
    proposalSort: els.outputScopeSort.value === "" ? (output.scopeItems.length + 1) * 10 : num(els.outputScopeSort.value),
    proposalIndent: num(els.outputScopeIndent.value),
    includeProposal: els.outputScopeProposal.checked,
    includeContract: els.outputScopeContract.checked,
  });
  els.outputScopeDescription.value = "";
  els.outputScopeSort.value = String((output.scopeItems.length + 1) * 10);
  els.outputScopeIndent.value = "0";
  els.outputScopeProposal.checked = true;
  els.outputScopeContract.checked = true;
  renderEstimateOutput();
  renderContract();
  saveActiveCrmRecordEdits();
}

function handleOutputScopeItemEdit(event) {
  const row = event.target.closest("[data-output-scope-item]");
  const field = event.target.dataset.outputScopeField;
  const item = outputState().scopeItems.find((entry) => entry.id === row?.dataset.outputScopeItem);
  if (!item || !field) return;
  if (event.target.type === "checkbox") item[field] = event.target.checked;
  else if (["proposalSort", "proposalIndent"].includes(field)) item[field] = event.target.value === "" ? "" : num(event.target.value);
  else item[field] = event.target.value;
  if (event.type === "change") {
    renderEstimateOutput();
    renderContract();
  }
  saveActiveCrmRecordEdits();
}

function deleteOutputScopeItem(itemId) {
  const output = outputState();
  output.scopeItems = output.scopeItems.filter((item) => item.id !== itemId);
  renderEstimateOutput();
  renderContract();
  saveActiveCrmRecordEdits();
}

function contractState() {
  if (!state.contract) state.contract = {};
  if (!state.contract.inclusions) state.contract.inclusions = {};
  if (!state.contract.exclusions) state.contract.exclusions = {};
  if (!state.contract.approval) state.contract.approval = {};
  contractInclusionOptions.forEach((item) => {
    if (state.contract.inclusions[item] === undefined) state.contract.inclusions[item] = true;
  });
  contractExclusionOptions.forEach((item) => {
    if (state.contract.exclusions[item] === undefined) state.contract.exclusions[item] = true;
  });
  if (!state.contract.date) state.contract.date = todayIso();
  if (!state.contract.estimateVersionId) state.contract.estimateVersionId = state.sentEstimateVersionId || state.estimateVersions?.[0]?.id || "current";
  if (!state.contract.customerName) state.contract.customerName = els.customerName?.value || "";
  if (!state.contract.location) state.contract.location = els.crmProjectAddress?.value || outputState().location || "";
  if (!state.contract.depositTerms) state.contract.depositTerms = "Deposit and payment schedule to be confirmed with Zak's Homes & Cottages prior to production start.";
  state.contract.approval = {
    status: state.contract.approval.status || "Pending review",
    approvedBy: state.contract.approval.approvedBy || "",
    approvedRole: state.contract.approval.approvedRole || "",
    approvedAt: state.contract.approval.approvedAt || "",
    note: state.contract.approval.note || "",
    signature: state.contract.approval.signature || "",
  };
  return state.contract;
}

function canApproveContract() {
  const user = state.auth.currentUser;
  if (!user) return false;
  return user.permissions.includes("all") || user.permissions.includes("management");
}

function isContractApproved() {
  const contract = contractState();
  return contract.approval.status === "Approved" && contract.approval.signature === contractApprovalSignature();
}

function contractApprovalSignature(estimate = selectedContractEstimate()) {
  const contract = contractState();
  return JSON.stringify({
    date: contract.date,
    estimateVersionId: contract.estimateVersionId,
    estimateTotal: estimate.totals?.total || 0,
    customerName: contract.customerName,
    location: contract.location,
    depositTerms: contract.depositTerms,
    inclusions: contract.inclusions,
    exclusions: contract.exclusions,
  });
}

function resetContractApproval(reason = "Contract changed after approval.") {
  const contract = contractState();
  if (contract.approval.status !== "Approved") return;
  contract.approval = {
    status: "Pending review",
    approvedBy: "",
    approvedRole: "",
    approvedAt: "",
    note: reason,
    signature: "",
  };
}

function approveContract() {
  if (!canApproveContract()) {
    els.contractApprovalMessage.textContent = "Only an owner or upper management user can approve the contract.";
    return;
  }
  const contract = contractState();
  contract.approval = {
    status: "Approved",
    approvedBy: state.auth.currentUser.name,
    approvedRole: state.auth.currentUser.role,
    approvedAt: new Date().toISOString(),
    note: els.contractApprovalNote.value.trim(),
    signature: contractApprovalSignature(),
  };
  renderContract();
  saveActiveCrmRecordEdits();
}

function revokeContractApproval() {
  if (!canApproveContract()) {
    els.contractApprovalMessage.textContent = "Only an owner or upper management user can revoke contract approval.";
    return;
  }
  const contract = contractState();
  contract.approval = {
    status: "Pending review",
    approvedBy: "",
    approvedRole: "",
    approvedAt: "",
    note: els.contractApprovalNote.value.trim() || "Approval revoked.",
    signature: "",
  };
  renderContract();
  saveActiveCrmRecordEdits();
}

function printApprovedContract() {
  if (!isContractApproved()) {
    els.contractApprovalMessage.textContent = "Contract must be reviewed and approved before it can be printed or emailed.";
    return;
  }
  window.print();
}

function contractVersionOptions(selectedId) {
  const currentSnapshot = estimateSnapshot();
  return [
    `<option value="current" ${selectedId === "current" ? "selected" : ""}>Current working estimate - ${money.format(currentSnapshot.totals.total)}</option>`,
    ...(state.estimateVersions || []).map(
      (version) =>
        `<option value="${escapeAttr(version.id)}" ${selectedId === version.id ? "selected" : ""}>${escapeAttr(version.versionName)} - ${money.format(version.totals.total)}</option>`,
    ),
  ].join("");
}

function selectedContractEstimate() {
  const contract = contractState();
  const saved = state.estimateVersions?.find((version) => version.id === contract.estimateVersionId);
  if (saved) return saved;
  const snapshot = estimateSnapshot();
  return {
    id: "current",
    versionName: "Current working estimate",
    createdAtLabel: todayIso(),
    customerName: els.customerName?.value || "",
    projectName: els.projectName?.value || "",
    projectType: els.projectType?.value || "",
    totals: snapshot.totals,
    lines: snapshot.lines,
  };
}

function renderContractChecklist(container, options, selectedMap, dataAttr) {
  container.innerHTML = options
    .map(
      (item) => `
        <label class="check-row">
          <input type="checkbox" ${selectedMap[item] ? "checked" : ""} ${dataAttr}="${escapeAttr(item)}" />
          <span>${escapeAttr(item)}</span>
        </label>
      `,
    )
    .join("");
}

function renderContract() {
  if (!els.contractPreview) return;
  const contract = contractState();
  const estimate = selectedContractEstimate();
  const included = contractInclusionOptions.filter((item) => contract.inclusions[item]);
  const excluded = contractExclusionOptions.filter((item) => contract.exclusions[item]);
  const activeLines = estimate.lines
    .filter((line) => line.includeContract !== false)
    .concat(outputScopeLines("contract"))
    .sort((a, b) => num(a.proposalSort, 9999) - num(b.proposalSort, 9999) || String(a.description).localeCompare(String(b.description)));
  const approved = isContractApproved();
  const staleApproval = contract.approval.status === "Approved" && !approved;
  const approvalDate = contract.approval.approvedAt ? new Date(contract.approval.approvedAt).toLocaleString("en-CA") : "";
  els.contractDate.value = contract.date;
  els.contractEstimateVersion.innerHTML = contractVersionOptions(contract.estimateVersionId);
  els.contractEstimateVersion.value = contract.estimateVersionId;
  els.contractCustomerName.value = contract.customerName;
  els.contractLocation.value = contract.location;
  els.contractDepositTerms.value = contract.depositTerms;
  els.contractApprovalNote.value = contract.approval.note || "";
  els.approveContractBtn.disabled = !canApproveContract() || approved;
  els.revokeContractApprovalBtn.disabled = !canApproveContract() || !approved;
  els.printContractBtn.disabled = !approved;
  els.contractApprovalStatus.className = `contract-approval-status ${approved ? "approved" : "pending"}`;
  els.contractApprovalStatus.innerHTML = approved
    ? `<strong>Approved</strong><span>${escapeAttr(contract.approval.approvedBy)} (${escapeAttr(contract.approval.approvedRole)}) - ${escapeAttr(approvalDate)}</span>`
    : `<strong>${staleApproval ? "Approval needs review" : "Pending owner review"}</strong><span>Printing and email are locked until an owner or upper management approves this contract.</span>`;
  els.contractApprovalMessage.textContent = approved ? "Approved contract is unlocked for print/save PDF." : "Review and sign-off required before print/save PDF or email.";
  renderContractChecklist(els.contractInclusions, contractInclusionOptions, contract.inclusions, "data-contract-include");
  renderContractChecklist(els.contractExclusions, contractExclusionOptions, contract.exclusions, "data-contract-exclude");

  const pageShell = (pageNumber, pageTotal, body, includeLogo = false) => `
    <article class="proposal-page contract-page">
      <div class="proposal-page-label">Page ${pageNumber} of ${pageTotal}</div>
      ${includeLogo ? `<div class="proposal-logo-row"><img src="./assets/zaks-homes-cottages-logo.jpg" alt="Zak's Homes & Cottages" /></div>` : ""}
      <div class="proposal-page-body">${body}</div>
    </article>
  `;
  const estimateRows = activeLines
    .slice(0, 36)
    .map(
      (line) => `
        <tr>
          <td>${escapeAttr(line.customerDescription || line.description)}</td>
          <td>${line.customScopeItem ? "" : formatQuantity(line.quantity)}</td>
          <td>${escapeAttr(line.unit || "")}</td>
          <td>${line.customScopeItem ? "" : money.format(line.total)}</td>
        </tr>
      `,
    )
    .join("");
  const pageOne = `
    <h2>Construction Contract</h2>
    <dl class="proposal-meta">
      <div><dt>Customer:</dt><dd>${escapeAttr(contract.customerName || "Not set")}</dd></div>
      <div><dt>Project:</dt><dd>${escapeAttr(estimate.projectName || els.projectName?.value || "Project")}</dd></div>
      <div><dt>Location:</dt><dd>${escapeAttr(contract.location || "Not set")}</dd></div>
      <div><dt>Contract date:</dt><dd>${escapeAttr(prettyDate(contract.date))}</dd></div>
      <div><dt>Estimate version:</dt><dd>${escapeAttr(estimate.versionName)}</dd></div>
      <div><dt>Contract amount:</dt><dd>${escapeAttr(money.format(estimate.totals.total))}</dd></div>
      <div><dt>Approval:</dt><dd>${approved ? `${escapeAttr(contract.approval.approvedBy)} - ${escapeAttr(approvalDate)}` : "Pending owner review"}</dd></div>
    </dl>
    ${approved ? "" : `<div class="contract-watermark">Pending approval - not for signature or distribution</div>`}
    <section class="proposal-section">
      <h4>Agreement Summary</h4>
      <p>Zak's Homes & Cottages agrees to provide the work selected in this contract and the attached estimate version, subject to final approvals, selections, site conditions, and written change orders.</p>
      <p>${escapeAttr(contract.depositTerms)}</p>
    </section>
    <section class="proposal-section">
      <h4>Included In Contract</h4>
      <ul>${included.map((item) => `<li>${escapeAttr(item)}</li>`).join("")}</ul>
    </section>
  `;
  const pageTwo = `
    <section class="proposal-section">
      <h4>Estimate Included In Contract</h4>
      <p>This contract uses ${escapeAttr(estimate.versionName)} as the attached estimate schedule.</p>
      <table class="estimate-version-lines contract-estimate-table">
        <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
        <tbody>${estimateRows || `<tr><td colspan="4">No estimate lines selected.</td></tr>`}</tbody>
      </table>
      ${activeLines.length > 36 ? `<p class="helper-note">${activeLines.length - 36} additional line items are included in the saved estimate detail.</p>` : ""}
      <div class="proposal-subtotal"><span>Contract amount including applicable taxes</span><strong>${money.format(estimate.totals.total)}</strong></div>
    </section>
  `;
  const pageThree = `
    <section class="proposal-section">
      <h4>Not Included Unless Added By Written Change Order</h4>
      <ul>${excluded.map((item) => `<li>${escapeAttr(item)}</li>`).join("")}</ul>
    </section>
    <section class="proposal-section">
      <h4>Change Orders And Selections</h4>
      <p>Selections, allowances, upgrades, and customer-requested changes that differ from the attached estimate version will be tracked separately and require approval before they are added to the contract amount.</p>
    </section>
    <section class="contract-signatures">
      <div><span>Customer signature</span></div>
      <div><span>Zak's Homes & Cottages</span></div>
    </section>
  `;
  els.contractPreview.innerHTML = [pageShell(1, 3, pageOne, true), pageShell(2, 3, pageTwo), pageShell(3, 3, pageThree)].join("");
}

function handleOutputEdit(event) {
  const output = outputState();
  if (event.target.closest("[data-output-scope-item]")) {
    handleOutputScopeItemEdit(event);
    return;
  }
  if (event.target.dataset.outputDescription) {
    output.descriptions[event.target.dataset.outputDescription] = event.target.value;
    output.descriptionsManual[event.target.dataset.outputDescription] = true;
    if (event.type === "change") renderEstimateOutput();
    saveActiveCrmRecordEdits();
    return;
  }
  const fieldMap = {
    outputEstimateVersion: "estimateVersionId",
    outputEstimateDate: "estimateDate",
    outputProvidedBy: "providedBy",
    outputLocation: "location",
    outputIntro: "intro",
    outputMovingNotes: "movingNotes",
    outputExclusions: "exclusions",
  };
  const field = fieldMap[event.target.id];
  if (!field) return;
  output[field] = event.target.value;
  if (field !== "estimateVersionId") output.manual[field] = true;
  if (event.type === "change") renderEstimateOutput();
  saveActiveCrmRecordEdits();
}

function handleContractEdit(event) {
  const contract = contractState();
  if (event.target.dataset.contractInclude) {
    resetContractApproval();
    contract.inclusions[event.target.dataset.contractInclude] = event.target.checked;
    renderContract();
    saveActiveCrmRecordEdits();
    return;
  }
  if (event.target.dataset.contractExclude) {
    resetContractApproval();
    contract.exclusions[event.target.dataset.contractExclude] = event.target.checked;
    renderContract();
    saveActiveCrmRecordEdits();
    return;
  }
  const fieldMap = {
    contractDate: "date",
    contractEstimateVersion: "estimateVersionId",
    contractCustomerName: "customerName",
    contractLocation: "location",
    contractDepositTerms: "depositTerms",
    contractApprovalNote: "approvalNote",
  };
  const field = fieldMap[event.target.id];
  if (!field) return;
  if (field === "approvalNote") {
    contract.approval.note = event.target.value;
  } else {
    resetContractApproval();
    contract[field] = event.target.value;
  }
  if (event.type === "change") renderContract();
  saveActiveCrmRecordEdits();
}

function allowanceLines() {
  return state.lines.filter((line) => line.category === "Allowance");
}

function getAllowanceState(line) {
  if (!state.allowanceValues[line.id]) {
    state.allowanceValues[line.id] = {
      actual: "",
      status: "Not selected",
      notes: "",
    };
  }
  return state.allowanceValues[line.id];
}

function renderAllowances() {
  if (!els.allowancesBody) return;
  const lines = allowanceLines();

  els.allowancesBody.innerHTML = lines
    .map((line) => {
      const allowance = allowanceAmount(line);
      const record = getAllowanceState(line);
      const actual = record.actual === "" ? 0 : num(record.actual);
      const variance = actual - allowance;
      return `
        <tr data-allowance="${line.id}">
          <td>${line.section}</td>
          <td>${escapeAttr(lineOutputText(line))}</td>
          <td class="money">${money.format(allowance)}</td>
          <td><input data-allowance-field="actual" type="number" value="${record.actual}" placeholder="0" step="0.01" /></td>
          <td class="money ${variance > 0 ? "over" : variance < 0 ? "under" : ""}">${money.format(variance)}</td>
          <td>
            <select data-allowance-field="status">
              ${["Not selected", "Selected", "Approved", "Change order needed", "Closed"]
                .map((status) => `<option ${record.status === status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
          </td>
          <td><input data-allowance-field="notes" value="${escapeAttr(record.notes)}" placeholder="Selection notes" /></td>
        </tr>
      `;
    })
    .join("");

  updateAllowanceTotals();
}

function updateAllowanceTotals() {
  if (!els.allowanceTotal) return;
  let allowanceTotal = 0;
  let actualTotal = 0;
  allowanceLines().forEach((line) => {
    const allowance = allowanceAmount(line);
    const record = getAllowanceState(line);
    allowanceTotal += allowance;
    actualTotal += record.actual === "" ? 0 : num(record.actual);
    const row = els.allowancesBody?.querySelector(`[data-allowance="${CSS.escape(line.id)}"]`);
    const varianceCell = row?.querySelector(".money:nth-of-type(2)");
    if (varianceCell) {
      const variance = (record.actual === "" ? 0 : num(record.actual)) - allowance;
      varianceCell.textContent = money.format(variance);
      varianceCell.classList.toggle("over", variance > 0);
      varianceCell.classList.toggle("under", variance < 0);
    }
  });
  const varianceTotal = actualTotal - allowanceTotal;
  els.allowanceTotal.textContent = money.format(allowanceTotal);
  els.allowanceActualTotal.textContent = money.format(actualTotal);
  els.allowanceVarianceTotal.textContent = money.format(varianceTotal);
  els.allowanceVarianceTotal.classList.toggle("over", varianceTotal > 0);
  els.allowanceVarianceTotal.classList.toggle("under", varianceTotal < 0);
}

function createSelectionItems(items = selectionTemplate) {
  const source = Array.isArray(items) ? items : [];
  const templateKeys = new Set(selectionTemplate.map((item) => `${item.category}::${item.item}`));
  const savedByKey = new Map(source.map((item) => [`${item.category}::${item.item}`, item]));
  const merged = selectionTemplate.map((template) => {
    const saved = savedByKey.get(`${template.category}::${template.item}`) || {};
    return { ...template, ...saved, id: template.id, photo: normalizeSelectionPhoto(saved.photo) };
  });
  const extraSavedItems = source
    .filter((item) => !templateKeys.has(`${item.category}::${item.item}`))
    .map((item, index) => ({ ...item, id: item.id || `selection-extra-${index + 1}`, photo: normalizeSelectionPhoto(item.photo) }));
  return [...merged, ...extraSavedItems];
}

function normalizeSelectionPhoto(photo) {
  if (!photo?.dataUrl) return null;
  return {
    name: photo.name || "Project info photo",
    type: photo.type || "image/*",
    size: num(photo.size),
    uploadedAt: photo.uploadedAt || new Date().toISOString(),
    dataUrl: photo.dataUrl,
  };
}

function ensureSelections() {
  if (!Array.isArray(state.selections) || !state.selections.length) {
    state.selections = createSelectionItems();
  }
}

function selectionCategories() {
  ensureSelections();
  return [...new Set(state.selections.map((item) => item.category))];
}

function selectionStatusOptions(currentStatus) {
  return ["Needed", "In Progress", "Selected", "Approved", "Change Required", "N/A"]
    .map((status) => `<option ${currentStatus === status ? "selected" : ""}>${status}</option>`)
    .join("");
}

function selectionProgressForCategory(category) {
  const items = state.selections.filter((item) => item.category === category);
  const done = items.filter((item) => ["Selected", "Approved", "N/A"].includes(item.status)).length;
  return { total: items.length, done };
}

function renderSelections() {
  if (!els.selectionsBody) return;
  ensureSelections();
  const categories = selectionCategories();
  if (!state.activeSelectionCategory || !categories.includes(state.activeSelectionCategory)) {
    state.activeSelectionCategory = categories[0] || "";
  }
  const currentCategory = els.selectionCategoryFilter.value || "All categories";
  els.selectionCategoryFilter.innerHTML = [
    `<option>All categories</option>`,
    ...categories.map((category) => `<option ${category === currentCategory ? "selected" : ""}>${escapeAttr(category)}</option>`),
  ].join("");
  if (currentCategory !== "All categories" && categories.includes(currentCategory)) {
    state.activeSelectionCategory = currentCategory;
  }

  if (els.selectionCategoryTabs) {
    els.selectionCategoryTabs.innerHTML = categories
      .map((category) => {
        const progress = selectionProgressForCategory(category);
        return `
          <button class="selection-category-tab ${category === state.activeSelectionCategory ? "active" : ""}" type="button" data-selection-category="${escapeAttr(category)}">
            <span>${escapeAttr(category)}</span>
            <small>${progress.done} of ${progress.total} complete</small>
          </button>
        `;
      })
      .join("");
  }

  const activeItems = state.selections.filter((item) => item.category === state.activeSelectionCategory);
  const activeProgress = selectionProgressForCategory(state.activeSelectionCategory);
  if (els.selectionFormHeader) {
    els.selectionFormHeader.innerHTML = `
      <div>
        <span>Selection section</span>
        <h3>${escapeAttr(state.activeSelectionCategory || "Selections")}</h3>
      </div>
      <strong>${activeProgress.done} / ${activeProgress.total}</strong>
    `;
  }
  if (els.selectionFormFields) {
    els.selectionFormFields.innerHTML = activeItems
      .map(
        (item) => `
          <article class="selection-field-card" data-selection="${item.id}">
            <div class="selection-field-title">
              <h4>${escapeAttr(item.item)}</h4>
              <select data-selection-field="status" aria-label="${escapeAttr(item.item)} status">
                ${selectionStatusOptions(item.status)}
              </select>
            </div>
            <label>
              Selection / product / colour
              <textarea data-selection-field="selection" rows="2" placeholder="Enter selection details">${escapeAttr(item.selection)}</textarea>
            </label>
            <div class="selection-field-meta">
              <label>
                Assigned to
                <input data-selection-field="assignedTo" value="${escapeAttr(item.assignedTo)}" />
              </label>
              <label>
                Due date
                <input data-selection-field="dueDate" type="date" value="${item.dueDate || ""}" />
              </label>
            </div>
            <label>
              Notes
              <textarea data-selection-field="notes" rows="2" placeholder="Supplier, model number, drawing note, or customer note">${escapeAttr(item.notes)}</textarea>
            </label>
            <div class="selection-photo-control">
              <span>Photo</span>
              <div>
                ${
                  item.photo
                    ? `<button class="selection-photo-link" type="button" data-preview-selection-photo="${escapeAttr(item.id)}">${escapeAttr(item.photo.name)}</button>
                       <button class="secondary" type="button" data-remove-selection-photo="${escapeAttr(item.id)}">Remove</button>`
                    : `<small>No photo attached</small>`
                }
              </div>
              <input data-selection-photo="${escapeAttr(item.id)}" type="file" accept="image/*" />
            </div>
          </article>
        `,
      )
      .join("");
  }

  const search = (els.selectionSearch.value || "").trim().toLowerCase();
  const rows = state.selections.filter((item) => {
    const categoryMatch = currentCategory === "All categories" || item.category === currentCategory;
    const text = `${item.category} ${item.item} ${item.selection} ${item.status} ${item.assignedTo} ${item.notes}`.toLowerCase();
    return categoryMatch && (!search || text.includes(search));
  });
  els.selectionsBody.innerHTML = rows
    .map(
      (item) => `
        <tr data-selection="${item.id}">
          <td>${escapeAttr(item.category)}</td>
          <td>${escapeAttr(item.item)}</td>
          <td><input data-selection-field="selection" value="${escapeAttr(item.selection)}" placeholder="Selection / product / colour" /></td>
          <td>
            <select data-selection-field="status">
              ${selectionStatusOptions(item.status)}
            </select>
          </td>
          <td><input data-selection-field="assignedTo" value="${escapeAttr(item.assignedTo)}" placeholder="Owner" /></td>
          <td><input data-selection-field="dueDate" type="date" value="${item.dueDate || ""}" /></td>
          <td>${
            item.photo
              ? `<button class="selection-photo-link" type="button" data-preview-selection-photo="${escapeAttr(item.id)}">${escapeAttr(item.photo.name)}</button>`
              : `<span class="muted-cell">No photo</span>`
          }</td>
          <td><input data-selection-field="notes" value="${escapeAttr(item.notes)}" placeholder="Notes / supplier / model #" /></td>
        </tr>
      `,
    )
    .join("");
  const counts = state.selections.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === "Needed") acc.needed += 1;
      if (item.status === "Selected") acc.selected += 1;
      if (item.status === "Approved") acc.approved += 1;
      return acc;
    },
    { total: 0, needed: 0, selected: 0, approved: 0 },
  );
  els.selectionTotal.textContent = String(counts.total);
  els.selectionNeeded.textContent = String(counts.needed);
  els.selectionSelected.textContent = String(counts.selected);
  els.selectionApproved.textContent = String(counts.approved);
}

function handleSelectionEdit(event) {
  const row = event.target.closest("[data-selection]");
  const field = event.target.dataset.selectionField;
  const item = state.selections.find((entry) => entry.id === row?.dataset.selection);
  if (!item || !field) return;
  item[field] = event.target.value;
  if (event.type === "change" || field === "status") {
    renderSelections();
  }
  saveActiveCrmRecordEdits();
}

function createScheduleItems(startDate = todayIso()) {
  return scheduleTemplate.map((item, index) => ({
    id: `schedule-${index + 1}`,
    name: item.name,
    department: item.department,
    trade: item.trade || item.department,
    subtrade: "",
    purchaseOrderId: "",
    targetDate: addDaysIso(startDate, item.offset),
    endDate: addDaysIso(startDate, item.offset),
    status: index === 0 ? "In progress" : "Not started",
    notes: "",
  }));
}

function ensureSchedule() {
  if (!state.schedule.startDate) state.schedule.startDate = todayIso();
  if (!state.schedule.owner) state.schedule.owner = "Production";
  if (!state.schedule.scope) state.schedule.scope = "current";
  if (!state.schedule.tradeFilter) state.schedule.tradeFilter = "All trades";
  if (!Array.isArray(state.schedule.items) || !state.schedule.items.length) {
    state.schedule.items = createScheduleItems(state.schedule.startDate);
  }
  state.schedule.items.forEach((item) => {
    if (!item.trade) item.trade = item.department || "Production";
    if (item.subtrade === undefined) item.subtrade = "";
    if (item.purchaseOrderId === undefined) item.purchaseOrderId = "";
    if (!item.endDate) item.endDate = item.targetDate || state.schedule.startDate;
    if (item.targetDate && item.endDate < item.targetDate) item.endDate = item.targetDate;
  });
  if (!state.schedule.calendarMonth) state.schedule.calendarMonth = monthKey(state.schedule.startDate);
  if (!state.schedule.selectedItemId || !state.schedule.items.some((item) => item.id === state.schedule.selectedItemId)) {
    state.schedule.selectedItemId = state.schedule.items[0]?.id || "";
  }
}

function applyScheduleTemplate() {
  state.schedule.startDate = els.scheduleStartDate.value || todayIso();
  state.schedule.owner = els.scheduleOwner.value || "Production";
  state.schedule.items = createScheduleItems(state.schedule.startDate);
  state.schedule.calendarMonth = monthKey(state.schedule.startDate);
  state.schedule.selectedItemId = state.schedule.items[0]?.id || "";
  state.schedule.scope = els.scheduleScope.value || "current";
  state.schedule.tradeFilter = els.scheduleTradeFilter.value || "All trades";
  render();
}

function tradeOptionsHtml(selected) {
  return scheduleTrades.map((trade) => `<option ${selected === trade ? "selected" : ""}>${trade}</option>`).join("");
}

function scheduleSubtradeOptionsHtml(selected = "", trade = "") {
  const vendors = normalizeVendors(state.vendors)
    .filter((vendor) => !trade || vendor.trade === trade)
    .sort((a, b) => a.company.localeCompare(b.company));
  const hasSelected = selected && !vendors.some((vendor) => companyMatches(vendor.company, selected));
  return [
    `<option value="">Unassigned</option>`,
    ...(hasSelected ? [`<option value="${escapeAttr(selected)}" selected>${escapeAttr(selected)}</option>`] : []),
    ...vendors.map((vendor) => `<option value="${escapeAttr(vendor.company)}" ${companyMatches(vendor.company, selected) ? "selected" : ""}>${escapeAttr(vendor.company)}</option>`),
  ].join("");
}

function scheduleFilterValue(type = "all", trade = "", company = "") {
  if (type === "company") return `company:${encodeURIComponent(trade)}:${encodeURIComponent(company)}`;
  if (type === "trade") return `trade:${encodeURIComponent(trade)}`;
  return "all";
}

function parseScheduleFilter(value) {
  if (!value || value === "All trades" || value === "all") return { type: "all", label: "All trades" };
  if (scheduleTrades.includes(value)) return { type: "trade", trade: value, label: value };
  const [type, trade = "", company = ""] = String(value).split(":");
  if (type === "trade") {
    const tradeName = decodeURIComponent(trade);
    return { type: "trade", trade: tradeName, label: tradeName };
  }
  if (type === "company") {
    const tradeName = decodeURIComponent(trade);
    const companyName = decodeURIComponent(company);
    return { type: "company", trade: tradeName, company: companyName, label: `${tradeName} / ${companyName}` };
  }
  return { type: "all", label: "All trades" };
}

function companyMatches(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

function allScheduleRecords() {
  const records = [{ schedule: state.schedule }, ...state.crm.records.filter((record) => record.schedule?.items?.length)];
  return records.filter((record, index, list) => list.findIndex((item) => item.schedule === record.schedule) === index);
}

function scheduleCompaniesByTrade() {
  const groups = Object.fromEntries(scheduleTrades.map((trade) => [trade, new Set()]));
  state.vendors.forEach((vendor) => {
    const trade = vendor.trade || "Project Materials";
    if (!groups[trade]) groups[trade] = new Set();
    groups[trade].add(vendor.company);
  });
  allScheduleRecords().forEach((record) => {
    (record.schedule?.items || []).forEach((item) => {
      const trade = item.trade || item.department;
      const company = String(item.subtrade || "").trim();
      if (!trade || !company) return;
      if (!groups[trade]) groups[trade] = new Set();
      groups[trade].add(company);
    });
  });
  return groups;
}

function scheduleTradeFilterOptionsHtml(selectedValue) {
  const selected = parseScheduleFilter(selectedValue);
  const selectedNormalized =
    selected.type === "company"
      ? scheduleFilterValue("company", selected.trade, selected.company)
      : selected.type === "trade"
        ? scheduleFilterValue("trade", selected.trade)
        : "all";
  const groups = scheduleCompaniesByTrade();
  return [
    `<option value="all" ${selectedNormalized === "all" ? "selected" : ""}>All trades</option>`,
    ...scheduleTrades.map((trade) => {
      const tradeValue = scheduleFilterValue("trade", trade);
      const companies = [...(groups[trade] || [])].sort((a, b) => a.localeCompare(b));
      return `
        <optgroup label="${escapeAttr(trade)}">
          <option value="${escapeAttr(tradeValue)}" ${selectedNormalized === tradeValue ? "selected" : ""}>All ${escapeAttr(trade)}</option>
          ${companies
            .map((company) => {
              const companyValue = scheduleFilterValue("company", trade, company);
              return `<option value="${escapeAttr(companyValue)}" ${selectedNormalized === companyValue ? "selected" : ""}>${escapeAttr(company)}</option>`;
            })
            .join("")}
        </optgroup>
      `;
    }),
  ].join("");
}

function normalizedScheduleFilterValue(value) {
  const filter = parseScheduleFilter(value);
  if (filter.type === "company") return scheduleFilterValue("company", filter.trade, filter.company);
  if (filter.type === "trade") return scheduleFilterValue("trade", filter.trade);
  return "all";
}

function currentProjectName() {
  return els.projectName?.value || "Current project";
}

function projectOptionLabel(option) {
  return `${option.projectName || "Untitled project"}${option.customerName ? ` - ${option.customerName}` : ""}`;
}

function scheduleProjectOptions() {
  const options = [{ id: state.crm.activeRecordId || "current", projectName: currentProjectName(), customerName: els.customerName?.value || "New Customer", current: true }];
  state.crm.records.forEach((record) => {
    if (!record.projectName) return;
    if (record.id === state.crm.activeRecordId) return;
    if (options.some((option) => option.projectName === record.projectName)) return;
    options.push({ id: record.id, projectName: record.projectName, customerName: record.customerName || "No customer", current: false });
  });
  return options;
}

function projectOptionsHtml(selectedId = state.crm.activeRecordId || "current") {
  return scheduleProjectOptions()
    .map((option) => `<option value="${escapeAttr(option.id)}" ${option.id === selectedId ? "selected" : ""}>${escapeAttr(projectOptionLabel(option))}</option>`)
    .join("");
}

function estimateProjectOptionsHtml(selectedId = state.crm.activeRecordId || "current") {
  const currentId = state.crm.activeRecordId || "current";
  const currentLabel = `${els.customerName?.value || "New Customer"} - ${els.projectName?.value || "Current project"}`;
  const options = [{ id: currentId, label: currentLabel }];
  state.crm.records.forEach((record) => {
    if (record.id === currentId) return;
    options.push({
      id: record.id,
      label: `${record.customerName || "No customer"} - ${record.projectName || "Untitled project"}`,
    });
  });
  return options
    .map((option) => `<option value="${escapeAttr(option.id)}" ${option.id === selectedId ? "selected" : ""}>${escapeAttr(option.label)}</option>`)
    .join("");
}

function renderEstimateProjectPicker() {
  if (!els.estimateProjectSelect) return;
  els.estimateProjectSelect.innerHTML = estimateProjectOptionsHtml();
  els.estimateProjectSelect.value = state.crm.activeRecordId || "current";
}

function taskProjectOptionsHtml(selectedId = state.taskFilters.projectId || state.crm.activeRecordId || "current") {
  return [`<option value="all" ${selectedId === "all" ? "selected" : ""}>All projects</option>`, projectOptionsHtml(selectedId)].join("");
}

function switchEstimateProject(projectId) {
  if (!projectId || projectId === (state.crm.activeRecordId || "current")) return;
  saveActiveCrmRecordEdits();
  const record = state.crm.records.find((item) => item.id === projectId);
  if (!record) return;
  applyCrmRecord(record);
}

function switchTaskProject(projectId) {
  if (!projectId || projectId === (state.crm.activeRecordId || "current")) return;
  const record = state.crm.records.find((item) => item.id === projectId);
  if (!record) return;
  applyCrmRecord(record);
  setView("tasks");
}

function matchingScheduleProject(projectName) {
  const value = String(projectName || "").trim().toLowerCase();
  return scheduleProjectOptions().find((option) => option.projectName.toLowerCase() === value);
}

function calendarProjectRecords() {
  const current = {
    id: state.crm.activeRecordId || "current",
    projectName: currentProjectName(),
    customerName: els.customerName?.value || "New Customer",
    schedule: state.schedule,
    purchaseOrders: state.purchaseOrders,
  };
  if (state.schedule.scope !== "all") return [current];
  const saved = state.crm.records.filter((record) => record.schedule?.items?.length);
  const withoutCurrent = saved.filter((record) => record.id !== state.crm.activeRecordId);
  return [current, ...withoutCurrent];
}

function purchaseOrdersForScheduleItem(record, item) {
  const itemTrade = item.trade || item.department || "";
  const itemCompany = item.subtrade || "";
  return normalizePurchaseOrders(record.purchaseOrders)
    .filter((order) => order.status !== "Closed")
    .filter((order) => order.trade === itemTrade || companyMatches(order.vendor, itemCompany));
}

function purchaseOrderById(record, purchaseOrderId) {
  if (!purchaseOrderId) return null;
  return normalizePurchaseOrders(record.purchaseOrders).find((order) => order.id === purchaseOrderId) || null;
}

function scheduleItemPurchaseOrders(record, item) {
  const manualOrder = purchaseOrderById(record, item.purchaseOrderId);
  return manualOrder ? [manualOrder] : purchaseOrdersForScheduleItem(record, item);
}

function schedulePurchaseOrderOptionsHtml(item) {
  const orders = normalizePurchaseOrders(state.purchaseOrders).filter((order) => order.status !== "Closed");
  const matches = purchaseOrdersForScheduleItem({ purchaseOrders: state.purchaseOrders }, item || {});
  const selectedId = item?.purchaseOrderId || "";
  const autoMatch = matches[0];
  const autoLabel = autoMatch ? `Auto: ${autoMatch.number} - ${autoMatch.vendor || autoMatch.trade || "matched PO"}` : "Auto match by trade/vendor";
  return [
    `<option value="" ${selectedId ? "" : "selected"}>${escapeAttr(autoLabel)}</option>`,
    ...orders.map((order) => {
      const matchLabel = matches.some((match) => match.id === order.id) ? " (auto match)" : "";
      const label = `${order.number} - ${order.vendor || "No vendor"} - ${order.trade || "No trade"}${matchLabel}`;
      return `<option value="${escapeAttr(order.id)}" ${selectedId === order.id ? "selected" : ""}>${escapeAttr(label)}</option>`;
    }),
  ].join("");
}

function calendarItems() {
  const filter = parseScheduleFilter(state.schedule.tradeFilter);
  return calendarProjectRecords().flatMap((record) =>
    (record.schedule?.items || [])
      .filter((item) => {
        const itemTrade = item.trade || item.department;
        if (filter.type === "all") return true;
        if (filter.type === "trade") return itemTrade === filter.trade;
        return itemTrade === filter.trade && companyMatches(item.subtrade, filter.company);
      })
      .map((item) => ({
        ...item,
        endDate: item.endDate || item.targetDate,
        projectId: record.id,
        projectName: record.projectName || "Project",
        purchaseOrderNumbers: scheduleItemPurchaseOrders(record, item).map((order) => order.number),
        isCurrentProject: record.id === (state.crm.activeRecordId || "current") || record.id === "current",
      })),
  );
}

function projectColor(projectId) {
  const text = String(projectId || "current");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % projectColorPalette.length;
  }
  return projectColorPalette[hash];
}

function selectedScheduleItem() {
  ensureSchedule();
  return state.schedule.items.find((item) => item.id === state.schedule.selectedItemId) || state.schedule.items[0];
}

function scheduleForProject(projectId) {
  if (!projectId || projectId === "current" || projectId === state.crm.activeRecordId) return state.schedule;
  const record = state.crm.records.find((item) => item.id === projectId);
  return record?.schedule || null;
}

function scheduleItemForProject(projectId, itemId) {
  const schedule = scheduleForProject(projectId);
  const item = schedule?.items?.find((entry) => entry.id === itemId);
  return { schedule, item };
}

function persistScheduleProject(projectId) {
  if (!projectId || projectId === "current" || projectId === state.crm.activeRecordId) {
    saveActiveCrmRecordEdits();
    return;
  }
  const record = state.crm.records.find((item) => item.id === projectId);
  if (record) {
    record.updatedAt = new Date().toISOString();
    persistCrmRecords();
  }
}

async function handleSelectionPhotoUpload(event) {
  const input = event.target.closest("[data-selection-photo]");
  const file = input?.files?.[0];
  if (!input || !file) return;
  const item = state.selections.find((entry) => entry.id === input.dataset.selectionPhoto);
  if (!item) return;
  item.photo = {
    name: file.name,
    type: file.type || "image/*",
    size: file.size,
    uploadedAt: new Date().toISOString(),
    dataUrl: await readFileAsDataUrl(file),
  };
  input.value = "";
  renderSelections();
  saveActiveCrmRecordEdits();
}

function openSelectionPhotoPreview(selectionId) {
  const item = state.selections.find((entry) => entry.id === selectionId);
  if (!item?.photo?.dataUrl || !els.jobFilePreviewModal || !els.jobFilePreviewBody) return;
  state.openJobFilePreviewId = "";
  revokeJobFilePreviewObjectUrl();
  els.jobFilePreviewTitle.textContent = item.photo.name || item.item || "Project info photo";
  els.jobFilePreviewDownload.href = item.photo.dataUrl;
  els.jobFilePreviewDownload.download = item.photo.name || "project-info-photo";
  els.jobFilePreviewBody.classList.remove("pdf-pages");
  els.jobFilePreviewBody.innerHTML = "";
  const image = document.createElement("img");
  image.src = item.photo.dataUrl;
  image.alt = item.photo.name || item.item || "Project info photo";
  els.jobFilePreviewBody.append(image);
  els.jobFilePreviewModal.removeAttribute("hidden");
}

function removeSelectionPhoto(selectionId) {
  const item = state.selections.find((entry) => entry.id === selectionId);
  if (!item) return;
  item.photo = null;
  renderSelections();
  saveActiveCrmRecordEdits();
}

function moveScheduleItemToDate(projectId, itemId, dateText) {
  const { schedule, item } = scheduleItemForProject(projectId, itemId);
  if (!schedule || !item || !dateText) return;
  const length = Math.max(0, dayDiff(item.targetDate, item.endDate || item.targetDate));
  item.targetDate = dateText;
  item.endDate = addDaysIso(dateText, length);
  schedule.selectedItemId = item.id;
  schedule.calendarMonth = monthKey(dateText);
  persistScheduleProject(projectId);
  renderSchedule();
}

function resizeScheduleItemToDate(projectId, itemId, edge, dateText) {
  const { schedule, item } = scheduleItemForProject(projectId, itemId);
  if (!schedule || !item || !dateText) return;
  if (edge === "start") {
    item.targetDate = dateText;
    if (!item.endDate || item.endDate < item.targetDate) item.endDate = item.targetDate;
  } else {
    item.endDate = dateText;
    if (item.endDate < item.targetDate) item.targetDate = item.endDate;
  }
  schedule.selectedItemId = item.id;
  schedule.calendarMonth = monthKey(item.targetDate);
  persistScheduleProject(projectId);
  renderSchedule();
}

function handleScheduleDragStart(event) {
  const resizeHandle = event.target.closest("[data-schedule-resize]");
  if (resizeHandle) {
    event.stopPropagation();
    event.dataTransfer.setData(
      "application/zaks-schedule",
      JSON.stringify({
        action: "resize",
        edge: resizeHandle.dataset.scheduleResize,
        itemId: resizeHandle.dataset.scheduleEvent,
        projectId: resizeHandle.dataset.scheduleProject,
      }),
    );
    event.dataTransfer.effectAllowed = "move";
    return true;
  }
  const scheduleEvent = event.target.closest("[data-schedule-event]");
  if (!scheduleEvent || scheduleEvent.closest("[data-calendar-more]")) return false;
  event.dataTransfer.setData(
    "application/zaks-schedule",
    JSON.stringify({
      action: "move",
      itemId: scheduleEvent.dataset.scheduleEvent,
      projectId: scheduleEvent.dataset.scheduleProject,
    }),
  );
  event.dataTransfer.effectAllowed = "move";
  scheduleEvent.classList.add("dragging");
  return true;
}

function handleScheduleDrop(event) {
  const dateText = calendarDateFromPointer(event);
  if (!dateText) return false;
  const raw = event.dataTransfer.getData("application/zaks-schedule");
  if (!raw) return false;
  event.preventDefault();
  try {
    const payload = JSON.parse(raw);
    if (payload.action === "resize") resizeScheduleItemToDate(payload.projectId, payload.itemId, payload.edge, dateText);
    else moveScheduleItemToDate(payload.projectId, payload.itemId, dateText);
    return true;
  } catch {
    return false;
  }
}

function calendarDateFromPointer(event) {
  const directDay = event.target.closest("[data-calendar-date]");
  if (directDay?.dataset.calendarDate) return directDay.dataset.calendarDate;
  const weekRow = event.target.closest("[data-calendar-week]");
  if (!weekRow) return "";
  return calendarDateFromWeekPointer(weekRow, event.clientX);
}

function calendarDateFromViewportPoint(clientX, clientY, fallbackWeekRow = null) {
  const target = document.elementFromPoint(clientX, clientY);
  const directDay = target?.closest?.("[data-calendar-date]");
  if (directDay?.dataset.calendarDate) return directDay.dataset.calendarDate;
  const directWeek = target?.closest?.("[data-calendar-week]");
  if (directWeek) return calendarDateFromWeekPointer(directWeek, clientX);
  const weeks = Array.from(document.querySelectorAll("[data-calendar-week]"));
  const weekAtY = weeks.find((week) => {
    const rect = week.getBoundingClientRect();
    return clientY >= rect.top && clientY <= rect.bottom;
  });
  if (weekAtY) return calendarDateFromWeekPointer(weekAtY, clientX);
  if (fallbackWeekRow) return calendarDateFromWeekPointer(fallbackWeekRow, clientX);
  return "";
}

function calendarDateFromWeekPointer(weekRow, clientX) {
  const days = Array.from(weekRow.querySelectorAll("[data-calendar-date]"));
  if (!days.length) return "";
  const rect = weekRow.getBoundingClientRect();
  const column = Math.min(6, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * 7)));
  return days[column]?.dataset.calendarDate || "";
}

function highlightCalendarDropDay(event) {
  document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
  const dateText = calendarDateFromPointer(event);
  const targetDay = dateText ? document.querySelector(`[data-calendar-date="${dateText}"]`) : null;
  targetDay?.classList.add("drag-over");
}

function beginScheduleResize(event) {
  if (state.schedule.resizeDrag) return true;
  let handle = event.target.closest("[data-schedule-resize]");
  let scheduleEvent = handle?.closest("[data-schedule-event]");
  let edge = handle?.dataset.scheduleResize || "";
  if (!handle) {
    scheduleEvent = event.target.closest("[data-schedule-event]");
    if (!scheduleEvent || scheduleEvent.closest("[data-calendar-more]")) return false;
    const rect = scheduleEvent.getBoundingClientRect();
    const edgeZone = Math.min(28, rect.width * 0.28);
    if (event.clientX - rect.left <= edgeZone) edge = "start";
    else if (rect.right - event.clientX <= edgeZone) edge = "end";
    else return false;
    handle = scheduleEvent.querySelector(`[data-schedule-resize="${edge}"]`) || scheduleEvent;
  }
  const weekRow = scheduleEvent?.closest("[data-calendar-week]");
  if (!weekRow) return false;
  event.preventDefault();
  event.stopPropagation();
  state.schedule.resizeDrag = {
    edge,
    itemId: scheduleEvent.dataset.scheduleEvent,
    projectId: scheduleEvent.dataset.scheduleProject,
    weekRow,
    pointerId: event.pointerId ?? null,
    lastDate: calendarDateFromViewportPoint(event.clientX, event.clientY, weekRow),
  };
  try {
    if (event.pointerId !== undefined) handle.setPointerCapture?.(event.pointerId);
  } catch {
    // Some browsers only allow pointer capture during trusted pointer events.
  }
  document.body.classList.add("schedule-resizing");
  highlightCalendarResizeDate(weekRow, event.clientX);
  return true;
}

function beginScheduleMove(event) {
  if (state.schedule.resizeDrag || state.schedule.moveDrag || event.target.closest("[data-schedule-resize]")) return false;
  const scheduleEvent = event.target.closest("[data-schedule-event]");
  const weekRow = scheduleEvent?.closest("[data-calendar-week]");
  if (!scheduleEvent || !weekRow || scheduleEvent.closest("[data-calendar-more]")) return false;
  event.preventDefault();
  state.schedule.moveDrag = {
    itemId: scheduleEvent.dataset.scheduleEvent,
    projectId: scheduleEvent.dataset.scheduleProject,
    weekRow,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
  scheduleEvent.classList.add("dragging");
  highlightCalendarResizeDate(weekRow, event.clientX);
  return true;
}

function highlightCalendarResizeDate(weekRow, clientX, clientY = null) {
  document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
  const dateText = clientY === null ? calendarDateFromWeekPointer(weekRow, clientX) : calendarDateFromViewportPoint(clientX, clientY, weekRow);
  const targetDay = dateText ? document.querySelector(`[data-calendar-date="${dateText}"]`) : null;
  targetDay?.classList.add("drag-over");
  return dateText;
}

function updateScheduleResize(event) {
  const drag = state.schedule.resizeDrag;
  if (!drag) return;
  event.preventDefault();
  drag.lastDate = highlightCalendarResizeDate(drag.weekRow, event.clientX, event.clientY) || drag.lastDate;
}

function updateScheduleMove(event) {
  const drag = state.schedule.moveDrag;
  if (!drag) return;
  event.preventDefault();
  if (Math.abs(event.clientX - drag.startX) > 4 || Math.abs(event.clientY - drag.startY) > 4) drag.moved = true;
  highlightCalendarResizeDate(drag.weekRow, event.clientX);
}

function finishScheduleResize(event) {
  const drag = state.schedule.resizeDrag;
  if (!drag) return;
  event.preventDefault();
  const dateText = calendarDateFromViewportPoint(event.clientX, event.clientY, drag.weekRow) || drag.lastDate;
  state.schedule.resizeDrag = null;
  document.body.classList.remove("schedule-resizing");
  document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
  if (dateText) resizeScheduleItemToDate(drag.projectId, drag.itemId, drag.edge, dateText);
}

function finishScheduleMove(event) {
  const drag = state.schedule.moveDrag;
  if (!drag) return false;
  event.preventDefault();
  const dateText = calendarDateFromWeekPointer(drag.weekRow, event.clientX);
  document.querySelectorAll("[data-schedule-event]").forEach((item) => item.classList.remove("dragging"));
  document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
  state.schedule.moveDrag = null;
  if (drag.moved && dateText) {
    moveScheduleItemToDate(drag.projectId, drag.itemId, dateText);
    return true;
  }
  state.schedule.dayPopupDate = "";
  state.schedule.selectedItemId = drag.itemId;
  state.schedule.editorOpen = true;
  renderSchedule();
  return true;
}

function pickScheduleResizeEdge(button) {
  const scheduleEvent = button.closest("[data-schedule-event]");
  if (!scheduleEvent) return;
  state.schedule.pendingResize = {
    edge: button.dataset.scheduleResize,
    itemId: scheduleEvent.dataset.scheduleEvent,
    projectId: scheduleEvent.dataset.scheduleProject,
  };
  renderSchedule();
}

function applyPendingScheduleResize(dateText) {
  const pending = state.schedule.pendingResize;
  if (!pending || !dateText) return false;
  state.schedule.pendingResize = null;
  resizeScheduleItemToDate(pending.projectId, pending.itemId, pending.edge, dateText);
  return true;
}

function calendarEventHtml(item, segment = {}) {
  const isRange = item.endDate && item.endDate !== item.targetDate;
  const pending = state.schedule.pendingResize;
  const pendingClass = pending?.itemId === item.id && pending?.projectId === item.projectId ? `resizing-${pending.edge}` : "";
  const gridStyle =
    segment.startColumn && segment.endColumn ? `grid-column: ${segment.startColumn} / ${segment.endColumn}; --bar-row: ${segment.row || 1};` : "";
  const poLabel = item.purchaseOrderNumbers?.length ? ` - ${item.purchaseOrderNumbers.join(", ")}` : "";
  const label = `${item.projectName || "Project"}${item.name ? ` - ${item.name}` : ""}${poLabel}`;
  return `
    <strong class="calendar-event ${segment.startColumn ? "calendar-bar" : ""} ${isRange ? "range-event" : ""} ${pendingClass} ${item.id === state.schedule.selectedItemId && item.isCurrentProject ? "active" : ""} ${item.isCurrentProject ? "" : "other-project"}" style="--event-color: ${projectColor(item.projectId)}; ${gridStyle}" data-schedule-event="${item.id}" data-schedule-project="${escapeAttr(item.projectId)}" title="${escapeAttr(label)}">
      <button class="event-resize-handle event-resize-start" type="button" data-schedule-resize="start" data-schedule-event="${item.id}" data-schedule-project="${escapeAttr(item.projectId)}" title="Drag or click, then choose a date"></button>
      <span>${escapeAttr(label)}</span>
      <button class="event-resize-handle event-resize-end" type="button" data-schedule-resize="end" data-schedule-event="${item.id}" data-schedule-project="${escapeAttr(item.projectId)}" title="Drag or click, then choose a date"></button>
    </strong>
  `;
}

function weekDatesForCalendar(stateMonth, weekStartIndex) {
  return Array.from({ length: 7 }, (_, offset) => {
    const [year, month] = stateMonth.split("-").map(Number);
    const first = new Date(year, month - 1, 1);
    const leadingDays = first.getDay();
    const dayNumber = weekStartIndex + offset - leadingDays + 1;
    const date = new Date(year, month - 1, dayNumber);
    const dateMonth = String(date.getMonth() + 1).padStart(2, "0");
    const dateDay = String(date.getDate()).padStart(2, "0");
    return {
      dateText: `${date.getFullYear()}-${dateMonth}-${dateDay}`,
      dayNumber: date.getDate(),
      isCurrentMonth: dateMonth === stateMonth.slice(5) && String(date.getFullYear()) === stateMonth.slice(0, 4),
    };
  });
}

function calendarBarSegments(weekDates, visibleItems) {
  const weekStart = weekDates[0].dateText;
  const weekEnd = weekDates[6].dateText;
  return visibleItems
    .filter((item) => (item.targetDate || "") <= weekEnd && (item.endDate || item.targetDate || "") >= weekStart)
    .sort((a, b) => String(a.targetDate).localeCompare(String(b.targetDate)) || String(a.name).localeCompare(String(b.name)))
    .map((item, index) => {
      const segmentStart = item.targetDate < weekStart ? weekStart : item.targetDate;
      const segmentEnd = (item.endDate || item.targetDate) > weekEnd ? weekEnd : item.endDate || item.targetDate;
      const startColumn = weekDates.findIndex((day) => day.dateText === segmentStart) + 1;
      const endColumn = weekDates.findIndex((day) => day.dateText === segmentEnd) + 2;
      return { item, startColumn, endColumn, row: index + 1 };
    });
}

function renderDayEvents(dateText, dayItems) {
  const visibleItems = dayItems.slice(0, 5);
  const remaining = dayItems.length - visibleItems.length;
  return `
    ${visibleItems.map((item) => calendarEventHtml(item)).join("")}
    ${
      remaining > 0
        ? `<strong class="calendar-event more-events" data-calendar-more="${dateText}">
            <span>+ ${remaining} more</span>
            <small>View day</small>
          </strong>`
        : ""
    }
  `;
}

function renderScheduleCalendar() {
  if (!els.scheduleCalendar) return;
  ensureSchedule();
  const [year, month] = state.schedule.calendarMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingDays = first.getDay();
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const today = todayIso();
  const visibleItems = calendarItems();
  els.scheduleCalendarTitle.textContent = monthTitle(state.schedule.calendarMonth);
  els.scheduleCalendarSubtitle.textContent = `${
    state.schedule.scope === "all" ? "All saved projects" : currentProjectName()
  } - ${parseScheduleFilter(state.schedule.tradeFilter).label}`;

  els.scheduleCalendar.innerHTML = Array.from({ length: totalCells / 7 }, (_, weekIndex) => {
    const weekDates = weekDatesForCalendar(state.schedule.calendarMonth, weekIndex * 7);
    const segments = calendarBarSegments(weekDates, visibleItems);
    return `
      <section class="calendar-week-row" data-calendar-week style="--bar-count: ${Math.max(1, segments.length)}">
        <div class="calendar-week-days">
          ${weekDates
            .map(
              (day) => `
                <button class="calendar-day ${day.isCurrentMonth ? "" : "muted"} ${day.dateText === today ? "today" : ""}" type="button" data-calendar-date="${day.dateText}" ${day.isCurrentMonth ? "" : "disabled"}>
                  <span>${day.dayNumber}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="calendar-week-bars">
          ${segments.map((segment) => calendarEventHtml(segment.item, segment)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderSchedule() {
  if (!els.scheduleBody) return;
  ensureSchedule();
  els.scheduleStartDate.value = state.schedule.startDate;
  els.scheduleOwner.value = state.schedule.owner;
  els.scheduleScope.value = state.schedule.scope || "current";
  els.scheduleTradeFilter.innerHTML = scheduleTradeFilterOptionsHtml(state.schedule.tradeFilter);
  els.scheduleTradeFilter.value = normalizedScheduleFilterValue(state.schedule.tradeFilter);
  els.scheduleEditProjectName.innerHTML = projectOptionsHtml(state.crm.activeRecordId || "current");
  const selectedForEditor = selectedScheduleItem();
  els.scheduleEditTrade.innerHTML = tradeOptionsHtml(selectedForEditor?.trade || "Framing");
  els.scheduleEditSubtrade.innerHTML = scheduleSubtradeOptionsHtml(selectedForEditor?.subtrade || "", selectedForEditor?.trade || selectedForEditor?.department || "Framing");
  els.scheduleEditPurchaseOrder.innerHTML = schedulePurchaseOrderOptionsHtml(selectedForEditor);
  renderScheduleCalendar();

  const statuses = ["Not started", "In progress", "Waiting", "Complete"];
  els.scheduleBody.innerHTML = state.schedule.items
    .map(
      (item) => `
        <tr data-schedule-item="${item.id}">
          <td><input data-schedule-field="name" value="${escapeAttr(item.name)}" /></td>
          <td>
            <select data-schedule-field="department">
              ${["Sales", "Office", "Production", "Owners", "Accounting"]
                .map((department) => `<option ${item.department === department ? "selected" : ""}>${department}</option>`)
                .join("")}
            </select>
          </td>
          <td>
            <select data-schedule-field="trade">
              ${tradeOptionsHtml(item.trade || item.department)}
            </select>
          </td>
          <td>
            <select data-schedule-field="subtrade">
              ${scheduleSubtradeOptionsHtml(item.subtrade || "", item.trade || item.department)}
            </select>
          </td>
          <td><input data-schedule-field="targetDate" type="date" value="${item.targetDate || ""}" /></td>
          <td><input data-schedule-field="endDate" type="date" value="${item.endDate || item.targetDate || ""}" /></td>
          <td>
            <select data-schedule-field="status">
              ${statuses.map((status) => `<option ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </td>
          <td><input data-schedule-field="notes" value="${escapeAttr(item.notes)}" placeholder="Schedule notes" /></td>
        </tr>
      `,
    )
    .join("");

  const openItems = state.schedule.items.filter((item) => item.status !== "Complete");
  const completed = state.schedule.items.length - openItems.length;
  const next = openItems
    .slice()
    .sort((a, b) => String(a.targetDate || "9999-99-99").localeCompare(String(b.targetDate || "9999-99-99")))[0];

  if (els.scheduleNextMilestone) els.scheduleNextMilestone.textContent = next?.name || "All complete";
  if (els.scheduleNextDate) els.scheduleNextDate.textContent = prettyDate(next?.targetDate);
  if (els.scheduleOpenItems) els.scheduleOpenItems.textContent = String(openItems.length);
  if (els.scheduleCompletedItems) els.scheduleCompletedItems.textContent = String(completed);
  if (els.scheduleUpcoming) {
    els.scheduleUpcoming.innerHTML = openItems.length
      ? openItems
          .slice(0, 5)
          .map(
            (item) => `
              <article>
                <strong>${escapeAttr(item.name)}</strong>
                <span>${escapeAttr(item.department)} - ${prettyDate(item.targetDate)}</span>
                <small>${escapeAttr(item.status)}</small>
              </article>
            `,
          )
          .join("")
      : `<p class="empty-note">No open schedule items.</p>`;
  }

  const selected = selectedScheduleItem();
  if (selected) {
    els.scheduleEditProjectName.value = state.crm.activeRecordId || "current";
    els.scheduleEditName.value = selected.name || "";
    els.scheduleEditDepartment.value = selected.department || "Production";
    els.scheduleEditTrade.value = selected.trade || selected.department || "Framing";
    els.scheduleEditSubtrade.innerHTML = scheduleSubtradeOptionsHtml(selected.subtrade || "", selected.trade || selected.department || "Framing");
    els.scheduleEditSubtrade.value = selected.subtrade || "";
    els.scheduleEditPurchaseOrder.innerHTML = schedulePurchaseOrderOptionsHtml(selected);
    els.scheduleEditPurchaseOrder.value = selected.purchaseOrderId || "";
    els.scheduleEditDate.value = selected.targetDate || "";
    els.scheduleEditEndDate.value = selected.endDate || selected.targetDate || "";
    els.scheduleEditStatus.value = selected.status || "Not started";
    els.scheduleEditNotes.value = selected.notes || "";
  }
  els.scheduleEditor.classList.toggle("is-open", Boolean(state.schedule.editorOpen && selected));

  const dayItems = state.schedule.dayPopupDate
    ? calendarItems().filter((item) => dateRangeIncludes(state.schedule.dayPopupDate, item.targetDate, item.endDate))
    : [];
  els.scheduleDayPopup.classList.toggle("is-open", Boolean(state.schedule.dayPopupDate && dayItems.length));
  els.scheduleDayPopupTitle.textContent = prettyDate(state.schedule.dayPopupDate);
  els.scheduleDayPopupItems.innerHTML = dayItems
    .map(
      (item) => `
        <button class="day-event-row" type="button" style="--event-color: ${projectColor(item.projectId)}" data-schedule-event="${item.id}" data-schedule-project="${escapeAttr(item.projectId)}">
          <strong>${escapeAttr(item.name)}</strong>
          <span>${escapeAttr(item.projectName)} - ${escapeAttr(item.status)}</span>
          <small>${escapeAttr(item.trade || item.department || "Schedule")}${item.subtrade ? ` / ${escapeAttr(item.subtrade)}` : ""}${item.purchaseOrderNumbers?.length ? ` / ${escapeAttr(item.purchaseOrderNumbers.join(", "))}` : ""}</small>
        </button>
      `,
    )
    .join("");
}

function handleScheduleEdit(event) {
  ensureSchedule();
  if (event.target === els.scheduleStartDate) {
    state.schedule.startDate = event.target.value || todayIso();
    saveActiveCrmRecordEdits();
    if (event.type === "change") renderSchedule();
    return;
  }
  if (event.target === els.scheduleOwner) {
    state.schedule.owner = event.target.value;
    saveActiveCrmRecordEdits();
    return;
  }
  if (event.target === els.scheduleScope) {
    state.schedule.scope = event.target.value;
    saveActiveCrmRecordEdits();
    if (event.type === "change") renderSchedule();
    return;
  }
  if (event.target === els.scheduleTradeFilter) {
    state.schedule.tradeFilter = event.target.value;
    saveActiveCrmRecordEdits();
    if (event.type === "change") renderSchedule();
    return;
  }
  const row = event.target.closest("[data-schedule-item]");
  const field = event.target.dataset.scheduleField;
  const item = state.schedule.items.find((entry) => entry.id === row?.dataset.scheduleItem);
  if (!item || !field) return;
  item[field] = event.target.value;
  if (field === "trade") {
    item.subtrade = "";
    const subtradeSelect = row.querySelector('[data-schedule-field="subtrade"]');
    if (subtradeSelect) subtradeSelect.innerHTML = scheduleSubtradeOptionsHtml("", item.trade || item.department);
  }
  if (field === "targetDate" && (!item.endDate || item.endDate < item.targetDate)) item.endDate = item.targetDate;
  if (field === "endDate" && item.endDate < item.targetDate) item.targetDate = item.endDate;
  saveActiveCrmRecordEdits();
  if (event.type === "change") renderSchedule();
}

function handleScheduleEditorEdit(event) {
  const selected = selectedScheduleItem();
  if (!selected) return;
  if (event.target.id === "scheduleEditProjectName") {
    const projectId = event.target.value;
    if (projectId && projectId !== (state.crm.activeRecordId || "current")) {
      moveSelectedScheduleItemToProject(projectId);
      return;
    }
    return;
  }
  const fieldMap = {
    scheduleEditName: "name",
    scheduleEditDepartment: "department",
    scheduleEditTrade: "trade",
    scheduleEditSubtrade: "subtrade",
    scheduleEditPurchaseOrder: "purchaseOrderId",
    scheduleEditDate: "targetDate",
    scheduleEditEndDate: "endDate",
    scheduleEditStatus: "status",
    scheduleEditNotes: "notes",
  };
  const field = fieldMap[event.target.id];
  if (!field) return;
  selected[field] = event.target.value;
  if (field === "trade") {
    selected.subtrade = "";
    els.scheduleEditSubtrade.innerHTML = scheduleSubtradeOptionsHtml("", selected.trade || selected.department);
    els.scheduleEditSubtrade.value = "";
  }
  if ((field === "trade" || field === "subtrade") && !selected.purchaseOrderId) {
    els.scheduleEditPurchaseOrder.innerHTML = schedulePurchaseOrderOptionsHtml(selected);
    els.scheduleEditPurchaseOrder.value = "";
  }
  if (field === "targetDate" && (!selected.endDate || selected.endDate < selected.targetDate)) selected.endDate = selected.targetDate;
  if (field === "endDate" && selected.endDate < selected.targetDate) selected.targetDate = selected.endDate;
  if (field === "targetDate" && event.target.value) state.schedule.calendarMonth = monthKey(event.target.value);
  if (field === "endDate" && event.target.value) state.schedule.calendarMonth = monthKey(selected.targetDate || event.target.value);
  saveActiveCrmRecordEdits();
  if (event.type === "change") renderSchedule();
}

function moveSelectedScheduleItemToProject(projectId) {
  const selected = selectedScheduleItem();
  const targetRecord = state.crm.records.find((record) => record.id === projectId);
  if (!selected || !targetRecord) return;
  const movedItem = { ...selected };
  state.schedule.items = state.schedule.items.filter((item) => item.id !== selected.id);
  if (state.schedule.selectedItemId === selected.id) state.schedule.selectedItemId = state.schedule.items[0]?.id || "";
  saveActiveCrmRecordEdits();
  targetRecord.schedule = normalizeSchedule(targetRecord.schedule);
  if (!targetRecord.schedule.items.some((item) => item.id === movedItem.id)) {
    targetRecord.schedule.items.push(movedItem);
  }
  targetRecord.schedule.selectedItemId = movedItem.id;
  targetRecord.schedule.editorOpen = true;
  targetRecord.schedule.dayPopupDate = "";
  targetRecord.updatedAt = new Date().toISOString();
  persistCrmRecords();
  applyCrmRecord(targetRecord);
  state.schedule.selectedItemId = movedItem.id;
  state.schedule.editorOpen = true;
  renderSchedule();
}

function addScheduleItem() {
  ensureSchedule();
  const selected = selectedScheduleItem();
  const dateText = selected?.targetDate || `${state.schedule.calendarMonth}-01`;
  createScheduleItemOnDate(dateText);
}

function createScheduleItemOnDate(dateText) {
  ensureSchedule();
  const id = `schedule-${Date.now()}`;
  const filter = parseScheduleFilter(state.schedule.tradeFilter);
  const item = {
    id,
    name: "New schedule item",
    department: "Production",
    trade: filter.type === "trade" || filter.type === "company" ? filter.trade : "Framing",
    subtrade: filter.type === "company" ? filter.company : "",
    purchaseOrderId: "",
    targetDate: dateText,
    endDate: dateText,
    status: "Not started",
    notes: "",
  };
  state.schedule.items.push(item);
  state.schedule.selectedItemId = id;
  state.schedule.editorOpen = true;
  saveActiveCrmRecordEdits();
  renderSchedule();
}

function selectScheduleDate(dateText) {
  if (!dateText) return;
  const item = state.schedule.items.find((entry) => dateRangeIncludes(dateText, entry.targetDate, entry.endDate));
  if (!item) return;
  state.schedule.selectedItemId = item.id;
  state.schedule.editorOpen = true;
  renderSchedule();
}

function deleteSelectedScheduleItem() {
  const selected = selectedScheduleItem();
  if (!selected) return;
  const shouldDelete = window.confirm(`Delete "${selected.name}" from the schedule?`);
  if (!shouldDelete) return;
  state.schedule.items = state.schedule.items.filter((item) => item.id !== selected.id);
  state.schedule.selectedItemId = state.schedule.items[0]?.id || "";
  state.schedule.editorOpen = false;
  renderSchedule();
}

function hasPermission(view) {
  const user = state.auth.currentUser;
  if (!user) return false;
  if (view === "management") return canViewManagement(user);
  return user.permissions.includes("all") || user.permissions.includes(view);
}

function canViewManagement(user = state.auth.currentUser) {
  if (!user) return false;
  return user.role === "Owner" || user.role === "Management" || user.permissions.includes("all") || user.permissions.includes("management");
}

function firstAllowedView() {
  return ["crm", "management", "estimate", "output", "contract", "tasks", "schedule", "vendors", "jobFiles", "warranty", "billingStages", "purchaseOrders", "changeOrders", "selections", "allowances", "review"].find((view) => hasPermission(view)) || "crm";
}

function syncNavGroups(view = state.view) {
  const groupViews = {
    sales: ["estimate", "output", "contract", "review"],
    projectManagement: ["schedule", "selections", "vendors", "jobFiles", "warranty"],
    financial: ["billingStages", "purchaseOrders", "changeOrders", "allowances"],
  };
  document.querySelectorAll("[data-nav-group]").forEach((group) => {
    const isActiveGroup = groupViews[group.dataset.navGroup]?.includes(view);
    group.classList.toggle("collapsed", !isActiveGroup);
    const toggle = document.querySelector(`[data-nav-group-toggle="${group.dataset.navGroup}"]`);
    if (toggle) toggle.setAttribute("aria-expanded", String(!group.classList.contains("collapsed")));
  });
}

function setOpenNavGroup(groupName) {
  document.querySelectorAll("[data-nav-group]").forEach((group) => {
    group.classList.toggle("collapsed", group.dataset.navGroup !== groupName);
    const toggle = document.querySelector(`[data-nav-group-toggle="${group.dataset.navGroup}"]`);
    if (toggle) toggle.setAttribute("aria-expanded", String(!group.classList.contains("collapsed")));
  });
}

function loadAuthSession() {
  if (!storageAvailable()) return;
  const userId = window.localStorage.getItem("zaksBuildOsCurrentUser");
  state.auth.currentUser = users.find((user) => user.id === userId) || null;
  try {
    const rawProfiles = window.localStorage.getItem("zaksBuildOsUserProfiles");
    const parsedProfiles = rawProfiles ? JSON.parse(rawProfiles) : {};
    state.auth.profiles = parsedProfiles && typeof parsedProfiles === "object" ? parsedProfiles : {};
  } catch {
    state.auth.profiles = {};
  }
}

function persistAuthSession() {
  if (!storageAvailable()) return;
  if (state.auth.currentUser) window.localStorage.setItem("zaksBuildOsCurrentUser", state.auth.currentUser.id);
  else window.localStorage.removeItem("zaksBuildOsCurrentUser");
}

function persistUserProfiles() {
  if (!storageAvailable()) return;
  window.localStorage.setItem("zaksBuildOsUserProfiles", JSON.stringify(state.auth.profiles));
}

function currentUserProfile() {
  const user = state.auth.currentUser;
  if (!user) return null;
  const saved = state.auth.profiles[user.id] || {};
  return {
    id: user.id,
    name: saved.name || user.name,
    role: user.role,
    email: saved.email || "",
    phone: saved.phone || "",
  };
}

function renderAuth() {
  const isSignedIn = Boolean(state.auth.currentUser);
  document.body.classList.toggle("is-authenticated", isSignedIn);
  els.loginScreen?.toggleAttribute("hidden", isSignedIn);
  byId("app")?.toggleAttribute("hidden", !isSignedIn);
  if (!isSignedIn) return;
  const profile = currentUserProfile();
  els.activeUserName.textContent = profile.name;
  els.activeUserRole.textContent = profile.role;
  if (els.accountName) els.accountName.value = profile.name;
  if (els.accountEmail) els.accountEmail.value = profile.email;
  if (els.accountPhone) els.accountPhone.value = profile.phone;
  if (els.accountRole) els.accountRole.value = profile.role;
  if (els.accountPanel) els.accountPanel.toggleAttribute("hidden", !state.auth.accountPanelOpen);
  if (els.accountMenuBtn) els.accountMenuBtn.setAttribute("aria-expanded", String(state.auth.accountPanelOpen));
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.toggleAttribute("hidden", !hasPermission(button.dataset.view));
  });
  if (!hasPermission(state.view)) state.view = firstAllowedView();
}

function handleAccountEdit() {
  const user = state.auth.currentUser;
  if (!user) return;
  state.auth.profiles[user.id] = {
    ...(state.auth.profiles[user.id] || {}),
    name: els.accountName.value.trim() || user.name,
    email: els.accountEmail.value.trim(),
    phone: els.accountPhone.value.trim(),
  };
  persistUserProfiles();
  renderAuth();
}

function toggleAccountPanel(forceOpen = !state.auth.accountPanelOpen) {
  state.auth.accountPanelOpen = Boolean(forceOpen);
  renderAuth();
}

function handleLogin(event) {
  event.preventDefault();
  const selectedUser = users.find((user) => user.id === els.loginUser.value);
  if (!selectedUser || els.loginPassword.value !== selectedUser.password) {
    els.loginError.textContent = "That login did not match. For this prototype, use password zaks.";
    return;
  }
  state.auth.currentUser = selectedUser;
  els.loginPassword.value = "";
  els.loginError.textContent = "";
  persistAuthSession();
  renderAuth();
  setView(firstAllowedView());
}

function logout() {
  state.auth.currentUser = null;
  state.auth.accountPanelOpen = false;
  persistAuthSession();
  renderAuth();
}

function managementRecords() {
  const records = [...state.crm.records];
  if (els.projectName && !records.some((record) => record.id === state.crm.activeRecordId)) {
    records.unshift(currentCrmRecord());
  }
  return records;
}

const managementOpenStatuses = ["New", "Contacted", "Needs Estimate", "Estimate In Progress", "Quote Sent", "Follow-up", "Under Construction"];

function managementBreakdownRecords(breakdown) {
  const records = managementRecords();
  if (!breakdown) return [];
  if (breakdown.type === "total") return records;
  if (breakdown.type === "open" || breakdown.type === "pipeline") return records.filter((record) => managementOpenStatuses.includes(record.status));
  if (breakdown.type === "won") return records.filter((record) => record.status === "Won");
  if (breakdown.type === "status") return records.filter((record) => record.status === breakdown.status);
  return [];
}

function managementBreakdownTitle(breakdown, records) {
  if (!breakdown) return "Projects";
  if (breakdown.type === "total") return `Total leads (${records.length})`;
  if (breakdown.type === "open") return `Open pipeline (${records.length})`;
  if (breakdown.type === "won") return `Won jobs (${records.length})`;
  if (breakdown.type === "pipeline") return `Pipeline value (${money.format(records.reduce((sum, record) => sum + num(record.estimateTotal), 0))})`;
  if (breakdown.type === "status") return `${breakdown.status} (${records.length})`;
  return "Projects";
}

function renderManagementBreakdown() {
  if (!els.managementBreakdownModal) return;
  const breakdown = state.managementBreakdown;
  const records = managementBreakdownRecords(breakdown);
  els.managementBreakdownModal.toggleAttribute("hidden", !breakdown);
  if (!breakdown) {
    els.managementBreakdownBody.innerHTML = "";
    return;
  }
  const totalValue = records.reduce((sum, record) => sum + num(record.estimateTotal), 0);
  els.managementBreakdownTitle.textContent = managementBreakdownTitle(breakdown, records);
  els.managementBreakdownBody.innerHTML = `
    <div class="management-breakdown-summary">
      <div><span>Projects</span><strong>${records.length}</strong></div>
      <div><span>Total value</span><strong>${money.format(totalValue)}</strong></div>
    </div>
    ${
      records.length
        ? `<div class="management-breakdown-list">
            ${records
              .map(
                (record) => `
                  <article>
                    <div>
                      <strong>${escapeAttr(record.projectName || "Untitled project")}</strong>
                      <span>${escapeAttr(record.customerName || "No customer")} - ${escapeAttr(record.status || "No status")}</span>
                    </div>
                    <div>
                      <strong>${money.format(num(record.estimateTotal))}</strong>
                      <span>${escapeAttr(record.salesperson || "Unassigned")}</span>
                    </div>
                    <small>${record.followupDate ? `Follow-up ${prettyDate(record.followupDate)}` : "No follow-up date"}</small>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : `<p class="empty-note">No projects in this group yet.</p>`
    }
  `;
}

function renderManagement() {
  if (!els.mgmtTotalLeads) return;
  const records = managementRecords();
  const won = records.filter((record) => record.status === "Won");
  const open = records.filter((record) => managementOpenStatuses.includes(record.status));
  const pipelineValue = open.reduce((sum, record) => sum + num(record.estimateTotal), 0);
  const wonValue = won.reduce((sum, record) => sum + num(record.estimateTotal), 0);
  const quoteSent = records.filter((record) => record.status === "Quote Sent").length;
  const avgValue = records.length ? records.reduce((sum, record) => sum + num(record.estimateTotal), 0) / records.length : 0;
  const conversion = records.length ? (won.length / records.length) * 100 : 0;

  els.mgmtTotalLeads.textContent = String(records.length);
  els.mgmtOpenLeads.textContent = String(open.length);
  els.mgmtWonLeads.textContent = String(won.length);
  els.mgmtPipelineValue.textContent = money.format(pipelineValue);

  const statusCounts = ["New", "Contacted", "Needs Estimate", "Estimate In Progress", "Quote Sent", "Follow-up", "Won", "Under Construction", "Lost"].map((status) => ({
    status,
    count: records.filter((record) => record.status === status).length,
  }));
  els.mgmtSalesStats.innerHTML = statusCounts
    .map(
      (item) => `
        <article>
          <span>${escapeAttr(item.status)}</span>
          <strong>${item.count}</strong>
          <button class="management-breakdown-link" type="button" data-management-status="${escapeAttr(item.status)}">View</button>
        </article>
      `,
    )
    .join("");

  const salespeople = ["Chris Peters", "Angela Kiedrowski", "Will Buhler", "Kelsie Funk", "Dale Deptuck", "Sam Milne", "Chad Zacharias"];
  els.mgmtSalespeopleStats.innerHTML = `
    <table class="management-table">
      <thead>
        <tr>
          <th>Salesperson</th>
          <th>Leads</th>
          <th>Open</th>
          <th>Won</th>
          <th>Pipeline</th>
          <th>Won value</th>
        </tr>
      </thead>
      <tbody>
        ${salespeople
          .map((salesperson) => {
            const owned = records.filter((record) => (record.salesperson || "Chris Peters") === salesperson);
            const ownedOpen = owned.filter((record) => managementOpenStatuses.includes(record.status));
            const ownedWon = owned.filter((record) => record.status === "Won");
            return `
              <tr>
                <td>${salesperson}</td>
                <td>${owned.length}</td>
                <td>${ownedOpen.length}</td>
                <td>${ownedWon.length}</td>
                <td>${money.format(ownedOpen.reduce((sum, record) => sum + num(record.estimateTotal), 0))}</td>
                <td>${money.format(ownedWon.reduce((sum, record) => sum + num(record.estimateTotal), 0))}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  els.mgmtKeyMetrics.innerHTML = `
    <article><span>Quote sent</span><strong>${quoteSent}</strong></article>
    <article><span>Conversion rate</span><strong>${conversion.toFixed(0)}%</strong></article>
    <article><span>Average estimate</span><strong>${money.format(avgValue)}</strong></article>
    <article><span>Won value</span><strong>${money.format(wonValue)}</strong></article>
  `;
  renderManagementBreakdown();
}

function render() {
  syncProjectLevelAvailability();
  syncProjectQuantities();
  renderEstimateProjectPicker();
  renderSections();
  renderAllowances();
  renderReview();
  renderEstimateVersions();
  renderCrm();
  renderProjectTasks();
  renderSchedule();
  renderSelections();
  renderVendors();
  renderJobFiles();
  renderWarranty();
  renderPurchaseOrders();
  renderChangeOrders();
  renderEstimateOutput();
  renderContract();
  renderManagement();
  updateTotals();
}

function setView(view) {
  if (!hasPermission(view)) view = firstAllowedView();
  state.view = view;
  renderAuth();
  const fullProjectPanelViews = ["estimate", "output", "contract", "review"];
  const compactProjectPanelViews = ["selections", "jobFiles", "billingStages", "purchaseOrders", "changeOrders", "allowances"];
  const projectPanelVisible = [...fullProjectPanelViews, ...compactProjectPanelViews].includes(view);
  byId("app").classList.toggle("project-panel-hidden", !projectPanelVisible);
  const projectPanel = document.querySelector(".project-panel");
  projectPanel?.toggleAttribute("hidden", !projectPanelVisible);
  projectPanel?.classList.toggle("project-panel-compact", compactProjectPanelViews.includes(view));
  document.querySelector(".schedule-top-panel")?.toggleAttribute("hidden", view !== "schedule");
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  syncNavGroups(view);
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `${view}View`);
  });
  const titles = {
    estimate: "Estimate Builder",
    crm: "CRM Pipeline",
    management: "Management Dashboard",
    output: "Estimate Proposal",
    contract: "Contract",
    tasks: "To-Dos",
    schedule: "Scheduling",
    vendors: "Vendor/Subtrade Management",
    jobFiles: "Files & Photos",
    warranty: "Warranty",
    billingStages: "Billing Stages",
    purchaseOrders: "Purchase Orders",
    changeOrders: "Change Orders",
    selections: "Project Info",
    allowances: "Allowances",
    review: "Estimate Review",
  };
  els.viewTitle.textContent = titles[view];
  render();
}

function handleLineEdit(event) {
  const row = event.target.closest("[data-line]");
  if (!row) return;
  const line = state.lines.find((item) => item.id === row.dataset.line);
  const field = event.target.dataset.field;
  if (!line || !field) return;
  if (event.target.type === "checkbox") {
    line[field] = event.target.checked;
  } else if (["quantity", "unitCost", "margin", "proposalSort", "proposalIndent"].includes(field)) {
    line[field] = event.target.value === "" ? "" : num(event.target.value);
    if (field === "quantity") line.quantityManual = true;
  } else {
    line[field] = event.target.value;
  }
  if (field === "quantity" && isPineCeilingSource(line)) {
    syncLinkedPineCeilingQuantities();
    render();
    saveActiveCrmRecordEdits();
    return;
  }
  updateTotals();
  renderReview();
  renderEstimateOutput();
  saveActiveCrmRecordEdits();
  const totals = lineTotals(line);
  const moneyCells = row.querySelectorAll(".money");
  moneyCells[0].textContent = money.format(totals.retail);
  moneyCells[1].textContent = money.format(totals.total);
}

function handleCalcEdit(event) {
  const panel = event.target.closest("[data-calculator]");
  if (!panel) return false;
  const line = state.lines.find((item) => item.id === panel.dataset.calculator);
  if (!line) return true;
  const type = calculatorType(line);
  const values = getCalcValues(line);
  if (event.target.dataset.calcIndex !== undefined) {
    values.quantities[num(event.target.dataset.calcIndex)] = num(event.target.value);
    render();
    saveActiveCrmRecordEdits();
    return true;
  }
  if (event.target.dataset.flooringIndex !== undefined) {
    const row = values.rows[num(event.target.dataset.flooringIndex)];
    const field = event.target.dataset.flooringField;
    row[field] = field === "name" ? event.target.value : num(event.target.value);
    values.flooringManual = true;
    render();
    saveActiveCrmRecordEdits();
    return true;
  }
  if (event.target.dataset.calcField) {
    values[event.target.dataset.calcField] =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.tagName === "SELECT" || event.target.type === "text"
          ? event.target.value
          : num(event.target.value);
    if (["length", "width"].includes(event.target.dataset.calcField)) values.roofDimensionsManual = true;
    if (event.target.dataset.calcField === "distance") values.distanceManual = true;
    if (["doorQty", "doorHeight", "doorColour", "trimFinish", "mouldingLf", "misc"].includes(event.target.dataset.calcField)) {
      values.paintDoorsTrimManual = true;
    }
    if (
      [
        "widthBucket",
        "lengthClass",
        "eavesWidth",
        "sqft",
        "kms",
        "fuelBracket",
        "additionalHours",
        "highLiftOver6",
        "simpleHeightClass",
        "simpleLoadedKms",
        "simpleDemobKms",
        "simpleFuelBracket",
      ].includes(event.target.dataset.calcField)
    ) {
      values.moveManual = true;
    }
    if (["trips", "kms", "rate"].includes(event.target.dataset.calcField)) values.deliveryManual = true;
    render();
    saveActiveCrmRecordEdits();
    return true;
  }
  return true;
}

function handleAllowanceEdit(event) {
  const row = event.target.closest("[data-allowance]");
  if (!row) return false;
  const record = getAllowanceState(state.lines.find((line) => line.id === row.dataset.allowance));
  const field = event.target.dataset.allowanceField;
  if (!record || !field) return true;
  record[field] = field === "actual" ? event.target.value : event.target.value;
  if (field === "actual") {
    updateAllowanceTotals();
  } else if (event.type === "change") {
    renderAllowances();
  }
  saveActiveCrmRecordEdits();
  return true;
}

function orderTradeOptionsHtml(selected) {
  const options = ["Project Materials", ...scheduleTrades.filter((trade) => !["Sales", "Office", "Accounting"].includes(trade))];
  return options.map((trade) => `<option ${selected === trade ? "selected" : ""}>${escapeAttr(trade)}</option>`).join("");
}

function vendorTradeOptionsHtml(selected = "Project Materials") {
  const options = ["Project Materials", ...scheduleTrades.filter((trade) => !["Sales", "Office"].includes(trade))];
  return options.map((trade) => `<option ${selected === trade ? "selected" : ""}>${escapeAttr(trade)}</option>`).join("");
}

function vendorCompanyOptionsHtml() {
  return [
    `<option value="">Select company</option>`,
    ...normalizeVendors(state.vendors)
      .slice()
      .sort((a, b) => a.company.localeCompare(b.company))
      .map((vendor) => `<option value="${escapeAttr(vendor.company)}">${escapeAttr(vendor.company)} - ${escapeAttr(vendor.trade)}</option>`),
  ].join("");
}

function vendorByCompany(company) {
  const value = String(company || "").trim().toLowerCase();
  return normalizeVendors(state.vendors).find((vendor) => vendor.company.trim().toLowerCase() === value);
}

function syncVendorCompanyOptions() {
  const html = vendorCompanyOptionsHtml();
  const currentPurchaseOrderVendor = els.purchaseOrderVendor?.value || "";
  const currentChangeOrderVendor = els.changeOrderRequestedBy?.value || "";
  if (els.vendorCompanyOptions) els.vendorCompanyOptions.innerHTML = html;
  if (els.purchaseOrderVendor) {
    els.purchaseOrderVendor.innerHTML = html;
    els.purchaseOrderVendor.value = currentPurchaseOrderVendor;
  }
  if (els.changeOrderRequestedBy) {
    els.changeOrderRequestedBy.innerHTML = html;
    els.changeOrderRequestedBy.value = currentChangeOrderVendor;
  }
}

function applyPurchaseOrderVendorTrade() {
  const vendor = vendorByCompany(els.purchaseOrderVendor?.value);
  if (!vendor || !els.purchaseOrderTrade) return;
  els.purchaseOrderTrade.innerHTML = orderTradeOptionsHtml(vendor.trade);
}

function normalizeVendors(items) {
  const source = Array.isArray(items) ? items : [];
  return source
    .filter((item) => item?.company)
    .map((item, index) => ({
      id: item.id || `vendor-${Date.now()}-${index}`,
      company: item.company || "",
      type: item.type || "Subtrade",
      trade: item.trade || "Project Materials",
      contact: item.contact || "",
      phone: item.phone || "",
      email: item.email || "",
      status: item.status || "Active",
      notes: item.notes || "",
    }));
}

function loadVendors() {
  if (!storageAvailable()) return;
  try {
    state.vendors = normalizeVendors(JSON.parse(window.localStorage.getItem("zaksBuildOsVendors") || "[]"));
  } catch {
    state.vendors = [];
  }
}

function persistVendors() {
  if (!storageAvailable()) return;
  window.localStorage.setItem("zaksBuildOsVendors", JSON.stringify(normalizeVendors(state.vendors)));
}

function renderVendors() {
  if (!els.vendorsBody) return;
  state.vendors = normalizeVendors(state.vendors);
  syncVendorCompanyOptions();
  els.vendorTrade.innerHTML = vendorTradeOptionsHtml(els.vendorTrade.value || "Project Materials");
  const tradeFilter = els.vendorTradeFilter.value || "All trades";
  els.vendorTradeFilter.innerHTML = [
    `<option>All trades</option>`,
    ...["Project Materials", ...scheduleTrades.filter((trade) => !["Sales", "Office"].includes(trade))].map(
      (trade) => `<option ${trade === tradeFilter ? "selected" : ""}>${escapeAttr(trade)}</option>`,
    ),
  ].join("");
  const search = (els.vendorSearch.value || "").trim().toLowerCase();
  const rows = state.vendors.filter((vendor) => {
    const tradeMatch = tradeFilter === "All trades" || vendor.trade === tradeFilter;
    const text = `${vendor.company} ${vendor.type} ${vendor.trade} ${vendor.contact} ${vendor.phone} ${vendor.email} ${vendor.status} ${vendor.notes}`.toLowerCase();
    return tradeMatch && (!search || text.includes(search));
  });
  els.vendorCount.textContent = String(state.vendors.length);
  els.subtradeCount.textContent = String(state.vendors.filter((vendor) => vendor.type === "Subtrade").length);
  els.materialVendorCount.textContent = String(state.vendors.filter((vendor) => vendor.type !== "Subtrade").length);
  els.vendorsBody.innerHTML = rows.length
    ? rows
        .map(
          (vendor) => `
            <tr class="vendor-directory-row ${state.selectedVendorId === vendor.id ? "selected" : ""}" data-select-vendor="${vendor.id}">
              <td><strong>${escapeAttr(vendor.company)}</strong></td>
              <td>${escapeAttr(vendor.type)}</td>
              <td>${escapeAttr(vendor.trade)}</td>
              <td>${escapeAttr(vendor.contact || "-")}</td>
              <td>${escapeAttr(vendor.phone || "-")}</td>
              <td>${escapeAttr(vendor.email || "-")}</td>
              <td>${escapeAttr(vendor.status)}</td>
              <td>${escapeAttr(vendor.notes || "-")}</td>
              <td><button class="danger-button vendor-delete-btn" type="button" data-delete-vendor="${vendor.id}">Delete</button></td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="9">No vendors or subtrades found.</td></tr>`;
  els.addVendorBtn.textContent = state.selectedVendorId ? "Update company" : "Add company";
}

function addVendor() {
  const company = els.vendorCompany.value.trim();
  if (!company) return;
  const values = {
    company,
    type: els.vendorType.value || "Subtrade",
    trade: els.vendorTrade.value || "Project Materials",
    contact: els.vendorContact.value.trim(),
    phone: els.vendorPhone.value.trim(),
    email: els.vendorEmail.value.trim(),
    status: els.vendorStatus.value || "Active",
    notes: els.vendorNotes.value.trim(),
  };
  const existing = state.vendors.find((vendor) => vendor.id === state.selectedVendorId);
  if (existing) {
    Object.assign(existing, values);
  } else {
    state.vendors.unshift({
      id: `vendor-${Date.now()}`,
      ...values,
    });
  }
  clearVendorForm();
  persistVendors();
  renderVendors();
  renderSchedule();
}

function selectVendor(vendorId) {
  const vendor = state.vendors.find((item) => item.id === vendorId);
  if (!vendor) return;
  state.selectedVendorId = vendor.id;
  els.vendorCompany.value = vendor.company;
  els.vendorType.value = vendor.type;
  els.vendorTrade.innerHTML = vendorTradeOptionsHtml(vendor.trade);
  els.vendorContact.value = vendor.contact;
  els.vendorPhone.value = vendor.phone;
  els.vendorEmail.value = vendor.email;
  els.vendorStatus.value = vendor.status;
  els.vendorNotes.value = vendor.notes;
  renderVendors();
}

function clearVendorForm() {
  state.selectedVendorId = "";
  ["vendorCompany", "vendorContact", "vendorPhone", "vendorEmail", "vendorNotes"].forEach((id) => (els[id].value = ""));
  els.vendorType.value = "Subtrade";
  els.vendorTrade.innerHTML = vendorTradeOptionsHtml("Project Materials");
  els.vendorStatus.value = "Active";
}

function deleteVendor(vendorId) {
  state.vendors = state.vendors.filter((vendor) => vendor.id !== vendorId);
  if (state.selectedVendorId === vendorId) clearVendorForm();
  persistVendors();
  renderVendors();
  renderSchedule();
}

function renderPurchaseOrders() {
  if (!els.purchaseOrdersBody) return;
  state.purchaseOrders = normalizePurchaseOrders(state.purchaseOrders);
  const currentTrade = els.purchaseOrderTrade.value || "Project Materials";
  syncVendorCompanyOptions();
  if (state.selectedPurchaseOrderId && !state.purchaseOrders.some((order) => order.id === state.selectedPurchaseOrderId)) state.selectedPurchaseOrderId = "";
  els.purchaseOrderTrade.innerHTML = orderTradeOptionsHtml(currentTrade);
  if (!["all", "open", "issued"].includes(state.purchaseOrderFilter)) state.purchaseOrderFilter = "all";
  syncPurchaseOrderProjectFilter();
  const projectRows = filteredPurchaseOrderRows("all");
  const visibleOrders = filteredPurchaseOrderRows(state.purchaseOrderFilter);
  const openTotal = filteredPurchaseOrderRows("open").reduce((sum, row) => sum + num(row.amount), 0);
  const issuedTotal = filteredPurchaseOrderRows("issued").reduce((sum, row) => sum + num(row.amount), 0);
  els.purchaseOrderCount.textContent = String(projectRows.length);
  els.purchaseOrderOpenTotal.textContent = money.format(openTotal);
  els.purchaseOrderIssuedTotal.textContent = money.format(issuedTotal);
  if (els.purchaseOrderOverviewLabel) els.purchaseOrderOverviewLabel.textContent = purchaseOrderOverviewLabel();
  document.querySelectorAll("[data-purchase-order-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.purchaseOrderFilter === state.purchaseOrderFilter);
  });
  els.purchaseOrdersBody.innerHTML = visibleOrders.length
    ? visibleOrders
        .map(
          (item) => `
            <tr class="order-directory-row ${state.selectedPurchaseOrderId === item.id && item.projectId === (state.crm.activeRecordId || "current") ? "selected" : ""}" data-select-purchase-order="${item.id}" data-purchase-order-project="${escapeAttr(item.projectId)}">
              <td>
                <div class="order-project-cell">
                  <strong>${escapeAttr(item.projectName || "-")}</strong>
                  <small>${escapeAttr(item.customerName || "")}</small>
                </div>
              </td>
              <td>${escapeAttr(item.number)}</td>
              <td>${escapeAttr(item.vendor || "-")}</td>
              <td>${escapeAttr(item.trade || "-")}</td>
              <td>${money.format(num(item.amount))}</td>
              <td>${escapeAttr(item.neededDate || "-")}</td>
              <td>${escapeAttr(item.status || "Draft")}</td>
              <td>${escapeAttr(item.notes || "-")}</td>
              <td><button class="secondary mini-button" type="button" data-print-purchase-order="${escapeAttr(item.id)}" data-purchase-order-project="${escapeAttr(item.projectId)}">Print</button></td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="9">No purchase orders found for ${escapeAttr(purchaseOrderProjectFilterLabel())}.</td></tr>`;
  els.addPurchaseOrderBtn.textContent = state.selectedPurchaseOrderId ? "Update purchase order" : "Add purchase order";
  if (els.printPurchaseOrderBtn) els.printPurchaseOrderBtn.disabled = !state.selectedPurchaseOrderId;
}

function purchaseOrderProjectRows() {
  const currentId = state.crm.activeRecordId || "current";
  const projects = [
    {
      id: currentId,
      projectName: els.projectName?.value || "Current project",
      customerName: els.customerName?.value || "New Customer",
      purchaseOrders: state.purchaseOrders,
    },
    ...state.crm.records
      .filter((record) => record.id !== currentId)
      .map((record) => ({
        id: record.id,
        projectName: record.projectName || "Untitled project",
        customerName: record.customerName || "No customer",
        purchaseOrders: normalizePurchaseOrders(record.purchaseOrders),
      })),
  ];
  return projects.flatMap((project) =>
    normalizePurchaseOrders(project.purchaseOrders).map((order) => ({
      ...order,
      projectId: project.id,
      projectName: project.projectName,
      customerName: project.customerName,
    })),
  );
}

function purchaseOrderProjectOptionsHtml(selected = state.purchaseOrderProjectFilter) {
  const currentId = state.crm.activeRecordId || "current";
  const projects = [
    { id: "current", label: `${els.projectName?.value || "Current project"} - ${els.customerName?.value || "New Customer"}` },
    ...state.crm.records
      .filter((record) => record.id !== currentId)
      .map((record) => ({ id: record.id, label: `${record.projectName || "Untitled project"} - ${record.customerName || "No customer"}` })),
  ];
  return [
    `<option value="all" ${selected === "all" ? "selected" : ""}>All projects</option>`,
    ...projects.map((project) => `<option value="${escapeAttr(project.id)}" ${selected === project.id ? "selected" : ""}>${escapeAttr(project.label)}</option>`),
  ].join("");
}

function syncPurchaseOrderProjectFilter() {
  const currentId = state.crm.activeRecordId || "current";
  const validProjectIds = new Set(["all", "current", currentId, ...state.crm.records.map((record) => record.id)]);
  if (!validProjectIds.has(state.purchaseOrderProjectFilter)) state.purchaseOrderProjectFilter = "current";
  if (!els.purchaseOrderProjectFilter) return;
  els.purchaseOrderProjectFilter.innerHTML = purchaseOrderProjectOptionsHtml(state.purchaseOrderProjectFilter);
  els.purchaseOrderProjectFilter.value = state.purchaseOrderProjectFilter;
}

function purchaseOrderProjectFilterLabel() {
  const currentId = state.crm.activeRecordId || "current";
  const projectFilter = state.purchaseOrderProjectFilter || "current";
  if (projectFilter === "all") return "all projects";
  if (projectFilter === "current" || projectFilter === currentId) return els.projectName?.value || "current project";
  const record = state.crm.records.find((item) => item.id === projectFilter);
  return record?.projectName || "the selected project";
}

function switchPurchaseOrderProjectFilter(projectId) {
  state.purchaseOrderProjectFilter = projectId || "current";
  state.selectedPurchaseOrderId = "";
  clearPurchaseOrderForm();
  const currentId = state.crm.activeRecordId || "current";
  if (projectId && projectId !== "all" && projectId !== "current" && projectId !== currentId) {
    saveActiveCrmRecordEdits();
    const record = state.crm.records.find((item) => item.id === projectId);
    if (!record) {
      renderPurchaseOrders();
      return;
    }
    applyCrmRecord(record);
    state.purchaseOrderProjectFilter = "current";
    setView("purchaseOrders");
    return;
  }
  renderPurchaseOrders();
}

function filteredPurchaseOrderRows(filter = state.purchaseOrderFilter) {
  const currentId = state.crm.activeRecordId || "current";
  const projectFilter = state.purchaseOrderProjectFilter || "current";
  return purchaseOrderProjectRows()
    .filter((item) => projectFilter === "all" || (projectFilter === "current" ? item.projectId === currentId : item.projectId === projectFilter))
    .filter((item) => {
      if (filter === "open") return !["Received", "Closed"].includes(item.status);
      if (filter === "issued") return ["Issued", "Received", "Closed"].includes(item.status);
      return true;
    })
    .sort((a, b) => String(a.projectName).localeCompare(String(b.projectName)) || String(a.number).localeCompare(String(b.number)));
}

function purchaseOrderOverviewLabel() {
  const scope = purchaseOrderProjectFilterLabel();
  if (state.purchaseOrderFilter === "open") return `Showing open purchase orders for ${scope}.`;
  if (state.purchaseOrderFilter === "issued") return `Showing issued, received, and closed purchase orders for ${scope}.`;
  return `Showing all purchase orders for ${scope}.`;
}

function renderChangeOrders() {
  if (!els.changeOrdersBody) return;
  state.changeOrders = normalizeChangeOrders(state.changeOrders);
  syncVendorCompanyOptions();
  if (state.selectedChangeOrderId && !state.changeOrders.some((order) => order.id === state.selectedChangeOrderId)) state.selectedChangeOrderId = "";
  if (els.changeOrderDate && !els.changeOrderDate.value) els.changeOrderDate.value = todayIso();
  const pendingTotal = state.changeOrders
    .filter((item) => !["Approved", "Rejected", "Invoiced"].includes(item.status))
    .reduce((sum, item) => sum + num(item.amount), 0);
  const approvedTotal = state.changeOrders
    .filter((item) => ["Approved", "Invoiced"].includes(item.status))
    .reduce((sum, item) => sum + num(item.amount), 0);
  els.changeOrderCount.textContent = String(state.changeOrders.length);
  els.changeOrderPendingTotal.textContent = money.format(pendingTotal);
  els.changeOrderApprovedTotal.textContent = money.format(approvedTotal);
  els.changeOrdersBody.innerHTML = state.changeOrders.length
    ? state.changeOrders
        .map(
          (item) => `
            <tr class="order-directory-row ${state.selectedChangeOrderId === item.id ? "selected" : ""}" data-select-change-order="${item.id}">
              <td>${escapeAttr(item.number)}</td>
              <td>${escapeAttr(item.title || "-")}</td>
              <td>${escapeAttr(item.requestedBy || "-")}</td>
              <td>${money.format(num(item.amount))}</td>
              <td>${escapeAttr(item.date || "-")}</td>
              <td>${escapeAttr(item.status || "Draft")}</td>
              <td>${escapeAttr(item.description || "-")}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="7">No change orders yet.</td></tr>`;
  els.addChangeOrderBtn.textContent = state.selectedChangeOrderId ? "Update change order" : "Add change order";
}

function addPurchaseOrder() {
  applyPurchaseOrderVendorTrade();
  const values = {
    vendor: els.purchaseOrderVendor.value.trim(),
    trade: els.purchaseOrderTrade.value || "Project Materials",
    amount: els.purchaseOrderAmount.value,
    neededDate: els.purchaseOrderNeededDate.value,
    status: els.purchaseOrderStatus.value || "Draft",
    notes: els.purchaseOrderNotes.value.trim(),
  };
  const existing = state.purchaseOrders.find((order) => order.id === state.selectedPurchaseOrderId);
  if (existing) {
    Object.assign(existing, values);
  } else {
    const nextNumber = `PO-${String(state.purchaseOrders.length + 1).padStart(3, "0")}`;
    state.purchaseOrders.push({
      id: `po-${Date.now()}`,
      number: nextNumber,
      ...values,
    });
  }
  clearPurchaseOrderForm();
  renderPurchaseOrders();
  renderSchedule();
  saveActiveCrmRecordEdits();
}

function addChangeOrder() {
  const values = {
    title: els.changeOrderTitle.value.trim(),
    requestedBy: els.changeOrderRequestedBy.value.trim(),
    amount: els.changeOrderAmount.value,
    date: els.changeOrderDate.value || todayIso(),
    status: els.changeOrderStatus.value || "Draft",
    description: els.changeOrderDescription.value.trim(),
  };
  const existing = state.changeOrders.find((order) => order.id === state.selectedChangeOrderId);
  if (existing) {
    Object.assign(existing, values);
  } else {
    const nextNumber = `CO-${String(state.changeOrders.length + 1).padStart(3, "0")}`;
    state.changeOrders.push({
      id: `co-${Date.now()}`,
      number: nextNumber,
      ...values,
    });
  }
  clearChangeOrderForm();
  renderChangeOrders();
  saveActiveCrmRecordEdits();
}

function selectPurchaseOrder(orderId) {
  const order = state.purchaseOrders.find((item) => item.id === orderId);
  if (!order) return;
  populatePurchaseOrderForm(order);
  renderPurchaseOrders();
}

function selectPurchaseOrderFromProject(orderId, projectId = state.crm.activeRecordId || "current") {
  const currentId = state.crm.activeRecordId || "current";
  if (projectId && projectId !== "current" && projectId !== currentId) {
    saveActiveCrmRecordEdits();
    const record = state.crm.records.find((item) => item.id === projectId);
    if (!record) return;
    state.purchaseOrderProjectFilter = "current";
    applyCrmRecord(record);
    setView("purchaseOrders");
  }
  const order = state.purchaseOrders.find((item) => item.id === orderId);
  if (!order) return;
  populatePurchaseOrderForm(order);
  renderPurchaseOrders();
}

function populatePurchaseOrderForm(order) {
  state.selectedPurchaseOrderId = order.id;
  els.purchaseOrderVendor.value = order.vendor;
  els.purchaseOrderTrade.innerHTML = orderTradeOptionsHtml(order.trade);
  els.purchaseOrderAmount.value = order.amount;
  els.purchaseOrderNeededDate.value = order.neededDate;
  els.purchaseOrderStatus.value = order.status;
  els.purchaseOrderNotes.value = order.notes;
}

function clearPurchaseOrderForm() {
  state.selectedPurchaseOrderId = "";
  els.purchaseOrderVendor.value = "";
  els.purchaseOrderTrade.innerHTML = orderTradeOptionsHtml("Project Materials");
  els.purchaseOrderAmount.value = "";
  els.purchaseOrderNeededDate.value = "";
  els.purchaseOrderStatus.value = "Draft";
  els.purchaseOrderNotes.value = "";
}

function purchaseOrderPrintHtml(order) {
  const generatedDate = new Date().toLocaleDateString("en-CA");
  const projectName = order.projectName || els.projectName?.value || "Current project";
  const customerName = order.customerName || els.customerName?.value || "New Customer";
  return `
    <div class="purchase-order-print-page">
      <h1>Purchase Order ${escapeAttr(order.number || "")}</h1>
      <div class="purchase-order-print-meta">Generated ${escapeAttr(generatedDate)}</div>
      <div class="purchase-order-print-grid">
        <div><span>Project</span><strong>${escapeAttr(projectName)}</strong></div>
        <div><span>Customer</span><strong>${escapeAttr(customerName)}</strong></div>
        <div><span>Vendor / supplier</span><strong>${escapeAttr(order.vendor || "-")}</strong></div>
        <div><span>Trade / category</span><strong>${escapeAttr(order.trade || "-")}</strong></div>
        <div><span>Amount</span><strong>${money.format(num(order.amount))}</strong></div>
        <div><span>Needed by</span><strong>${escapeAttr(order.neededDate || "-")}</strong></div>
        <div><span>Status</span><strong>${escapeAttr(order.status || "Draft")}</strong></div>
        <div><span>PO number</span><strong>${escapeAttr(order.number || "-")}</strong></div>
      </div>
      <h2>Notes / Scope</h2>
      <div class="purchase-order-print-notes">${escapeAttr(order.notes || "")}</div>
    </div>
  `;
}

function clearPurchaseOrderPrintMode() {
  document.body.classList.remove("purchase-order-printing");
  if (els.purchaseOrderPrintArea) els.purchaseOrderPrintArea.innerHTML = "";
}

function printPurchaseOrder(orderId = state.selectedPurchaseOrderId, projectId = state.crm.activeRecordId || "current") {
  const currentId = state.crm.activeRecordId || "current";
  const order =
    projectId && projectId !== "current" && projectId !== currentId
      ? purchaseOrderProjectRows().find((item) => item.id === orderId && item.projectId === projectId)
      : state.purchaseOrders.find((item) => item.id === orderId);
  if (!order || !els.purchaseOrderPrintArea) return;
  els.purchaseOrderPrintArea.innerHTML = purchaseOrderPrintHtml(order);
  document.body.classList.add("purchase-order-printing");
  window.print();
  window.setTimeout(clearPurchaseOrderPrintMode, 500);
}

function selectChangeOrder(orderId) {
  const order = state.changeOrders.find((item) => item.id === orderId);
  if (!order) return;
  state.selectedChangeOrderId = order.id;
  els.changeOrderTitle.value = order.title;
  els.changeOrderRequestedBy.value = order.requestedBy;
  els.changeOrderAmount.value = order.amount;
  els.changeOrderDate.value = order.date || todayIso();
  els.changeOrderStatus.value = order.status;
  els.changeOrderDescription.value = order.description;
  renderChangeOrders();
}

function clearChangeOrderForm() {
  state.selectedChangeOrderId = "";
  els.changeOrderTitle.value = "";
  els.changeOrderRequestedBy.value = "";
  els.changeOrderAmount.value = "";
  els.changeOrderDate.value = todayIso();
  els.changeOrderStatus.value = "Draft";
  els.changeOrderDescription.value = "";
  renderChangeOrders();
}

function handlePurchaseOrderEdit(event) {
  const row = event.target.closest("[data-purchase-order]");
  const field = event.target.dataset.purchaseOrderField;
  const item = state.purchaseOrders.find((order) => order.id === row?.dataset.purchaseOrder);
  if (!item || !field) return;
  item[field] = event.target.value;
  if (event.type === "change") renderPurchaseOrders();
  saveActiveCrmRecordEdits();
}

function handleChangeOrderEdit(event) {
  const row = event.target.closest("[data-change-order]");
  const field = event.target.dataset.changeOrderField;
  const item = state.changeOrders.find((order) => order.id === row?.dataset.changeOrder);
  if (!item || !field) return;
  item[field] = event.target.value;
  if (event.type === "change") renderChangeOrders();
  saveActiveCrmRecordEdits();
}

function renderJobFiles() {
  if (!els.jobFilesList) return;
  state.jobFiles = normalizeJobFiles(state.jobFiles);
  renderJobFileProjectControls();
  const records = jobFileProjectRecords();
  const selectedProjectId = currentJobFileProjectId();
  const visibleFiles = records
    .filter((record) => record.id === selectedProjectId)
    .flatMap((record) =>
      normalizeJobFiles(record.jobFiles).map((file) => ({
        ...file,
        projectId: record.id,
        projectName: record.projectName,
        customerName: record.customerName,
      })),
    );
  const photos = visibleFiles.filter(isJobFileImage);
  const totalSize = visibleFiles.reduce((sum, file) => sum + num(file.size), 0);
  els.jobFileCount.textContent = String(visibleFiles.length);
  els.jobPhotoCount.textContent = String(photos.length);
  els.jobFileTotalSize.textContent = formatFileSize(totalSize);
  els.jobFilesList.innerHTML = visibleFiles.length
    ? visibleFiles
        .map((file) => {
          const uploaded = new Date(file.uploadedAt).toLocaleString("en-CA");
          const isImage = isJobFileImage(file);
          const isPdf = isJobFilePdf(file);
          const canPreview = isPreviewableJobFile(file);
          return `
            <article class="job-file-card" data-job-file="${file.id}" data-job-file-project="${escapeAttr(file.projectId)}">
              ${
                canPreview
                  ? `<button class="job-file-preview-trigger" type="button" data-preview-job-file="${escapeAttr(file.id)}" data-job-file-project="${escapeAttr(file.projectId)}" aria-label="Preview ${escapeAttr(file.name)}">
                      ${
                        isImage && file.dataUrl
                          ? `<img src="${file.dataUrl}" alt="${escapeAttr(file.name)}" />`
                          : `<div class="job-file-icon pdf-file-icon">PDF</div>`
                      }
                    </button>`
                  : `<div class="job-file-icon">FILE</div>`
              }
              <div class="job-file-details">
                <button class="job-file-name-button" type="button" data-preview-job-file="${escapeAttr(file.id)}" data-job-file-project="${escapeAttr(file.projectId)}" ${canPreview ? "" : "disabled"}>${escapeAttr(file.name)}</button>
                <span class="job-file-project-badge">${escapeAttr(file.projectName || "Current job")}</span>
                <span>${escapeAttr(file.customerName || "No customer")} - ${escapeAttr(file.type || "File")} - ${formatFileSize(file.size)} - ${escapeAttr(uploaded)}</span>
                <label>
                  Attached job
                  <select data-job-file-project-picker>
                    ${jobFileProjectOptionsHtml(file.projectId, false)}
                  </select>
                </label>
                <label>
                  Description
                  <textarea data-job-file-field="description" rows="3" placeholder="Add description">${escapeAttr(file.description)}</textarea>
                </label>
                <div class="job-file-actions">
                  <a class="secondary file-download-link" href="${file.dataUrl}" download="${escapeAttr(file.name)}">Download</a>
                  ${canPreview ? `<button class="secondary" type="button" data-preview-job-file="${escapeAttr(file.id)}" data-job-file-project="${escapeAttr(file.projectId)}">Preview</button>` : ""}
                  <button class="danger-button" type="button" data-delete-job-file="${escapeAttr(file.id)}">Delete</button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")
    : `<p class="empty-note">No files uploaded for this job yet.</p>`;
}

function currentJobFileProjectId() {
  return state.crm.activeRecordId || "current";
}

function jobFileProjectRecords() {
  const current = {
    id: currentJobFileProjectId(),
    projectName: currentProjectName(),
    customerName: els.customerName?.value || "New Customer",
    jobFiles: state.jobFiles,
    current: true,
  };
  const saved = state.crm.records
    .filter((record) => record.id !== state.crm.activeRecordId)
    .map((record) => ({
      id: record.id,
      projectName: record.projectName || "Untitled project",
      customerName: record.customerName || "No customer",
      jobFiles: record.jobFiles || [],
      current: false,
    }));
  return [current, ...saved];
}

function jobFileProjectOptionsHtml(selectedId = currentJobFileProjectId(), includeAll = false) {
  const options = jobFileProjectRecords();
  return [
    includeAll ? `<option value="all" ${selectedId === "all" ? "selected" : ""}>All jobs</option>` : "",
    ...options.map(
      (option) =>
        `<option value="${escapeAttr(option.id)}" ${option.id === selectedId ? "selected" : ""}>${escapeAttr(option.projectName)}${option.customerName ? ` - ${escapeAttr(option.customerName)}` : ""}</option>`,
    ),
  ].join("");
}

function renderJobFileProjectControls() {
  const currentId = currentJobFileProjectId();
  if (els.jobFileProject) {
    const selected = jobFileProjectRecords().some((record) => record.id === els.jobFileProject.value) ? els.jobFileProject.value : currentId;
    els.jobFileProject.innerHTML = jobFileProjectOptionsHtml(selected, false);
  }
}

function findJobFileTarget(projectId) {
  if (!projectId || projectId === currentJobFileProjectId()) {
    return {
      record: null,
      files: state.jobFiles,
      save() {
        saveActiveCrmRecordEdits();
      },
    };
  }
  const record = state.crm.records.find((item) => item.id === projectId);
  if (!record) return null;
  record.jobFiles = normalizeJobFiles(record.jobFiles);
  return {
    record,
    files: record.jobFiles,
    save() {
      persistCrmRecords();
    },
  };
}

function findJobFile(fileId, projectId = state.openJobFilePreviewProjectId || currentJobFileProjectId()) {
  const target = findJobFileTarget(projectId);
  return target?.files.find((item) => item.id === fileId);
}

function moveJobFileToProject(fileId, fromProjectId, toProjectId) {
  if (!fileId || !toProjectId || fromProjectId === toProjectId) return;
  const source = findJobFileTarget(fromProjectId);
  const destination = findJobFileTarget(toProjectId);
  if (!source || !destination) return;
  const fileIndex = source.files.findIndex((item) => item.id === fileId);
  if (fileIndex < 0) return;
  const [file] = source.files.splice(fileIndex, 1);
  const destinationRecord = jobFileProjectRecords().find((record) => record.id === toProjectId);
  file.projectId = toProjectId;
  file.projectName = destinationRecord?.projectName || "";
  destination.files.unshift(file);
  source.save();
  if (destination !== source) destination.save();
  if (state.openJobFilePreviewId === fileId && state.openJobFilePreviewProjectId === fromProjectId) {
    state.openJobFilePreviewProjectId = toProjectId;
  }
  renderJobFiles();
  renderJobFilePreview();
}

function isJobFileImage(file) {
  const name = file?.name?.toLowerCase() || "";
  const dataUrl = file?.dataUrl || "";
  return Boolean(file?.type?.startsWith("image/") || dataUrl.startsWith("data:image/") || /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/.test(name));
}

function isJobFilePdf(file) {
  const dataUrl = file?.dataUrl || "";
  return Boolean(file?.type === "application/pdf" || dataUrl.startsWith("data:application/pdf") || file?.name?.toLowerCase().endsWith(".pdf"));
}

function isPreviewableJobFile(file) {
  return Boolean(file?.dataUrl && (isJobFileImage(file) || isJobFilePdf(file)));
}

function openJobFilePreview(fileId, projectId = currentJobFileProjectId()) {
  const file = findJobFile(fileId, projectId);
  if (!isPreviewableJobFile(file)) return;
  state.openJobFilePreviewId = fileId;
  state.openJobFilePreviewProjectId = projectId;
  renderJobFilePreview();
}

function closeJobFilePreview() {
  state.openJobFilePreviewId = "";
  state.openJobFilePreviewProjectId = "";
  renderJobFilePreview();
}

function revokeJobFilePreviewObjectUrl() {
  if (!state.jobFilePreviewObjectUrl) return;
  URL.revokeObjectURL(state.jobFilePreviewObjectUrl);
  state.jobFilePreviewObjectUrl = "";
}

function dataUrlToBlobUrl(dataUrl, fallbackType = "application/octet-stream") {
  const { bytes, mime } = dataUrlToBytes(dataUrl, fallbackType);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

function dataUrlToBytes(dataUrl, fallbackType = "application/octet-stream") {
  const [header = "", body = ""] = String(dataUrl).split(",");
  const mime = header.match(/^data:([^;]+)/)?.[1] || fallbackType;
  const isBase64 = header.includes(";base64");
  const binary = isBase64 ? atob(body) : decodeURIComponent(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return { bytes, mime };
}

async function renderPdfJobFile(file, renderToken) {
  els.jobFilePreviewBody.innerHTML = `<p class="empty-note">Loading PDF preview...</p>`;
  try {
    const pdfjs = await import("./assets/pdf.legacy.min.js");
    pdfjs.GlobalWorkerOptions.workerSrc = "./assets/pdf.legacy.worker.min.js";
    const { bytes } = dataUrlToBytes(file.dataUrl, "application/pdf");
    const pdf = await pdfjs.getDocument({ data: bytes, disableWorker: true }).promise;
    if (renderToken !== state.jobFilePreviewRenderToken) return;
    els.jobFilePreviewBody.innerHTML = "";
    els.jobFilePreviewBody.classList.add("pdf-pages");
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      if (renderToken !== state.jobFilePreviewRenderToken) return;
      const viewport = page.getViewport({ scale: 1.35 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.setAttribute("aria-label", `${file.name || "PDF"} page ${pageNumber}`);
      els.jobFilePreviewBody.append(canvas);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    }
  } catch (error) {
    console.warn("PDF preview failed", error);
    if (renderToken !== state.jobFilePreviewRenderToken) return;
    els.jobFilePreviewBody.innerHTML = `<p class="empty-note">PDF preview is not available in this browser. Use Download to open the file.</p>`;
  }
}

function renderJobFilePreview() {
  if (!els.jobFilePreviewModal || !els.jobFilePreviewBody) return;
  const file = findJobFile(state.openJobFilePreviewId, state.openJobFilePreviewProjectId);
  const canPreview = isPreviewableJobFile(file);
  state.jobFilePreviewRenderToken += 1;
  const renderToken = state.jobFilePreviewRenderToken;
  revokeJobFilePreviewObjectUrl();
  els.jobFilePreviewBody.classList.remove("pdf-pages");
  els.jobFilePreviewModal.toggleAttribute("hidden", !canPreview);
  if (!canPreview) {
    els.jobFilePreviewBody.innerHTML = "";
    els.jobFilePreviewDownload?.removeAttribute("href");
    els.jobFilePreviewDownload?.removeAttribute("download");
    return;
  }
  els.jobFilePreviewTitle.textContent = file.name || "File";
  els.jobFilePreviewDownload.href = file.dataUrl;
  els.jobFilePreviewDownload.download = file.name || "job-file";
  els.jobFilePreviewBody.innerHTML = "";
  if (isJobFileImage(file)) {
    const image = document.createElement("img");
    image.src = file.dataUrl;
    image.alt = file.name || "Job photo";
    els.jobFilePreviewBody.append(image);
    return;
  }
  renderPdfJobFile(file, renderToken);
}

async function addJobFiles() {
  const files = Array.from(els.jobFileInput.files || []);
  if (!files.length) {
    els.jobFileUploadNote.textContent = "Choose one or more files first.";
    return;
  }
  const projectId = els.jobFileProject?.value || currentJobFileProjectId();
  const target = findJobFileTarget(projectId);
  if (!target) {
    els.jobFileUploadNote.textContent = "Choose a valid job before uploading.";
    return;
  }
  const projectLabel =
    projectId === currentJobFileProjectId()
      ? currentProjectName()
      : state.crm.records.find((record) => record.id === projectId)?.projectName || "selected job";
  els.jobFileUploadNote.textContent = `Uploading files into ${projectLabel}...`;
  try {
    const description = els.jobFileDescription.value.trim();
    const records = await Promise.all(
      files.map(async (file) => ({
        id: `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        description,
        projectId,
        projectName: projectLabel,
        dataUrl: await readFileAsDataUrl(file),
      })),
    );
    target.files.unshift(...records);
    els.jobFileInput.value = "";
    els.jobFileDescription.value = "";
    els.jobFileUploadNote.textContent = `${records.length} file${records.length === 1 ? "" : "s"} added.`;
    renderJobFiles();
    target.save();
  } catch (error) {
    els.jobFileUploadNote.textContent = `Upload failed: ${error.message}`;
  }
}

function handleJobFileEdit(event) {
  const row = event.target.closest("[data-job-file]");
  const projectPicker = event.target.closest("[data-job-file-project-picker]");
  if (projectPicker) {
    moveJobFileToProject(row?.dataset.jobFile, row?.dataset.jobFileProject, projectPicker.value);
    return;
  }
  const field = event.target.dataset.jobFileField;
  const target = findJobFileTarget(row?.dataset.jobFileProject);
  const file = target?.files.find((item) => item.id === row?.dataset.jobFile);
  if (!file || !field) return;
  file[field] = event.target.value;
  target.save();
}

function deleteJobFile(fileId, projectId = currentJobFileProjectId()) {
  if (state.openJobFilePreviewId === fileId && state.openJobFilePreviewProjectId === projectId) closeJobFilePreview();
  const target = findJobFileTarget(projectId);
  if (!target) return;
  const nextFiles = target.files.filter((file) => file.id !== fileId);
  if (target.record) target.record.jobFiles = nextFiles;
  else state.jobFiles = nextFiles;
  renderJobFiles();
  target.save();
}

function handleRatePick(event) {
  const select = event.target.closest("[data-rate-pick]");
  if (!select) return false;
  const line = state.lines.find((item) => item.id === select.dataset.ratePick);
  if (!line || select.value === "") return true;
  line.unitCost = num(select.value);
  render();
  saveActiveCrmRecordEdits();
  return true;
}

function storageAvailable() {
  try {
    window.localStorage.setItem("zaks-crm-test", "1");
    window.localStorage.removeItem("zaks-crm-test");
    return true;
  } catch {
    return false;
  }
}

function loadCrmRecords() {
  if (!storageAvailable()) return;
  const raw = window.localStorage.getItem("zaksBuildOsCrmRecords");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) state.crm.records = parsed;
  } catch {
    state.crm.records = [];
  }
}

function normalizeSchedule(schedule) {
  const normalized = {
    startDate: schedule?.startDate || todayIso(),
    owner: schedule?.owner || "Production",
    items: Array.isArray(schedule?.items) ? schedule.items : [],
    calendarMonth: schedule?.calendarMonth || monthKey(schedule?.startDate || todayIso()),
    selectedItemId: schedule?.selectedItemId || "",
    scope: schedule?.scope || "current",
    tradeFilter: schedule?.tradeFilter || "All trades",
    editorOpen: false,
    dayPopupDate: "",
  };
  normalized.items = normalized.items.map((item, index) => ({
    id: item.id || `schedule-${index + 1}`,
    name: item.name || "Schedule item",
    department: item.department || "Production",
    trade: item.trade || item.department || "Production",
    subtrade: item.subtrade || "",
    purchaseOrderId: item.purchaseOrderId || "",
    targetDate: item.targetDate || normalized.startDate,
    endDate: item.endDate || item.targetDate || normalized.startDate,
    status: item.status || "Not started",
    notes: item.notes || "",
  }));
  return normalized;
}

function normalizeTasks(tasks) {
  const source = Array.isArray(tasks) ? tasks : [];
  return source.map((task, index) => {
    const done = Boolean(task.done);
    return {
      id: task.id || `task-${Date.now()}-${index}`,
      text: task.text || "Project task",
      done,
      owner: task.owner || "Sales",
      dueDate: task.dueDate || "",
      priority: task.priority || "Normal",
      status: task.status || (done ? "Complete" : "Open"),
      notes: task.notes || "",
    };
  });
}

function createBillingStages(source = []) {
  const saved = Array.isArray(source) ? source : [];
  return billingStageTemplate.map((stage) => {
    const match = saved.find((item) => item.id === stage.id || item.label === stage.label);
    const completed = Boolean(match?.completed);
    const status = billingStageStatuses.includes(match?.status)
      ? match.status
      : completed
        ? "Complete"
        : "Not started";
    return {
      ...stage,
      completed: status !== "Not started" || completed,
      completedDate: match?.completedDate || "",
      amount: match?.amount || "",
      status,
      notes: match?.notes || "",
    };
  });
}

function normalizePurchaseOrders(items) {
  const source = Array.isArray(items) ? items : [];
  return source.map((item, index) => ({
    id: item.id || `po-${Date.now()}-${index}`,
    number: item.number || `PO-${String(index + 1).padStart(3, "0")}`,
    vendor: item.vendor || "",
    trade: item.trade || "Project Materials",
    amount: item.amount || "",
    neededDate: item.neededDate || "",
    status: item.status || "Draft",
    notes: item.notes || "",
  }));
}

function normalizeChangeOrders(items) {
  const source = Array.isArray(items) ? items : [];
  return source.map((item, index) => ({
    id: item.id || `co-${Date.now()}-${index}`,
    number: item.number || `CO-${String(index + 1).padStart(3, "0")}`,
    title: item.title || "",
    requestedBy: item.requestedBy || "",
    amount: item.amount || "",
    date: item.date || todayIso(),
    status: item.status || "Draft",
    description: item.description || "",
  }));
}

function normalizeJobFiles(items) {
  const source = Array.isArray(items) ? items : [];
  return source.map((item, index) => ({
    id: item.id || `file-${Date.now()}-${index}`,
    name: item.name || "Uploaded file",
    type: item.type || "application/octet-stream",
    size: num(item.size),
    uploadedAt: item.uploadedAt || new Date().toISOString(),
    description: item.description || "",
    projectId: item.projectId || "",
    projectName: item.projectName || "",
    dataUrl: item.dataUrl || "",
  }));
}

function normalizeWarranty(warranty = {}) {
  const deficiencies = Array.isArray(warranty.deficiencies) ? warranty.deficiencies : [];
  return {
    complete: Boolean(warranty.complete),
    startDate: warranty.startDate || "",
    newHomeWarrantyStartDate: warranty.newHomeWarrantyStartDate || "",
    newHomeWarrantyPaperworkSent: Boolean(warranty.newHomeWarrantyPaperworkSent),
    notes: warranty.notes || "",
    deficiencies: deficiencies.map((item, index) => ({
      id: item.id || `deficiency-${Date.now()}-${index}`,
      text: item.text || "",
      done: Boolean(item.done),
      assignedTo: item.assignedTo || "",
      notes: item.notes || "",
      photo: item.photo?.dataUrl
        ? {
            name: item.photo.name || "Deficiency photo",
            type: item.photo.type || "image/*",
            size: num(item.photo.size),
            uploadedAt: item.photo.uploadedAt || new Date().toISOString(),
            dataUrl: item.photo.dataUrl,
          }
        : null,
    })),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("File could not be read."));
    reader.readAsDataURL(file);
  });
}

function persistCrmRecords() {
  if (!storageAvailable()) return;
  window.localStorage.setItem("zaksBuildOsCrmRecords", JSON.stringify(state.crm.records));
}

function saveActiveCrmRecordEdits({ refreshCrm = false } = {}) {
  if (!state.crm.activeRecordId) return;
  const index = state.crm.records.findIndex((item) => item.id === state.crm.activeRecordId);
  if (index < 0) return;
  state.crm.records[index] = currentCrmRecord();
  persistCrmRecords();
  if (refreshCrm) renderCrm();
}

function currentCrmRecord() {
  const totals = grandTotals();
  return {
    id: state.crm.activeRecordId || `lead-${Date.now()}`,
    projectName: els.projectName.value || "Untitled project",
    customerName: els.customerName.value || "New Customer",
    projectType: els.projectType.value,
    projectLevel: els.projectLevel.disabled ? "N/A" : els.projectLevel.value,
    houseSqft: els.houseSqft.value,
    garageSqft: els.garageSqft.value,
    travelDistance: els.travelDistance.value,
    destinationTown: els.destinationTown.value,
    destinationProvince: els.destinationProvince.value,
    status: els.crmStatus.value,
    owner: els.crmOwner.value,
    followupDate: els.crmFollowupDate.value,
    phone: els.crmPhone.value.trim(),
    email: els.crmEmail.value.trim(),
    leadSource: els.crmLeadSource.value,
    salesperson: els.crmSalesperson.value,
    interestedModels: els.crmInterestedModels.value.trim(),
    projectAddress: els.crmProjectAddress.value,
    estimate: serializeEstimateState(),
    estimateTotal: totals.total,
    estimateVersions: state.estimateVersions || [],
    sentEstimateVersionId: state.sentEstimateVersionId || "",
    schedule: state.schedule,
    selections: state.selections,
    contract: state.contract,
    purchaseOrders: normalizePurchaseOrders(state.purchaseOrders),
    changeOrders: normalizeChangeOrders(state.changeOrders),
    jobFiles: normalizeJobFiles(state.jobFiles),
    warranty: normalizeWarranty(state.crm.warranty),
    output: outputState(),
    billingStages: createBillingStages(state.crm.billingStages),
    notes: state.crm.notes,
    tasks: normalizeTasks(state.crm.tasks),
    updatedAt: new Date().toISOString(),
  };
}

function applyCrmRecord(record) {
  if (!record) return;
  if (state.crm.activeRecordId && state.crm.activeRecordId !== record.id) {
    saveActiveCrmRecordEdits();
  }
  state.crm.activeRecordId = record.id;
  els.projectName.value = record.projectName || "";
  els.customerName.value = record.customerName || "";
  els.projectType.value = record.projectType || "RTM";
  els.projectLevel.value = record.projectLevel && record.projectLevel !== "N/A" ? record.projectLevel : "Standard";
  els.houseSqft.value = record.houseSqft || 1400;
  els.garageSqft.value = record.garageSqft || 0;
  els.travelDistance.value = record.travelDistance || 75;
  els.destinationTown.value = record.destinationTown || "";
  els.destinationProvince.value = record.destinationProvince || "SK";
  els.crmStatus.value = record.status || "Needs Estimate";
  els.crmOwner.value = record.owner || "Sales";
  els.crmFollowupDate.value = record.followupDate || "";
  els.crmPhone.value = record.phone || "";
  els.crmEmail.value = record.email || "";
  els.crmLeadSource.value = record.leadSource || "Walk-in";
  els.crmSalesperson.value = record.salesperson || "Chris Peters";
  els.crmInterestedModels.value = record.interestedModels || "";
  els.crmProjectAddress.value = record.projectAddress || "";
  state.crm.billingStages = createBillingStages(record.billingStages);
  state.crm.notes = Array.isArray(record.notes) ? record.notes : [];
  state.crm.tasks = normalizeTasks(record.tasks?.length ? record.tasks : state.crm.tasks);
  state.selectedProjectTask = null;
  state.crm.warranty = normalizeWarranty(record.warranty);
  state.schedule = normalizeSchedule(record.schedule);
  state.selections = createSelectionItems(record.selections?.length ? record.selections : selectionTemplate);
  state.purchaseOrders = normalizePurchaseOrders(record.purchaseOrders);
  state.changeOrders = normalizeChangeOrders(record.changeOrders);
  state.selectedPurchaseOrderId = "";
  state.selectedChangeOrderId = "";
  state.jobFiles = normalizeJobFiles(record.jobFiles);
  state.estimateVersions = Array.isArray(record.estimateVersions) ? record.estimateVersions : [];
  state.sentEstimateVersionId = record.sentEstimateVersionId || "";
  restoreEstimateState(record.estimate || { lines: record.estimateLines, calcValues: record.calcValues, allowanceValues: record.allowanceValues });
  state.output = {
    estimateVersionId: record.output?.estimateVersionId || record.sentEstimateVersionId || "current",
    estimateDate: record.output?.estimateDate || "",
    providedBy: record.output?.providedBy || record.salesperson || "",
    location: record.output?.location || "",
    intro: record.output?.intro || "",
    movingNotes: record.output?.movingNotes || "",
    exclusions: record.output?.exclusions || "",
    descriptions: record.output?.descriptions || {},
    manual: record.output?.manual || {},
    descriptionsManual: record.output?.descriptionsManual || {},
    scopeItems: normalizeOutputScopeItems(record.output?.scopeItems),
  };
  state.contract = {
    date: record.contract?.date || "",
    estimateVersionId: record.contract?.estimateVersionId || record.sentEstimateVersionId || "current",
    customerName: record.contract?.customerName || record.customerName || "",
    location: record.contract?.location || record.projectAddress || "",
    depositTerms: record.contract?.depositTerms || "Deposit and payment schedule to be confirmed with Zak's Homes & Cottages prior to production start.",
    approval: record.contract?.approval || {},
    inclusions: record.contract?.inclusions || {},
    exclusions: record.contract?.exclusions || {},
  };
  render();
}

function saveCrmRecord() {
  const record = currentCrmRecord();
  const index = state.crm.records.findIndex((item) => item.id === record.id);
  if (index >= 0) state.crm.records[index] = record;
  else state.crm.records.unshift(record);
  state.crm.activeRecordId = record.id;
  persistCrmRecords();
  renderCrm();
}

function startEstimateForLead() {
  els.crmStatus.value = "Estimate In Progress";
  saveCrmRecord();
  setView("estimate");
}

function newCrmLead() {
  saveActiveCrmRecordEdits();
  state.crm.activeRecordId = null;
  els.projectName.value = "New Lead";
  els.customerName.value = "";
  els.projectType.value = "RTM";
  els.projectLevel.value = "Standard";
  els.houseSqft.value = 1400;
  els.garageSqft.value = 0;
  els.travelDistance.value = 75;
  els.destinationTown.value = "";
  els.destinationProvince.value = "SK";
  els.crmStatus.value = "New";
  els.crmOwner.value = "Sales";
  els.crmFollowupDate.value = "";
  els.crmPhone.value = "";
  els.crmEmail.value = "";
  els.crmLeadSource.value = "Walk-in";
  els.crmSalesperson.value = "Chris Peters";
  els.crmInterestedModels.value = "";
  els.crmProjectAddress.value = "";
  state.crm.billingStages = createBillingStages();
  state.crm.notes = [];
  state.crm.tasks = [
    { id: `task-${Date.now()}-1`, text: "Contact customer", done: false, owner: "Sales", dueDate: "", priority: "Normal", status: "Open", notes: "" },
    { id: `task-${Date.now()}-2`, text: "Gather project details", done: false, owner: "Sales", dueDate: "", priority: "Normal", status: "Open", notes: "" },
    { id: `task-${Date.now()}-3`, text: "Create first estimate", done: false, owner: "Sales", dueDate: "", priority: "Normal", status: "Open", notes: "" },
  ];
  state.selectedProjectTask = null;
  state.crm.warranty = normalizeWarranty();
  state.schedule = {
    startDate: todayIso(),
    owner: "Production",
    items: createScheduleItems(todayIso()),
    calendarMonth: monthKey(),
    selectedItemId: "",
    scope: "current",
    tradeFilter: "All trades",
    editorOpen: false,
    dayPopupDate: "",
  };
  state.selections = createSelectionItems();
  state.purchaseOrders = [];
  state.changeOrders = [];
  state.selectedPurchaseOrderId = "";
  state.selectedChangeOrderId = "";
  state.jobFiles = [];
  state.estimateVersions = [];
  state.sentEstimateVersionId = "";
  hydrateBlankEstimate();
  state.output = {
    estimateVersionId: "current",
    estimateDate: todayIso(),
    providedBy: loggedInSalespersonName(),
    location: "",
    intro: "",
    movingNotes: "",
    exclusions: "",
    descriptions: {},
    manual: {},
    descriptionsManual: {},
    scopeItems: [],
  };
  state.contract = {
    date: todayIso(),
    estimateVersionId: "current",
    customerName: "",
    location: "",
    depositTerms: "Deposit and payment schedule to be confirmed with Zak's Homes & Cottages prior to production start.",
    approval: {
      status: "Pending review",
      approvedBy: "",
      approvedRole: "",
      approvedAt: "",
      note: "",
      signature: "",
    },
    inclusions: {},
    exclusions: {},
  };
  render();
}

function renderCrm() {
  if (!els.crmBoard) return;
  state.crm.tasks = normalizeTasks(state.crm.tasks);
  state.crm.warranty = normalizeWarranty(state.crm.warranty);
  state.crm.billingStages = createBillingStages(state.crm.billingStages);
  state.crm.status = els.crmStatus?.value || state.crm.status;
  state.crm.owner = els.crmOwner?.value || state.crm.owner;
  state.crm.followupDate = els.crmFollowupDate?.value || state.crm.followupDate;
  state.crm.phone = els.crmPhone?.value || "";
  state.crm.email = els.crmEmail?.value || "";
  state.crm.leadSource = els.crmLeadSource?.value || "Walk-in";
  state.crm.salesperson = els.crmSalesperson?.value || "Chris Peters";
  state.crm.interestedModels = els.crmInterestedModels?.value || "";
  state.crm.projectAddress = els.crmProjectAddress?.value || "";

  const totals = grandTotals();
  if (els.crmLeadTitle && document.activeElement !== els.crmLeadTitle) {
    els.crmLeadTitle.value = els.projectName.value || "";
  }
  if (els.crmCustomerNameInput && document.activeElement !== els.crmCustomerNameInput) {
    els.crmCustomerNameInput.value = els.customerName.value || "";
  }
  if (els.crmActiveRecordTitle) {
    els.crmActiveRecordTitle.textContent = els.projectName.value || "Untitled lead";
  }
  els.crmCustomerName.textContent = els.customerName.value || "New Customer";
  els.crmProjectName.textContent = els.projectName.value || "Current project";
  els.crmProjectType.textContent = els.projectType.value;
  els.crmProjectLevel.textContent = els.projectLevel.disabled ? "N/A" : els.projectLevel.value;
  els.crmEstimateTotal.textContent = money.format(totals.total);
  renderBillingStages();

  els.crmRecordSelect.innerHTML = [
    `<option value="">Current unsaved lead</option>`,
    ...state.crm.records.map(
      (record) =>
        `<option value="${record.id}" ${record.id === state.crm.activeRecordId ? "selected" : ""}>${escapeAttr(record.customerName || "Unnamed")} - ${escapeAttr(record.projectName || "Project")}</option>`,
    ),
  ].join("");

  document.querySelectorAll("[data-crm-lane] .lane-items").forEach((lane) => {
    lane.innerHTML = "";
  });
  const boardRecords = [...state.crm.records];
  const current = currentCrmRecord();
  if (!state.crm.records.some((record) => record.id === current.id)) boardRecords.unshift(current);
  boardRecords.forEach((record) => {
    const laneName = ["New", "Contacted", "Needs Estimate", "Quote Sent", "Won", "Under Construction"].includes(record.status)
      ? record.status
      : record.status === "Estimate In Progress"
        ? "Needs Estimate"
        : record.status === "Follow-up"
          ? "Quote Sent"
          : "New";
    const activeLane = document.querySelector(`[data-crm-lane="${laneName}"] .lane-items`);
    if (!activeLane) return;
    const card = document.createElement("article");
    card.className = `lead-card ${record.id === state.crm.activeRecordId ? "active" : ""}`;
    card.dataset.recordId = record.id;
    card.draggable = true;
    card.innerHTML = `
      <strong>${escapeAttr(record.projectName || "Current project")}</strong>
      <span>${escapeAttr(record.customerName || "New Customer")}</span>
    `;
    activeLane.appendChild(card);
  });

  els.crmTasks.innerHTML = state.crm.tasks
    .map(
      (task, index) => `
        <article class="task-row">
          <label>
            <input data-task-index="${index}" type="checkbox" ${task.done ? "checked" : ""} />
            <span>${escapeAttr(task.text)}</span>
          </label>
          <button class="secondary mini-button" type="button" data-delete-crm-task="${index}">Delete</button>
        </article>
      `,
    )
    .join("");

  els.crmNotes.innerHTML = state.crm.notes.length
    ? state.crm.notes
        .map(
          (note) => `
            <article>
              <strong>${escapeAttr(note.date)}</strong>
              <p>${escapeAttr(note.text)}</p>
            </article>
          `,
        )
        .join("")
    : `<p class="empty-note">No notes yet.</p>`;
  renderCrmMap();
}

function renderCrmMap() {
  if (!els.crmProjectMap) return;
  const address = String(els.crmProjectAddress?.value || "").trim();
  const hasAddress = Boolean(address);
  const mapUrl = hasAddress ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : "";
  const linkUrl = hasAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "#";
  els.crmProjectMap.toggleAttribute("hidden", !hasAddress);
  els.crmMapEmpty?.toggleAttribute("hidden", hasAddress);
  if (hasAddress && els.crmProjectMap.getAttribute("src") !== mapUrl) els.crmProjectMap.src = mapUrl;
  if (!hasAddress) els.crmProjectMap.removeAttribute("src");
  if (els.crmMapLink) {
    els.crmMapLink.href = linkUrl;
    els.crmMapLink.toggleAttribute("hidden", !hasAddress);
  }
}

function renderBillingStages() {
  if (!els.crmBillingStages) return;
  const groups = [...new Set(state.crm.billingStages.map((stage) => stage.group))];
  const completeCount = state.crm.billingStages.filter((stage) => stage.completed).length;
  const amountTotal = state.crm.billingStages.reduce((sum, stage) => sum + num(stage.amount), 0);
  const paidTotal = state.crm.billingStages
    .filter((stage) => ["Invoiced", "Paid"].includes(stage.status))
    .reduce((sum, stage) => sum + num(stage.amount), 0);
  if (els.billingStageCount) els.billingStageCount.textContent = String(state.crm.billingStages.length);
  if (els.billingStageAmountTotal) els.billingStageAmountTotal.textContent = money.format(amountTotal);
  if (els.billingStagePaidTotal) els.billingStagePaidTotal.textContent = money.format(paidTotal);
  els.crmBillingStageSummary.textContent = `${completeCount} of ${state.crm.billingStages.length} complete`;
  els.crmBillingStages.innerHTML = groups
    .map((group) => {
      const stages = state.crm.billingStages.filter((stage) => stage.group === group);
      return `
        <section class="billing-stage-group">
          <h4>${escapeAttr(group)}</h4>
          <div class="billing-stage-list">
            ${stages
              .map(
                (stage) => `
                  <div class="billing-stage-row" data-billing-stage="${escapeAttr(stage.id)}">
                    <label class="billing-stage-check">
                      <input data-billing-stage-field="completed" type="checkbox" ${stage.completed ? "checked" : ""} />
                      <span>${escapeAttr(stage.label)}</span>
                    </label>
                    <label>
                      Amount
                      <input data-billing-stage-field="amount" type="number" min="0" step="0.01" value="${escapeAttr(stage.amount)}" placeholder="0" />
                    </label>
                    <label>
                      Completed
                      <input data-billing-stage-field="completedDate" type="date" value="${escapeAttr(stage.completedDate)}" />
                    </label>
                    <label>
                      Billing status
                      <select data-billing-stage-field="status">
                        ${billingStageStatuses
                          .map((status) => `<option ${stage.status === status ? "selected" : ""}>${escapeAttr(status)}</option>`)
                          .join("")}
                      </select>
                    </label>
                    <label>
                      Notes
                      <input data-billing-stage-field="notes" value="${escapeAttr(stage.notes)}" placeholder="Invoice, draw, or payment note" />
                    </label>
                  </div>
                `,
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
  renderBillingReport();
}

function handleBillingStageEdit(event) {
  const row = event.target.closest("[data-billing-stage]");
  const field = event.target.dataset.billingStageField;
  if (!row || !field) return;
  const stage = state.crm.billingStages.find((item) => item.id === row.dataset.billingStage);
  if (!stage) return;
  if (field === "completed") {
    stage.completed = event.target.checked;
    if (stage.completed && stage.status === "Not started") stage.status = "Complete";
    if (!stage.completed) {
      stage.status = "Not started";
      stage.completedDate = "";
    }
  } else {
    stage[field] = event.target.value;
    if (field === "amount") stage.amount = event.target.value;
    if (field === "status") stage.completed = event.target.value !== "Not started";
    if (field === "completedDate" && event.target.value && stage.status === "Not started") {
      stage.completed = true;
      stage.status = "Complete";
    }
  }
  if (field === "notes" || field === "amount") {
    const amountTotal = state.crm.billingStages.reduce((sum, item) => sum + num(item.amount), 0);
    const paidTotal = state.crm.billingStages
      .filter((item) => ["Invoiced", "Paid"].includes(item.status))
      .reduce((sum, item) => sum + num(item.amount), 0);
    if (els.billingStageAmountTotal) els.billingStageAmountTotal.textContent = money.format(amountTotal);
    if (els.billingStagePaidTotal) els.billingStagePaidTotal.textContent = money.format(paidTotal);
    renderBillingReport();
    saveActiveCrmRecordEdits();
    return;
  }
  renderBillingStages();
  saveActiveCrmRecordEdits();
}

function billingProjectRecords() {
  const current = currentCrmRecord();
  const saved = state.crm.records.filter((record) => record.id !== current.id);
  return [current, ...saved].filter((record) => record.projectName || record.customerName);
}

function billingReportStatus(stage) {
  if (stage.status === "Paid") return "paid";
  if (stage.status === "Invoiced") return "outstanding";
  if (stage.status === "Complete" || stage.completed) return "ready";
  return "upcoming";
}

function billingReportRows() {
  return billingProjectRecords().flatMap((record) =>
    createBillingStages(record.billingStages).map((stage) => {
      const reportStatus = billingReportStatus(stage);
      const amount = num(stage.amount);
      return {
        key: `${record.id}-${stage.id}`,
        recordId: record.id,
        projectName: record.projectName || "Untitled project",
        customerName: record.customerName || "New Customer",
        stageLabel: stage.label,
        group: stage.group,
        status: stage.status,
        reportStatus,
        reportStatusLabel: billingReportStatuses[reportStatus],
        completedDate: stage.completedDate || "",
        amount,
        owing: reportStatus === "paid" ? 0 : amount,
        notes: stage.notes || "",
      };
    }),
  );
}

function filteredBillingReportRows() {
  const filter = els.billingReportFilter?.value || "all";
  return billingReportRows().filter((row) => filter === "all" || row.reportStatus === filter);
}

function renderBillingReport() {
  if (!els.billingReportBody) return;
  const rows = billingReportRows();
  const totals = rows.reduce(
    (acc, row) => {
      acc[row.reportStatus] += row.amount;
      return acc;
    },
    { ready: 0, outstanding: 0, paid: 0, upcoming: 0 },
  );
  els.billingReportReadyTotal.textContent = money.format(totals.ready);
  els.billingReportOutstandingTotal.textContent = money.format(totals.outstanding);
  els.billingReportPaidTotal.textContent = money.format(totals.paid);
  els.billingReportUpcomingTotal.textContent = money.format(totals.upcoming);

  const visibleRows = filteredBillingReportRows();
  els.billingReportBody.innerHTML = visibleRows.length
    ? visibleRows
        .map(
          (row) => `
            <tr data-billing-report-row="${escapeAttr(row.key)}">
              <td>${escapeAttr(row.projectName)}</td>
              <td>${escapeAttr(row.customerName)}</td>
              <td>${escapeAttr(row.stageLabel)}</td>
              <td><span class="billing-status-pill ${escapeAttr(row.reportStatus)}">${escapeAttr(row.reportStatusLabel)}</span></td>
              <td>${escapeAttr(row.completedDate || "-")}</td>
              <td>${money.format(row.amount)}</td>
              <td>${money.format(row.owing)}</td>
              <td>${escapeAttr(row.notes || "")}</td>
              <td><button class="secondary mini-button" type="button" data-print-billing-invoice="${escapeAttr(row.key)}">Print</button></td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="9" class="muted-cell">No billing stages match this view.</td></tr>`;
}

function billingReportPrintHtml(rows, title) {
  const generatedDate = new Date().toLocaleDateString("en-CA");
  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const totalOwing = rows.reduce((sum, row) => sum + row.owing, 0);
  return `
    <div class="billing-print-page">
      <h1>${escapeAttr(title)}</h1>
      <div class="billing-print-meta">Generated ${escapeAttr(generatedDate)}</div>
      <table class="billing-print-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Customer</th>
            <th>Stage</th>
            <th>Status</th>
            <th>Completed</th>
            <th>Amount</th>
            <th>Owing</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeAttr(row.projectName)}</td>
                  <td>${escapeAttr(row.customerName)}</td>
                  <td>${escapeAttr(row.stageLabel)}</td>
                  <td>${escapeAttr(row.reportStatusLabel)}</td>
                  <td>${escapeAttr(row.completedDate || "-")}</td>
                  <td>${money.format(row.amount)}</td>
                  <td>${money.format(row.owing)}</td>
                  <td>${escapeAttr(row.notes || "")}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
      <div class="billing-print-totals">
        <span>Total amount: ${money.format(totalAmount)}</span>
        <span>Total owing: ${money.format(totalOwing)}</span>
      </div>
    </div>
  `;
}

function clearBillingPrintMode() {
  document.body.classList.remove("billing-printing");
  if (els.billingPrintArea) els.billingPrintArea.innerHTML = "";
}

function printBillingRows(rows, title) {
  if (!rows.length || !els.billingPrintArea) return;
  els.billingPrintArea.innerHTML = billingReportPrintHtml(rows, title);
  document.body.classList.add("billing-printing");
  window.print();
  window.setTimeout(clearBillingPrintMode, 500);
}

function printBillingReport() {
  const filter = els.billingReportFilter?.value || "all";
  const title = filter === "all" ? "All Project Billing Report" : `${billingReportStatuses[filter]} Billing Report`;
  printBillingRows(filteredBillingReportRows(), title);
}

function printBillingInvoice(rowKey) {
  const row = billingReportRows().find((item) => item.key === rowKey);
  if (!row) return;
  printBillingRows([row], `Billing Invoice - ${row.projectName}`);
}

function updateCrmRecordStatus(recordId, status) {
  let record = state.crm.records.find((item) => item.id === recordId);
  if (!record) {
    state.crm.activeRecordId = recordId;
    record = currentCrmRecord();
    record.id = recordId;
    state.crm.records.unshift(record);
  }
  record.status = status;
  record.updatedAt = new Date().toISOString();
  if (record.id === state.crm.activeRecordId) {
    els.crmStatus.value = status;
    state.crm.status = status;
  }
  persistCrmRecords();
  renderCrm();
}

function handleCrmDragStart(event) {
  const card = event.target.closest("[data-record-id]");
  if (!card) return;
  event.dataTransfer.setData("text/plain", card.dataset.recordId);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
}

function handleCrmDragEnd(event) {
  event.target.closest("[data-record-id]")?.classList.remove("dragging");
  document.querySelectorAll("[data-crm-lane]").forEach((lane) => lane.classList.remove("drag-over"));
}

function handleCrmDrop(event) {
  const lane = event.target.closest("[data-crm-lane]");
  if (!lane) return;
  event.preventDefault();
  lane.classList.remove("drag-over");
  const recordId = event.dataTransfer.getData("text/plain");
  if (!recordId) return;
  updateCrmRecordStatus(recordId, lane.dataset.crmLane);
}

function addCrmTask() {
  const label = window.prompt("Task name");
  if (!label) return;
  state.crm.tasks.push({ id: `task-${Date.now()}`, text: label, done: false, owner: "Sales", dueDate: "", priority: "Normal", status: "Open", notes: "" });
  renderCrm();
  renderProjectTasks();
  saveActiveCrmRecordEdits();
}

function deleteCrmTask(index) {
  if (index < 0 || index >= state.crm.tasks.length) return;
  state.crm.tasks.splice(index, 1);
  renderCrm();
  renderProjectTasks();
  saveActiveCrmRecordEdits();
}

function addCrmNote() {
  const text = els.crmNoteInput.value.trim();
  if (!text) return;
  state.crm.notes.unshift({
    text,
    date: new Date().toLocaleDateString("en-CA"),
  });
  els.crmNoteInput.value = "";
  renderCrm();
  saveActiveCrmRecordEdits();
}

function warrantyProjectRows() {
  const currentId = state.crm.activeRecordId || "current";
  const current = {
    id: currentId,
    projectName: currentProjectName(),
    customerName: els.customerName?.value || "New Customer",
    started: state.schedule?.startDate || "",
    warranty: normalizeWarranty(state.crm.warranty),
    current: true,
  };
  const saved = state.crm.records
    .filter((record) => record.id !== state.crm.activeRecordId)
    .map((record) => ({
      id: record.id,
      projectName: record.projectName || "Untitled project",
      customerName: record.customerName || "No customer",
      started: record.schedule?.startDate || record.createdAt || record.updatedAt || "",
      warranty: normalizeWarranty(record.warranty),
      current: false,
      record,
    }));
  return [current, ...saved];
}

function selectedWarrantyProjectId() {
  const rows = warrantyProjectRows();
  const selected = state.warranty.selectedProjectId || state.crm.activeRecordId || "current";
  return rows.some((row) => row.id === selected) ? selected : rows[0]?.id || "current";
}

function warrantyTarget(projectId = selectedWarrantyProjectId()) {
  if (!projectId || projectId === (state.crm.activeRecordId || "current")) {
    state.crm.warranty = normalizeWarranty(state.crm.warranty);
    return {
      warranty: state.crm.warranty,
      save() {
        saveActiveCrmRecordEdits();
      },
    };
  }
  const record = state.crm.records.find((item) => item.id === projectId);
  if (!record) return null;
  record.warranty = normalizeWarranty(record.warranty);
  return {
    record,
    warranty: record.warranty,
    save() {
      persistCrmRecords();
    },
  };
}

function renderWarranty() {
  if (!els.warrantyProjectsBody) return;
  state.warranty.selectedProjectId = selectedWarrantyProjectId();
  const rows = warrantyProjectRows();
  const selectedRow = rows.find((row) => row.id === state.warranty.selectedProjectId) || rows[0];
  const openDeficiencies = rows.reduce((sum, row) => sum + row.warranty.deficiencies.filter((item) => !item.done).length, 0);
  els.warrantyProjectCount.textContent = String(rows.length);
  els.warrantyCompleteCount.textContent = String(rows.filter((row) => row.warranty.complete).length);
  els.warrantyOpenDeficiencyCount.textContent = String(openDeficiencies);
  els.warrantyProjectsBody.innerHTML = rows
    .map(
      (row) => `
        <tr class="order-directory-row ${row.id === state.warranty.selectedProjectId ? "selected" : ""}" data-select-warranty-project="${escapeAttr(row.id)}">
          <td><strong>${escapeAttr(row.projectName)}</strong></td>
          <td>${escapeAttr(row.customerName)}</td>
          <td>${escapeAttr(row.started ? prettyDate(row.started.slice(0, 10)) : "-")}</td>
          <td><input data-warranty-project-field="startDate" type="date" value="${escapeAttr(row.warranty.startDate)}" /></td>
          <td><input data-warranty-project-field="complete" type="checkbox" ${row.warranty.complete ? "checked" : ""} /></td>
          <td><textarea data-warranty-project-field="notes" rows="2" placeholder="Warranty notes">${escapeAttr(row.warranty.notes)}</textarea></td>
        </tr>
      `,
    )
    .join("");
  if (els.warrantyAdminProject) els.warrantyAdminProject.textContent = selectedRow?.projectName || "-";
  if (els.warrantyAdminCustomer) els.warrantyAdminCustomer.textContent = selectedRow?.customerName || "-";
  if (els.warrantyAdminStarted) els.warrantyAdminStarted.textContent = selectedRow?.started ? prettyDate(selectedRow.started.slice(0, 10)) : "-";
  if (els.warrantyNewHomeStartDate) els.warrantyNewHomeStartDate.value = selectedRow?.warranty.newHomeWarrantyStartDate || "";
  if (els.warrantyPaperworkSent) els.warrantyPaperworkSent.checked = Boolean(selectedRow?.warranty.newHomeWarrantyPaperworkSent);
  els.warrantyDeficiencyProject.innerHTML = rows
    .map((row) => `<option value="${escapeAttr(row.id)}" ${row.id === state.warranty.selectedProjectId ? "selected" : ""}>${escapeAttr(row.projectName)} - ${escapeAttr(row.customerName)}</option>`)
    .join("");
  els.warrantyPrintHeader.innerHTML = selectedRow
    ? `<strong>${escapeAttr(selectedRow.projectName)}</strong><span>${escapeAttr(selectedRow.customerName)}${selectedRow.warranty.startDate ? ` - Warranty Start ${escapeAttr(prettyDate(selectedRow.warranty.startDate))}` : ""}${selectedRow.warranty.newHomeWarrantyStartDate ? ` - New Home Warranty ${escapeAttr(prettyDate(selectedRow.warranty.newHomeWarrantyStartDate))}` : ""}</span>`
    : "";
  renderWarrantyDeficiencies();
}

function handleWarrantyAdminEdit(event) {
  const target = warrantyTarget();
  if (!target) return;
  if (event.target === els.warrantyNewHomeStartDate) {
    target.warranty.newHomeWarrantyStartDate = event.target.value;
  } else if (event.target === els.warrantyPaperworkSent) {
    target.warranty.newHomeWarrantyPaperworkSent = event.target.checked;
  } else {
    return;
  }
  target.save();
  if (event.type === "change") renderWarranty();
}

function renderWarrantyDeficiencies() {
  const target = warrantyTarget();
  const deficiencies = target?.warranty.deficiencies || [];
  els.warrantyDeficienciesBody.innerHTML = deficiencies.length
    ? deficiencies
        .map(
          (item) => `
            <tr data-warranty-deficiency="${escapeAttr(item.id)}">
              <td><input data-warranty-deficiency-field="done" type="checkbox" ${item.done ? "checked" : ""} /><span class="print-only">${item.done ? "Complete" : "Open"}</span></td>
              <td><input data-warranty-deficiency-field="text" value="${escapeAttr(item.text)}" placeholder="Deficiency" /><span class="print-only">${escapeAttr(item.text || "-")}</span></td>
              <td><input data-warranty-deficiency-field="assignedTo" value="${escapeAttr(item.assignedTo)}" placeholder="Assigned to" /><span class="print-only">${escapeAttr(item.assignedTo || "-")}</span></td>
              <td>
                ${
                  item.photo
                    ? `<button class="selection-photo-link" type="button" data-preview-warranty-photo="${escapeAttr(item.id)}">${escapeAttr(item.photo.name)}</button>`
                    : `<span class="muted-cell">No picture</span>`
                }
                <input data-warranty-deficiency-photo="${escapeAttr(item.id)}" type="file" accept="image/*" />
              </td>
              <td><textarea data-warranty-deficiency-field="notes" rows="2" placeholder="Notes">${escapeAttr(item.notes)}</textarea><span class="print-only">${escapeAttr(item.notes || "-")}</span></td>
              <td><button class="danger-button no-print" type="button" data-delete-warranty-deficiency="${escapeAttr(item.id)}">Delete</button></td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="6">No deficiencies for this project yet.</td></tr>`;
}

async function addWarrantyDeficiency() {
  const target = warrantyTarget();
  const text = els.warrantyDeficiencyText.value.trim();
  if (!target || !text) return;
  const file = els.warrantyDeficiencyPhoto.files?.[0];
  target.warranty.deficiencies.unshift({
    id: `deficiency-${Date.now()}`,
    text,
    done: false,
    assignedTo: els.warrantyDeficiencyAssignedTo.value.trim(),
    notes: els.warrantyDeficiencyNotes.value.trim(),
    photo: file
      ? {
          name: file.name,
          type: file.type || "image/*",
          size: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl: await readFileAsDataUrl(file),
        }
      : null,
  });
  els.warrantyDeficiencyText.value = "";
  els.warrantyDeficiencyAssignedTo.value = "";
  els.warrantyDeficiencyNotes.value = "";
  els.warrantyDeficiencyPhoto.value = "";
  target.save();
  renderWarranty();
}

function handleWarrantyProjectEdit(event) {
  const row = event.target.closest("[data-select-warranty-project]");
  const field = event.target.dataset.warrantyProjectField;
  const target = warrantyTarget(row?.dataset.selectWarrantyProject);
  if (!target || !field) return;
  if (field === "complete") target.warranty.complete = event.target.checked;
  else target.warranty[field] = event.target.value;
  target.save();
  if (field === "complete" || event.type === "change") renderWarranty();
}

function handleWarrantyDeficiencyEdit(event) {
  const row = event.target.closest("[data-warranty-deficiency]");
  const field = event.target.dataset.warrantyDeficiencyField;
  const target = warrantyTarget();
  const item = target?.warranty.deficiencies.find((entry) => entry.id === row?.dataset.warrantyDeficiency);
  if (!item || !field) return;
  if (field === "done") item.done = event.target.checked;
  else item[field] = event.target.value;
  target.save();
  if (field === "done") renderWarranty();
}

async function handleWarrantyDeficiencyPhoto(event) {
  const input = event.target.closest("[data-warranty-deficiency-photo]");
  const file = input?.files?.[0];
  if (!input || !file) return;
  const target = warrantyTarget();
  const item = target?.warranty.deficiencies.find((entry) => entry.id === input.dataset.warrantyDeficiencyPhoto);
  if (!item) return;
  item.photo = {
    name: file.name,
    type: file.type || "image/*",
    size: file.size,
    uploadedAt: new Date().toISOString(),
    dataUrl: await readFileAsDataUrl(file),
  };
  input.value = "";
  target.save();
  renderWarranty();
}

function openWarrantyPhotoPreview(deficiencyId) {
  const target = warrantyTarget();
  const item = target?.warranty.deficiencies.find((entry) => entry.id === deficiencyId);
  if (!item?.photo?.dataUrl || !els.jobFilePreviewModal || !els.jobFilePreviewBody) return;
  state.openJobFilePreviewId = "";
  state.openJobFilePreviewProjectId = "";
  els.jobFilePreviewModal.hidden = false;
  els.jobFilePreviewTitle.textContent = item.photo.name || "Deficiency photo";
  els.jobFilePreviewDownload.href = item.photo.dataUrl;
  els.jobFilePreviewDownload.download = item.photo.name || "deficiency-photo";
  els.jobFilePreviewBody.classList.remove("pdf-pages");
  els.jobFilePreviewBody.innerHTML = "";
  const image = document.createElement("img");
  image.src = item.photo.dataUrl;
  image.alt = item.text || "Deficiency photo";
  els.jobFilePreviewBody.append(image);
}

function deleteWarrantyDeficiency(deficiencyId) {
  const target = warrantyTarget();
  if (!target) return;
  target.warranty.deficiencies = target.warranty.deficiencies.filter((item) => item.id !== deficiencyId);
  target.save();
  renderWarranty();
}

function printDeficiencyList() {
  document.body.classList.add("warranty-printing");
  window.print();
  window.setTimeout(() => document.body.classList.remove("warranty-printing"), 500);
}

function taskProjectRows() {
  const currentId = state.crm.activeRecordId || "current";
  const rows = [
    {
      projectId: currentId,
      projectName: currentProjectName(),
      customerName: els.customerName?.value || "New Customer",
      current: true,
      tasks: normalizeTasks(state.crm.tasks),
    },
  ];
  state.crm.records.forEach((record) => {
    if (record.id === currentId) return;
    rows.push({
      projectId: record.id,
      projectName: record.projectName || "Untitled project",
      customerName: record.customerName || "No customer",
      current: false,
      record,
      tasks: normalizeTasks(record.tasks || []),
    });
  });
  return rows.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectId: project.projectId,
      projectName: project.projectName,
      customerName: project.customerName,
      current: project.current,
      record: project.record,
    })),
  );
}

function filteredProjectTasks() {
  const projectId = state.taskFilters.projectId || state.crm.activeRecordId || "current";
  const owner = state.taskFilters.owner || "All owners";
  const sort = state.taskFilters.sort || "due";
  const priorityRank = { High: 0, Normal: 1, Low: 2 };
  return taskProjectRows()
    .filter((task) => projectId === "all" || task.projectId === projectId)
    .filter((task) => owner === "All owners" || task.owner === owner)
    .sort((a, b) => {
      if (sort === "owner") return `${a.owner || ""}${a.dueDate || "9999-99-99"}`.localeCompare(`${b.owner || ""}${b.dueDate || "9999-99-99"}`);
      if (sort === "project") return `${a.projectName || ""}${a.dueDate || "9999-99-99"}`.localeCompare(`${b.projectName || ""}${b.dueDate || "9999-99-99"}`);
      if (sort === "priority") return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) || String(a.dueDate || "9999-99-99").localeCompare(String(b.dueDate || "9999-99-99"));
      return String(a.dueDate || "9999-99-99").localeCompare(String(b.dueDate || "9999-99-99"));
    });
}

function taskBreakdownRecords(type) {
  const today = todayIso();
  const soon = addDaysIso(today, 7);
  const tasks = filteredProjectTasks();
  if (type === "open") return tasks.filter((task) => !task.done);
  if (type === "dueSoon") return tasks.filter((task) => !task.done && task.dueDate && task.dueDate <= soon);
  if (type === "complete") return tasks.filter((task) => task.done);
  return tasks;
}

function taskBreakdownTitle(type, tasks) {
  const labels = {
    total: "Total to-dos",
    open: "Open to-dos",
    dueSoon: "To-dos due soon",
    complete: "Complete to-dos",
  };
  return `${labels[type] || "To-Dos"} (${tasks.length})`;
}

function renderTaskBreakdown() {
  if (!els.taskBreakdownModal) return;
  const type = state.taskBreakdown;
  const tasks = taskBreakdownRecords(type);
  els.taskBreakdownModal.toggleAttribute("hidden", !type);
  if (!type) {
    els.taskBreakdownBody.innerHTML = "";
    return;
  }
  const openCount = tasks.filter((task) => !task.done).length;
  const completeCount = tasks.length - openCount;
  els.taskBreakdownTitle.textContent = taskBreakdownTitle(type, tasks);
  els.taskBreakdownBody.innerHTML = `
    <div class="management-breakdown-summary">
      <div><span>To-Dos</span><strong>${tasks.length}</strong></div>
      <div><span>Open / complete</span><strong>${openCount} / ${completeCount}</strong></div>
    </div>
    ${
      tasks.length
        ? `<div class="task-breakdown-list">
            ${tasks
              .map(
                (task) => `
                  <article>
                    <div>
                      <strong>${escapeAttr(task.text || "Untitled task")}</strong>
                      <span>${escapeAttr(task.projectName || "Current project")}</span>
                    </div>
                    <div>
                      <strong>${task.dueDate ? prettyDate(task.dueDate) : "No due date"}</strong>
                      <span>${escapeAttr(task.owner || "Unassigned")} - ${escapeAttr(task.priority || "Normal")}</span>
                    </div>
                    <small>${escapeAttr(task.status || (task.done ? "Complete" : "Open"))}${task.notes ? ` - ${escapeAttr(task.notes)}` : ""}</small>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : `<p class="empty-note">No to-dos in this group yet.</p>`
    }
  `;
}

function renderProjectTasks() {
  if (!els.projectTasksBody) return;
  state.crm.tasks = normalizeTasks(state.crm.tasks);
  const today = todayIso();
  const soon = addDaysIso(today, 7);
  const activeProjectId = state.crm.activeRecordId || "current";
  if (!state.taskFilters.projectId || (state.taskFilters.projectId !== "all" && !taskProjectRows().some((task) => task.projectId === state.taskFilters.projectId))) {
    state.taskFilters.projectId = activeProjectId;
  }
  if (
    state.selectedProjectTask &&
    !taskProjectRows().some((task) => task.projectId === state.selectedProjectTask.projectId && task.id === state.selectedProjectTask.taskId)
  ) {
    state.selectedProjectTask = null;
  }
  const displayedTasks = filteredProjectTasks();
  const openTasks = displayedTasks.filter((task) => !task.done);
  const completeTasks = displayedTasks.filter((task) => task.done);
  const dueSoon = openTasks.filter((task) => task.dueDate && task.dueDate <= soon).length;
  const selectedFormProjectId = state.selectedProjectTask?.projectId || activeProjectId;
  els.projectTaskProjectSelect.innerHTML = projectOptionsHtml(selectedFormProjectId);
  els.projectTaskListProjectSelect.innerHTML = taskProjectOptionsHtml(state.taskFilters.projectId || activeProjectId);
  els.projectTaskListProjectSelect.value = state.taskFilters.projectId || activeProjectId;
  els.projectTaskOwnerFilter.value = state.taskFilters.owner || "All owners";
  els.projectTaskSort.value = state.taskFilters.sort || "due";
  els.projectTaskTotal.textContent = String(displayedTasks.length);
  els.projectTaskOpen.textContent = String(openTasks.length);
  els.projectTaskDueSoon.textContent = String(dueSoon);
  els.projectTaskComplete.textContent = String(completeTasks.length);
  els.projectTasksBody.innerHTML = displayedTasks.length
    ? displayedTasks
    .map(
      (task) => `
        <tr class="order-directory-row ${task.done ? "task-complete" : ""} ${state.selectedProjectTask?.projectId === task.projectId && state.selectedProjectTask?.taskId === task.id ? "selected" : ""}" data-select-project-task="${task.id}" data-project-task-project="${task.projectId}">
          <td>${task.done ? "Yes" : "No"}</td>
          <td><span class="project-task-project-name">${escapeAttr(task.projectName)} - ${escapeAttr(task.customerName || "No customer")}</span></td>
          <td>${escapeAttr(task.text)}</td>
          <td>${escapeAttr(task.owner || "Unassigned")}</td>
          <td>${escapeAttr(task.dueDate || "-")}</td>
          <td>${escapeAttr(task.priority || "Normal")}</td>
          <td>${escapeAttr(task.status || (task.done ? "Complete" : "Open"))}</td>
          <td>${escapeAttr(task.notes || "-")}</td>
        </tr>
      `,
    )
    .join("")
    : `<tr><td colspan="8" class="empty-table-cell">No to-dos match those filters.</td></tr>`;
  els.addProjectTaskBtn.textContent = state.selectedProjectTask ? "Update task" : "Add task";
  renderTaskBreakdown();
}

function projectTaskTarget(projectId = els.projectTaskProjectSelect.value || state.crm.activeRecordId || "current") {
  if (!projectId || projectId === (state.crm.activeRecordId || "current")) {
    state.crm.tasks = normalizeTasks(state.crm.tasks);
    return {
      tasks: state.crm.tasks,
      save() {
        saveActiveCrmRecordEdits();
      },
    };
  }
  const record = state.crm.records.find((item) => item.id === projectId);
  if (!record) return null;
  record.tasks = normalizeTasks(record.tasks || []);
  return {
    record,
    tasks: record.tasks,
    save() {
      persistCrmRecords();
    },
  };
}

function clearProjectTaskForm() {
  state.selectedProjectTask = null;
  els.projectTaskProjectSelect.value = state.crm.activeRecordId || "current";
  els.projectTaskText.value = "";
  els.projectTaskOwner.value = "Sales";
  els.projectTaskDueDate.value = "";
  els.projectTaskPriority.value = "Normal";
  els.projectTaskStatus.value = "Open";
  els.projectTaskNotes.value = "";
}

function addProjectTask() {
  const text = els.projectTaskText.value.trim();
  if (!text) return;
  const targetProjectId = els.projectTaskProjectSelect.value || state.crm.activeRecordId || "current";
  const target = projectTaskTarget(targetProjectId);
  if (!target) return;
  const values = {
    text,
    done: els.projectTaskStatus.value === "Complete",
    owner: els.projectTaskOwner.value || "Sales",
    dueDate: els.projectTaskDueDate.value || "",
    priority: els.projectTaskPriority.value || "Normal",
    status: els.projectTaskStatus.value || "Open",
    notes: els.projectTaskNotes.value.trim(),
  };
  const existing =
    state.selectedProjectTask?.projectId === targetProjectId
      ? target.tasks.find((task) => task.id === state.selectedProjectTask.taskId)
      : null;
  if (existing) {
    Object.assign(existing, values);
  } else {
    target.tasks.push({
      id: `task-${Date.now()}`,
      ...values,
    });
  }
  target.save();
  clearProjectTaskForm();
  renderProjectTasks();
  renderCrm();
}

function selectProjectTask(projectId, taskId) {
  const target = projectTaskTarget(projectId);
  const task = target?.tasks.find((item) => item.id === taskId);
  if (!task) return;
  state.selectedProjectTask = { projectId, taskId };
  els.projectTaskProjectSelect.innerHTML = projectOptionsHtml(projectId);
  els.projectTaskProjectSelect.value = projectId;
  els.projectTaskText.value = task.text;
  els.projectTaskOwner.value = task.owner || "Sales";
  els.projectTaskDueDate.value = task.dueDate || "";
  els.projectTaskPriority.value = task.priority || "Normal";
  els.projectTaskStatus.value = task.status || (task.done ? "Complete" : "Open");
  els.projectTaskNotes.value = task.notes || "";
  renderProjectTasks();
}

async function init() {
  [
    "loginScreen",
    "loginForm",
    "loginUser",
    "loginPassword",
    "loginError",
    "activeUserName",
    "activeUserRole",
    "accountMenuBtn",
    "accountPanel",
    "closeAccountPanelBtn",
    "accountName",
    "accountEmail",
    "accountPhone",
    "accountRole",
    "logoutBtn",
    "estimateProjectSelect",
    "projectName",
    "customerName",
    "projectType",
    "projectLevel",
    "houseSqft",
    "garageSqft",
    "travelDistance",
    "destinationTown",
    "destinationProvince",
    "distanceLookupBtn",
    "distanceLookupNote",
    "targetMargin",
    "pstRate",
    "gstRate",
    "estimateVersionNote",
    "saveEstimateVersionBtn",
    "estimateVersionStatus",
    "estimateVersionsList",
    "estimateVersionModal",
    "estimateVersionModalTitle",
    "estimateVersionDocument",
    "closeEstimateVersionBtn",
    "totalCost",
    "totalRetail",
    "totalPst",
    "totalGst",
    "grandTotal",
    "marginPct",
    "priceSqft",
    "searchInput",
    "sectionFilter",
    "sectionsList",
    "outputEstimateDate",
    "outputProvidedBy",
    "outputLocation",
    "outputIntro",
    "outputMovingNotes",
    "outputExclusions",
    "outputScopeSection",
    "outputScopeDescription",
    "outputScopeSort",
    "outputScopeIndent",
    "outputScopeProposal",
    "outputScopeContract",
    "addOutputScopeItemBtn",
    "outputScopeItemsList",
    "printOutputBtn",
    "outputLineEditor",
    "proposalPreview",
    "outputEstimateVersion",
    "contractDate",
    "contractEstimateVersion",
    "contractCustomerName",
    "contractLocation",
    "contractDepositTerms",
    "contractApprovalStatus",
    "contractApprovalNote",
    "approveContractBtn",
    "revokeContractApprovalBtn",
    "contractApprovalMessage",
    "printContractBtn",
    "contractInclusions",
    "contractExclusions",
    "contractPreview",
    "crmBoard",
    "crmRecordSelect",
    "crmActiveRecordTitle",
    "crmLeadTitle",
    "crmCustomerNameInput",
    "crmStatus",
    "crmOwner",
    "crmFollowupDate",
    "crmPhone",
    "crmEmail",
    "crmLeadSource",
    "crmSalesperson",
    "crmInterestedModels",
    "crmProjectAddress",
    "crmMapLink",
    "crmMapEmpty",
    "crmProjectMap",
    "crmCustomerName",
    "crmProjectName",
    "crmProjectType",
    "crmProjectLevel",
    "crmEstimateTotal",
    "crmBillingStageSummary",
    "crmBillingStages",
    "crmTasks",
    "projectTaskTotal",
    "projectTaskOpen",
    "projectTaskDueSoon",
    "projectTaskComplete",
    "projectTaskProjectSelect",
    "projectTaskListProjectSelect",
    "projectTaskText",
    "projectTaskOwner",
    "projectTaskDueDate",
    "projectTaskPriority",
    "projectTaskStatus",
    "projectTaskNotes",
    "addProjectTaskBtn",
    "projectTasksBody",
    "projectTaskOwnerFilter",
    "projectTaskSort",
    "taskBreakdownModal",
    "taskBreakdownTitle",
    "taskBreakdownBody",
    "closeTaskBreakdownBtn",
    "warrantyProjectCount",
    "warrantyCompleteCount",
    "warrantyOpenDeficiencyCount",
    "warrantyProjectsBody",
    "warrantyAdminProject",
    "warrantyAdminCustomer",
    "warrantyAdminStarted",
    "warrantyNewHomeStartDate",
    "warrantyPaperworkSent",
    "warrantyDeficiencyProject",
    "warrantyDeficiencyText",
    "warrantyDeficiencyAssignedTo",
    "warrantyDeficiencyPhoto",
    "warrantyDeficiencyNotes",
    "addWarrantyDeficiencyBtn",
    "printDeficiencyListBtn",
    "warrantyDeficienciesBody",
    "warrantyPrintHeader",
    "crmNoteInput",
    "crmNotes",
    "addTaskBtn",
    "addNoteBtn",
    "newLeadBtn",
    "saveLeadBtn",
    "startEstimateBtn",
    "scheduleStartDate",
    "scheduleOwner",
    "scheduleScope",
    "scheduleTradeFilter",
    "applyScheduleTemplateBtn",
    "scheduleBody",
    "scheduleNextMilestone",
    "scheduleNextDate",
    "scheduleOpenItems",
    "scheduleCompletedItems",
    "scheduleUpcoming",
    "scheduleEditor",
    "closeScheduleEditorBtn",
    "scheduleDayPopup",
    "scheduleDayPopupTitle",
    "scheduleDayPopupItems",
    "closeScheduleDayPopupBtn",
    "scheduleCalendar",
    "scheduleCalendarTitle",
    "scheduleCalendarSubtitle",
    "schedulePrevMonthBtn",
    "scheduleNextMonthBtn",
    "scheduleTodayBtn",
    "scheduleEditName",
    "scheduleEditProjectName",
    "scheduleEditDepartment",
    "scheduleEditTrade",
    "scheduleEditSubtrade",
    "scheduleEditPurchaseOrder",
    "scheduleEditDate",
    "scheduleEditEndDate",
    "scheduleEditStatus",
    "scheduleEditNotes",
    "addScheduleItemBtn",
    "deleteScheduleItemBtn",
    "selectionTotal",
    "selectionNeeded",
    "selectionSelected",
    "selectionApproved",
    "selectionCategoryTabs",
    "selectionFormHeader",
    "selectionFormFields",
    "selectionSearch",
    "selectionCategoryFilter",
    "selectionsBody",
    "allowanceTotal",
    "allowanceActualTotal",
    "allowanceVarianceTotal",
    "allowancesBody",
    "billingStageCount",
    "billingStageAmountTotal",
    "billingStagePaidTotal",
    "billingReportReadyTotal",
    "billingReportOutstandingTotal",
    "billingReportPaidTotal",
    "billingReportUpcomingTotal",
    "billingReportFilter",
    "billingReportBody",
    "billingPrintArea",
    "printBillingReportBtn",
    "jobFileCount",
    "jobPhotoCount",
    "jobFileTotalSize",
    "jobFileProject",
    "jobFileInput",
    "jobFileDescription",
    "addJobFilesBtn",
    "jobFileUploadNote",
    "jobFilesList",
    "jobFilePreviewModal",
    "jobFilePreviewTitle",
    "jobFilePreviewDownload",
    "jobFilePreviewBody",
    "closeJobFilePreviewBtn",
    "vendorCount",
    "subtradeCount",
    "materialVendorCount",
    "vendorCompany",
    "vendorType",
    "vendorTrade",
    "vendorContact",
    "vendorPhone",
    "vendorEmail",
    "vendorStatus",
    "vendorNotes",
    "addVendorBtn",
    "vendorSearch",
    "vendorTradeFilter",
    "vendorsBody",
    "vendorCompanyOptions",
    "purchaseOrderCount",
    "purchaseOrderOpenTotal",
    "purchaseOrderIssuedTotal",
    "purchaseOrderProjectFilter",
    "purchaseOrderVendor",
    "purchaseOrderTrade",
    "purchaseOrderAmount",
    "purchaseOrderNeededDate",
    "purchaseOrderStatus",
    "purchaseOrderNotes",
    "addPurchaseOrderBtn",
    "printPurchaseOrderBtn",
    "purchaseOrderOverviewLabel",
    "purchaseOrdersBody",
    "purchaseOrderPrintArea",
    "changeOrderCount",
    "changeOrderPendingTotal",
    "changeOrderApprovedTotal",
    "changeOrderTitle",
    "changeOrderRequestedBy",
    "changeOrderAmount",
    "changeOrderDate",
    "changeOrderStatus",
    "changeOrderDescription",
    "addChangeOrderBtn",
    "changeOrdersBody",
    "reviewTotals",
    "reviewSections",
    "reviewWarnings",
    "mgmtTotalLeads",
    "mgmtOpenLeads",
    "mgmtWonLeads",
    "mgmtPipelineValue",
    "mgmtSalesStats",
    "mgmtSalespeopleStats",
    "mgmtKeyMetrics",
    "managementBreakdownModal",
    "managementBreakdownTitle",
    "managementBreakdownBody",
    "closeManagementBreakdownBtn",
    "viewTitle",
  ].forEach((id) => (els[id] = byId(id)));

  state.library = await fetch("./estimate_library_extract.json").then((response) => response.json());
  loadCrmRecords();
  loadVendors();
  loadAuthSession();
  hydrateBlankEstimate();

  for (const section of state.library.sections) {
    const option = document.createElement("option");
    option.value = section.section_name;
    option.textContent = section.section_name;
    els.sectionFilter.appendChild(option);
  }
  if (state.crm.records.length) {
    applyCrmRecord(state.crm.records[0]);
  }
  renderAuth();

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelectorAll("[data-nav-group-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = document.querySelector(`[data-nav-group="${button.dataset.navGroupToggle}"]`);
      if (!group || !group.classList.contains("collapsed")) {
        group?.classList.add("collapsed");
        button.setAttribute("aria-expanded", "false");
        return;
      }
      setOpenNavGroup(button.dataset.navGroupToggle);
    });
  });
  els.loginForm.addEventListener("submit", handleLogin);
  els.logoutBtn.addEventListener("click", logout);
  els.accountMenuBtn.addEventListener("click", () => toggleAccountPanel());
  els.closeAccountPanelBtn.addEventListener("click", () => toggleAccountPanel(false));
  document.addEventListener("input", (event) => {
    if ([els.accountName, els.accountEmail, els.accountPhone].includes(event.target)) {
      handleAccountEdit();
      return;
    }
    if (event.target.closest("[data-rate-pick]")) {
      handleRatePick(event);
      return;
    }
    if (event.target.closest("[data-allowance]")) {
      handleAllowanceEdit(event);
      return;
    }
    if (event.target.closest("[data-purchase-order]")) {
      handlePurchaseOrderEdit(event);
      return;
    }
    if (event.target === els.purchaseOrderVendor) {
      applyPurchaseOrderVendorTrade();
      return;
    }
    if (event.target === els.purchaseOrderProjectFilter) {
      switchPurchaseOrderProjectFilter(event.target.value);
      return;
    }
    if (event.target.closest("[data-change-order]")) {
      handleChangeOrderEdit(event);
      return;
    }
    if (event.target.closest("[data-job-file]")) {
      handleJobFileEdit(event);
      return;
    }
    if (event.target.closest("[data-calculator]")) {
      handleCalcEdit(event);
      return;
    }
    if (event.target.closest("[data-selection]")) {
      handleSelectionEdit(event);
      return;
    }
    if (event.target.closest("[data-project-task]")) {
      return;
    }
    if (event.target.closest("[data-billing-stage]")) {
      handleBillingStageEdit(event);
      return;
    }
    if (event.target === els.billingReportFilter) {
      renderBillingReport();
      return;
    }
    if (event.target.closest("[data-select-warranty-project]")) {
      handleWarrantyProjectEdit(event);
      return;
    }
    if (event.target === els.warrantyNewHomeStartDate || event.target === els.warrantyPaperworkSent) {
      handleWarrantyAdminEdit(event);
      return;
    }
    if (event.target.closest("[data-warranty-deficiency]")) {
      handleWarrantyDeficiencyEdit(event);
      return;
    }
    if (event.target.dataset.outputDescription || event.target.closest(".output-tools")) {
      handleOutputEdit(event);
      return;
    }
    if (event.target.closest(".contract-tools")) {
      handleContractEdit(event);
      return;
    }
    if (
      event.target.closest("[data-schedule-item]") ||
      [els.scheduleStartDate, els.scheduleOwner, els.scheduleScope, els.scheduleTradeFilter].includes(event.target)
    ) {
      handleScheduleEdit(event);
      return;
    }
    if (
      [
        els.scheduleEditProjectName,
        els.scheduleEditName,
        els.scheduleEditDepartment,
        els.scheduleEditTrade,
        els.scheduleEditSubtrade,
        els.scheduleEditPurchaseOrder,
        els.scheduleEditDate,
        els.scheduleEditEndDate,
        els.scheduleEditStatus,
        els.scheduleEditNotes,
      ].includes(event.target)
    ) {
      handleScheduleEditorEdit(event);
      return;
    }
    if (event.target.closest(".line-table")) {
      handleLineEdit(event);
      return;
    }
    if (event.target === els.targetMargin) {
      state.lines.forEach((line) => {
        line.margin = num(els.targetMargin.value, 18);
      });
      render();
      saveActiveCrmRecordEdits();
      return;
    }
    if ([els.houseSqft, els.garageSqft, els.travelDistance, els.pstRate, els.gstRate, els.searchInput, els.sectionFilter].includes(event.target)) {
      render();
    }
  });
  document.addEventListener("change", (event) => {
    if ([els.accountName, els.accountEmail, els.accountPhone].includes(event.target)) {
      handleAccountEdit();
      return;
    }
    if (event.target.closest("[data-rate-pick]")) {
      handleRatePick(event);
      return;
    }
    if (event.target.closest("[data-allowance]")) {
      handleAllowanceEdit(event);
      return;
    }
    if (event.target.closest("[data-purchase-order]")) {
      handlePurchaseOrderEdit(event);
      return;
    }
    if (event.target === els.purchaseOrderVendor) {
      applyPurchaseOrderVendorTrade();
      return;
    }
    if (event.target === els.purchaseOrderProjectFilter) {
      switchPurchaseOrderProjectFilter(event.target.value);
      return;
    }
    if (event.target.closest("[data-change-order]")) {
      handleChangeOrderEdit(event);
      return;
    }
    if (event.target.closest("[data-job-file]")) {
      handleJobFileEdit(event);
      return;
    }
    if (event.target.closest("[data-calculator]")) {
      handleCalcEdit(event);
      return;
    }
    if (event.target.closest("[data-selection]")) {
      handleSelectionEdit(event);
      return;
    }
    if (event.target.closest("[data-project-task]")) {
      return;
    }
    if (event.target.closest("[data-billing-stage]")) {
      handleBillingStageEdit(event);
      return;
    }
    if (event.target === els.billingReportFilter) {
      renderBillingReport();
      return;
    }
    if (event.target.closest("[data-select-warranty-project]")) {
      handleWarrantyProjectEdit(event);
      return;
    }
    if (event.target === els.warrantyNewHomeStartDate || event.target === els.warrantyPaperworkSent) {
      handleWarrantyAdminEdit(event);
      return;
    }
    if (event.target.closest("[data-warranty-deficiency-photo]")) {
      handleWarrantyDeficiencyPhoto(event);
      return;
    }
    if (event.target.closest("[data-warranty-deficiency]")) {
      handleWarrantyDeficiencyEdit(event);
      return;
    }
    if (event.target.dataset.outputDescription || event.target.closest(".output-tools")) {
      handleOutputEdit(event);
      return;
    }
    if (event.target.closest(".contract-tools")) {
      handleContractEdit(event);
      return;
    }
    if (
      event.target.closest("[data-schedule-item]") ||
      [els.scheduleStartDate, els.scheduleOwner, els.scheduleScope, els.scheduleTradeFilter].includes(event.target)
    ) {
      handleScheduleEdit(event);
      return;
    }
    if (
      [
        els.scheduleEditProjectName,
        els.scheduleEditName,
        els.scheduleEditDepartment,
        els.scheduleEditTrade,
        els.scheduleEditSubtrade,
        els.scheduleEditPurchaseOrder,
        els.scheduleEditDate,
        els.scheduleEditEndDate,
        els.scheduleEditStatus,
        els.scheduleEditNotes,
      ].includes(event.target)
    ) {
      handleScheduleEditorEdit(event);
      return;
    }
    if ([els.sectionFilter, els.projectType].includes(event.target)) render();
  });
  document.addEventListener("click", (event) => {
    if (state.auth.accountPanelOpen && !event.target.closest(".account-menu")) {
      toggleAccountPanel(false);
      return;
    }
    const resizeButton = event.target.closest("[data-schedule-resize]");
    if (resizeButton) {
      event.preventDefault();
      pickScheduleResizeEdge(resizeButton);
      return;
    }
    const calcButton = event.target.closest("[data-open-calc]");
    if (calcButton) {
      state.openCalcLineId = state.openCalcLineId === calcButton.dataset.openCalc ? null : calcButton.dataset.openCalc;
      render();
      return;
    }
    const applyButton = event.target.closest("[data-apply-calc]");
    if (applyButton) {
      const line = state.lines.find((item) => item.id === applyButton.dataset.applyCalc);
      if (line) {
        applyCalculator(line);
        state.openCalcLineId = null;
        render();
      }
      return;
    }
    const toggle = event.target.closest("[data-toggle-section]");
    if (toggle) {
      const section = toggle.dataset.toggleSection;
      state.expanded.has(section) ? state.expanded.delete(section) : state.expanded.add(section);
      renderSections();
      return;
    }
    const markSentButton = event.target.closest("[data-mark-estimate-sent]");
    if (markSentButton) {
      markEstimateVersionSent(markSentButton.dataset.markEstimateSent);
      return;
    }
    const loadVersionButton = event.target.closest("[data-load-estimate-version]");
    if (loadVersionButton) {
      loadEstimateVersion(loadVersionButton.dataset.loadEstimateVersion);
      return;
    }
    const renameVersionButton = event.target.closest("[data-rename-estimate-version]");
    if (renameVersionButton) {
      renameEstimateVersion(renameVersionButton.dataset.renameEstimateVersion);
      return;
    }
    const openVersionButton = event.target.closest("[data-open-estimate-version]");
    if (openVersionButton) {
      openEstimateVersion(openVersionButton.dataset.openEstimateVersion);
      return;
    }
    if (event.target.closest("[data-close-estimate-version]")) {
      closeEstimateVersion();
      return;
    }
    const deleteScopeItemButton = event.target.closest("[data-delete-output-scope-item]");
    if (deleteScopeItemButton) {
      deleteOutputScopeItem(deleteScopeItemButton.dataset.deleteOutputScopeItem);
      return;
    }
    const printBillingInvoiceButton = event.target.closest("[data-print-billing-invoice]");
    if (printBillingInvoiceButton) {
      printBillingInvoice(printBillingInvoiceButton.dataset.printBillingInvoice);
      return;
    }
    const purchaseOrderFilterButton = event.target.closest("[data-purchase-order-filter]");
    if (purchaseOrderFilterButton) {
      state.purchaseOrderFilter = purchaseOrderFilterButton.dataset.purchaseOrderFilter || "all";
      renderPurchaseOrders();
      return;
    }
    const printPurchaseOrderButton = event.target.closest("[data-print-purchase-order]");
    if (printPurchaseOrderButton) {
      printPurchaseOrder(printPurchaseOrderButton.dataset.printPurchaseOrder, printPurchaseOrderButton.dataset.purchaseOrderProject);
      return;
    }
    const deleteFileButton = event.target.closest("[data-delete-job-file]");
    if (deleteFileButton) {
      const row = deleteFileButton.closest("[data-job-file]");
      deleteJobFile(deleteFileButton.dataset.deleteJobFile, row?.dataset.jobFileProject);
      return;
    }
    const deleteVendorButton = event.target.closest("[data-delete-vendor]");
    if (deleteVendorButton) {
      deleteVendor(deleteVendorButton.dataset.deleteVendor);
      return;
    }
    const selectVendorRow = event.target.closest("[data-select-vendor]");
    if (selectVendorRow) {
      selectVendor(selectVendorRow.dataset.selectVendor);
      return;
    }
    const selectPurchaseOrderRow = event.target.closest("[data-select-purchase-order]");
    if (selectPurchaseOrderRow) {
      selectPurchaseOrderFromProject(selectPurchaseOrderRow.dataset.selectPurchaseOrder, selectPurchaseOrderRow.dataset.purchaseOrderProject);
      return;
    }
    const selectChangeOrderRow = event.target.closest("[data-select-change-order]");
    if (selectChangeOrderRow) {
      selectChangeOrder(selectChangeOrderRow.dataset.selectChangeOrder);
      return;
    }
    const selectProjectTaskRow = event.target.closest("[data-select-project-task]");
    if (selectProjectTaskRow) {
      selectProjectTask(selectProjectTaskRow.dataset.projectTaskProject, selectProjectTaskRow.dataset.selectProjectTask);
      return;
    }
    const selectWarrantyProjectRow = event.target.closest("[data-select-warranty-project]");
    if (selectWarrantyProjectRow && !event.target.closest("input, textarea, select")) {
      state.warranty.selectedProjectId = selectWarrantyProjectRow.dataset.selectWarrantyProject;
      renderWarranty();
      return;
    }
    const previewWarrantyPhotoButton = event.target.closest("[data-preview-warranty-photo]");
    if (previewWarrantyPhotoButton) {
      event.preventDefault();
      openWarrantyPhotoPreview(previewWarrantyPhotoButton.dataset.previewWarrantyPhoto);
      return;
    }
    const deleteWarrantyDeficiencyButton = event.target.closest("[data-delete-warranty-deficiency]");
    if (deleteWarrantyDeficiencyButton) {
      deleteWarrantyDeficiency(deleteWarrantyDeficiencyButton.dataset.deleteWarrantyDeficiency);
      return;
    }
    const previewFileButton = event.target.closest("[data-preview-job-file]");
    if (previewFileButton) {
      event.preventDefault();
      openJobFilePreview(previewFileButton.dataset.previewJobFile, previewFileButton.dataset.jobFileProject);
      return;
    }
    const previewSelectionPhotoButton = event.target.closest("[data-preview-selection-photo]");
    if (previewSelectionPhotoButton) {
      event.preventDefault();
      openSelectionPhotoPreview(previewSelectionPhotoButton.dataset.previewSelectionPhoto);
      return;
    }
    const removeSelectionPhotoButton = event.target.closest("[data-remove-selection-photo]");
    if (removeSelectionPhotoButton) {
      event.preventDefault();
      removeSelectionPhoto(removeSelectionPhotoButton.dataset.removeSelectionPhoto);
      return;
    }
    if (event.target.closest("[data-close-job-file-preview]")) {
      closeJobFilePreview();
      return;
    }
    const managementSummary = event.target.closest("[data-management-breakdown]");
    if (managementSummary) {
      state.managementBreakdown = { type: managementSummary.dataset.managementBreakdown };
      renderManagementBreakdown();
      return;
    }
    const managementStatus = event.target.closest("[data-management-status]");
    if (managementStatus) {
      state.managementBreakdown = { type: "status", status: managementStatus.dataset.managementStatus };
      renderManagementBreakdown();
      return;
    }
    const taskSummary = event.target.closest("[data-task-breakdown]");
    if (taskSummary) {
      state.taskBreakdown = taskSummary.dataset.taskBreakdown;
      renderTaskBreakdown();
      return;
    }
    if (event.target.closest("[data-close-task-breakdown]")) {
      state.taskBreakdown = null;
      renderTaskBreakdown();
      return;
    }
    if (event.target.closest("[data-close-management-breakdown]")) {
      state.managementBreakdown = null;
      renderManagementBreakdown();
      return;
    }
    if (state.schedule.moveDrag || state.schedule.resizeDrag) {
      event.preventDefault();
      return;
    }
    if (event.target.closest("[data-schedule-resize]")) return;
    const scheduleEvent = event.target.closest("[data-schedule-event]");
    if (scheduleEvent) {
      event.preventDefault();
      state.schedule.dayPopupDate = "";
      const projectId = scheduleEvent.dataset.scheduleProject;
      if (projectId && projectId !== "current" && projectId !== state.crm.activeRecordId) {
        const record = state.crm.records.find((item) => item.id === projectId);
        if (record) {
          applyCrmRecord(record);
          state.schedule.selectedItemId = scheduleEvent.dataset.scheduleEvent;
          state.schedule.scope = "all";
          state.schedule.editorOpen = true;
          renderSchedule();
        }
        return;
      }
      state.schedule.selectedItemId = scheduleEvent.dataset.scheduleEvent;
      state.schedule.editorOpen = true;
      renderSchedule();
      return;
    }
    const calendarMore = event.target.closest("[data-calendar-more]");
    if (calendarMore) {
      event.preventDefault();
      state.schedule.dayPopupDate = calendarMore.dataset.calendarMore;
      state.schedule.editorOpen = false;
      renderSchedule();
      return;
    }
    const selectionCategoryButton = event.target.closest("[data-selection-category]");
    if (selectionCategoryButton) {
      state.activeSelectionCategory = selectionCategoryButton.dataset.selectionCategory;
      els.selectionCategoryFilter.value = state.activeSelectionCategory;
      renderSelections();
      return;
    }
    const calendarDate = event.target.closest("[data-calendar-date]");
    if (calendarDate) {
      if (applyPendingScheduleResize(calendarDate.dataset.calendarDate)) return;
      selectScheduleDate(calendarDate.dataset.calendarDate);
      return;
    }
    const leadCard = event.target.closest("[data-record-id]");
    if (leadCard) {
      const record = state.crm.records.find((item) => item.id === leadCard.dataset.recordId);
      if (record) applyCrmRecord(record);
      return;
    }
    const deleteCrmTaskButton = event.target.closest("[data-delete-crm-task]");
    if (deleteCrmTaskButton) {
      deleteCrmTask(num(deleteCrmTaskButton.dataset.deleteCrmTask));
      return;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.openJobFilePreviewId) closeJobFilePreview();
  });
  document.addEventListener("pointerdown", beginScheduleResize);
  document.addEventListener("pointerdown", beginScheduleMove);
  document.addEventListener("pointermove", (event) => {
    updateScheduleResize(event);
    updateScheduleMove(event);
  });
  document.addEventListener("pointerup", (event) => {
    finishScheduleResize(event);
    finishScheduleMove(event);
  });
  document.addEventListener("pointercancel", (event) => {
    finishScheduleResize(event);
    finishScheduleMove(event);
  });
  document.addEventListener("mousedown", (event) => {
    if (!beginScheduleResize(event)) beginScheduleMove(event);
  });
  document.addEventListener("mousemove", (event) => {
    updateScheduleResize(event);
    updateScheduleMove(event);
  });
  document.addEventListener("mouseup", (event) => {
    finishScheduleResize(event);
    finishScheduleMove(event);
  });
  document.addEventListener("dblclick", (event) => {
    if (event.target.closest("[data-schedule-event]")) return;
    const calendarDate = event.target.closest("[data-calendar-date]");
    if (calendarDate) {
      createScheduleItemOnDate(calendarDate.dataset.calendarDate);
    }
  });
  document.addEventListener("dragstart", (event) => {
    if (handleScheduleDragStart(event)) return;
    handleCrmDragStart(event);
  });
  document.addEventListener("dragend", (event) => {
    event.target.closest("[data-schedule-event]")?.classList.remove("dragging");
    handleCrmDragEnd(event);
  });
  document.addEventListener("dragover", (event) => {
    const calendarTarget = event.target.closest("[data-calendar-week], [data-calendar-date]");
    if (calendarTarget && Array.from(event.dataTransfer.types).includes("application/zaks-schedule")) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      highlightCalendarDropDay(event);
      return;
    }
    const lane = event.target.closest("[data-crm-lane]");
    if (!lane) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    lane.classList.add("drag-over");
  });
  document.addEventListener("dragleave", (event) => {
    const calendarWeek = event.target.closest("[data-calendar-week]");
    if (calendarWeek && !calendarWeek.contains(event.relatedTarget)) {
      document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
      return;
    }
    const lane = event.target.closest("[data-crm-lane]");
    if (!lane || lane.contains(event.relatedTarget)) return;
    lane.classList.remove("drag-over");
  });
  document.addEventListener("drop", (event) => {
    document.querySelectorAll("[data-calendar-date]").forEach((day) => day.classList.remove("drag-over"));
    if (handleScheduleDrop(event)) return;
    handleCrmDrop(event);
  });
  els.distanceLookupBtn.addEventListener("click", lookupDistance);
  els.saveEstimateVersionBtn.addEventListener("click", saveEstimateVersion);
  els.closeEstimateVersionBtn.addEventListener("click", closeEstimateVersion);
  els.printContractBtn.addEventListener("click", printApprovedContract);
  els.approveContractBtn.addEventListener("click", approveContract);
  els.revokeContractApprovalBtn.addEventListener("click", revokeContractApproval);
  els.closeManagementBreakdownBtn.addEventListener("click", () => {
    state.managementBreakdown = null;
    renderManagementBreakdown();
  });
  els.closeTaskBreakdownBtn.addEventListener("click", () => {
    state.taskBreakdown = null;
    renderTaskBreakdown();
  });
  els.printOutputBtn.addEventListener("click", () => window.print());
  els.addOutputScopeItemBtn.addEventListener("click", addOutputScopeItem);
  els.printBillingReportBtn.addEventListener("click", printBillingReport);
  els.printPurchaseOrderBtn.addEventListener("click", () => printPurchaseOrder());
  els.saveLeadBtn.addEventListener("click", saveCrmRecord);
  els.newLeadBtn.addEventListener("click", newCrmLead);
  els.startEstimateBtn.addEventListener("click", startEstimateForLead);
  els.applyScheduleTemplateBtn.addEventListener("click", applyScheduleTemplate);
  els.schedulePrevMonthBtn.addEventListener("click", () => {
    state.schedule.calendarMonth = shiftMonth(state.schedule.calendarMonth, -1);
    renderSchedule();
  });
  els.scheduleNextMonthBtn.addEventListener("click", () => {
    state.schedule.calendarMonth = shiftMonth(state.schedule.calendarMonth, 1);
    renderSchedule();
  });
  els.scheduleTodayBtn.addEventListener("click", () => {
    state.schedule.calendarMonth = monthKey();
    renderSchedule();
  });
  els.addScheduleItemBtn.addEventListener("click", addScheduleItem);
  els.deleteScheduleItemBtn.addEventListener("click", deleteSelectedScheduleItem);
  els.closeScheduleEditorBtn.addEventListener("click", () => {
    state.schedule.editorOpen = false;
    renderSchedule();
  });
  els.closeScheduleDayPopupBtn.addEventListener("click", () => {
    state.schedule.dayPopupDate = "";
    renderSchedule();
  });
  els.selectionSearch.addEventListener("input", renderSelections);
  els.selectionCategoryFilter.addEventListener("change", () => {
    if (els.selectionCategoryFilter.value !== "All categories") {
      state.activeSelectionCategory = els.selectionCategoryFilter.value;
    }
    renderSelections();
  });
  els.crmRecordSelect.addEventListener("change", () => {
    const record = state.crm.records.find((item) => item.id === els.crmRecordSelect.value);
    if (record) applyCrmRecord(record);
  });
  els.estimateProjectSelect.addEventListener("change", () => {
    switchEstimateProject(els.estimateProjectSelect.value);
  });
  els.crmLeadTitle.addEventListener("input", () => {
    els.projectName.value = els.crmLeadTitle.value;
    renderCrm();
    renderEstimateOutput();
    renderContract();
    saveActiveCrmRecordEdits({ refreshCrm: true });
  });
  els.crmCustomerNameInput.addEventListener("input", () => {
    els.customerName.value = els.crmCustomerNameInput.value;
    renderCrm();
    renderEstimateOutput();
    renderContract();
    saveActiveCrmRecordEdits({ refreshCrm: true });
  });
  els.addTaskBtn.addEventListener("click", addCrmTask);
  els.addProjectTaskBtn.addEventListener("click", addProjectTask);
  els.addVendorBtn.addEventListener("click", addVendor);
  els.vendorSearch.addEventListener("input", renderVendors);
  els.vendorTradeFilter.addEventListener("change", renderVendors);
  els.addPurchaseOrderBtn.addEventListener("click", addPurchaseOrder);
  els.addChangeOrderBtn.addEventListener("click", addChangeOrder);
  els.addJobFilesBtn.addEventListener("click", addJobFiles);
  els.addWarrantyDeficiencyBtn.addEventListener("click", addWarrantyDeficiency);
  els.printDeficiencyListBtn.addEventListener("click", printDeficiencyList);
  els.warrantyDeficiencyProject.addEventListener("change", () => {
    state.warranty.selectedProjectId = els.warrantyDeficiencyProject.value;
    renderWarranty();
  });
  els.closeJobFilePreviewBtn.addEventListener("click", closeJobFilePreview);
  els.projectTaskProjectSelect.addEventListener("change", () => {
    if (state.selectedProjectTask?.projectId !== els.projectTaskProjectSelect.value) {
      state.selectedProjectTask = null;
      els.addProjectTaskBtn.textContent = "Add task";
    }
  });
  els.projectTaskListProjectSelect.addEventListener("change", () => {
    state.taskFilters.projectId = els.projectTaskListProjectSelect.value;
    if (state.taskFilters.projectId !== "all") switchTaskProject(state.taskFilters.projectId);
    else renderProjectTasks();
  });
  els.projectTaskOwnerFilter.addEventListener("change", () => {
    state.taskFilters.owner = els.projectTaskOwnerFilter.value;
    renderProjectTasks();
  });
  els.projectTaskSort.addEventListener("change", () => {
    state.taskFilters.sort = els.projectTaskSort.value;
    renderProjectTasks();
  });
  els.addNoteBtn.addEventListener("click", addCrmNote);
  [
    els.crmStatus,
    els.crmOwner,
    els.crmFollowupDate,
    els.crmPhone,
    els.crmEmail,
    els.crmLeadSource,
    els.crmSalesperson,
    els.crmInterestedModels,
    els.crmProjectAddress,
  ].forEach((el) => {
    el.addEventListener("input", () => {
      renderCrm();
      renderEstimateOutput();
      saveActiveCrmRecordEdits();
    });
    el.addEventListener("change", () => {
      renderCrm();
      renderEstimateOutput();
      saveActiveCrmRecordEdits({ refreshCrm: true });
    });
  });
  els.crmTasks.addEventListener("change", (event) => {
    if (event.target.dataset.taskIndex === undefined) return;
    state.crm.tasks[num(event.target.dataset.taskIndex)].done = event.target.checked;
    state.crm.tasks[num(event.target.dataset.taskIndex)].status = event.target.checked ? "Complete" : "Open";
    renderCrm();
    renderProjectTasks();
    saveActiveCrmRecordEdits();
  });
  ["projectName", "customerName", "projectType", "projectLevel", "houseSqft", "garageSqft", "travelDistance", "destinationTown", "destinationProvince"].forEach((id) =>
    ["input", "change"].forEach((eventName) =>
      byId(id).addEventListener(eventName, () => {
        render();
        renderEstimateOutput();
        renderContract();
        saveActiveCrmRecordEdits();
      }),
    ),
  );
  if (state.auth.currentUser) setView(state.view);
  else render();
}

init().catch((error) => {
  document.body.innerHTML = `<main class="view active"><h1>Prototype could not load</h1><p>${error.message}</p></main>`;
});
