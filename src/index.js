const { getColor } = require("./apiMock");
const Color = require("./Color");

const allowedColors = ["black", "blue", "green", "red", "white"];
const allowedFormats = ["hex", "rgb"];
const allowedRunners = ["async", "sync"];

async function getColors(green, blue, red, order, callback) {
  const colors = [];
  if (green === "true") {
    green = new Color("green");
    colors[order.indexOf(green.name)] = getColor(green.name);
  }
  if (blue === "true") {
    blue = new Color("blue");
    colors[order.indexOf(blue.name)] = getColor(blue.name);
  }
  if (red === "true") {
    red = new Color("red");
    colors[order.indexOf(red.name)] = getColor(red.name);
  }
  callback(colors);
  return colors;
}

// 1. refactor functions
// 2. remove true falses args and just let the array of colors to define order and which color should return
// 3. Add white and black color support
// 4. Add the possiblity to select over RGB or HEX value to return, by default will be hex
// 5. Add the possibility to do this all at the same time asynchronously or one by one syncrhonously
function colors2() {
  console.log("DEBUG: ", process.argv);
  let green = process.argv[2];
  let blue = process.argv[3];
  let red = process.argv[4];
  const colorOrder = process.argv[5];
  getColors(green, blue, red, JSON.parse(colorOrder), async function (colors) {
    colors = await Promise.all(colors);
    // console.log(colors)
    var hexColors = [];
    colors.forEach((color) => (color ? hexColors.push(color.HEX) : null));
    console.log(hexColors);
  });
}

// colors2();

// it's working!
class FetchColors {
  #defaultColors = JSON.stringify(allowedColors);
  #defaultFormat = allowedFormats[0];
  #defaultRunner = allowedRunners[0];

  constructor() {
    console.log(
      `DEBUG: default values
	    colors: ${this.#defaultColors}
	    format: ${this.#defaultFormat}
	    runner: ${this.#defaultRunner}`
    );
  }

  validateColors() {
    const unkownColors = this.colors.filter(
      (color) => !allowedColors.includes(color)
    );

    if (unkownColors.length > 0) {
      console.log(
        `ERROR: Colors not allowed: ${unkownColors}. Fix it trying some of the next list: ${
          this.#defaultColors
        }`
      );
      process.exit(1);
    }
  }

  validateFormat() {
    const allowedFormat = allowedFormats.includes(this.format);

    if (!allowedFormat) {
      console.log(
        `ERROR: Format not allowed: ${this.format}. Fix it trying some of the following: ${allowedFormats}`
      );
      process.exit(1);
    }
  }

  validateRunner() {
    const allowedRunner = allowedRunners.includes(this.runner);

    if (!allowedRunner) {
      console.log(
        `ERROR: Runner not allowed: ${this.runner}. Fix it trying some of the following: ${allowedRunners}`
      );
      process.exit(1);
    }
  }

  setColors(colors = this.#defaultColors) {
    try {
      this.colors = JSON.parse(colors).map((color) => color.toLowerCase());
      this.validateColors();

      return this;
    } catch (error) {
      // possible error parsing to json
      throw new Error(error);
    }
  }

  setFormat(format = this.#defaultFormat) {
    this.format = format.toLowerCase();
    this.validateFormat();

    return this;
  }

  setRunner(runner = this.#defaultRunner) {
    this.runner = runner.toLowerCase();
    this.validateRunner();

    return this;
  }

  fetch() {
    console.log(`DEBUG: ${this.colors} ${this.format} ${this.runner}`);
    const findColorCodes = this.colors.map(
      async (colorName) => await getColor(colorName)
    );

    // Promise all preserve the order of inputs
    // TODO: add when we pass an async or sync runner
    Promise.all(findColorCodes).then((colorsMetadata) => {
      console.log(
        `DEBUG: ${colorsMetadata.map(
          (colorMetadata) =>
            `\n ${colorMetadata.name} => ${JSON.stringify(
              colorMetadata[this.format.toUpperCase()]
            )}`
        )}`
      );
      process.exit(1);
    });
  }
}

console.log("DEBUG: ", process.argv);

const Colors = new FetchColors();
const colors = process.argv[2];
const format = process.argv[3];
const runner = process.argv[4];

Colors.setColors(colors).setFormat(format).setRunner(runner).fetch();

/*
To run application:
node src/index.js true false true '["green","blue", "red"]'
*/

// final command: node src/index.js '["green","blue", "red", "white", "black"]' rgb false
