import { useEffect, useRef, useState } from "react";
import type { Design, Layout, ResumeDoc } from "@/lib/resume/types";
import { ResumePaper } from "./resume-paper";

const PAPER_PX_WIDTH = { a4: 794, letter: 816 }; // ~96dpi

type Props = {
  templateId: string;
  doc: ResumeDoc;
  design: Design;
  layout: Layout;
  paperRef?: React.Ref<HTMLDivElement>;
};

// Auto-fits the physical page to the available width using a CSS transform.
export function ResumePreview({ templateId, doc, design, layout, paperRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerH, setInnerH] = useState(0);
  const baseWidth = PAPER_PX_WIDTH[design.paper];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / baseWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setInnerH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  });

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <div style={{ height: innerH * scale }}>
        <div
          ref={innerRef}
          style={{
            width: baseWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div style={{ boxShadow: "0 10px 40px -12px rgba(0,0,0,0.25)", borderRadius: 4, overflow: "hidden" }}>
            <ResumePaper ref={paperRef} templateId={templateId} doc={doc} design={design} layout={layout} />
          </div>
        </div>
      </div>
    </div>
  );
}