import {
  ConversationTypes,
  WeavyType,
  WeavyTypes,
  WyLinkEventType,
} from "@weavy/uikit-react";
import { useCallback } from "react";

export type NavigateParameters = {
  appId?: string;
  url?: string;
  params?: {
    [k: string]: string;
  };
};

export type AppWithPageType = WeavyTypes.AppType & {
  metadata?: WeavyTypes.AppType["metadata"] & {
    page?: string;
  };
};

type WyAppRef =
  | (HTMLElement & { whenApp: () => Promise<AppWithPageType> })
  | null;

/**
 * Hook to trigger WeavyPageNavigation workflow. Runs if the metadata hasn't already been saved.
 * It needs a reference to the contextual Weavy component using the navigationRefCallback as ref on the component.
 *
 * @param onSetWeavyNavigation
 * @param deps
 * @returns
 */
export const useSetWeavyNavigationCallback = (
  onSetWeavyNavigation: () => void,
  deps: React.DependencyList
) => {
  const navigationRefCallBack = useCallback(
    (weavyComponent: WyAppRef) => {
      if (weavyComponent) {
        requestAnimationFrame(() => {
          weavyComponent.whenApp().then((app: AppWithPageType) => {
            if (!app.metadata?.page) {
              //console.debug("Triggering SetWeavyNavigation", app.uid)
              onSetWeavyNavigation();
            }
          });
        });
      }
    },
    [onSetWeavyNavigation, ...deps]
  );

  return { navigationRefCallBack };
};

export const useLinkHandler = <
  Props extends { linkData: any; navigateData: any }
>(
  weavy: WeavyType | undefined,
  updateProperties: (props: Partial<Props>) => void,
  onNavigate: () => void,
  onShowMessenger?: () => void
) => {
  const handleLink = async (e: WyLinkEventType) => {
    const appType = e.detail.app?.type;
    const appUid = e.detail.app?.uid;

    updateProperties({
      linkData: e.detail,
    } as Partial<Props>);

    console.log("appUid && weavy", appUid, weavy);

    // Check if the appType guid exists in the ConversationTypes map
    if (ConversationTypes.has(appType as string)) {
      // Show the messenger
      onShowMessenger?.();
    } else if (appUid && weavy) {
      // Show a contextual block by navigation to another page

      // First we much fetch the app metadata from the server
      const response = await weavy.fetch(`/api/apps/${appUid}`);
      if (!response.ok) {
        console.error("Error fetching app");
        return;
      }

      const { uid, metadata } = (await response.json()) as AppWithPageType;

      console.log("metadata", uid, metadata);
      if (uid) {
        if (metadata?.page) {
          let pageData: NavigateParameters;
          try {
            pageData = JSON.parse(atob(metadata.page));

            console.log("setting navigateData", pageData);
            updateProperties({
              navigateData: pageData ?? {},
            } as Partial<Props>);

            onNavigate();
          } catch (e) {
            console.warn("Could not parse page metadata", e);
            updateProperties({
              navigateData: {},
            } as Partial<Props>);
          }
        } else {
          updateProperties({
            navigateData: {},
          } as Partial<Props>);
        }
      }
    }

    //triggerLink()
  };

  return { handleLink };
};
