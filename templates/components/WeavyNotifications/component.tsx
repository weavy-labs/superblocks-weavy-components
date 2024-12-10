import { useSuperblocksContext } from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { useWeavy, WyNotifications } from "@weavy/uikit-react";
import { useLinkHandler } from "../WeavyNotificationEvents/notifications";

export default function WeavyNotifications({
  uid,
  weavyUrl,
  accessToken,
  weavyOptions = {},
  theme,
  forceDarkMode,
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
    updateProperties,
    events: { onTokenExpired, onNavigate },
  } = useSuperblocksContext<Props, EventTriggers>();

  const weavy = useWeavy({
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

  const { handleLink } = useLinkHandler(weavy, updateProperties, onNavigate);

  return (
    <WyNotifications
      style={weavyContainerStyle}
      className={modeClassName}
      uid={uid}
      onWyLink={handleLink}
    />
  );
}
