const {
  ApiCommands,
  getChosenResource,
  copyComponentsToApp,
  createComponentsSymlinks,
  copyComponentsConfigToApp,
  installComponentPackages,
  buildAndUploadComponents,
  startComponentsWatch,
} = require("./api.cjs");
const { exit } = require("process")

const cliVersion = require("@superblocksteam/cli/package.json").version;

const apiCommands = new ApiCommands([], { version: cliVersion });

apiCommands.init().then(async () => {

  if (process.env.NODE_ENV === "development") {
    console.warn("Using developer mode!\n")
  }
  const defaultResource = {
    location: "apps/weavydemo",
    resourceType: "APPLICATION",
  };

  const resource = await getChosenResource("APPLICATION", defaultResource)

  if(!resource) {
    exit(0)
  }

  if (process.env.NODE_ENV === "development") {
    await createComponentsSymlinks(resource);
  } else {
    await copyComponentsToApp(resource);
  }

  await copyComponentsConfigToApp(resource);
  await installComponentPackages(resource, process.env.WEAVY_DEV_VERSION);

  if (process.env.NODE_ENV === "development") {
    await startComponentsWatch(resource);
  } else {
    await buildAndUploadComponents(resource);
  }

  console.log("Success installing components 🥳");
});
