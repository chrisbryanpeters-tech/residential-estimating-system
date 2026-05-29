<?php
/**
 * Plugin Name: Zak's Barndominium Budget Calculator
 * Description: Adds a customer-facing barndominium budget calculator shortcode.
 * Version: 1.0.0
 * Author: Zak's Homes & Cottages
 * Text Domain: zaks-barndominium-calculator
 */

if (!defined('ABSPATH')) {
    exit;
}

function zaks_barndo_calculator_enqueue_assets() {
    $plugin_url = plugin_dir_url(__FILE__);
    $version = '1.0.0';

    wp_enqueue_style(
        'zaks-barndo-calculator',
        $plugin_url . 'assets/barndominium-budget-calculator.css',
        array(),
        $version
    );

    wp_enqueue_script(
        'zaks-barndo-calculator',
        $plugin_url . 'assets/barndominium-budget-calculator.js',
        array(),
        $version,
        true
    );
}

function zaks_barndo_budget_calculator_shortcode($atts = array()) {
    $atts = shortcode_atts(
        array(
            'contact_url' => 'https://zaksbuilding.com/contact/',
        ),
        $atts,
        'barndominium_budget_calculator'
    );

    zaks_barndo_calculator_enqueue_assets();

    $logo_url = plugin_dir_url(__FILE__) . 'assets/zaks-homes-cottages-logo.jpg';
    $contact_url = esc_url($atts['contact_url']);

    ob_start();
    ?>
    <section class="zaks-barndo-calculator" aria-label="Barndominium budget calculator">
        <header class="zaks-barndo-header">
            <a class="zaks-barndo-brand" href="https://zaksbuilding.com/" aria-label="Zak's Homes & Cottages">
                <img src="<?php echo esc_url($logo_url); ?>" alt="Zak's Homes & Cottages" />
            </a>
            <div>
                <p class="zaks-barndo-kicker">Planning tool</p>
                <h2>Barndominium Budget Calculator</h2>
                <p>
                    Get an early budget range for a shouse or barndominium by entering the home size,
                    shop size, finish levels, openings, and site assumptions.
                </p>
            </div>
        </header>

        <form class="zaks-barndo-form">
            <div class="zaks-barndo-section">
                <h3>Building Info</h3>
                <div class="zaks-barndo-field-grid">
                    <label>
                        Living area sq ft
                        <input data-barndo-field="livingSqft" type="number" min="0" value="3000" />
                    </label>
                    <label>
                        Shop / garage sq ft
                        <input data-barndo-field="shopSqft" type="number" min="0" value="3000" />
                    </label>
                    <label>
                        Covered porch sq ft
                        <input data-barndo-field="porchSqft" type="number" min="0" value="365" />
                    </label>
                    <label>
                        One-way distance km
                        <input data-barndo-field="distanceKm" type="number" min="0" value="250" />
                    </label>
                </div>
            </div>

            <div class="zaks-barndo-section">
                <h3>Finish Level</h3>
                <div class="zaks-barndo-field-grid">
                    <label>
                        Home finish
                        <select data-barndo-field="homeFinish">
                            <option value="Basic">Basic</option>
                            <option value="Mid" selected>Mid</option>
                            <option value="High">High</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </label>
                    <label>
                        Shop finish
                        <select data-barndo-field="shopFinish">
                            <option value="Basic">Basic</option>
                            <option value="Insulated">Insulated</option>
                            <option value="Finished" selected>Finished</option>
                        </select>
                    </label>
                    <label>
                        Exterior finish
                        <select data-barndo-field="exterior">
                            <option value="Metal" selected>Metal</option>
                            <option value="LP SmartSide">LP SmartSide</option>
                            <option value="Hardie">Hardie</option>
                            <option value="Stucco">Stucco</option>
                        </select>
                    </label>
                    <label>
                        Roof type
                        <select data-barndo-field="roof">
                            <option value="Metal" selected>Metal</option>
                            <option value="Asphalt">Asphalt</option>
                            <option value="Premium Metal">Premium Metal</option>
                        </select>
                    </label>
                    <label>
                        Foundation type
                        <select data-barndo-field="foundation">
                            <option value="Slab" selected>Slab</option>
                            <option value="Crawlspace">Crawlspace</option>
                            <option value="Basement">Basement</option>
                        </select>
                    </label>
                    <label>
                        Insulation
                        <select data-barndo-field="insulation">
                            <option value="Standard" selected>Standard</option>
                            <option value="Enhanced">Enhanced</option>
                            <option value="Spray Foam">Spray Foam</option>
                        </select>
                    </label>
                </div>
            </div>

            <div class="zaks-barndo-section">
                <h3>Openings</h3>
                <div class="zaks-barndo-field-grid">
                    <label>
                        Overhead doors
                        <input data-barndo-field="ohDoorQty" type="number" min="0" value="3" />
                    </label>
                    <label>
                        Man doors
                        <input data-barndo-field="manDoorQty" type="number" min="0" value="3" />
                    </label>
                    <label>
                        Windows
                        <input data-barndo-field="windowQty" type="number" min="0" value="25" />
                    </label>
                </div>
            </div>
        </form>

        <aside class="zaks-barndo-results" aria-live="polite">
            <div class="zaks-barndo-range">
                <span>Estimated retail</span>
                <strong data-barndo-output="retailAfterTax">$0</strong>
            </div>
            <p class="zaks-barndo-note">
                Budget pricing only. Final pricing depends on drawings, site conditions,
                supplier pricing, selections, and confirmed scope.
            </p>
            <a class="zaks-barndo-cta" href="<?php echo $contact_url; ?>">
                Request estimate
            </a>
        </aside>
    </section>
    <?php
    return ob_get_clean();
}

add_shortcode('barndominium_budget_calculator', 'zaks_barndo_budget_calculator_shortcode');
add_shortcode('barndo_budget_calculator', 'zaks_barndo_budget_calculator_shortcode');
