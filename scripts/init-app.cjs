const {
  ApiCommands,
  getConfig,
  getWorkflow,
  createAppAuthWorkflowLink,
  createAppSetNavigationWorkflowLink,
  chooseApp,
  chooseAppPages,
  fetchAppFiles,
  createComponentsSymlinks,
  copyComponentsToApp,
  copyComponentsConfigToApp,
  installComponentPackages,
  startComponentsWatch,
  buildAndUploadComponents,
  validateStateVarWeavyUrl,
 } = require("./api.cjs")
const chalk = require("chalk")
const { exit } = require("process")
const cliVersion = require("@superblocksteam/cli/package.json").version

const apiCommands = new ApiCommands([], { version: cliVersion })

apiCommands.init().then(async () => {
  const sdk = apiCommands.getSdk()
  const config = getConfig(sdk)
  const user = (await sdk.fetchCurrentUser()).user

  const authWorkflowMetadata = { name: "WeavyAuthentication", organization: user.currentOrganizationId }
  const authWorkflow = await getWorkflow(sdk, authWorkflowMetadata)

  const navWorkflowMetadata = { name: "WeavyPageNavigation", organization: user.currentOrganizationId }
  const navWorkflow = await getWorkflow(sdk, navWorkflowMetadata)

  const weavyMetadata = { name: "WeavyAPI", organization: user.currentOrganizationId }

  if (!authWorkflow) {
    console.warn("No WeavyAuthentication workflow found! Run create:weavy first")
    exit(-1)
  }

  const app = await chooseApp(sdk);
  const pages = await chooseAppPages(app)

  await validateStateVarWeavyUrl(sdk, app, weavyMetadata, config)
 
  for (const page of pages) {
    await createAppAuthWorkflowLink(sdk, authWorkflow, user, app, page, config)
    await createAppSetNavigationWorkflowLink(sdk, navWorkflow, user, app, page, config)
  }
  const resource = await fetchAppFiles(sdk, app)

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

  console.log("Success configuring your app 🥳")

  if (!authWorkflow.isDeployed) {
    console.warn(`${chalk.bold(`Your ${authWorkflowMetadata.name} workflow is not yet deployed! Deploy it before opening the app.`)} ${sdk.superblocksBaseUrl}workflows/${authWorkflow.id}`)
  }
  if (!navWorkflow.isDeployed) {
    console.warn(`${chalk.bold(`Your ${navWorkflowMetadata.name} workflow is not yet deployed! Deploy it before opening the app.`)} ${sdk.superblocksBaseUrl}workflows/${navWorkflow.id}`)
  }
  console.log(`${chalk.bold("View app in browser:")} ${sdk.superblocksBaseUrl}applications/edit/${app.id}`)
})
