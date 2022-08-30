import { useCallback, useEffect, useRef, useState } from "react";
import { last } from "lodash";
import { Notification } from "shared/graphql/query/notification/useNotifications";
import { Post } from "shared/graphql/query/post/usePosts";
export function usePagination(
  data: ArrayLike<Notification | Post> | undefined,
  fetchMore: Function
) {
  const SCROLL_OFFSET_THRESHOLD = 4000;
  const isFetchingMore = useRef(false);
  const triggeredOffset = useRef(false);
  const scrollOffset = useRef(0);
  const [lastFetchItemId, setLastFetchItemId] = useState<string>();
  const onEndReached = useCallback(async () => {
    if (isFetchingMore.current) return;
    const lastItem = last(data)?._id;
    if (lastFetchItemId !== lastItem) {
      isFetchingMore.current = true;
      setLastFetchItemId(lastItem);
      await fetchMore({
        variables: {
          before: lastItem,
        },
      });
      isFetchingMore.current = false;
    }
  }, [fetchMore, data, isFetchingMore]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (
        target &&
        target instanceof HTMLElement &&
        target.id == "app-layout"
      ) {
        if (
          target.clientHeight + target.scrollTop >
            target.scrollHeight - SCROLL_OFFSET_THRESHOLD &&
          !triggeredOffset.current
        ) {
          // Fetch more notifications only when scroll down.
          if (target.scrollTop >= scrollOffset.current) {
            triggeredOffset.current = true;
            onEndReached();
          }
        } else {
          triggeredOffset.current = false;
        }

        scrollOffset.current = target.scrollTop;
      }
    };
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [onEndReached]);
}
