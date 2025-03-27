import { MessengerTypes, WeavyType, WyLinkEventType } from "@weavy/uikit-react";
import { useCallback } from "react";
import { AppWithSourceMetadataType } from "@weavy/uikit-react/dist/types/types";

export type NavigateParameters = {
  appId?: string;
  url?: string;
  params?: {
    [k: string]: string;
  };
};

type WyAppRef =
  | (HTMLElement & { whenApp: () => Promise<AppWithSourceMetadataType> })
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
          weavyComponent.whenApp().then((app: AppWithSourceMetadataType) => {
            if (
              !app.metadata?.source_data ||
              !app.metadata?.source_url ||
              !app.metadata?.source_name
            ) {
              //console.debug("Triggering SetWeavyNavigation", app.uid)
              onSetWeavyNavigation();
            }
          });
        });
      }
      return weavyComponent
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
    const appType = e.detail.link.app?.type;
    const appUid = e.detail.link.app?.uid;

    updateProperties({
      linkData: e.detail,
    } as Partial<Props>);

    console.log("appUid && weavy", appUid, weavy);

    // Check if the appType guid exists in the MessengerTypes map
    if (appType && MessengerTypes.has(appType)) {
      // Show the messenger
      onShowMessenger?.();
    } else if (e.detail.source_name === "superblocks" && e.detail.source_data) {
      // Show a contextual block by navigation to another page
      let pageData: NavigateParameters;
      try {
        pageData = JSON.parse(atob(e.detail.source_data));

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
      if (e.detail.source_url) {
        // Open external source
        window.open(e.detail.source_url, "_blank");
      }

      updateProperties({
        navigateData: {},
      } as Partial<Props>);
    }

    //triggerLink()
  };

  return { handleLink };
};
