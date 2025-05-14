import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "400d6451-092f-40df-b2d4-7c6328009fdx",
  name: "WeavyCopilot",
  displayName: "Weavy Copilot",
  componentPath: "components/WeavyCopilot/component.tsx",
  properties: [
    {
      path: "agent",
      dataType: "string",
      propertiesPanelDisplay: {
        label: "Agent name",
        controlType: "text",
        placeholder: "Agent uid",
        defaultValue: "assistant",
        exampleData: "assistant"
      },
    },
    {
      path: "instructions",
      dataType: "string",
      description: "Instructions for the copilot",
      propertiesPanelDisplay: {
        label: "Instructions",
        controlType: "text",
        placeholder: "Provide instructions for the bot"
      },
    },
    {
      path: "contextData",
      dataType: "string",
      description: "Any content or context data for the copilot to work with.",
      propertiesPanelDisplay: {
        label: "Context data",
        controlType: "text",
        placeholder: "Provide some structured data"
      },
    },
    {
      path: "suggestions",
      dataType: "any",
      description: "Array of text message suggestions to be displayed as buttons.",
      propertiesPanelDisplay: {
        label: "Suggestions",
        controlType: "js-expr",
        defaultValue: "['Summarize this page']",
        exampleData: "['Summarize this page', 'Suggest changes']",
        placeholder: "Set an array of text suggestions"
      },
    },
    {
      path: "enableNewButton",
      dataType: "boolean",
      description: "Enable a button to make a new conversation.",
      propertiesPanelDisplay: {
        label: "New button",
        controlType: "switch",
        defaultValue: true,
      }
    },
    {
      path: "uid",
      dataType: "string",
      description: "Optional uid for the Weavy Copilot component. Should be a unique identifier (for each user and bot) that may relate to where it's used.",
      propertiesPanelDisplay: {
        label: "Uid",
        controlType: "text",
        exampleData: "superblocks:copilot-123",
        placeholder: "Optional uid for reference"
      },
    },
    {
      path: "enableAutoUid",
      dataType: "boolean",
      description: "Automatically generates an uid with the bot and user appended.",
      propertiesPanelDisplay: {
        label: "Append bot and user to Uid",
        controlType: "switch",
        defaultValue: true,
      }
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
    /*{
      path: "enableAttachments",
      dataType: "boolean",
      isExternallySettable: false,
      isExternallyReadable: false,
      propertiesPanelDisplay: {
        label: "Attachments",
        controlType: "switch",
        defaultValue: false,
      }
    },*/
    /*{
      path: "enableContextData",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Context data",
        controlType: "switch",
        defaultValue: true,
      }
    },*/
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
      path: "enableMentions",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Mentions",
        controlType: "switch",
        defaultValue: false,
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
        defaultValue: false,
      }
    },
    {
      path: "enableTyping",
      dataType: "boolean",
      propertiesPanelDisplay: {
        label: "Typing indicators",
        controlType: "switch",
        defaultValue: true,
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
    {
      path: "appId",
      dataType: "number",
      description: "A reference to the current app",
      isExternallySettable: false,
      isExternallyReadable: true
    },
    {
      path: "lastMessage",
      dataType: "any",
      description: "The last message sent",
      isExternallySettable: false,
      isExternallyReadable: true
    }
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
    {
      label: "On App Changed",
      path: "onApp",
    },
    {
      label: "On Message",
      path: "onMessage",
    },
  ],
  gridDimensions: {
    initialColumns: 50,
    initialRows: 30,
  },
} satisfies ComponentConfig;
