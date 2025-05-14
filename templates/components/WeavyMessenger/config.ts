import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "4a23ea18-07dc-443f-93a9-fdfec31fa927",
  name: "WeavyMessenger",
  displayName: "Weavy Messenger",
  componentPath: "components/WeavyMessenger/component.tsx",
  properties: [
    {
      path: "name",
      dataType: "string",
      description: "The display name of the component. Used in title.",
      propertiesPanelDisplay: {
        label: "Display name",
        controlType: "text",
        exampleData: "My messenger",
      },
    },
    {
      path: "agent",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "Agent mode",
        controlType: "text",
        placeholder: "Optional agent uid",
        exampleData: "assistant"
      },
    },
    {
      path: "contextData",
      dataType: "string",
      description: "Any content or context data for the agent to work with.",
      propertiesPanelDisplay: {
        label: "Context data",
        controlType: "text",
        placeholder: "Provide some structured data"
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
      path: "enableCloudFiles",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Cloud Files",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableEmbeds",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Embeds",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableGoogleMeet",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Google Meet",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableMicrosoftTeams",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Microsoft Teams",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableZoomMeetings",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Zoom Meetings",
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
      path: "enablePolls",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Polls",
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
      path: "enableReceipts",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Message receipts",
        controlType: "switch",
        defaultValue: true,
      },
    },
    {
      path: "enableTyping",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Typing indicators",
        controlType: "switch",
        defaultValue: true,
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
  ],
  events: [
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
