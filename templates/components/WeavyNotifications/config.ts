import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "7ae0214d-3621-4fb1-a468-c4333038340f",
  name: "WeavyNotifications",
  displayName: "Weavy Notifications",
  componentPath: "components/WeavyNotifications/component.tsx",
  properties: [
    {
      path: "uid",
      dataType: "string",
      description: "Optional uid to only show notifications for a specific Weavy component",
      propertiesPanelDisplay: {
        label: "Uid (optional)",
        placeholder: "App uid to filter by",
        controlType: "text",
      },
    },
    {
      path: "forceDarkMode",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Force dark mode",
        controlType: "switch",
        defaultValue: false,
      }
    },
    {
      path: "theme",
      dataType: "any",
      propertiesPanelDisplay: {
        label: "Theme",
        controlType: "js-expr",
        defaultValue: "theme",
        exampleData: "theme",
        placeholder: "Set theme settings"
      },
    },
    {
      path: "weavyUrl",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "Weavy Url",
        controlType: "js-expr",
        defaultValue: "App.WEAVY_URL.value",
        exampleData: "App.WEAVY_URL.value"
      },
    },
    {
      path: "accessToken",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "User Access Token",
        controlType: "js-expr",
        defaultValue: "GetWeavyToken.response?.access_token",
        exampleData: "GetWeavyToken.response?.access_token",
      },
    },
    {
      path: "weavyOptions",
      dataType: "any",
      description: "Additional Weavy configuration properties",
      propertiesPanelDisplay: {
        label: "Weavy options",
        exampleData: "{}",
        expectedType: "WeavyOptions",
        controlType: "js-expr",
        defaultValue: "{}",
      },
    },
    {
      path: "linkData",
      dataType: "any",
      description: "The link event data for onNavigate",
      isExternallyReadable: true,
      isExternallySettable: false,
    },
    {
      path: "navigateData",
      dataType: "any",
      description: "The url event data for onNavigate",
      isExternallyReadable: true,
      isExternallySettable: false,
    },
  ],
  events: [
    {
      label: "On Navigate",
      path: "onNavigate",
    },
    {
      label: "On Token Expired",
      path: "onTokenExpired",
    },
  ],
  gridDimensions: {
    initialColumns: 50,
    initialRows: 30,
  },
} satisfies ComponentConfig;
