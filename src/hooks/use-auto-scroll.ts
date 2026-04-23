import { useEffect, useRef } from 'react';

export function useAutoScroll(dependency: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const scrollElement = scrollRef.current?.parentElement;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // Use a threshold of 50px to determine "at bottom"
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      isAtBottomRef.current = isAtBottom;
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current && isAtBottomRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [dependency]);

  return scrollRef;
}
