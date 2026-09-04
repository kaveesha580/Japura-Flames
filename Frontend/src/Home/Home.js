import { useEffect, useRef } from "react";

export function useReveal(options = {}) {
  const elementRef = useRef(null);
  const { threshold = 0.15, rootMargin = "0px 0px -40px 0px" } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return elementRef;
}
