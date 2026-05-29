(function () {
  const money = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

  const rates = {
    homeShell: 130,
    homeFinish: {
      Basic: 65,
      Mid: 95,
      High: 135,
      Custom: 175,
    },
    shopShell: 65,
    shopFinish: {
      Basic: 15,
      Insulated: 35,
      Finished: 60,
    },
    porch: 85,
    exterior: {
      Metal: 0,
      "LP SmartSide": 18,
      Hardie: 26,
      Stucco: 30,
    },
    roof: {
      Metal: 0,
      Asphalt: -3,
      "Premium Metal": 9,
    },
    foundation: {
      Slab: 28,
      Crawlspace: 55,
      Basement: 95,
    },
    insulation: {
      Standard: 0,
      Enhanced: 9,
      "Spray Foam": 18,
    },
    openings: {
      overheadDoorSqft: 42,
      manDoorEach: 750,
      windowSqft: 75,
      interiorDoorEach: 325,
    },
    mobilizationKm: 150,
    engineeringAdminRate: 0.015,
    projectManagementRate: 0.02,
  };

  const defaults = {
    overheadDoorWidth: 16,
    overheadDoorHeight: 10,
    windowSqft: 16,
    interiorDoorQty: 16,
    septicAllowance: 0,
    utilityAllowance: 25000,
    contingencyRate: 0.03,
    marginRate: 0.18,
    taxRate: 0.11,
  };

  const num = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  function field(root, name) {
    return root.querySelector(`[data-barndo-field="${name}"]`);
  }

  function output(root, name) {
    return root.querySelector(`[data-barndo-output="${name}"]`);
  }

  function calculate(root) {
    const livingSqft = num(field(root, "livingSqft").value);
    const shopSqft = num(field(root, "shopSqft").value);
    const porchSqft = num(field(root, "porchSqft").value);
    const totalBuildingSqft = livingSqft + shopSqft;
    const totalCoveredSqft = livingSqft + shopSqft + porchSqft;
    const foundation = field(root, "foundation").value;
    const foundationRate = rates.foundation[foundation] || 0;
    const foundationQty = foundation === "Slab" ? totalBuildingSqft : livingSqft;

    const homeShell = livingSqft * rates.homeShell;
    const homeFinish = livingSqft * rates.homeFinish[field(root, "homeFinish").value];
    const shopShell = shopSqft * rates.shopShell;
    const shopFinish = shopSqft * rates.shopFinish[field(root, "shopFinish").value];
    const porchTotal = porchSqft * rates.porch;
    const foundationTotal = foundationQty * foundationRate;
    const exteriorUpgrade = totalBuildingSqft * rates.exterior[field(root, "exterior").value];
    const roofUpgrade = totalCoveredSqft * rates.roof[field(root, "roof").value];
    const insulationUpgrade = totalBuildingSqft * rates.insulation[field(root, "insulation").value];
    const upgradeTotal = exteriorUpgrade + roofUpgrade + insulationUpgrade;
    const overheadDoorArea = num(field(root, "ohDoorQty").value) * defaults.overheadDoorWidth * defaults.overheadDoorHeight;
    const windowArea = num(field(root, "windowQty").value) * defaults.windowSqft;
    const openingsTotal =
      overheadDoorArea * rates.openings.overheadDoorSqft +
      num(field(root, "manDoorQty").value) * rates.openings.manDoorEach +
      windowArea * rates.openings.windowSqft +
      defaults.interiorDoorQty * rates.openings.interiorDoorEach;
    const travelTotal = num(field(root, "distanceKm").value) * rates.mobilizationKm;
    const subtotalBeforeContingency =
      homeShell +
      homeFinish +
      shopShell +
      shopFinish +
      porchTotal +
      foundationTotal +
      upgradeTotal +
      openingsTotal +
      travelTotal +
      defaults.utilityAllowance +
      defaults.septicAllowance;
    const contingency = subtotalBeforeContingency * defaults.contingencyRate;
    const hardCostSubtotal = subtotalBeforeContingency + contingency;
    const engineeringAdmin = hardCostSubtotal * rates.engineeringAdminRate;
    const projectManagement = hardCostSubtotal * rates.projectManagementRate;
    const totalCostBeforeMargin = hardCostSubtotal + engineeringAdmin + projectManagement;
    const retailBeforeTax = totalCostBeforeMargin / (1 - defaults.marginRate);
    const retailAfterTax = retailBeforeTax * (1 + defaults.taxRate);

    output(root, "retailAfterTax").textContent = money.format(retailAfterTax);
  }

  function init(root) {
    root.querySelectorAll("[data-barndo-field]").forEach((input) => {
      input.addEventListener("input", () => calculate(root));
      input.addEventListener("change", () => calculate(root));
    });
    calculate(root);
  }

  function initAll() {
    document.querySelectorAll(".zaks-barndo-calculator").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
    return;
  }
  initAll();
})();
