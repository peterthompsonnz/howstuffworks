// Add a onchange handler function to the operations selection element
document.querySelector('#operation').addEventListener('change', handleOperation);

// Assign offset values to the three colours that make up each pixel of the image
const RED = 0;
const GREEN = 1;
const BLUE = 2;

// The example image's dimensions
const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 337;

// The distance in pixels between original image and the top of the generated one
const IMAGE_BOTTOM_MARGIN = 20;

// Get a handle to the canvas element on which the images will be drawn
const canvas = document.querySelector('canvas');

// Size the canvas to the train image's dimensions, plus the gap between them, plus the generated image
const cw = canvas.width = IMAGE_WIDTH;
// The canvas needs to be tall enough to fit original image a gap and then the generated image
const ch = canvas.height = IMAGE_HEIGHT * 2 + IMAGE_BOTTOM_MARGIN;
// Get the drawing context
const ctx = canvas.getContext('2d');
// Get a handle to the train image that is hidden on the web page
const image = document.querySelector('#trainImage');

// Create an Image object, set it's source to be the existing hidden image. and draw it at the top of the canvas
const train = new Image();
train.onload = function () {
    ctx.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
}

// Handle the operation that the user chooses
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

// Set each pixel's colour to be removed to zero
async function modifyData(imageData, colour) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        imageData.data[i + colour] = 0;
    }
}

// Grab the image data of the original image, remove the chosen colour from it, then draw it on the canvas below the original image
async function removeColour(colour) {
    try {
        let imageData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        await modifyData(imageData, colour);
        ctx.putImageData(imageData, 0, IMAGE_HEIGHT + IMAGE_BOTTOM_MARGIN);
    } catch (error) {
        console.log(error.message);
    }
}

// Set the components of each pixel's colour to it's grayscale value
async function invertData(imageData) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i + 1] = 255 - imageData.data[i + 1];
        imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
}

// Grab the image data of the original image, invert it's colours, then draw it on the canvas below the original image
async function invertColours() {
    try {
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        await invertData(imageData);
        ctx.putImageData(imageData, 0, IMAGE_HEIGHT + IMAGE_BOTTOM_MARGIN);
    } catch (error) {
        console.log(error.message);
    }
}
// Average out each colour value etc...
async function grayscaleData(imageData) {
    for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = average;
        imageData.data[i + 1] = average;
        imageData.data[i + 2] = average;
    }
}

// Ditto to above function explainations
async function grayscale() {
    try {
        let imageData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        await grayscaleData(imageData);
        ctx.putImageData(imageData, 0, IMAGE_HEIGHT + IMAGE_BOTTOM_MARGIN);
    } catch (error) {
        console.log(error);
    }
}