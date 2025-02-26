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

    let baseDistance = 1000; // Base takeoff distance in feet (for standard conditions)

    // Adjust for altitude (rough estimate: increase 10% per 1000 ft)
    baseDistance *= 1 + (altitude / 1000) * 0.1;

    // Adjust for temperature (increase 1% per °C above 15°C)
    if (temperature > 15) {
        baseDistance *= 1 + ((temperature - 15) * 0.01);
    }

    // Adjust for wind (reduce 5% per 5 knots headwind)
    baseDistance *= 1 - (wind / 5) * 0.05;

    // Adjust for runway surface
    if (runway === "grass") {
        baseDistance *= 1.15; // Increase by 15% for grass
    }

    document.getElementById("result").textContent = Math.round(baseDistance);
}