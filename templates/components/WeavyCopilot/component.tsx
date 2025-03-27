import {
  useSuperblocksContext,
  useSuperblocksIsLoading,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import {
  Feature,
  useWeavy,
  WeavyComponents,
  WyCopilot,
} from "@weavy/uikit-react";
import { useSetWeavyNavigationCallback } from "../WeavyNotificationEvents/notifications";
import { ComponentProps, useRef } from "react";

const { WyButton, WyIcon } = WeavyComponents;

export default function WeavyCopilot({
  bot,
  instructions,
  contextData,
  suggestions,
  enableNewButton,
  uid,
  enableAutoUid,
  name,
  weavyUrl,
  accessToken,
  weavyOptions = {},
  theme,
  forceDarkMode,
  enableNotifications,
  lastMessage,
  appId,
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
      theme && theme.padding.bottom.value / 2 + theme.padding.bottom.mode,
    ["--wy-gap"]:
      theme && theme.padding.bottom.value / 2 + theme.padding.bottom.mode,
  };

  const modeClassName =
    forceDarkMode || theme?.mode === "DARK" ? "wy-dark" : "";

  const {
    events: { onSetWeavyNavigation, onTokenExpired, onApp, onMessage },
    updateProperties,
  } = useSuperblocksContext<Props, EventTriggers>();

  const copilotRef = useRef<any>();

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

  const features = [
    //props.enableAttachments && Feature.Attachments,
    //props.enableContextData && Feature.ContextData,
    Feature.ContextData,
    props.enableEmbeds && Feature.Embeds,
    props.enableMentions && Feature.Mentions,
    props.enablePreviews && Feature.Previews,
    props.enableReactions && Feature.Reactions,
    props.enableTyping && Feature.Typing,
  ]
    .filter((f) => f)
    .join(" ");

  const notificationProps = {
    notifications: (enableNotifications
      ? "button-list"
      : "none") as ComponentProps<typeof WyCopilot>["notifications"],
  };

  const { navigationRefCallBack } = useSetWeavyNavigationCallback(
    onSetWeavyNavigation,
    [uid],
  );

  return (
    <WyCopilot
      ref={(refObj) => {
        if (refObj) {
          copilotRef.current = refObj;
          uid && navigationRefCallBack(refObj);
        }
      }}
      style={weavyContainerStyle}
      className={modeClassName}
      bot={bot || undefined}
      instructions={instructions || undefined}
      data={contextData ? [contextData] : undefined}
      uid={!enableAutoUid ? uid : undefined}
      autoUid={enableAutoUid && uid ? uid : undefined}
      name={name || undefined}
      onWyApp={(e) => {
        updateProperties({
          appId: e.detail.app.id,
        });
        onApp();
      }}
      onWyMessage={(e) => {
        updateProperties({
          lastMessage: e.detail,
        });
        onMessage();
      }}
      features={features}
      {...notificationProps}
    >
      {enableNewButton ? (
        <div slot="actions">
          <WyButton kind="icon" onClick={() => copilotRef.current?.reset()}>
            <WyIcon name="stars" />
          </WyButton>
        </div>
      ) : undefined}
      {suggestions instanceof Array ? (
        <div slot="suggestion-list" style={{ display: "contents" }}>
          {suggestions.map((suggestion) => (
            <WyButton key={suggestion} className="suggestion">
              {suggestion}
            </WyButton>
          ))}
        </div>
      ) : undefined}
    </WyCopilot>
  );
}
