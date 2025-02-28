if ("serviceWorker" in navigator) {
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    navigator.serviceWorker.register(`${baseUrl}/service-worker.js`)
        .then(registration => {
            console.log("Service Worker Registered", registration);
        })
        .catch(err => {
            console.log("Service Worker Registration Failed", err);
        });
}

// POH takeoff distance data (example values, replace with actual POH numbers)
const takeoffData_2300 = [
    { altitude: 0, temperatures: [0, 10, 20, 30, 40], groundRoll: [775, 835, 895, 960, 1030], totalDistance: [1380, 1475, 1575, 1685, 1795] },
    { altitude: 1000, temperatures: [0, 10, 20, 30, 40], groundRoll: [850, 915, 380, 1050, 1125], totalDistance: [1510, 1615, 1725, 1845, 1970] },
    { altitude: 2000, temperatures: [0, 10, 20, 30, 40], groundRoll: [930, 1000, 1075, 1155, 1235], totalDistance: [1650, 1770, 1895, 2030, 2170] },
    { altitude: 3000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1020, 1100, 1180, 1270, 1360], totalDistance: [1815, 1945, 2085, 2235, 2395] },
    { altitude: 4000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1125, 1210, 1300, 1395, 1495], totalDistance: [2000, 2145, 2305, 2475, 2655] },
    { altitude: 5000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1235, 1330, 1430, 1540, 1650], totalDistance: [2210, 2375, 2555, 2750, 2960] },
    { altitude: 6000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1365, 1470, 1580, 1700, 'N/A'], totalDistance: [2450, 2640, 2850, 3070, 'N/A'] },
    { altitude: 7000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1505, 1625, 1750, 'N/A', 'N/A'], totalDistance: [2730, 2955, 3190, 'N/A', 'N/A'] },
    { altitude: 8000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1665, 1800, 'N/A', 'N/A', 'N/A'], totalDistance: [3065, 3302, 'N/A', 'N/A', 'N/A'] }
];

const takeoffData_2100 = [
    { altitude: 0, temperatures:    [0, 10, 20, 30, 40], groundRoll: [630, 680, 725, 780, 835],      totalDistance: [1130, 1210, 1290, 1375, 1465] },
    { altitude: 1000, temperatures: [0, 10, 20, 30, 40], groundRoll: [690, 740, 795, 855, 915],      totalDistance: [1235, 1320, 1405, 1500, 1600] },
    { altitude: 2000, temperatures: [0, 10, 20, 30, 40], groundRoll: [755, 810, 870, 935, 1000],     totalDistance: [1350, 1440, 1540, 1645, 1755] },
    { altitude: 3000, temperatures: [0, 10, 20, 30, 40], groundRoll: [830, 890, 955, 1025, 1100],    totalDistance: [1475, 1580, 1690, 1805, 1930] },
    { altitude: 4000, temperatures: [0, 10, 20, 30, 40], groundRoll: [910, 980, 1050, 1125, 1210],   totalDistance: [1620, 1735, 1860, 1990, 2130] },
    { altitude: 5000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1000, 1075, 1155, 1240, 1330], totalDistance: [1780, 1910, 2050, 2195, 2355] },
    { altitude: 6000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1100, 1185, 1275, 1370, 1465], totalDistance: [1965, 2115, 2270, 2435, 2615] },
    { altitude: 7000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1215, 1305, 1405, 1510, 1620], totalDistance: [2180, 2345, 2520, 2715, 2920] },
    { altitude: 8000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1340, 1445, 1555, 1675, 1795], totalDistance: [2425, 2615, 2815, 3040, 3280] }
];

const takeoffData_1900 = [
    { altitude: 0,    temperatures: [0, 10, 20, 30, 40], groundRoll: [505, 540, 580, 620, 665],      totalDistance: [915, 975, 1035, 1105, 1175]    },
    { altitude: 1000, temperatures: [0, 10, 20, 30, 40], groundRoll: [550, 590, 635, 680, 725],      totalDistance: [995, 1060, 1130, 1205, 1280]   },
    { altitude: 2000, temperatures: [0, 10, 20, 30, 40], groundRoll: [600, 645, 695, 745, 795],      totalDistance: [1085, 1155, 1230, 1315, 1400]  },
    { altitude: 3000, temperatures: [0, 10, 20, 30, 40], groundRoll: [660, 710, 760, 815, 870],      totalDistance: [1180, 1260, 1345, 1435, 1530]  },
    { altitude: 4000, temperatures: [0, 10, 20, 30, 40], groundRoll: [725, 775, 835, 895, 955],      totalDistance: [1290, 1380, 1475, 1575, 1680]  },
    { altitude: 5000, temperatures: [0, 10, 20, 30, 40], groundRoll: [795, 855, 915, 985, 1055],     totalDistance: [1415, 1515, 1620, 1735, 1850]  },
    { altitude: 6000, temperatures: [0, 10, 20, 30, 40], groundRoll: [870, 940, 1010, 1080, 1160],   totalDistance: [1555, 1670, 1785, 1910, 2045]  },
    { altitude: 7000, temperatures: [0, 10, 20, 30, 40], groundRoll: [960, 1035, 1110, 1195, 1280],  totalDistance: [1715, 1840, 1975, 2115, 2265]  },
    { altitude: 8000, temperatures: [0, 10, 20, 30, 40], groundRoll: [1060, 1140, 1225, 1320, 1415], totalDistance: [1900, 2040, 2190, 2350, 2520]  }
];

const landingData_2300 = [
    { altitude: 0,    temperatures: [0, 10, 20, 30, 40], groundRoll: [495, 510, 530, 545, 565],      totalDistance: [1205, 1235, 1265, 1295, 1330]  },
    { altitude: 1000, temperatures: [0, 10, 20, 30, 40], groundRoll: [510, 530, 550, 565, 585],      totalDistance: [1235, 1265, 1300, 1330, 1365]  },
    { altitude: 2000, temperatures: [0, 10, 20, 30, 40], groundRoll: [530, 550, 570, 590, 610],      totalDistance: [1265, 1300, 1335, 1370, 1405]  },
    { altitude: 3000, temperatures: [0, 10, 20, 30, 40], groundRoll: [550, 570, 590, 610, 630],      totalDistance: [1300, 1335, 1370, 1405, 1440]  },
    { altitude: 4000, temperatures: [0, 10, 20, 30, 40], groundRoll: [570, 590, 615, 635, 655],      totalDistance: [1335, 1370, 1410, 1445, 1480]  },
    { altitude: 5000, temperatures: [0, 10, 20, 30, 40], groundRoll: [590, 615, 635, 655, 680],      totalDistance: [1370, 1415, 1450, 1485, 1525]  },
    { altitude: 6000, temperatures: [0, 10, 20, 30, 40], groundRoll: [615, 640, 660, 685, 705],      totalDistance: [1415, 1455, 1490, 1535, 1570]  },
    { altitude: 7000, temperatures: [0, 10, 20, 30, 40], groundRoll: [640, 660, 685, 710, 730],      totalDistance: [1455, 1495, 1535, 1575, 1615]  },
    { altitude: 8000, temperatures: [0, 10, 20, 30, 40], groundRoll: [665, 690, 710, 735, 760],      totalDistance: [1500, 1540, 1580, 1620, 1665]  }
];


// Bilinear interpolation function
function bilinearInterpolate(x1, x2, y1, y2, q11, q12, q21, q22, x, y) {
    let r1 = interpolate(x1, q11, x2, q21, x);
    let r2 = interpolate(x1, q12, x2, q22, x);
    return interpolate(y1, r1, y2, r2, y);
}

// Linear interpolation function
function interpolate(x1, y1, x2, y2, x) {
    return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
}

// Takeoff distance databases
const takeoffData = {
    2300: takeoffData_2300,
    2100: takeoffData_2100,
    1900: takeoffData_1900
};

const landingData = {
    2300: landingData_2300,
};

// Interpolate ground roll and total distance for each dataset
function getInterpolatedDistance(data, altitude, temperature) {
    let lowerAlt, upperAlt;

    for (let i = 0; i < data.length - 1; i++) {
        if (altitude >= data[i].altitude && altitude <= data[i + 1].altitude) {
            lowerAlt = data[i];
            upperAlt = data[i + 1];
            break;
        }
    }

    if (!lowerAlt || !upperAlt) {
        alert("Altitude out of range (0-8000 ft)");
        return;
    }

    let lowerTempIndex, upperTempIndex;
    for (let i = 0; i < lowerAlt.temperatures.length - 1; i++) {
        if (temperature >= lowerAlt.temperatures[i] && temperature <= lowerAlt.temperatures[i + 1]) {
            lowerTempIndex = i;
            upperTempIndex = i + 1;
            break;
        }
    }

    if (lowerTempIndex === undefined || upperTempIndex === undefined) {
        alert("Temperature out of range (0-40°C)");
        return;
    }

    let g11 = lowerAlt.groundRoll[lowerTempIndex];
    let g12 = lowerAlt.groundRoll[upperTempIndex];
    let g21 = upperAlt.groundRoll[lowerTempIndex];
    let g22 = upperAlt.groundRoll[upperTempIndex];

    let t11 = lowerAlt.totalDistance[lowerTempIndex];
    let t12 = lowerAlt.totalDistance[upperTempIndex];
    let t21 = upperAlt.totalDistance[lowerTempIndex];
    let t22 = upperAlt.totalDistance[upperTempIndex];

    let groundRoll = bilinearInterpolate(
        lowerAlt.altitude, upperAlt.altitude,
        lowerAlt.temperatures[lowerTempIndex], lowerAlt.temperatures[upperTempIndex],
        g11, g12, g21, g22, altitude, temperature
    );

    let totalDistance = bilinearInterpolate(
        lowerAlt.altitude, upperAlt.altitude,
        lowerAlt.temperatures[lowerTempIndex], lowerAlt.temperatures[upperTempIndex],
        t11, t12, t21, t22, altitude, temperature
    );

    return { groundRoll, totalDistance };
}

// Function to get interpolated takeoff data between two weight classes
function interpolateData(weight, altitude, temperature, type) {
    const data = type === "takeoff" ? takeoffData : landingData;

    let groundRoll, totalDistance;

    let lowerData, upperData;

    if (type === "takeoff") {
        let lowerWeight, upperWeight;
        const weights = [1900, 2100, 2300];
        // Find bounding weights
        for (let i = 0; i < weights.length - 1; i++) {
            if (weight >= weights[i] && weight <= weights[i + 1]) {
                lowerWeight = weights[i];
                upperWeight = weights[i + 1];
                break;
            }
        }

        if (!lowerWeight || !upperWeight) {
            alert("Weight out of range (1900-2300 lbs)");
            return;
        }

        // Retrieve data for the two closest weight categories
        lowerData = data[lowerWeight];
        upperData = data[upperWeight];

        let lowerResult = getInterpolatedDistance(lowerData, altitude, temperature);
        let upperResult = getInterpolatedDistance(upperData, altitude, temperature);

        // Final interpolation between weight categories
        groundRoll = interpolate(lowerWeight, lowerResult.groundRoll, upperWeight, upperResult.groundRoll, weight);
        totalDistance = interpolate(lowerWeight, lowerResult.totalDistance, upperWeight, upperResult.totalDistance, weight);
    } else {
        let result = getInterpolatedDistance(data[2300], altitude, temperature);
        upperData = data[2300];
        groundRoll = result.groundRoll;
        totalDistance = result.totalDistance;
    }

    return { groundRoll, totalDistance };
}

function formatAltimeterSetting(event) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 2) {
        value = value.slice(0, 2) + '.' + value.slice(2, 4); // Insert dot after the first two digits
    }
    event.target.value = value;
}

function calculatePressureAltitude() {
    const fieldElevation = parseFloat(document.getElementById("fieldElevation").value);
    const altimeterSetting = parseFloat(document.getElementById("altimeterSetting").value);

    if (!isNaN(fieldElevation) && !isNaN(altimeterSetting)) {
        const pressureAltitude = fieldElevation + (29.92 - altimeterSetting) * 1000;
        document.getElementById("pressureAltitude").value = Math.round(pressureAltitude);
    }
}

function calculate() {
    const fieldElevation = parseFloat(document.getElementById("fieldElevation").value);
    const altimeterSetting = parseFloat(document.getElementById("altimeterSetting").value); // New altimeter setting input
    const altitude = parseFloat(document.getElementById("pressureAltitude").value); // Use renamed pressure altitude field
    const temperature = parseFloat(document.getElementById("temperature").value);
    const weight = parseFloat(document.getElementById("weight").value); // New weight input
    const wind = parseFloat(document.getElementById("wind").value);
    const runway = document.getElementById("runway").value;

    if (isNaN(fieldElevation) || isNaN(altimeterSetting) || isNaN(altitude) || isNaN(temperature) || isNaN(weight) || isNaN(wind)) {
        alert("Please fill all fields correctly.");
        return;
    }

    if (weight < 1900 || weight > 2300) {
        alert("Weight must be between 1900 and 2300 lbs.");
        return;
    }

    let { groundRoll, totalDistance } = interpolateData(weight, altitude, temperature, "takeoff");

    // Wind adjustment: Assume 10% reduction per 9 knots headwind, increase for tailwind
    if (wind >= 0) {
        groundRoll *= 1 - (wind / 9) * 0.1;
        totalDistance *= 1 - (wind / 9) * 0.1;
    } else {
        groundRoll *= 1 + (Math.abs(wind) / 2) * 0.1;
        totalDistance *= 1 + (Math.abs(wind) / 2) * 0.1;
    }

    // Runway surface adjustment
    if (runway === "grass") {
        grassEffect = groundRoll * 0.15;
        groundRoll += grassEffect;
        totalDistance += grassEffect;
    }

    document.getElementById("takeoffGroundRoll").textContent = Math.round(groundRoll);
    document.getElementById("takeoffTotalDistance").textContent = Math.round(totalDistance);

    let { groundRoll: landingGroundRoll, totalDistance: landingTotalDistance } = interpolateData(2300, altitude, temperature, "landing");

    // Wind adjustment:
    if (wind >= 0) {
        landingGroundRoll *= 1 - (wind / 9) * 0.1;
        landingTotalDistance *= 1 - (wind / 9) * 0.1;
    } else {
        let tailwind = Math.abs(wind);
        if (tailwind <= 10) {
            landingGroundRoll *= 1 + (tailwind / 2) * 0.1;
            landingTotalDistance *= 1 + (tailwind / 2) * 0.1;
        } else {
            alert("Tailwind greater than 10 knots is not recommended.");
            return;
        }
    }

    // Runway surface adjustment:
    if (runway === "grass") {
        let grassEffect = landingGroundRoll * 0.45;
        landingGroundRoll += grassEffect;
        landingTotalDistance += grassEffect;
    }

    document.getElementById("landingGroundRoll").textContent = Math.round(landingGroundRoll);
    document.getElementById("landingTotalDistance").textContent = Math.round(landingTotalDistance);
}

document.getElementById("takeoffForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission behavior
    calculate();
});

document.getElementById("altimeterSetting").addEventListener("input", formatAltimeterSetting);
document.getElementById("fieldElevation").addEventListener("input", calculatePressureAltitude);
document.getElementById("altimeterSetting").addEventListener("input", calculatePressureAltitude);