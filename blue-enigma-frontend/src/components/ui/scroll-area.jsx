import React, { forwardRef } from "react";

export const ScrollArea = forwardRef(({ children, className = "" }, ref) => (
  <div ref={ref} className={`overflow-y-auto ${className}`}>
    {children}
  </div>
));
