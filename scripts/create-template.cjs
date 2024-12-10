const {
  ApiCommands,
  getConfig,
  updateSuperblocksConfigResource,
  getWorkflow,
  createAppAuthWorkflowLink,
  createAppSetNavigationWorkflowLink,
  initApp,
  fetchAppFiles,
  createComponentsSymlinks,
  copyComponentsToApp,
  copyComponentsConfigToApp,
  installComponentPackages,
  startComponentsWatch,
  buildAndUploadComponents,
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

  if (!authWorkflow) {
    console.warn("No WeavyAuthentication workflow found! Run create:weavy first")
    exit(-1)
  }

  const resource = {
    location: "apps/weavytemplate",
    resourceType: "APPLICATION",
  }
  const metadata = {
    name: "WeavyTemplate",
    organizationId: user.currentOrganizationId,
  }

  const weavyMetadata = { name: "WeavyAPI", organization: user.currentOrganizationId }

  const app = await initApp(sdk, metadata, config, weavyMetadata)
  const page = app.pageSummaryList[0]

  await updateSuperblocksConfigResource(app.id, resource, sdk)

  await createAppAuthWorkflowLink(sdk, authWorkflow, user, app, page, config)
  await createAppSetNavigationWorkflowLink(sdk, navWorkflow, user, app, page, config)
  await fetchAppFiles(sdk, app, resource)

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

  console.log("Success creating app template 🥳")

  if (!authWorkflow.isDeployed) {
    console.warn(`${chalk.bold(`Your ${authWorkflowMetadata.name} workflow is not yet deployed! Deploy it before opening the demo app.`)} ${sdk.superblocksBaseUrl}workflows/${authWorkflow.id}`)
  }
  if (!navWorkflow.isDeployed) {
    console.warn(`${chalk.bold(`Your ${navWorkflowMetadata.name} workflow is not yet deployed! Deploy it before opening the demo app.`)} ${sdk.superblocksBaseUrl}workflows/${navWorkflow.id}`)
  }
  console.log(`${chalk.bold("View demo in browser:")} ${sdk.superblocksBaseUrl}applications/edit/${app.id}`)
})
