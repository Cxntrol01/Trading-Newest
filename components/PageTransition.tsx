"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">(
    "fadeIn"
  );

  useEffect(() => {
    setTransitionStage("fadeOut");
  }, [pathname]);

  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [transitionStage, children]);

  return (
    <div
      className={`
        transition-opacity duration-150
        ${transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"}
      `}
    >
      {displayChildren}
    </div>
  );
}
