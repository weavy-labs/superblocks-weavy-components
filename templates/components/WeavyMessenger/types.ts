// GENERATED CODE -- DO NOT EDIT!
//
// This file is automatically generated by the Superblocks CLI
// Use the `superblocks components watch` command to regenerate this file from its source in config.ts

// All properties of your component are defined here.
// These are the properties which are surfaced in the Superblocks properties panel
// and can be referenced throughout your Superblocks Application
export type Props = {
  name: string | null;
  bot: string | null;
  enableAttachments: boolean;
  enableCloudFiles: boolean;
  enableGoogleMeet: boolean;
  enableMicrosoftTeams: boolean;
  enableZoomMeetings: boolean;
  enableMentions: boolean;
  enablePolls: boolean;
  enablePreviews: boolean;
  enableReactions: boolean;
  enableReceipts: boolean;
  enableTyping: boolean;
  forceDarkMode: boolean;
  theme: any;
  weavyUrl: string | null;
  accessToken: string | null;
  weavyOptions: any;
};

export type EventTriggers = {
  // Call the subsequent function(s) to trigger event(s) in Superblocks from your component.
  // These events can be wired up to event handlers in your Superblocks App
  onTokenExpired: () => void;
};