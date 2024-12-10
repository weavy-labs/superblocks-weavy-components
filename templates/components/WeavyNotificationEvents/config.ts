import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "20f3a396-2aaf-41f9-bd45-649335ca399e",
  name: "WeavyNotificationEvents",
  displayName: "Weavy Notification Events",
  componentPath: "components/WeavyNotificationEvents/component.tsx",
  properties: [
    {
      path: "showLoading",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Show update spinner",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "nativeNotifications",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Native browser notifications",
        controlType: "switch",
        defaultValue: false,
      },
    },
    {
      path: "disableNotifications",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Disable notification toasts",
        controlType: "switch",
        defaultValue: false,
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
      },
    },
    {
      path: "accessToken",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "User Access Token",
        controlType: "js-expr",
        defaultValue: "GetWeavyToken.response?.access_token",
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
      path: "notificationCount",
      dataType: "number",
      description: "The number of unread notifications.",
      isExternallyReadable: true,
      isExternallySettable: false,
    },
    {
      path: "notificationTitle",
      dataType: "string",
      description: "The title of the most recent notification event",
      isExternallyReadable: true,
      isExternallySettable: false,
    },
    {
      path: "notificationDescription",
      dataType: "string",
      description: "The description of the most recent notification event.",
      isExternallyReadable: true,
      isExternallySettable: false,
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
      label: "On Notification",
      path: "onNotification",
    },
    {
      label: "On Navigate",
      path: "onNavigate",
    },
    {
      label: "On Show Messenger",
      path: "onShowMessenger"
    },
    {
      label: "On Token Expired",
      path: "onTokenExpired",
    },
  ],
  gridDimensions: {
    initialColumns: 3,
    initialRows: 3,
  },
} satisfies ComponentConfig;
