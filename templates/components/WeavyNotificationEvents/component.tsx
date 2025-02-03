import {
  useSuperblocksContext,
  useSuperblocksIsLoading,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import {
  useWeavy,
  WeavyComponents,
  WyNotificationsEventType,
  WyNotificationToasts,
} from "@weavy/uikit-react";
import { useEffect } from "react";
import { useLinkHandler } from "./notifications";

export default function Component({
  nativeNotifications,
  disableNotifications,
  weavyUrl,
  accessToken,
  weavyOptions = {},
  theme,
  forceDarkMode,
  showLoading,
}: Props) {
  const weavyContainerStyle: React.CSSProperties & {
    [key: `--${string}`]: string | undefined;
  } = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: theme?.fontFamily,
    ["--wy-border-radius"]:
      theme?.borderRadius.value + theme?.borderRadius.mode,
    ["--wy-theme-color"]: theme?.colors.primary500,
    ["--wy-padding"]:
      theme && theme.padding.bottom.value / 2 + theme.padding.bottom.mode,
    ["--wy-gap"]:
      theme && theme.padding.bottom.value / 2 + theme.padding.bottom.mode,
  };

  const modeClassName =
    forceDarkMode || theme?.mode === "DARK" ? "wy-dark" : "";

  // If any of your component's properties are connected to APIs, you might want to show a loading indicator while the data is
  // loading. The `useSuperblocksIsLoading` hook returns a boolean that indicates whether this is the case.
  const isLoading = useSuperblocksIsLoading();
  const {
    updateProperties,
    events: { onNotification, onNavigate, onShowMessenger, onTokenExpired },
  } = useSuperblocksContext<Props, EventTriggers>();

  const weavy = useWeavy(
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
    [accessToken]
  );

  const { handleLink } = useLinkHandler(
    weavy,
    updateProperties,
    onNavigate,
    onShowMessenger
  );

  const updateNotificationCount = async () => {
    if (weavy) {
      // Fetch notification count from the Weavy Web API.
      // See https://www.weavy.com/docs/reference/web-api/notifications#list-notifications

      const queryParams = new URLSearchParams({
        type: "",
        countOnly: "true",
        unread: "true",
      });

      // Use weavy.fetch() for fetching from the Weavy Web API to fetch on behalf of the currently authenticated user.
      const response = await weavy.fetch(
        `/api/notifications?${queryParams.toString()}`
      );
      if (response.ok) {
        const result = await response.json();

        // Update the count
        updateProperties({ notificationCount: result.count });
      }
    }
  };

  const handleNotifications = (e: WyNotificationsEventType) => {
    if (e.detail.notification && e.detail.action === "notification_created") {
      // Only show notifications when a new notification is received

      // Show notifications using the Retool
      const [title, description] = e.detail.notification.plain.split(":", 2);

      updateProperties({
        notificationTitle: title,
        notificationDescription: description,
      });

      onNotification();
    }

    // Always update the notification count when notifications updates are received
    updateNotificationCount();
  };

  useEffect(() => {
    if (weavy && weavyUrl && accessToken) {
      // Get initial notification count
      updateNotificationCount();

      // Configure realtime notifications listener
      weavy.notificationEvents = true;

      // Add a realtime notification event listener
      weavy.host?.addEventListener("wy-notifications", handleNotifications);

      return () => {
        // Unregister the event listener when the component is unmounted
        weavy.host?.removeEventListener(
          "wy-notifications",
          handleNotifications
        );
      };
    }
  }, [weavy, weavyUrl, accessToken]);

  return (
    <div style={weavyContainerStyle} className={modeClassName}>
      {showLoading && isLoading ? <WeavyComponents.WySpinner /> : null}
      {!disableNotifications ? (
        <WyNotificationToasts
          appearance={nativeNotifications ? "native" : "internal"}
          onWyLink={handleLink}
        />
      ) : null}
    </div>
  );
}
