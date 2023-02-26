// Global variables used in engine.js ()

// Current X and Y value on the map
let currentLocName;
let currentX;
let currentY;
let worldGrid = [12, 8]; // X and Y threshold of the map 

// Fuel consumption
let totalFuel = 0;
let fuelPerEachStop = [];

// Fuel base cost
let fuelBaseUnit = 5;

// Coordinates of each interest point in X and Y format
let interestPoints = {
    'Port 1': [0, 3],
    'Port 2': [5, 8],
    'Port 3': [12, 1],
    'Oil rig 1': [2, 6],
    'Oil rig 2': [3, 2],
    'Oil rig 3': [6, 4],
    'Oil rig 4': [9, 7],
    'Oil rig 5': [11, 3]
}

let locationsLeftToVisit = Object.keys(interestPoints).length - 1;
let storms = [];
let stormsItensity = [];
let stormBlockedLocations = [];
let visitedPlaces = [];

// Travelled locations (coordinates X and Y)
let travelledArr = [];

// Temporary route locations
let tempTravelledArr = [];

// Setters 
export function setCurrentX(value) {
    currentX = value;
}

export function setCurrentY(value) {
    currentY = value;
}

export function setCurrentLocName(value) {
    currentLocName = value;
}

export function addVisitedPlace(place) {
    visitedPlaces.push(place);
}

export function updateShipLocation(location, x, y) {
    currentLocName = location;
    currentX = x;
    currentY = y;
}

/**
 * Add storm coordinates to game
 * @param {Integer} x 
 * @param {Integer} y 
 * @param {Integer} intensity between 0 and 3; 3 locks off an area.
 */
export function addStorm(x, y, intensity) {
    storms.push(new Array(x, y));
    stormsItensity.push(intensity);
} 

export function addTravelledLocation() {
    travelledArr.push(tempTravelledArr);
    
    // Clear temp travelled arr
    tempTravelledArr = [];
}

export function addTempTravelledLocation(x, y) {
    tempTravelledArr.push(new Array(x, y));
}

export function addStormBlockedLocation(nameOfBlockedLoc) {
    stormBlockedLocations.push(nameOfBlockedLoc);
}

export function makeBlockedLocationsAvailable() {
    stormBlockedLocations = [];
    stormsItensity = [];
    storms = [];
}

export function addFuelPerStop(fuelPerStop) {
    fuelPerEachStop.push(fuelPerStop);
}

export function increaseTotalFuelConsumption(fuel) {
    totalFuel += fuel;
}


export {interestPoints, currentX, currentY, visitedPlaces, currentLocName, storms, worldGrid, stormsItensity, travelledArr, tempTravelledArr, stormBlockedLocations, locationsLeftToVisit, totalFuel, fuelPerEachStop, fuelBaseUnit};