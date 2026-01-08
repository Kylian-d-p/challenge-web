"use client";

import { PropsWithChildren, useEffect, useRef } from "react";

export default function InfiniteScroll(props: PropsWithChildren<{ getMore: () => void; hasMore: boolean; loading: boolean }>) {
  const { getMore, hasMore, loading } = props;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          getMore();
        }
      },
      { threshold: 1 }
    );

    const current = bottomRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [bottomRef, getMore, hasMore, loading]);

  return (
    <>
      {props.children}
      <div ref={bottomRef} />
    </>
  );
}
