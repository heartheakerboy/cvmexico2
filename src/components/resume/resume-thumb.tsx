import { useEffect, useRef, useState } from "react";
import { ResumePaper } from "./resume-paper";
import { sampleDoc } from "@/lib/resume/sample";
import { defaultLayout, makeDefaultDesign } from "@/lib/resume/types";

// Live miniature of a template using sample data, scaled to fill its card.
export function ResumeThumb({ templateId, accent }: { templateId: string; accent: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [isInView, setIsInView] = useState(false);
  const baseWidth = 794;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // Setup intersection observer to lazy-render template content
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading 200px before coming into view
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const design = makeDefaultDesign(accent);
  return (
    <div ref={boxRef} style={{ width: "100%", height: "100%", minHeight: "150px", overflow: "hidden", background: "#fff" }}>
      {isInView ? (
        <div style={{ width: baseWidth, transform: `scale(${scale})`, transformOrigin: "top left", pointerEvents: "none" }}>
          <ResumePaper templateId={templateId} doc={sampleDoc} design={design} layout={defaultLayout} />
        </div>
      ) : (
        <div className="h-full w-full bg-secondary/10 animate-pulse" />
      )}
    </div>
  );
}