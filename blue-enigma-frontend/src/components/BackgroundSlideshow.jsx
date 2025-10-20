import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // ocean waves
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1", // airplane window
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // map
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // sky
];

export function BackgroundSlideshow() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000); // 6s per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={images[current]}
          alt="background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* overlay gradient */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
