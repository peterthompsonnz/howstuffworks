document.querySelector('#operation').addEventListener('change', handleOperation);

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const ALPHA = 3;

const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 337;

const canvas = document.querySelector('canvas');

// Fit canvas to train image dimensions
const cw = canvas.width = IMAGE_WIDTH;
const ch = canvas.height = IMAGE_HEIGHT * 3;
const ctx = canvas.getContext('2d');

const image = document.querySelector('#trainImage');

const train = new Image();
train.src = image.src;

train.onload = function () {
    ctx.drawImage(image, 0, 0, image.width, image.height);
}

function handleOperation(evt) {
    evt.preventDefault();
    const value = evt.target.value;

    switch (value) {
        case 'RR': removeColour(RED);
            break;
        case 'RG': removeColour(GREEN);
            break;
        case 'RB': removeColour(BLUE);
            break;
        case 'INVERT': invertColours();
            break;
        case 'GRAYSCALE': grayscale();
            break;
        default: console.log('Unknown operation')
    }
}

async function modifyData(imageData, colour) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        imageData.data[i + colour] = 0;
    }
}

async function removeColour(colour) {
    try {
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        await modifyData(imageData, colour);
        ctx.putImageData(imageData, 0, image.height + 20);
    } catch (error) {
        console.log(error);
    }
}


async function invertData(imageData) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i + 1] = 255 - imageData.data[i + 1];
        imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
}


async function invertColours() {
    try {
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        await invertData(imageData);
        ctx.putImageData(imageData, 0, image.height + 20);
    } catch (error) {
        console.log(error);
    }
}

async function grayscaleData(imageData) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = average;
        imageData.data[i + 1] = average;
        imageData.data[i + 2] = average;
    }
}

async function grayscale() {
    try {
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        await grayscaleData(imageData);
        ctx.putImageData(imageData, 0, image.height + 20);
    } catch (error) {
        console.log(error);
    }
}