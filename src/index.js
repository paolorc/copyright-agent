const { ColorService } = require("./service/ColorService");

async function init() {
  const argColors = process.argv[2];
  const argFormat = process.argv[3];
  const argRunner = process.argv[4];

  console.log(
    `DEBUG: Args received \n colors: ${argColors} \n format: ${argFormat} \n runner: ${argRunner}`
  );

  const colorService = new ColorService();

  try {
    await colorService
      .setColors(argColors)
      .setFormat(argFormat)
      .setRunner(argRunner)
      .run();
  } catch (error) {
    throw new Error(error.message);
  }
}

init().catch((error) => console.log(`ERROR: Something happened!, ${error}`));
