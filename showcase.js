import * as world from "./world.js"

// Below there's logic for showcasing the project in the terminal. -- No logic effect
let commands = { 
    'left': `‖____________________ `,
    'right': ` ____________________‖`,
    'twoSpaces': '‖\n‖',
    'oneSpace': '‖',
    'blockedLeft': ' (☞ﾟヮﾟ)☞     ',
    'blockedRight': '     ☜(ﾟヮﾟ☜) ',
    'sunLeft': ' _____ 🌤 ',
    'sunRight': ' 🌤 _____ ',

}

export function basicDetails(visit) {
    // Show current visit
    let output = `${commands['left']}Trip: ${visit}${commands['right']}`;
    console.log(output);

    // Starting point
    console.log(`${commands['twoSpaces']}  Starting point: X=${world.currentX} Y=${world.currentY}`);
    console.log(`${commands['oneSpace']}  Location name: ${world.currentLocName}`);
}

export function endPointDetails(endPointCoord, name) {
    // End point
    console.log(`${commands['twoSpaces']}  End point: X=${endPointCoord[0]} Y=${endPointCoord[1]}`);
    console.log(`${commands['oneSpace']}  Location name: ${name}`);
}

// X, Y, Intensity, Price
export function processArrayPoints(arr) {
    let output = {};

    let counter = 1;
    arr.forEach(item => {
        output[counter] = {'X': item[0], 'Y': item[1], 'Storm itensity level': item[2], 'Price': item[3]};
        counter++;
    })

    console.table(output);
}

export function processSmallArr(arr, intensityArr) {
    let output = {};

    let counter = 1;
    arr.forEach(item => {
        output[counter] = {'X': item[0], 'Y': item[1], 'Storm intensity': intensityArr[counter - 1]};
        counter++;
    })

    console.table(output);
}

export function processFuelArr(arr) {
    let output = {};

    let trip;
    let counter = 1;
    arr.forEach(item => {
        trip = `Trip ${counter}`;
        output[counter] = {trip: item};
        counter++;
    })

    console.table(output);
}

export function showcaseFuel(totalFuel) {
    console.log(`${commands['twoSpaces']} ------- Fuel consumption ------- `)
    console.log(`${commands['oneSpace']} 🚀 Current trip total fuel: ${totalFuel}`);
    console.log(`${commands['oneSpace']} 🚀 Overall ship fuel: ${world.totalFuel}`);
    console.log(`${commands['twoSpaces']}`);
}

export function ranIntoBlockedPath(endPoint) {
    console.log(`${commands['twoSpaces']} ${commands['blockedLeft']} Blocked path to ${endPoint} ${commands['blockedRight']}`);
}

export function weatherImproved() {
    console.log(`${commands['twoSpaces']} ${commands['sunLeft']} Weather improved ${commands['sunRight']}`);
    console.log(`${commands['twoSpaces']} All locked locations are now unlocked!`);
    console.log(`${commands['oneSpace']} ${world.stormBlockedLocations}`);
}

export function showStormDetails(storms, intensity) {
    console.log(`${commands['twoSpaces']} ------- Storm locations below! ------- `);
    processSmallArr(storms, intensity);
}

export function showLastFuelDetails(fuelPerStop) {
    console.log(`${commands['twoSpaces']} ------- Fuel final values ------- `)
    console.log(`${commands['oneSpace']} 🚀 Overall ship fuel: ${world.totalFuel}`);
    processFuelArr(fuelPerStop);
}