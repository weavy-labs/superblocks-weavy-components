require("dotenv").config();

const authenticated_command_1 = require("@superblocksteam/cli/dist/common/authenticated-command.js");
const sdk_1 = require("@superblocksteam/sdk");
const util_1 = require("@superblocksteam/util");
const axios = require("axios");
const yaml = require("yaml");
const { v4 } = require("uuid");
const fs = require("node:fs/promises");
const path = require("node:path");

const _exec = require("child_process").exec;
const spawn = require("child_process").spawn;
const util = require("util");
const exec = util.promisify(_exec);
const execWithOutput = async (command, options) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {
      stdio: "inherit",
      shell: true,
      ...options,
    });
    childProcess.on("error", (error) => {
      reject(error);
    });
    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}.`));
      }
    });
  });
};

const ora = require("ora");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { exit } = require("process");

const BASE_SERVER_PUBLIC_API_URL_V1 = "api/v1/public";
const BASE_SERVER_PUBLIC_API_URL_V2 = "api/v2/public";
const BASE_SERVER_API_URL_V1 = "api/v1";
const BASE_SERVER_API_URL_V2 = "api/v2";
const BASE_SERVER_API_URL_V3 = "api/v3";

const CLI_VERSION_HEADER = "x-superblocks-cli-version";
const SUPERBLOCKS_URL_HEADER = "x-superblocks-url";

exports.ApiCommands = class ApiCommands extends (
  authenticated_command_1.AuthenticatedCommand
) {
  async init() {
    try {
      const result = await (0, util_1.getLocalTokenWithUrl)();
      if (!("token" in result)) {
        throw new Error();
      }
      const { token, superblocksBaseUrl } = result;
      this.sdk = new sdk_1.SuperblocksSdk(
        token,
        superblocksBaseUrl,
        this.config.version
      );
      await this.runAutomatedDotfileUpdates();
    } catch (e) {
      console.log(e.message);
      this.error("Please run 'superblocks login' first", { exit: 1 });
    }
  }
};

function applyToChildren(node, replacer) {
  if (node.children) {
    node.children = node.children?.map((childObject) => {
      childObject = applyToChildren(childObject, replacer);
      return replacer(childObject);
    });
  }
  return node;
}
exports.applyToChildren = applyToChildren;

function getConfig(sdk) {
  return {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + sdk.token,
      [CLI_VERSION_HEADER]: sdk.cliVersion,
    },
  };
}
exports.getConfig = getConfig;

/** REST */
async function fetchIntegrations(sdk, organizationId, config) {
  const spinner = ora(`Fetching integrations`).start();
  try {
    const response = await axios.get(
      new URL(
        `${BASE_SERVER_API_URL_V1}/integrations/superset?organizationId=${organizationId}&kind=PLUGIN`,
        sdk.superblocksBaseUrl
      ).toString(),
      config
    );
    spinner.stop();
    return response.data.data;
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
    return [];
  }
}
exports.fetchIntegrations = fetchIntegrations;

async function getIntegration(sdk, metadata, config) {
  const integrations = await fetchIntegrations(
    sdk,
    metadata.organization,
    config
  );
  const integration = integrations.find((ig) => metadata.name === ig.name);
  return integration;
}
exports.getIntegration = getIntegration;

/*
async function createIntegration(sdk, metadata, config) {
  const spinner = ora(`Creating integration ${metadata.name}`).start();
  const integrationId = v4();
  const configurationId = v4();

  try {
    // NOT ALLOWED
    const response = await axios.post(
      new URL(
        `${BASE_SERVER_API_URL_V2}/integrations`,
        sdk.superblocksBaseUrl
      ).toString(),
  
      {
        "id": integrationId,
        "name": metadata.name,
        "slug": metadata.name.toLowerCase(),
        "pluginId": "restapiintegration",
        "kind": "PLUGIN",
        "configurations": [
            {
                "id": configurationId,
                "isDefault": true,
                "integrationId": integrationId,
                "configuration": {
                    "authType": "bearer",
                    "name": metadata.name,
                    "urlBase": process.env.WEAVY_URL,
                    "authConfig": {
                        "bearerToken": process.env.WEAVY_APIKEY
                    }
                },
                "profileIds": [],
                "created": (new Date()).toISOString()
            }
        ]
      },
      config
    );

    spinner.succeed();
    return response.data.data;
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.createIntegration = createIntegration;
*/

async function initIntegration(sdk, metadata, config) {
  const spinner = ora(`Validating ${metadata.name} REST API`).start();
  let integration;
  try {
    integration = await getIntegration(sdk, metadata, config);

    if (!integration) {
      while (!integration) {
        spinner.stop();
        console.warn(`No ${metadata.name} integration found!`);
        console.log(`
    Open ${chalk.bold(
      `${sdk.superblocksBaseUrl}integrations/restapiintegration`
    )} and create a ${chalk.bold(`REST API`)} integration.
    - Set the ${chalk.bold(`Name`)} of the integration to ${chalk.blue(
          metadata.name
        )}.
    - Set the ${chalk.bold(`Base URL`)} to your Weavy environment url.
    - Set ${chalk.bold(`Authentication`)} to ${chalk.bold(
          `Bearer token`
        )} with a Weavy API key.
    - Add a ${chalk.bold(`Header`)}: 
      ${chalk.blue(`Content-Type`)} -> ${chalk.blue(`application/json`)}
    `);
        const replace = await inquirer.prompt([
          {
            name: "confirm",
            message: `When you have created the ${metadata.name}, do you want to try again?`,
            type: "confirm",
            default: true,
          },
        ]);
        if (replace.confirm) {
          spinner.start();
          integration = await getIntegration(sdk, metadata, config);
        } else {
          throw new Error(`No existing ${metadata.name} REST API integration`);
        }
      }
      //integration = await createIntegration(sdk, metadata, config);
    }
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
    exit(-1);
  }
  spinner.succeed(`Using existing ${metadata.name} REST API integration.`);
  return integration;
}
exports.initIntegration = initIntegration;

/* WORKFLOWS */
async function getWorkflow(sdk, metadata) {
  const workflows = await sdk.fetchApis();
  const workflow = workflows.find((wf) => metadata.name === wf.name);
  return workflow;
}
exports.getWorkflow = getWorkflow;

async function getFullWorkflow(sdk, workflowData, config) {
  const spinner = ora(`Fetching workflow ${workflowData.name}`);
  let response;
  try {
    response = await axios.get(
      new URL(
        `${BASE_SERVER_API_URL_V3}/apis/${workflowData.id}`,
        sdk.superblocksBaseUrl
      ).toString(),
      config
    );
    spinner.succeed();
    return response.data.data;
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.getFullWorkflow = getFullWorkflow;

async function initWorkflow(sdk, metadata, config) {
  const spinner = ora(`Initializing ${metadata.name} workflow`).start();
  let workflow = await getWorkflow(sdk, metadata);

  if (workflow) {
    spinner.succeed(`Found existing ${metadata.name} workflow`);
  } else {
    try {
      let pb;
      let pbJson = await fs.readFile(
        path.resolve(
          __dirname,
          `../templates/${metadata.name.toLowerCase()}.pb.json`
        ),
        { encoding: "utf8" }
      );

      if (metadata.integration) {
        pbJson = pbJson.replace(
          /"integration":\s*"[0-9a-f\-]*"/gu,
          `"integration": "${metadata.integration}"`
        );
      }

      pb = JSON.parse(pbJson);
      workflow = await createWorkflow(sdk, metadata, pb, config);
      spinner.succeed(`Created ${metadata.name} workflow`);
    } catch (e) {
      spinner.fail(`${spinner.text}: ${e.message}`);
    }
  }
  return workflow;
}
exports.initWorkflow = initWorkflow;

async function createWorkflow(sdk, metadata, pb = {}, config) {
  const spinner = ora(`Creating workflow ${metadata.name}`).start();

  try {
    const response = await axios.post(
      new URL(
        `${BASE_SERVER_API_URL_V3}/apis?v2=true`,
        sdk.superblocksBaseUrl
      ).toString(),
      {
        api: {
          metadata: metadata,
          ...pb,
        },
        lastSuccessfulWrite: -1,
      },
      config
    );
    spinner.succeed();
    return response.data.data;
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
    console.log(e);
  }
}
exports.createWorkflow = createWorkflow;

/** RESOURCES */

async function getResourceById(id) {
  try {
    const superblockConfig = require("../.superblocks/superblocks.json");
    return superblockConfig.resources[id];
  } catch (e) {
    console.error(e);
  }
}
exports.getResourceById = getResourceById;

async function getChosenResource(resourceType, defaultResource) {
  let superblockConfig, resources, chosenResource;

  try {
    superblockConfig = require("../.superblocks/superblocks.json");
    const resourceList = Array.from(
      Object.entries(superblockConfig.resources)
    ).map((r) => {
      return { id: r[0], ...r[1] };
    });
    resources = resourceType
      ? resourceList.filter((r) => (r.resourceType = resourceType))
      : resourceList;
  } catch (e) {
    console.error(e);
  }

  if (
    resources.length === 1 &&
    resources[0].location === defaultResource.location
  ) {
    chosenResource = resources[0];
  }

  if (!chosenResource && resources?.length) {
    const result = await inquirer.prompt({
      type: "list",
      name: "resource",
      message: `Which ${
        resourceType?.toLowerCase() || "resource"
      } do you want to use?`,
      choices: resources.map((r) => {
        return { name: r.location, value: r };
      }),
    });
    chosenResource = result.resource;
  }

  return chosenResource;
}
exports.getChosenResource = getChosenResource;

async function updateSuperblocksConfigResource(id, resource, sdk) {
  let superblockConfig, spinner;

  try {
    superblockConfig = require("../.superblocks/superblocks.json");
    spinner = ora("Updating superblocks resource config");
  } catch {
    spinner = ora("Creating superblocks resource config");
    superblockConfig = {
      configType: "ROOT",
      metadata: {
        cliVersion: sdk.cliVersion,
      },
      resources: {},
    };
  }
  spinner.start();

  for (const resourceKey in superblockConfig.resources) {
    if (
      superblockConfig.resources[resourceKey].location === resource.location
    ) {
      spinner.text = `Removing resource from config: ${resourceKey}`;

      const resMeta = superblockConfig.resources[resourceKey];
      delete superblockConfig.resources[resourceKey];
    }
  }

  spinner.text = "Updating superblocks resource config";

  // Add new resource entry
  superblockConfig.resources[id] = resource;

  const json = JSON.stringify(superblockConfig);

  const superblocksConfigPath = path.resolve(__dirname, "../.superblocks");

  try {
    if (!(await fs.stat(superblocksConfigPath)).isDirectory()) {
      throw new Error();
    }
  } catch {
    await fs.mkdir(superblocksConfigPath, { recursive: true });
  }

  try {
    await fs.writeFile(
      path.resolve(__dirname, "../.superblocks/superblocks.json"),
      json,
      { encoding: "utf8" }
    );
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.updateSuperblocksConfigResource = updateSuperblocksConfigResource;

async function pushToSuperblocks(sdk, resource) {
  const spinner = ora(
    `Pushing ${resource.resourceType.toLowerCase()} to ${
      sdk.superblocksBaseUrl
    }`
  ).start();
  try {
    await exec(
      `superblocks push ${resource.location.replace("'", "\\'")} --skip-commit`
    );
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.pushToSuperblocks = pushToSuperblocks;

async function commitWorkflow(sdk, workflow, config) {
  const spinner = ora(`Committing workflow ${workflow.name}`).start();

  try {
    const response = await axios.post(
      new URL(
        `${BASE_SERVER_API_URL_V3}/apis/${workflow.id}/commit`,
        sdk.superblocksBaseUrl
      ).toString(),
      {
        commitMessage: "Weavy deploy",
      },
      config
    );

    commitId = response.data.data.commitId;
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
  return commitId;
}
exports.commitWorkflow = commitWorkflow;

async function deployWorkflow(sdk, workflow, commitId, config) {
  const spinner = ora(`Deploying workflow ${workflow.name}`).start();

  /* Unfortunately not allowed in API */
  try {
    await axios.post(
      new URL(
        `${BASE_SERVER_API_URL_V3}/apis/${workflow.id}/deployments`,
        sdk.superblocksBaseUrl
      ).toString(),
      {
        commitId: commitId,
        deployMessage: "Weavy deploy",
      },
      config
    );
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.deployWorkflow = deployWorkflow;

/* APPS */
async function getApp(sdk, metadata) {
  const apps = await sdk.fetchApplications();
  const foundApp = apps.find((a) => metadata.name === a.name);
  if (foundApp) {
    const appData = await sdk.fetchApplication({
      applicationId: foundApp.id,
      viewMode: "editor",
    });
    return appData.application;
  }
}
exports.getApp = getApp;

async function chooseApp(sdk) {
  const apps = await sdk.fetchApplications();
  let chosenApp;

  if (apps.length) {
    const result = await inquirer.prompt({
      type: "list",
      name: "app",
      message: `Which app do you want to use?`,
      choices: apps.map((a) => {
        return { name: `${a.name}: ${a.id}`, value: a };
      }),
    });
    chosenApp = result.app;
  }

  if (chosenApp) {
    const appData = await sdk.fetchApplication({
      applicationId: chosenApp.id,
      viewMode: "editor",
    });
    return appData.application;
  }
}
exports.chooseApp = chooseApp;

async function createApp(sdk, appData, config) {
  const spinner = ora(`Creating app ${appData.name}`).start();
  let response;
  try {
    response = await axios.post(
      new URL(
        `${BASE_SERVER_API_URL_V2}/applications?viewMode=editor`,
        sdk.superblocksBaseUrl
      ).toString(),
      appData,
      config
    );
    spinner.succeed(`Creating app ${appData.name}: ${response.data.data.id}`);
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
    console.log(e);
    exit(-1);
  }
  return response;
}
exports.createApp = createApp;

async function chooseAppPages(app) {
  const pages = app.pageSummaryList;
  let chosenPages;

  if (pages?.length) {
    const result = await inquirer.prompt({
      type: "checkbox",
      name: "pages",
      message: `Which pages do you want to configure?`,
      choices: pages.map((p) => {
        return { name: `${p.name}: ${p.id}`, checked: true, value: p };
      }),
    });
    chosenPages = result.pages;
  }
  return chosenPages;
}
exports.chooseAppPages = chooseAppPages;

async function getAppPage(sdk, app, page, config) {
  const response = await axios.get(
    new URL(
      `${BASE_SERVER_API_URL_V2}/applications/${app.id}/pages/${page.id}?viewMode=editor`,
      sdk.superblocksBaseUrl
    ).toString(),
    config
  );
  return response.data.data;
}
exports.getAppPage = getAppPage;

async function initApp(sdk, metadata, config, integrationMetadata) {
  let app = await getApp(sdk, metadata);

  if (app) {
    const replace = await inquirer.prompt([
      {
        name: "confirm",
        message: `Found an existing ${metadata.name} in your organization, do you want to update the app?`,
        type: "confirm",
        default: true,
      },
    ]);
    if (!replace.confirm) {
      app = null;
    }
  }

  if (!app) {
    const dsl =
      await require(`../templates/${metadata.name.toLowerCase()}.dsl.json`);
    let appData = { ...metadata, initialPageDSL: dsl };

    const weavyUrl = await getWeavyURL(sdk, integrationMetadata, config);
    appData = await applyStateVarWeavyUrl(appData, weavyUrl);
    appData = await applyEventNavigate(appData);
    const response = await createApp(sdk, appData, config);
    app = response.data.data;
  }

  return app;
}
exports.initApp = initApp;

async function createAppPageApi(sdk, app, page, config, appApi) {
  await axios.post(
    new URL(
      `${BASE_SERVER_API_URL_V3}/apis?v2=true`,
      sdk.superblocksBaseUrl
    ).toString(),
    {
      api: appApi,
      applicationId: app.id,
      pageId: page.id,
      //lastSuccessfulWrite: -1,
    },
    config
  );
}
exports.createAppPageApi = createAppPageApi;

async function createAppAuthWorkflowLink(
  sdk,
  workflow,
  user,
  app,
  page,
  config
) {
  const spinner = ora(
    `Creating GetWeavyToken workflow link for ${page.name}`
  ).start();

  try {
    await createAppPageApi(sdk, app, page, config, {
      metadata: {
        name: "GetWeavyToken",
        organization: user.currentOrganizationId,
      },
      blocks: [
        {
          name: "UpdateUserAndGetToken",
          step: {
            integration: "workflow",
            workflow: {
              custom: {
                user: {
                  value: "{{Global.user}}",
                },
              },
              workflow: workflow.id,
            },
          },
        },
      ],
      trigger: {
        application: {
          id: app.id,
          pageId: page.id,
        },
      },
    });
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.createAppAuthWorkflowLink = createAppAuthWorkflowLink;

async function createAppSetNavigationWorkflowLink(
  sdk,
  workflow,
  user,
  app,
  page,
  config
) {
  const spinner = ora(
    `Creating SetWeavyNavigation workflow link for ${page.name}`
  ).start();

  try {
    await createAppPageApi(sdk, app, page, config, {
      metadata: {
        name: "SetWeavyNavigation",
        organization: user.currentOrganizationId,
      },
      blocks: [
        {
          name: "SaveMetadata",
          step: {
            integration: "workflow",
            workflow: {
              custom: {
                uid: {
                  value: "{{pageNavigationUid.value}}",
                },
                url: {
                  value: "{{Global.URL}}",
                },
                appId: {
                  value: "{{Global.app.id}}",
                },
              },
              workflow: workflow.id,
            },
          },
        },
      ],
      trigger: {
        application: {
          id: app.id,
          pageId: page.id,
        },
      },
    });
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.createAppSetNavigationWorkflowLink = createAppSetNavigationWorkflowLink;

async function fetchAppFiles(sdk, app, resource) {
  try {
    await execWithOutput(
      `superblocks init ${sdk.superblocksBaseUrl}applications/${app.id} -m latest-edits`
    );
  } catch (e) {
    console.error(e);
    exit(-1);
  }

  if (!resource) {
    resource = await getResourceById(app.id);
  }
  try {
    await execWithOutput(
      `superblocks pull ${resource.location.replace("'", "\\'")}`
    );
  } catch (e) {
    console.error(e);
    exit(-1);
  }

  return resource;
}
exports.fetchAppFiles = fetchAppFiles;

async function applyStateVarWeavyUrl(appData, weavyUrl) {
  appData.configuration ??= {};
  appData.configuration.dsl ??= { version: 8 };
  appData.configuration.dsl.stateVars ??= {};
  appData.configuration.dsl.stateVars.stateVarMap ??= {};

  const stateVarMap = appData.configuration?.dsl?.stateVars?.stateVarMap;

  for (const stateVar in stateVarMap) {
    if (stateVarMap[stateVar].name === "WEAVY_URL") {
      delete stateVarMap[stateVar];
    }
  }

  const stateVarUuid = v4();
  stateVarMap[stateVarUuid] = {
    createdAt: Date.now(),
    defaultValue: weavyUrl,
    //dynamicBindingPathList: [],
    //dynamicTriggerPathList: [],
    id: stateVarUuid,
    name: "WEAVY_URL",
    persistance: "Temporary",
  };
  return appData;
}
exports.applyStateVarWeavyUrl = applyStateVarWeavyUrl;

async function applyEventNavigate(appData) {
  appData.configuration ??= {};
  appData.configuration.dsl ??= { version: 8 };
  appData.configuration.dsl.events ??= {};
  appData.configuration.dsl.events.eventMap ??= {};

  const eventMap = appData.configuration?.dsl?.events?.eventMap;

  for (const event in eventMap) {
    if (eventMap[event].name === "navigateFromNotification") {
      delete eventMap[event];
    }
  }

  const eventUuid = v4();
  const eventArgUuid = v4();

  eventMap[eventUuid] = {
    id: eventUuid,
    name: "navigateFromNotification",
    arguments: [
      {
        id: eventArgUuid,
        name: "navigateData",
      },
    ],
    onTrigger: [
      {
        id: "ik3tohzzvy",
        code: '// Get data from the Weavy Notification Events component\nlet { url, appId, queryParams } = WeavyNotificationEvents1.navigateData;\n\n// Set default target\nlet target = "SAME_WINDOW";\n\n// Check if it\'s from a different Superblocks app\nif (appId !== Global.app.id) {\n  // Construct an url to the other app\n  url = new URL(\n    "." + url,\n    `https://${Global.URL.host}/applications/${appId}/`,\n  ).toString();\n\n  // Open the other app in a new tab\n  target = "NEW_WINDOW";\n}\n\n// Navigate to the page\nnavigateTo(url, queryParams, target);\n',
        type: "runJs",
      },
    ],
  };

  appData.initialPageDSL = applyToChildren(
    appData.initialPageDSL,
    (component) => {
      if (component.onNavigate) {
        //console.log("Found nav event", component);
        component.onNavigate.forEach((onNavEvent) => {
          if (
            onNavEvent.type === "triggerEvent" &&
            onNavEvent.event.name === "App.navigateFromNotification"
          ) {
            onNavEvent.event.id = eventUuid;
            onNavEvent.eventPayload = {
              [eventArgUuid]: `{{${component.widgetName}.navigateData}}`,
            };
          }
        });
      }
      return component;
    }
  );

  return appData;
}
exports.applyEventNavigate = applyEventNavigate;

async function validateStateVarWeavyUrl(sdk, app, integrationMetadata, config) {
  const weavyUrl = await getWeavyURL(sdk, integrationMetadata, config);
  let validStateVar = false;
  do {
    const appData = (
      await sdk.fetchApplication({
        applicationId: app.id,
        viewMode: "editor",
      })
    ).application;

    if (!appData) {
      throw new Error(`Could not get app ${app.name}`);
    }
    const stateVarMap =
      appData.configuration?.dsl?.stateVars?.stateVarMap || {};

    const foundStateVar = Object.values(stateVarMap).find(
      (stateVar) => stateVar.name === "WEAVY_URL"
    );
    if (foundStateVar && foundStateVar.defaultValue === weavyUrl) {
      validStateVar = true;
    } else if (foundStateVar) {
      const tryAgain = await inquirer.prompt([
        {
          name: "confirm",
          message: `Your WEAVY_URL variable should have the default value "${weavyUrl}", do you want to try again?`,
          type: "confirm",
          default: true,
        },
      ]);

      if (!tryAgain.confirm) {
        validStateVar = true;
      }
    } else {
      console.warn(`No WEAVY_URL is created yet!`);
      console.log(`
        For the Weavy components to function properly, you must create a WEAVY_URL variable in your app.

        Open ${chalk.bold(
          `${sdk.superblocksBaseUrl}applications/edit/${appData.id}`
        )} and create a ${chalk.bold(`Frontend variable`)} in the ${chalk.bold(
        `App scope`
      )}.
        - Set it as a temporary variable.
        - Set the ${chalk.bold(`Name`)} of the variable to ${chalk.blue(
        `WEAVY_URL`
      )}.
        - Set the ${chalk.bold(
          `Default value`
        )} to your Weavy environment url: ${chalk.blue(weavyUrl)}
        `);
      const tryAgain = await inquirer.prompt([
        {
          name: "confirm",
          message: `When you have created a WEAVY_URL state variable, do you want to try again?`,
          type: "confirm",
          default: true,
        },
      ]);

      if (!tryAgain.confirm) {
        validStateVar = true;
      }
    }
  } while (!validStateVar);
}
exports.validateStateVarWeavyUrl = validateStateVarWeavyUrl;

async function getWeavyURL(sdk, integrationMetadata, config) {
  const integration = await getIntegration(sdk, integrationMetadata, config);
  const defaultConfig = integration.configurations.find(
    (config) => config.isDefault
  );
  const weavyUrl = defaultConfig?.configuration.urlBase;
  return weavyUrl;
}

/* COMPONENTS */

async function createComponentsSymlinks(resource) {
  const spinner = ora("Creating components symlinks").start();

  const componentTemplatePath = path.resolve(
    __dirname,
    "../templates/components"
  );
  const appComponentsPath = path.resolve(
    __dirname,
    `../${resource.location}/components`
  );
  //const libsTemplatePath = path.resolve(__dirname, "../templates/libs");
  //const appLibsPath = path.resolve(__dirname, `../${resource.location}/libs`);

  try {
    if (!(await fs.stat(appComponentsPath)).isDirectory()) {
      throw new Error();
    }
  } catch {
    await fs.mkdir(appComponentsPath, { recursive: true });
  }

  /*try {
    if (!(await fs.stat(appLibsPath)).isDirectory()) {
      throw new Error();
    }
  } catch {
    await fs.mkdir(appLibsPath, { recursive: true });
  }*/

  let folderPaths = (
    await fs.readdir(componentTemplatePath, { withFileTypes: true })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return {
        name: dirent.name,
        target: path.join(componentTemplatePath, dirent.name),
        path: path.join(appComponentsPath, dirent.name),
      };
    });

  /*folderPaths = folderPaths.concat(
    (await fs.readdir(libsTemplatePath, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => {
        return {
          target: path.join(libsTemplatePath, dirent.name),
          path: path.join(appLibsPath, dirent.name),
        };
      })
  );*/

  try {
    for (const folderPath in folderPaths) {
      const folder = folderPaths[folderPath];
      try {
        const folderPathStat = await fs.lstat(folder.path);

        if (folderPathStat.isDirectory()) {
          spinner.stop();
          const remove = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirm",
              message: `Do you want to remove existing component directory ${folder.name}?`,
              default: true,
            },
          ]);

          spinner.start();
          if (remove.confirm) {
            await fs.rm(folder.path, { recursive: true });
          }
        }
        if (!folderPathStat.isSymbolicLink()) {
          throw new Error();
        }
      } catch {
        await fs.symlink(folder.target, folder.path, "dir");
      }
    }
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.createComponentsSymlinks = createComponentsSymlinks;

async function copyComponentsConfigToApp(resource) {
  const spinner = ora("Copying component config").start();

  const appConfigTemplatePath = path.resolve(
    __dirname,
    "../node_modules/@superblocksteam/cli/assets/custom-components/setup"
  );
  const appPath = path.resolve(__dirname, `../${resource.location}`);

  try {
    if (!(await fs.stat(appPath)).isDirectory()) {
      throw new Error();
    }
  } catch {
    await fs.mkdir(appPath, { recursive: true });
  }

  try {
    await fs.cp(appConfigTemplatePath, appPath, {
      recursive: true,
      force: true,
    });
    try {
      const ignorePath = path.resolve(appPath, "./.gitignore");
      const ignoreRenamePath = path.resolve(appPath, "./gitignore_will_rename");
      if ((await fs.stat(ignorePath)).isFile()) {
        await fs.rm(ignoreRenamePath);
      } else {
        await fs.rename(ignoreRenamePath, ignorePath, {
          force: true,
        });
      }
    } catch {}
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.copyComponentsConfigToApp = copyComponentsConfigToApp;

async function copyComponentsToApp(resource) {
  const spinner = ora("Copying components").start();

  const componentTemplatePath = path.resolve(
    __dirname,
    "../templates/components"
  );
  const appComponentsPath = path.resolve(
    __dirname,
    `../${resource.location}/components`
  );

  try {
    if (!(await fs.stat(appComponentsPath)).isDirectory()) {
      throw new Error();
    }
  } catch {
    await fs.mkdir(appComponentsPath, { recursive: true });
  }

  // Remove previous symlinks

  let folderPaths = (
    await fs.readdir(componentTemplatePath, { withFileTypes: true })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return {
        target: path.join(componentTemplatePath, dirent.name),
        path: path.join(appComponentsPath, dirent.name),
      };
    });

  try {
    for (const folderPath in folderPaths) {
      const folder = folderPaths[folderPath];

      try {
        if ((await fs.lstat(folder.path)).isSymbolicLink()) {
          await fs.rm(folder.path);
        }
      } catch {
        /* No worries */
      }
      await fs.cp(folder.target, folder.path, { recursive: true, force: true });
    }
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }

  /*try {
    await fs.cp(componentTemplatePath, appComponentsPath, { recursive: true, force: true });
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }*/
}
exports.copyComponentsToApp = copyComponentsToApp;

async function installComponentPackages(resource, version) {
  const spinner = ora(
    `Installing app packages${version ? ` with WEAVY_DEV_VERSION` : ""}`
  ).start();
  try {
    await exec(
      `npm install @weavy/uikit-react${version ? `@${version}` : ""}`,
      {
        cwd: path.resolve(__dirname, `../${resource.location}`),
      }
    );
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.installComponentPackages = installComponentPackages;

async function buildAndUploadComponents(resource) {
  console.log(`Building and uploading components...`);
  try {
    await execWithOutput(`superblocks components upload`, {
      cwd: path.resolve(__dirname, `../${resource.location}`),
    });
  } catch (e) {
    console.error(e);
    exit(-1);
  }
}
exports.buildAndUploadComponents = buildAndUploadComponents;

async function startComponentsWatch(resource) {
  console.log(`Starting components watch mode...`);
  try {
    await execWithOutput(`superblocks components watch`, {
      cwd: path.resolve(__dirname, `../${resource.location}`),
    });
  } catch (e) {
    console.error(e);
    exit(-1);
  }
}
exports.startComponentsWatch = startComponentsWatch;

/* TEMPLATES */
async function saveWorkflowTemplate(workflow) {
  const spinner = ora(
    `Saving workflow pb template for ${workflow.name}`
  ).start();
  try {
    if (!workflow.apiPb) {
      throw new Error("No apiPb found");
    }

    const blocks = workflow.apiPb.blocks;
    const trigger = workflow.apiPb.trigger;

    const pbJson = JSON.stringify({ blocks, trigger }, undefined, 2);

    await fs.writeFile(
      path.resolve(
        __dirname,
        `../templates/${workflow.name.toLowerCase()}.pb.json`
      ),
      pbJson,
      { encoding: "utf8" }
    );
    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.saveWorkflowTemplate = saveWorkflowTemplate;

async function saveAppPageDSL(sdk, app, page, config) {
  const spinner = ora(`Saving page dsl template for ${app.name}`).start();
  try {
    const pageData = await getAppPage(sdk, app, page, config);
    const dsl = pageData.page.layouts[0].dsl;

    {
      const dslJson = JSON.stringify(dsl, undefined, 2);

      await fs.writeFile(
        path.resolve(
          __dirname,
          `../templates/${app.name.toLowerCase()}.dsl.json`
        ),
        dslJson,
        { encoding: "utf8" }
      );
    }

    spinner.succeed();
  } catch (e) {
    spinner.fail(`${spinner.text}: ${e.message}`);
  }
}
exports.saveAppPageDSL = saveAppPageDSL;
