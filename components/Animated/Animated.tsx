import React from "react";
import { useInView, animated } from "@react-spring/web";

const Animated = ({ children }: { children: React.ReactNode }) => {
  const [ref, springs] = useInView(
    () => ({
      from: {
        opacity: 0,
        y: 100,
      },
      to: {
        opacity: 1,
        y: 0,
      },
    }),
    {
      rootMargin: "-30% 0%",
      once: true,
    }
  );
  return (
    <animated.div ref={ref} style={springs}>
      {children}
    </animated.div>
  );
};

export default Animated;
