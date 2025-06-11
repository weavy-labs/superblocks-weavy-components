import {
  useSuperblocksContext,
  useSuperblocksIsLoading,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { Feature, useWeavy, WyPosts } from "@weavy/uikit-react";
import { useSetWeavyNavigationCallback } from "../WeavyNotificationEvents/notifications";
import { ComponentProps, useEffect } from "react";
import { useHooksInternalContext } from "@superblocksteam/custom-components/dist/hooksPlumbing";

export default function WeavyPosts({
  uid,
  name,
  contextData,
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
    ["--wy-padding"]:
      theme && theme.padding.left.value / 2 + theme.padding.left.mode,
    ["--wy-gap"]:
      theme && theme.padding.left.value / 2 + theme.padding.left.mode,
  };

  const modeClassName =
    forceDarkMode || theme?.mode === "DARK" ? "wy-dark" : "";

  const {
    updateProperties,
    events: { onSetWeavyNavigation, onTokenExpired },
  } = useSuperblocksContext<Props, EventTriggers>();

  useWeavy(
    {
      url: weavyUrl,
      tokenFactory: async (refresh: boolean) => {
        if (refresh) {
          console.log("onTokenExpired: " + accessToken);
          onTokenExpired();
        }
        return accessToken;
      },
      ...weavyOptions,
    },
    [accessToken],
  );

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

  const features = [
    props.enableAttachments && Feature.Attachments,
    props.enableCloudFiles && Feature.CloudFiles,
    props.enableComments && Feature.Comments,
    Feature.ContextData,
    props.enableEmbeds && Feature.Embeds,
    props.enableGoogleMeet && Feature.GoogleMeet,
    props.enableMicrosoftTeams && Feature.MicrosoftTeams,
    props.enableZoomMeetings && Feature.ZoomMeetings,
    props.enableMentions && Feature.Mentions,
    props.enablePolls && Feature.Polls,
    props.enablePreviews && Feature.Previews,
    props.enableReactions && Feature.Reactions,
  ]
    .filter((f) => f)
    .join(" ");

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
          name={name || undefined}
          data={contextData ? [contextData] : undefined}
          features={features}
          {...notificationProps}
        />
      )}
    </>
  );
}
