let constBlack = {
	'RGB': [0, 0, 0],
	'HEX': '000000',
	'CMY': [1, 1, 1],
	'CMYK': [0, 0, 0, 1],
	'HSL': [0, 0, 0]
}

let constWhite = {
	'RGB': [255, 255, 255],
	'HEX': 'FFFFFF',
	'CMY': [0, 0, 0],
	'CMYK': [0, 0, 0, 0],
	'HSL': [0, 0, 1]
}

let constRed = {
	'RGB': [255, 0, 0],
	'HEX': 'FF0000',
	'CMY': [0, 1, 1],
	'CMYK': [0, 1, 1, 0],
	'HSL': [0, 1, 0.5]
}

let constGreen = {
	'RGB': [0, 255, 0],
	'HEX': '00FF00',
	'CMY': [1, 0, 1],
	'CMYK': [1, 0, 1, 0],
	'HSL': [0.33333, 1, 0.5]
}

let constBlue = {
	'RGB': [0, 0, 255],
	'HEX': '0000FF',
	'CMY': [1, 1, 0],
	'CMYK': [1, 1, 0, 0],
	'HSL': [0.66667, 1, 0.5]
}

var expected = {
    colourModes: {
        cases: {
            BLACK: constBlack,
            WHITE: constWhite,
            RED: constRed,
            GREEN: constGreen,
            BLUE: constBlue
        }
    }
}

export { expected }
