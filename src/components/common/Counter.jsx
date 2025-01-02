import React, { useEffect } from "react";
import { motion,useMotionValue, useTransform, animate } from "framer-motion";

const Counter = ({ value, duration = 1, delay = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, {
      duration,
      delay,
    });
    return () => animation.stop();
  }, [value, count, duration, delay]);


  

  return <motion.span>{ rounded}</motion.span>;
};

export default Counter;
