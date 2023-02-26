import * as engine from './engine.js'
import * as world from './world.js'
import * as showcase from './showcase.js'

// Decide starting location
world.setCurrentLocName('Port 1');

// Add start location to visited places
world.addVisitedPlace(world.currentLocName);

// Assign the current X and Y value of the ship 
let currentPoint = world.interestPoints[world.currentLocName];
world.setCurrentX(currentPoint[0]);
world.setCurrentY(currentPoint[1]);

// Add random storms to the game
engine.addRandomStorms(25);

// Visit each available point on the map
let visits = 0;
while (visits < world.locationsLeftToVisit) {
    showcase.basicDetails(visits + 1);
    engine.choosingRouteVariation(world.currentLocName);
    visits++;
}

// --- Showcase only --- 
showcase.showStormDetails(world.storms, world.stormsItensity);

// --- Showcase only --- 
showcase.showLastFuelDetails(world.fuelPerEachStop);
