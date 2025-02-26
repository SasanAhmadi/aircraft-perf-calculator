function calculateTakeoff() {
    const weight = parseFloat(document.getElementById("weight").value);
    const altitude = parseFloat(document.getElementById("altitude").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const wind = parseFloat(document.getElementById("wind").value);
    const runway = document.getElementById("runway").value;

    if (isNaN(weight) || isNaN(altitude) || isNaN(temperature) || isNaN(wind)) {
        alert("Please fill all fields correctly.");
        return;
    }

    let baseGroundRoll = 1000; // Approximate base ground roll in feet at sea level, 15°C, no wind
    let baseTotalDistance = 1600; // Approximate base total distance to clear 50 ft obstacle

    // Adjust for altitude (increase 10% per 1000 ft)
    baseGroundRoll *= 1 + (altitude / 1000) * 0.1;
    baseTotalDistance *= 1 + (altitude / 1000) * 0.1;

    // Adjust for temperature (increase 1% per °C above 15°C)
    if (temperature > 15) {
        baseGroundRoll *= 1 + ((temperature - 15) * 0.01);
        baseTotalDistance *= 1 + ((temperature - 15) * 0.01);
    }

    // Adjust for wind (reduce 5% per 5 knots headwind)
    baseGroundRoll *= 1 - (wind / 5) * 0.05;
    baseTotalDistance *= 1 - (wind / 5) * 0.05;

    // Adjust for runway surface
    if (runway === "grass") {
        baseGroundRoll *= 1.15; // Increase by 15% for grass
        baseTotalDistance *= 1.15;
    }

    document.getElementById("groundRoll").textContent = Math.round(baseGroundRoll);
    document.getElementById("totalDistance").textContent = Math.round(baseTotalDistance);
}