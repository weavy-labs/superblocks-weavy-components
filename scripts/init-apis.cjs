const {
  ApiCommands,
  getConfig,
  initIntegration,
  initWorkflow,
 } = require("./api.cjs")

const inquirer = require("inquirer");
const chalk = require("chalk")
const { exit } = require("process");

const cliVersion = require("@superblocksteam/cli/package.json").version

const apiCommands = new ApiCommands([], { version: cliVersion })

apiCommands.init().then(async () => {
  const sdk = apiCommands.getSdk()
  const config = getConfig(sdk)
  const user = (await sdk.fetchCurrentUser()).user

  const weavyMetadata = { name: "WeavyAPI", organization: user.currentOrganizationId }
  const integration = await initIntegration(sdk, weavyMetadata, config)

  const authMetadata = { name: "WeavyAuthentication", organization: user.currentOrganizationId, integration: integration.id }
  let authWorkflow = await initWorkflow(sdk, authMetadata, config)
  
  const navMetadata = { name: "WeavyPageNavigation", organization: user.currentOrganizationId, integration: integration.id }
  let navWorkflow = await initWorkflow(sdk, navMetadata, config)

  while (!authWorkflow.isDeployed || !navWorkflow.isDeployed) {
    console.log(`\nThe workflows must be ${chalk.bold(`deployed`)} to be available in the apps.`)

    if (!authWorkflow.isDeployed) {
      console.log(
        `Open the ${chalk.blue(authMetadata.name)} workflow and deploy it: ${chalk.bold(`${
          sdk.superblocksBaseUrl
        }workflows/${authWorkflow.id}`)}`
      );
    }

    if (!navWorkflow.isDeployed) {
      console.log(
        `Open the ${chalk.blue(navMetadata.name)} workflow and deploy it: ${chalk.bold(`${
          sdk.superblocksBaseUrl
        }workflows/${navWorkflow.id}`)}`
      );
    }

    const replace = await inquirer.prompt([
      {
        name: "confirm",
        message: `When you have deployed the ${!authWorkflow.isDeployed && !navWorkflow.isDeployed ? "workflows" : "workflow"}, do you want to continue?`,
        type: "confirm",
        default: true,
      },
    ]);
    if (replace.confirm) {
      authWorkflow = await sdk.fetchApi({ apiId: authWorkflow.id, viewMode: "export-live" });
      navWorkflow = await sdk.fetchApi({ apiId: navWorkflow.id, viewMode: "export-live" });
    } else {
      exit(-1);
    }

  } 
  
  console.log("Success creating backend apis 🥳")
})
