import React from "react";
import { motion, MotionProps } from "framer-motion";

interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
