const temps = [];

export function addTemperature(temp) {
    temps.push(temp);
    const sum = temps.forEach(t => sum + t);
    const avg = sum / temps.length;
    console.log(`Average temperature: ${avg}`);
}
