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

// POH takeoff distance data (example values, replace with actual POH numbers)
const takeoffData = [
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

function calculateTakeoff() {
    const altitude = parseFloat(document.getElementById("altitude").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const wind = parseFloat(document.getElementById("wind").value);
    const runway = document.getElementById("runway").value;

    if (isNaN(altitude) || isNaN(temperature) || isNaN(wind)) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Find the closest altitude range
    let lowerAlt, upperAlt;
    for (let i = 0; i < takeoffData.length - 1; i++) {
        if (altitude >= takeoffData[i].altitude && altitude <= takeoffData[i + 1].altitude) {
            lowerAlt = takeoffData[i];
            upperAlt = takeoffData[i + 1];
            break;
        }
    }

    if (!lowerAlt || !upperAlt) {
        alert("Altitude out of range (0-8000 ft)");
        return;
    }

    // Find the two closest temperatures in the table
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

    // Get ground roll and total distance for interpolation
    let g11 = lowerAlt.groundRoll[lowerTempIndex];
    let g12 = lowerAlt.groundRoll[upperTempIndex];
    let g21 = upperAlt.groundRoll[lowerTempIndex];
    let g22 = upperAlt.groundRoll[upperTempIndex];

    let t11 = lowerAlt.totalDistance[lowerTempIndex];
    let t12 = lowerAlt.totalDistance[upperTempIndex];
    let t21 = upperAlt.totalDistance[lowerTempIndex];
    let t22 = upperAlt.totalDistance[upperTempIndex];

    // Interpolate takeoff distances
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

    document.getElementById("groundRoll").textContent = Math.round(groundRoll);
    document.getElementById("totalDistance").textContent = Math.round(totalDistance);
}