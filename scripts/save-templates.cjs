const {
  ApiCommands,
  getConfig,
  getApp,
  getWorkflow,
  saveWorkflowTemplate,
  saveAppPageDSL,
  getFullWorkflow,
} = require("./api.cjs")
const chalk = require("chalk")
const { exit } = require("process")
const cliVersion = require("@superblocksteam/cli/package.json").version

const apiCommands = new ApiCommands([], { version: cliVersion })

apiCommands.init().then(async () => {
  const sdk = apiCommands.getSdk()
  const config = getConfig(sdk)
  const user = (await sdk.fetchCurrentUser()).user

  {
    const authWorkflowMetadata = {
      name: "WeavyAuthentication",
      organization: user.currentOrganizationId,
    }
    const authWorkflow = await getWorkflow(sdk, authWorkflowMetadata)
  
    if (!authWorkflow) {
      console.warn("No WeavyAuthentication workflow found!")
    } else {
      const workflow = await getFullWorkflow(sdk, authWorkflow, config)
      await saveWorkflowTemplate(workflow);
    }
  }

  {
    const navWorkflowMetadata = {
      name: "WeavyPageNavigation",
      organization: user.currentOrganizationId,
    }
    const navWorkflow = await getWorkflow(sdk, navWorkflowMetadata)
  
    if (!navWorkflow) {
      console.warn("No WeavyPageNavigation workflow found!")
    } else {
      const workflow = await getFullWorkflow(sdk, navWorkflow, config)
      await saveWorkflowTemplate(workflow);
    }
  }

  {
    const appMetadata = {
      name: "WeavyDemo",
      organizationId: user.currentOrganizationId,
    }
  
    const app = await getApp(sdk, appMetadata, config)

    if (!app) {
      console.warn("No WeavyDemo app found!")
    } else {
      const page = app.pageSummaryList[0]
      await saveAppPageDSL(sdk, app, page, config)
    }
  }

  {
    const appMetadata = {
      name: "WeavyTemplate",
      organizationId: user.currentOrganizationId,
    }
  
    const app = await getApp(sdk, appMetadata, config)

    if (!app) {
      console.warn("No WeavyTemplate app found!")
    } else {
      const page = app.pageSummaryList[0]
      await saveAppPageDSL(sdk, app, page, config)
    }
  }

  console.log("Success saving templates 🥳")
})
