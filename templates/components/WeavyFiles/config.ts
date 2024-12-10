import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "197bbdfa-e12f-4418-a0f2-f97acd3282bd",
  name: "WeavyFiles",
  displayName: "Weavy Files",
  componentPath: "components/WeavyFiles/component.tsx",
  properties: [
    {
      path: "uid",
      dataType: "string",
      description: "The uid for the Weavy Files component. Should be a unique identifier that may relate to where it's used.",
      propertiesPanelDisplay: {
        label: "Uid",
        controlType: "text",
        exampleData: "superblocks:files-123",
        placeholder: "Set an uid for reference"
      },
    },
    {
      path: "name",
      dataType: "string",
      description: "The display name of the component. Used in notifications etc.",
      propertiesPanelDisplay: {
        label: "Display name",
        controlType: "text",
        exampleData: "My files",
      },
    },
    {
      path: "enableAttachments",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Attachments",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableComments",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Comments",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableCloudFiles",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Cloud Files",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableMentions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Mentions",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enablePreviews",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Previews",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableReactions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Reactions",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableVersions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Versions",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableWebDAV",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "WebDAV",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableNotifications",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Notification button",
        controlType: "switch",
        defaultValue: true,
      }
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
      isExternallyReadable: true,
      isExternallySettable: true,
    },
    {
      path: "accessToken",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "User Access Token",
        controlType: "js-expr",
        defaultValue: "GetWeavyToken.response?.access_token",
      },
      isExternallyReadable: true,
      isExternallySettable: true,
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
  ],
  events: [
    {
      label: "On Set Weavy Navigation",
      path: "onSetWeavyNavigation",
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
