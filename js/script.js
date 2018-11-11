let fa, bg, shadow, icons, icon, colors;
let fontSize = 120;
let iconName = 'cog';

function preload() {
    // Load Font Awesome Font
    fa = loadFont('https://use.fontawesome.com/releases/v5.4.1/webfonts/fa-solid-900.ttf');

    // Load availible icons
    icons = loadJSON('data/icons.json');

    // Load background colors
    colors = loadJSON('data/colors.json');
}

function setup() {
    // Create the canvas
    createCanvas(400, 400);

    // Create icon change input
    select('#icon').value(iconName).input(updateIcon);

    // Setup autocomplete for icon name
    setupAutocomplete();

    // Create width and height input
    select('#width').value(width.toString()).input(updateWidth);
    select('#height').value(height.toString()).input(updateHeight);

    // Create font size input
    select('#fontsize').value(fontSize.toString()).input(updateFontSize);

    // Select a random background color
    selectRandomBg();

    // Get Unicode value for icon
    icon = parseInt(icons[iconName], 16);

    // Remove loading info
    select('#loading-info').remove();

    // Show input area
    select('#input').style('display', 'block');

    noLoop();
}

function draw() {
    // Draw background color
    background(bg);

    // Draw icon for shadow testing
    fill(255);
    translate(width / 2, height / 2);
    textAlign(CENTER, CENTER);
    textSize(parseInt(fontSize));
    textFont(fa);
    text(String.fromCharCode(icon), 0, 0);

    // Draw shadows
    loadPixels();

    // Go up the picture line by line
    for (var y = height; y > 0; y--) {
        var start = (y * width) * 4;
        var isShadow = false;

        // Calculate maxmimum shift for row
        if (width > (height - y)) {
            var maxShift = (height - y);
        } else {
            var maxShift = width;
        }

        // Diagonally go through image
        for (var shift = 0; shift < maxShift; shift ++) {
            var pixel = start + (shift * width) * 4 + shift * 4;

            // Search if pixel is white => Icon is present
            if (pixels[pixel] == 255 && pixels[pixel + 1] == 255 && pixels[pixel + 2] == 255) {
                isShadow = true;
            }

            // Draw shadow if icon has been found in row
            if (isShadow) {
                pixels[pixel] = shadow[0];
                pixels[pixel + 1] = shadow[1];
                pixels[pixel + 2] = shadow[2];
            }
        }
    }

    // Go along x axis on image
    for (var x = 0; x < width; x++) {
        var start = x * 4;
        var isShadow = false;

        // Calculate maxmimum shift for row
        if (height > (width - x)) {
            var maxShift = (width - x);
        } else {
            var maxShift = height;
        }

        // Diagonally go through image
        for (var shift = 0; shift < maxShift; shift ++) {
            var pixel = start + (shift * width) * 4 + shift * 4;

            // Search if pixel is white => Icon is present
            if (pixels[pixel] == 255 && pixels[pixel + 1] == 255 && pixels[pixel + 2] == 255) {
                isShadow = true;
            }

            // Draw shadow if icon has been found in row
            if (isShadow) {
                pixels[pixel] = shadow[0];
                pixels[pixel + 1] = shadow[1];
                pixels[pixel + 2] = shadow[2];
            }
        }
    }

    // Update pixels to insert shadow
    updatePixels();

    // Redraw icon to draw over shadow
    fill(255);
    text(String.fromCharCode(icon), 0, 0);
}

// Select a random background color
function selectRandomBg() {
    // Get random background color
    let keys = Object.keys(colors);
    let randomBg = keys[Math.floor(Math.random() * keys.length)];
    bg = color(colors[randomBg][0], colors[randomBg][1], colors[randomBg][2]);

    // Calculate shadow color
    shadow = [
        Math.floor(red(bg) / 2),
        Math.floor(green(bg) / 2),
        Math.floor(blue(bg) / 2),
    ];
}

// Update icon name on input change
function updateIcon() {
    iconName = document.querySelector('#icon').value;

    // Get Unicode value for icon
    if (icons[iconName]) {
        icon = parseInt(icons[iconName], 16);
    }

    redraw();
}

// Update width of the canvas on input change
function updateWidth() {
    resizeCanvas(this.value(), height);
    redraw();
}

// Update height of the canvas on input change
function updateHeight() {
    resizeCanvas(width, this.value());
    redraw();
}

// Update font size on input change
function updateFontSize() {
    fontSize = this.value();
    redraw();
}

// Select a new background color
function newBg() {
    selectRandomBg();
    redraw();
}

// Download the logo as a PNG file
function download() {
    // Get p5 canvas element
    let canvas = document.querySelector('.p5Canvas');

    // Create download URL for canvas data
    let downloadURL = canvas.toDataURL('image/png');
    downloadUrl = downloadURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=logo.png');

    // Download image with #download
    // This will ask the browser to download the image instead of opening it
    let link = document.querySelector('#download');
    link.href = downloadURL;
    link.click();
}

// Setup icon name autocomplete
function setupAutocomplete() {
    new autoComplete({
        selector: '#icon',
        minChars: 2,
        source: function(term, suggest){
            term = term.toLowerCase();
            var matches = [];
            var choices = Object.keys(icons);
            for (i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        }    
    });
}