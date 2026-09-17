/* ==========================================
   INTERACTIVE UNIT CONVERTER
========================================== */


/* ==========================================
   UNIT DATA
========================================== */

const units = {

    /* ---------- LENGTH ---------- */
    length: {
        meter: {
            name: "Meter (m)",
            factor: 1
        },

        kilometer: {
            name: "Kilometer (km)",
            factor: 1000
        },

        centimeter: {
            name: "Centimeter (cm)",
            factor: 0.01
        },

        millimeter: {
            name: "Millimeter (mm)",
            factor: 0.001
        },

        mile: {
            name: "Mile (mi)",
            factor: 1609.344
        },

        yard: {
            name: "Yard (yd)",
            factor: 0.9144
        },

        foot: {
            name: "Foot (ft)",
            factor: 0.3048
        },

        inch: {
            name: "Inch (in)",
            factor: 0.0254
        }
    },


    /* ---------- WEIGHT ---------- */
    weight: {
        kilogram: {
            name: "Kilogram (kg)",
            factor: 1
        },

        gram: {
            name: "Gram (g)",
            factor: 0.001
        },

        milligram: {
            name: "Milligram (mg)",
            factor: 0.000001
        },

        pound: {
            name: "Pound (lb)",
            factor: 0.45359237
        },

        ounce: {
            name: "Ounce (oz)",
            factor: 0.028349523125
        },

        ton: {
            name: "Metric Ton (t)",
            factor: 1000
        }
    },


    /* ---------- TEMPERATURE ---------- */
    temperature: {
        celsius: {
            name: "Celsius (°C)"
        },

        fahrenheit: {
            name: "Fahrenheit (°F)"
        },

        kelvin: {
            name: "Kelvin (K)"
        }
    },


    /* ---------- SPEED ---------- */
    speed: {
        meterPerSecond: {
            name: "Meter/Second (m/s)",
            factor: 1
        },

        kilometerPerHour: {
            name: "Kilometer/Hour (km/h)",
            factor: 0.2777777778
        },

        milePerHour: {
            name: "Mile/Hour (mph)",
            factor: 0.44704
        },

        footPerSecond: {
            name: "Foot/Second (ft/s)",
            factor: 0.3048
        },

        knot: {
            name: "Knot",
            factor: 0.5144444444
        }
    },


    /* ---------- AREA ---------- */
    area: {
        squareMeter: {
            name: "Square Meter (m²)",
            factor: 1
        },

        squareKilometer: {
            name: "Square Kilometer (km²)",
            factor: 1000000
        },

        squareCentimeter: {
            name: "Square Centimeter (cm²)",
            factor: 0.0001
        },

        squareFoot: {
            name: "Square Foot (ft²)",
            factor: 0.09290304
        },

        squareInch: {
            name: "Square Inch (in²)",
            factor: 0.00064516
        },

        acre: {
            name: "Acre",
            factor: 4046.8564224
        },

        hectare: {
            name: "Hectare",
            factor: 10000
        }
    },


    /* ---------- TIME ---------- */
    time: {
        second: {
            name: "Second",
            factor: 1
        },

        millisecond: {
            name: "Millisecond",
            factor: 0.001
        },

        minute: {
            name: "Minute",
            factor: 60
        },

        hour: {
            name: "Hour",
            factor: 3600
        },

        day: {
            name: "Day",
            factor: 86400
        },

        week: {
            name: "Week",
            factor: 604800
        }
    }
};


/* ==========================================
   DOM ELEMENTS
========================================== */

const categorySelect = document.getElementById("category");
const fromUnitSelect = document.getElementById("fromUnit");
const toUnitSelect = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");

const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");


/* ==========================================
   LOAD UNITS
========================================== */

function loadUnits() {

    const category = categorySelect.value;

    const categoryUnits = units[category];

    fromUnitSelect.innerHTML = "";
    toUnitSelect.innerHTML = "";

    Object.keys(categoryUnits).forEach((unitKey) => {

        const unit = categoryUnits[unitKey];

        const optionFrom = document.createElement("option");

        optionFrom.value = unitKey;
        optionFrom.textContent = unit.name;

        fromUnitSelect.appendChild(optionFrom);


        const optionTo = document.createElement("option");

        optionTo.value = unitKey;
        optionTo.textContent = unit.name;

        toUnitSelect.appendChild(optionTo);
    });


    /* Default destination unit */
    if (toUnitSelect.options.length > 1) {
        toUnitSelect.selectedIndex = 1;
    }

    clearResult();
}


/* ==========================================
   TEMPERATURE CONVERSION
========================================== */

function convertTemperature(value, from, to) {

    let celsius;


    /* Convert FROM to Celsius */

    if (from === "celsius") {

        celsius = value;

    } else if (from === "fahrenheit") {

        celsius = (value - 32) * 5 / 9;

    } else if (from === "kelvin") {

        celsius = value - 273.15;
    }


    /* Convert Celsius TO destination */

    if (to === "celsius") {

        return celsius;

    } else if (to === "fahrenheit") {

        return (celsius * 9 / 5) + 32;

    } else if (to === "kelvin") {

        return celsius + 273.15;
    }
}


/* ==========================================
   GENERAL CONVERSION
========================================== */

function convertUnits(value, from, to, category) {

    /* Temperature has different formulas */

    if (category === "temperature") {

        return convertTemperature(value, from, to);
    }


    /* Same unit */

    if (from === to) {

        return value;
    }


    const fromFactor = units[category][from].factor;

    const toFactor = units[category][to].factor;


    /* Convert to base unit first */

    const baseValue = value * fromFactor;


    /* Convert base unit to target unit */

    return baseValue / toFactor;
}


/* ==========================================
   FORMAT RESULT
========================================== */

function formatResult(value) {

    if (!Number.isFinite(value)) {
        return "Invalid result";
    }


    if (Math.abs(value) < 0.000001 && value !== 0) {

        return value.toExponential(6);
    }


    return Number(value.toFixed(10)).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 10
        }
    );
}


/* ==========================================
   VALIDATE INPUT
========================================== */

function validateInput() {

    const value = inputValue.value.trim();


    if (value === "") {

        showError("Please enter a value.");

        return null;
    }


    const number = Number(value);


    if (!Number.isFinite(number)) {

        showError("Please enter a valid number.");

        return null;
    }


    /* Kelvin cannot be below absolute zero */

    if (
        categorySelect.value === "temperature" &&
        fromUnitSelect.value === "kelvin" &&
        number < 0
    ) {

        showError("Kelvin cannot be less than 0 K.");

        return null;
    }


    /* Celsius cannot be below absolute zero */

    if (
        categorySelect.value === "temperature" &&
        fromUnitSelect.value === "celsius" &&
        number < -273.15
    ) {

        showError(
            "Celsius cannot be below -273.15 °C."
        );

        return null;
    }


    /* Fahrenheit cannot be below absolute zero */

    if (
        categorySelect.value === "temperature" &&
        fromUnitSelect.value === "fahrenheit" &&
        number < -459.67
    ) {

        showError(
            "Fahrenheit cannot be below -459.67 °F."
        );

        return null;
    }


    clearError();

    return number;
}


/* ==========================================
   CONVERT BUTTON
========================================== */

function performConversion() {

    const value = validateInput();


    if (value === null) {
        return;
    }


    const category = categorySelect.value;

    const from = fromUnitSelect.value;

    const to = toUnitSelect.value;


    const convertedValue = convertUnits(
        value,
        from,
        to,
        category
    );


    result.textContent = formatResult(convertedValue);
}


/* ==========================================
   CLEAR RESULT
========================================== */

function clearResult() {

    inputValue.value = "";

    result.textContent = "0";

    clearError();
}


/* ==========================================
   ERROR FUNCTIONS
========================================== */

function showError(message) {

    errorMessage.textContent = message;

    result.textContent = "0";
}


function clearError() {

    errorMessage.textContent = "";
}


/* ==========================================
   SWAP UNITS
========================================== */

function swapUnits() {

    const currentFrom = fromUnitSelect.value;

    const currentTo = toUnitSelect.value;


    fromUnitSelect.value = currentTo;

    toUnitSelect.value = currentFrom;


    if (inputValue.value.trim() !== "") {

        performConversion();
    }
}


/* ==========================================
   EVENT LISTENERS
========================================== */


/* Change category */

categorySelect.addEventListener(
    "change",
    loadUnits
);


/* Convert */

convertBtn.addEventListener(
    "click",
    performConversion
);


/* Clear */

clearBtn.addEventListener(
    "click",
    clearResult
);


/* Swap */

swapBtn.addEventListener(
    "click",
    swapUnits
);


/* Instant conversion while typing */

inputValue.addEventListener(
    "input",
    () => {

        if (inputValue.value.trim() === "") {

            result.textContent = "0";

            clearError();

            return;
        }

        performConversion();
    }
);


/* Change FROM unit */

fromUnitSelect.addEventListener(
    "change",
    () => {

        if (inputValue.value.trim() !== "") {

            performConversion();
        }
    }
);


/* Change TO unit */

toUnitSelect.addEventListener(
    "change",
    () => {

        if (inputValue.value.trim() !== "") {

            performConversion();
        }
    }
);


/* Enter key */

inputValue.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            performConversion();
        }
    }
);


/* ==========================================
   INITIALIZE APPLICATION
========================================== */

loadUnits();