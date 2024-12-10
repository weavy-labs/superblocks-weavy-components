import {
  useSuperblocksContext,
  useSuperblocksIsLoading,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { useWeavy, WyChat } from "@weavy/uikit-react";
import { useSetWeavyNavigationCallback } from "../WeavyNotificationEvents/notifications";
import { ComponentProps, useEffect } from "react";
import { useHooksInternalContext } from "@superblocksteam/custom-components/dist/hooksPlumbing";

export default function WeavyChat({
  uid,
  name,
  weavyUrl,
  accessToken,
  weavyOptions = {},
  theme,
  forceDarkMode,
  enableNotifications,
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
    updateProperties,
    events: { onSetWeavyNavigation, onTokenExpired },
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

  const { widgetId } = useHooksInternalContext().ccRenderingContext;
  const isLoading = useSuperblocksIsLoading();

  useEffect(() => {
    if (!isLoading && !uid) {
      // Set default uid when not defined
      updateProperties({
        uid: `superblocks:chat-${widgetId}`,
      });
    }
  }, [isLoading]);

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
  };

  const notificationProps = {
    notifications: (enableNotifications
      ? "button-list"
      : "none") as ComponentProps<typeof WyChat>["notifications"],
  };

  const { navigationRefCallBack } = useSetWeavyNavigationCallback(
    onSetWeavyNavigation,
    [uid],
  );

  return (
    <WyChat
      ref={uid ? navigationRefCallBack : undefined}
      style={weavyContainerStyle}
      className={modeClassName}
      uid={uid}
      name={name}
      {...featureProps}
      {...notificationProps}
    />
  );
}
