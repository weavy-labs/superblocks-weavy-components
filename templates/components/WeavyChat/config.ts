import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "400d6451-092f-40df-b2d4-7c6328009fda",
  name: "WeavyChat",
  displayName: "Weavy Chat",
  componentPath: "components/WeavyChat/component.tsx",
  properties: [
    {
      path: "uid",
      dataType: "string",
      description: "The uid for the Weavy Chat component. Should be a unique identifier that may relate to where it's used.",
      propertiesPanelDisplay: {
        label: "Uid",
        controlType: "text",
        exampleData: "superblocks:chat-123",
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
        exampleData: "My chat",
      },
    },
    {
      path: "enableAttachments",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Attachments",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableCloudFiles",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Cloud Files",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableEmbeds",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Embeds",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableGoogleMeet",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Google Meet",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableMicrosoftTeams",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Microsoft Teams",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableZoomMeetings",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Zoom Meetings",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableMentions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Mentions",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enablePolls",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Polls",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enablePreviews",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Previews",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableReactions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Reactions",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "enableReceipts",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Reactions",
        controlType: "switch",
        defaultValue: false,
      }
    },
    {
      path: "enableTyping",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Typing indicators",
        controlType: "switch",
        defaultValue: false,
      }
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
