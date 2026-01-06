"use client";
import { useEffect, useRef, useState } from "react";
import type { Position } from "../type/type";

type Props = {
  placed: Record<number, Position[]>;
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
};

type Point = { x: number; y: number };

function centerRelative(el: HTMLElement, container: HTMLElement) {
  const r = el.getBoundingClientRect();
  const c = container.getBoundingClientRect();

  return {
    x: r.left - c.left + r.width / 2,
    y: r.top - c.top + r.height / 2,
  };
}

export default function TreeConnector({ placed, nodeRefs }: Props) {
  const [paths, setPaths] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const container = svg.parentElement!;
    const newPaths: string[] = [];

    Object.values(placed)
      .flat()
      .forEach((child) => {
        if (!child.parentId) return;

        const parentEl = nodeRefs.current[child.parentId];
        const childEl = nodeRefs.current[child.id];

        if (!parentEl || !childEl) return;

        const p1 = centerRelative(parentEl, container);
        const p2 = centerRelative(childEl, container);

        // คุมความโค้ง (ยิ่งมากยิ่งโค้ง)
        const offset = Math.abs(p2.y - p1.y) * 0.5;

        const d = `
          M ${p1.x} ${p1.y}
          C ${p1.x} ${p1.y + offset},
            ${p2.x} ${p2.y - offset},
            ${p2.x} ${p2.y}
        `;

        newPaths.push(d);
      });

    setPaths(newPaths);
  }, [placed, nodeRefs]);

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#f43f5e" strokeWidth={2} />
      ))}
    </svg>
  );
}
