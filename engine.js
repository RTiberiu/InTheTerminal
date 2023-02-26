import * as world from './world.js'
import * as showcase from './showcase.js'

// Functions of all the logic
export function choosingRouteVariation() {
    let distance;
    let shortestDistance = 0;
    let shortestInterestPoint; 
    let shortestPointCoord = [];
    let interestPointX;
    let interestPointY;

    // Loop through all points and use pythagoras to find the shortest distance
    for (let interestPoint in world.interestPoints) {
        // Check the current interest point wasn't visited
        if (world.visitedPlaces.includes(interestPoint)) {
            continue;
        }

        // Check the current interest point isn't blocked by a storm
        if (world.stormBlockedLocations.includes(interestPoint)) {
            continue;
        }
        
        // Get interest points X and Y values
        interestPointX = world.interestPoints[interestPoint][0];
        interestPointY = world.interestPoints[interestPoint][1];
        
        // Get distance using pythagoras
        distance = Math.hypot(interestPointX - world.currentX, interestPointY - world.currentY);
        
        // Decide if it's the shortest route
        if (distance < shortestDistance || shortestDistance == 0) {
            shortestDistance = distance;
            shortestInterestPoint = interestPoint;
            shortestPointCoord = [interestPointX, interestPointY];
        }
    }
    
    // Check if all available locations were visited AND if there are any blockd locations
    if (shortestInterestPoint == undefined && world.stormBlockedLocations.length > 0) {
        // Unblock all location blocked by the storm
        world.makeBlockedLocationsAvailable();

        // --- Showcase only ---
        showcase.weatherImproved();
        
        // Callback to resume with the newly available locations
        choosingRouteVariation();
        return;
    }

    // Get travelled coordinates array 
    let gotTravelledCoord = getTravelledCoordArr(world.currentLocName,shortestInterestPoint);

    // Callback choosing different travel variation 
    if (!gotTravelledCoord) {
        choosingRouteVariation();
        return;
    }

    // Update ship location and coordinates 
    world.updateShipLocation(shortestInterestPoint, shortestPointCoord[0], shortestPointCoord[1]);

    // Add new location to visited place
    world.addVisitedPlace(shortestInterestPoint);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomCoordinatesArr(thresholdX, thresholdY) {
    return new Array(getRandomInt(0, thresholdX), getRandomInt(0, thresholdY))
}

// Get random storm intensity between 1 and 3; 3 is only allowed for interest points
function getRandomIntensity(coordinateX, coordinateY) {
    let output;
    // Decide if the current point is touching interest point
    let isInterestPoint = false;
    
    let interestKeys = Object.keys(world.interestPoints);
    // Cycle through all the interest points
    for (let x = 0; x < interestKeys.length; x++) {
        // Break when match is found
        if(isInterestPoint) {
            break;
        }
        
        let currInterestPointArr = world.interestPoints[interestKeys[x]];
        
        // Check all four storm square coordinates if they match with the interest point 
        let allSidesCoordinates = [
            [coordinateX, coordinateY], [(coordinateX + 1), coordinateY],
            [coordinateX, coordinateY + 1], [coordinateX + 1, coordinateY + 1]
        ];
        for (let i = 0; i < allSidesCoordinates.length; i++) {
            let side = allSidesCoordinates[i];
            if(currInterestPointArr[0] === side[0] && currInterestPointArr[1] === side[1]) {
                isInterestPoint = true;
                break;
            }
        }
    }
    
    // Get random int
    if (isInterestPoint) {
        output = getRandomInt(1, 4);
    } else {
        output = getRandomInt(1, 3);
    }
    return output;
}

export function addRandomStorms(numberOfStorms) {
    // Don't allow more storms than the world has space
    let stormThreshold = world.worldGrid[0] * world.worldGrid[1];
    if (numberOfStorms > stormThreshold) {
        throw new Error(`Can't have more storms than spaces on the map! Please choose a lower number`);
    }

    let counter = 0;
    let randomCoordArr;
    let randomIntensity;
    // Find unique location of storms and add them
    while (counter < numberOfStorms) {
        // Randomize location until one it's unique
        let searchingStormLoc = true;
        while (searchingStormLoc) {
            randomCoordArr = getRandomCoordinatesArr(world.worldGrid[0], world.worldGrid[1]);

            // Check if random coordinates are unique 
            let foundStorm = world.storms.some(item => {
                return item[0] === randomCoordArr[0] && item[1] === randomCoordArr[1];
            });

            // Stop searching when unique storm coordinates are found
            if (!foundStorm) {
                searchingStormLoc = false;
            } 
        }
        
        // Get random intensity for the random storm
        randomIntensity = getRandomIntensity(randomCoordArr[0], randomCoordArr[1]);
    
        // Add storm location & intensity
        world.addStorm(randomCoordArr[0], randomCoordArr[1], randomIntensity);
        counter++;
    } 
}

/**
 * Get an array of travelled coordinates between two points in the 2d space.
 * @param {*} startingPoint name of the interest point
 * @param {*} endPoint name of the interest point
 */
export function getTravelledCoordArr(startingPoint, endPoint) {
    let startPointCoord = world.interestPoints[startingPoint];
    let endPointCoord = world.interestPoints[endPoint];
    let startPointCoordY = startPointCoord[1];
    let endPointCoordY = endPointCoord[1];
    let startPointCoordX = startPointCoord[0];
    let endPointCoordX = endPointCoord[0];
    
    // Print showcase details
    showcase.endPointDetails(endPointCoord, endPoint);

    // Showcase coordinates, storm, and price
    let showcaseArr = []; 

    // Move on the Y axis
    let coordStormIntensityY;
    let tempFuelY = 0;
    if (startPointCoordY > endPointCoordY) {
        // Move down the Y axis
        while(startPointCoordY > endPointCoordY) {
            // Get travel coordinate storm intensity
            coordStormIntensityY = getStormIntensityByCoord(startPointCoordX, startPointCoordY - 1);

            // Validate the storm intensity for the coordinate
            let validStormIntensity = validateCoordStormIntensity(coordStormIntensityY, endPoint);

            // Early exit for not finding the right path because of heavy storm
            if (!validStormIntensity) {
                // --- Showcase only --- 
                showcase.ranIntoBlockedPath(endPoint);


                return validStormIntensity;
            }

            // Add temp fuel consumption
            tempFuelY += getFuelConsumptionByStormIntensity(coordStormIntensityY);
            
            // --- Showcase only ---
            showcaseArr.push(new Array(startPointCoordX, startPointCoordY -1, coordStormIntensityY, getFuelConsumptionByStormIntensity(coordStormIntensityY)));

            // Add new location to temporary array
            world.addTempTravelledLocation(startPointCoordX, startPointCoordY - 1);
            startPointCoordY -= 1;
        }
    } else {
        // Move up Y the axis
        while(startPointCoordY < endPointCoordY) {
            // Get travel coordinate storm intensity
            coordStormIntensityY = getStormIntensityByCoord(startPointCoordX, startPointCoordY + 1);

            // Validate the storm intensity for the coordinate
            let validStormIntensity = validateCoordStormIntensity(coordStormIntensityY, endPoint);

            // Early exit for not finding the right path because of heavy storm
            if (!validStormIntensity) {
                // --- Showcase only --- 
                showcase.ranIntoBlockedPath(endPoint);

                return validStormIntensity;
            }

            // Add temp fuel consumption
            tempFuelY += getFuelConsumptionByStormIntensity(coordStormIntensityY);

            // --- Showcase only ---
            showcaseArr.push(new Array(startPointCoordX, startPointCoordY + 1, coordStormIntensityY, getFuelConsumptionByStormIntensity(coordStormIntensityY)));

            world.addTempTravelledLocation(startPointCoordX, startPointCoordY + 1);
            startPointCoordY += 1;
        }
    }
    
    
    // Move on the X axis
    let coordStormIntensityX;
    let tempFuelX = 0; 
    if (startPointCoordX > endPointCoordX) {
        // Move down the X axis
        while(startPointCoordX > endPointCoordX) { 
            // Get travel coordinate storm intensity
            coordStormIntensityX = getStormIntensityByCoord(startPointCoordX - 1, startPointCoordY);
            
            // Validate the storm intensity for the coordinate
            let validStormIntensity = validateCoordStormIntensity(coordStormIntensityX, endPoint);
            
            // Early exit for not finding the right path because of heavy storm
            if (!validStormIntensity) {
                // --- Showcase only --- 
                showcase.ranIntoBlockedPath(endPoint);

                return validStormIntensity;
            }

            // Add temp fuel consumption
            tempFuelX += getFuelConsumptionByStormIntensity(coordStormIntensityX);

            // --- Showcase only ---
            showcaseArr.push(new Array(startPointCoordX - 1, startPointCoordY, coordStormIntensityX, getFuelConsumptionByStormIntensity(coordStormIntensityX)));

            world.addTempTravelledLocation(startPointCoordX - 1, startPointCoordY);
            startPointCoordX -= 1;
        }
    } else {
        // Move up the X axis
        while(startPointCoordX < endPointCoordX) {
            // Get travel coordinate storm intensity
            coordStormIntensityX = getStormIntensityByCoord(startPointCoordX + 1, startPointCoordY);
            
            // Validate the storm intensity for the coordinate
            let validStormIntensity = validateCoordStormIntensity(coordStormIntensityX, endPoint);
            
            // Early exit for not finding the right path because of heavy storm
            if (!validStormIntensity) {
                // --- Showcase only --- 
                showcase.ranIntoBlockedPath(endPoint);

                return validStormIntensity;
            }

            // Add temp fuel consumption
            tempFuelX += getFuelConsumptionByStormIntensity(coordStormIntensityX);

            // --- Showcase only ---
            showcaseArr.push(new Array(startPointCoordX + 1, startPointCoordY, coordStormIntensityX, getFuelConsumptionByStormIntensity(coordStormIntensityX)))
            
            world.addTempTravelledLocation(startPointCoordX + 1, startPointCoordY);
            startPointCoordX += 1;
        }
    }
    
    // Get fuel consumption by storm intensity per current trip
    let totalTripFuelCost = tempFuelX + tempFuelY;
    
    // Increase total trip
    world.increaseTotalFuelConsumption(totalTripFuelCost);
    
    // Save current trip consumption
    world.addFuelPerStop(totalTripFuelCost);

    // Showcase trajectory X, Y, Intensity, Price
    showcase.processArrayPoints(showcaseArr);

    // Showcase fuel
    showcase.showcaseFuel(totalTripFuelCost);

    // Add temp travelled to actually travelled locations
    world.addTravelledLocation();
    return true;
}

export function getStormIntensityByCoord(x, y) {
    let output;
    // Find if given coordinates exist in storms arr
    let stormIndex;
    let foundStorm = world.storms.some(item => {
        let isEqualToStorm = item[0] === x && item[1] === y;
        if (isEqualToStorm) {
            stormIndex = world.storms.indexOf(item);
        }
        return isEqualToStorm;
    });

    if (!foundStorm) {
        output = 0;
    } else {
        output = world.stormsItensity[stormIndex];
    }
    return output;
}

// Validate that the storm isn't blocking the location and act accordingly 
export function validateCoordStormIntensity(stormIntensity, endPoint) {
    let output = false;
    if (stormIntensity == 3) {
        // Temporarily block current endPoint trajectory and stop function
        world.addStormBlockedLocation(endPoint);
    } else {
        // Validate coordinate
        output = true;
    }
    return output;
}

export function getFuelConsumptionByStormIntensity(stormIntensity) {
    let output;
    switch(stormIntensity) {
        case 0:
            output = world.fuelBaseUnit;
            break;
        case 1:
            output = world.fuelBaseUnit + (world.fuelBaseUnit * 0.1);
            break;
        case 2:
            output = world.fuelBaseUnit + (world.fuelBaseUnit * 0.2);
            break;
        default:
            throw new Error(`The storm intensity given is not available! Value provided: ${stormIntensity}`);
    }
    return output;
}


