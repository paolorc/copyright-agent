const { getColor } = require("../apiMock");

const {
  AllowedColorsEnum,
  AllowedFormatsEnum,
  AllowedRunnersEnum,
} = require("../constants");

//  Builder pattern to have a redabale way to config our color codes params to fetch
class ColorService {
  colors = Object.values(AllowedColorsEnum);
  format = AllowedFormatsEnum.HEX;
  runner = AllowedRunnersEnum.ASYNC;

  constructor() {
    console.log(
      `DEBUG: default values
          colors: ${this.colors}
          format: ${this.format}
          runner: ${this.runner}`
    );
  }

  validateColors() {
    const allowedColors = Object.values(AllowedColorsEnum);
    const unkownColors = this.colors.filter(
      (color) => !allowedColors.includes(color)
    );

    if (unkownColors.length > 0) {
      throw Error(
        `Colors not allowed: ${unkownColors}. Fix it trying some of the next list: ${allowedColors}`
      );
    }
  }

  validateFormat() {
    const allowedFormats = Object.values(AllowedFormatsEnum);
    const isAllowedFormat = allowedFormats.includes(this.format);

    if (!isAllowedFormat) {
      throw Error(
        `Format not allowed: ${this.format}. Fix it trying some of the following: ${allowedFormats}`
      );
    }
  }

  validateRunner() {
    const allowedRunners = Object.values(AllowedRunnersEnum);
    const isAllowedRunner = allowedRunners.includes(this.runner);

    if (!isAllowedRunner) {
      throw Error(
        `Runner not allowed: ${this.runner}. Fix it trying some of the following: ${allowedRunners}`
      );
    }
  }

  sanitizeColors(colors) {
    return Array.isArray(colors) ? colors : JSON.parse(colors);
  }

  setColors(colors = this.colors) {
    this.colors = this.sanitizeColors(colors).map((color) =>
      color.toLowerCase()
    );

    this.validateColors();

    return this;
  }

  setFormat(format = this.format) {
    this.format = format.toUpperCase();

    this.validateFormat();

    return this;
  }

  setRunner(runner = this.runner) {
    this.runner = runner.toLowerCase();

    this.validateRunner();

    return this;
  }

  async run() {
    switch (this.runner) {
      case AllowedRunnersEnum.ASYNC:
        await this.runAsync();
        break;

      case AllowedRunnersEnum.SYNC:
        await this.runSync();
        break;

      default:
        await this.runAsync();
        break;
    }
  }

  async runAsync() {
    console.log(`DEBUG: ==== Running "async" ====`);

    const fetchCodes = this.colors.map(
      async (colorName) => await getColor(colorName)
    );
    const allColorCodes = await Promise.all(fetchCodes);

    console.log(
      `DEBUG: Succeed! ${allColorCodes.map(
        (colorData) =>
          `\n ${colorData.name} => ${JSON.stringify(colorData[this.format])}`
      )}`
    );
  }

  async runSync() {
    console.log(`DEBUG: ==== Running "sync" ====`);

    for await (const colorName of this.colors) {
      const colorCodes = await getColor(colorName);

      console.log(
        `DEBUG: Color ${colorCodes.name} ${this.format} => ${JSON.stringify(
          colorCodes[this.format]
        )}`
      );
    }
  }
}

module.exports = {
  ColorService,
};
