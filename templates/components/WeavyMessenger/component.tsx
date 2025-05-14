import { useSuperblocksContext } from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { Feature, useWeavy, WyMessenger } from "@weavy/uikit-react";

export default function WeavyMessenger({
  name,
  agent,
  contextData,
  weavyUrl,
  accessToken,
  weavyOptions = {},
  theme,
  forceDarkMode,
  ...props
}: Props) {
  const weavyContainerStyle: React.CSSProperties & {
    [key: `--${string}`]: string | undefined;
  } = {
    display: "flex",
    height: "100%",
    width: "100%",
    fontFamily: theme?.fontFamily,
    ["--wy-border-radius"]:
      theme?.borderRadius.value + theme?.borderRadius.mode,
    ["--wy-theme-color"]: theme?.colors.primary500,
    ["--wy-padding"]: theme && (theme.padding.bottom.value/2 + theme.padding.bottom.mode),
    ["--wy-gap"]: theme && (theme.padding.bottom.value/2 + theme.padding.bottom.mode),
  };

  const modeClassName = forceDarkMode || theme?.mode === "DARK" ? "wy-dark" : "";

  const {
    events: { onTokenExpired },
  } = useSuperblocksContext<Props, EventTriggers>();

  useWeavy({
    url: weavyUrl,
    tokenFactory: async (refresh: boolean) => {
      if (refresh) {
        console.log("onTokenExpired: " + accessToken);
        onTokenExpired();
      }
      return accessToken;
    },
    ...weavyOptions,
  }, [accessToken]);

  const features = [
    props.enableAttachments && Feature.Attachments,
    props.enableCloudFiles && Feature.CloudFiles,
    Feature.ContextData,
    props.enableEmbeds && Feature.Embeds,
    props.enableGoogleMeet && Feature.GoogleMeet,
    props.enableMicrosoftTeams && Feature.MicrosoftTeams,
    props.enableZoomMeetings && Feature.ZoomMeetings,
    props.enableMentions && Feature.Mentions,
    props.enablePolls && Feature.Polls,
    props.enablePreviews && Feature.Previews,
    props.enableReactions && Feature.Reactions,
    props.enableReceipts && Feature.Receipts,
    props.enableTyping && Feature.Typing,
  ].filter((f) => f).join(" ");

  return (
    <WyMessenger
      agent={agent || undefined}
      data={contextData ? [contextData] : undefined}
      style={weavyContainerStyle}
      className={modeClassName}
      name={name || undefined}
      features={features}
    />
  );
}
