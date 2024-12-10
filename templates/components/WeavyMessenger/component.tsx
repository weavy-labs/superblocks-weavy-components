import { useSuperblocksContext } from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { useWeavy, WyMessenger } from "@weavy/uikit-react";

export default function WeavyMessenger({
  name,
  bot,
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

  const featureProps = {
    noAttachments: props.enableAttachments === false,
    noCloudFiles: props.enableCloudFiles === false,
    noGoogleMeet: props.enableGoogleMeet === false,
    noMicrosoftTeams: props.enableMicrosoftTeams === false,
    noZoomMeetings: props.enableZoomMeetings === false,
    noMentions: props.enableMentions === false,
    noPolls: props.enablePolls === false,
    noPreviews: props.enablePreviews === false,
    noReactions: props.enableReactions === false,
    noReceipts: props.enableReceipts === false,
    noTyping: props.enableTyping === false,
  };

  return (
    <WyMessenger
      bot={bot || undefined}
      style={weavyContainerStyle}
      className={modeClassName}
      name={name}
      {...featureProps}
    />
  );
}
