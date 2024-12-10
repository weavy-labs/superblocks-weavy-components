import {
  useSuperblocksContext,
  useSuperblocksIsLoading,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { useWeavy, WyPosts } from "@weavy/uikit-react";
import { useSetWeavyNavigationCallback } from "../WeavyNotificationEvents/notifications";
import { ComponentProps, useEffect } from "react";
import { useHooksInternalContext } from "@superblocksteam/custom-components/dist/hooksPlumbing";

export default function WeavyPosts({
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
        uid: `superblocks:posts-${widgetId}`,
      });
    }
  }, [isLoading]);

  const featureProps = {
    noAttachments: props.enableAttachments === false,
    noComments: props.enableComments === false,
    noCloudFiles: props.enableCloudFiles === false,
    noEmbeds: props.enableEmbeds === false,
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
      : "none") as ComponentProps<typeof WyPosts>["notifications"],
  };

  const { navigationRefCallBack } = useSetWeavyNavigationCallback(
    onSetWeavyNavigation,
    [uid],
  );

  return (
    <>
      {!isLoading && !uid ? (
        <div>Set the UID</div>
      ) : (
        <WyPosts
          ref={uid ? navigationRefCallBack : undefined}
          style={weavyContainerStyle}
          className={modeClassName}
          uid={uid}
          name={name}
          {...featureProps}
          {...notificationProps}
        />
      )}
    </>
  );
}
