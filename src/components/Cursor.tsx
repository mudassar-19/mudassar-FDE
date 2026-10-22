import { useEffect, useRef, useState } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";
import { prefersReducedEffects } from "../utils/motionPreference";

const TRAIL_LENGTH = 6;

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [label, setLabel] = useState("");
  const [disabled] = useState(prefersReducedEffects);

  useEffect(() => {
    if (disabled) return;

    let hover = false;
    const cursor = cursorRef.current!;
    const ring = ringRef.current!;
    const spotlight = spotlightRef.current!;
    const rippleLayer = rippleLayerRef.current!;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    const trailPositions = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      spotlight.style.setProperty("--spot-x", `${e.clientX}px`);
      spotlight.style.setProperty("--spot-y", `${e.clientY}px`);
    };
    document.addEventListener("mousemove", onMouseMove);

    let rafId = requestAnimationFrame(function loop() {
      if (!hover) {
        cursorPos.x += (mousePos.x - cursorPos.x) / 6;
        cursorPos.y += (mousePos.y - cursorPos.y) / 6;
        gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
      }
      ringPos.x += (mousePos.x - ringPos.x) / 12;
      ringPos.y += (mousePos.y - ringPos.y) / 12;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });

      trailPositions.unshift({ x: cursorPos.x, y: cursorPos.y });
      trailPositions.length = TRAIL_LENGTH;
      trailRefs.current.forEach((el, i) => {
        const pos = trailPositions[i];
        if (el && pos) {
          el.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${1 - i / TRAIL_LENGTH})`;
          el.style.opacity = `${0.35 * (1 - i / TRAIL_LENGTH)}`;
        }
      });

      rafId = requestAnimationFrame(loop);
    });

    const hoverEls = Array.from(
      document.querySelectorAll("[data-cursor], [data-cursor-label]")
    );
    const onOver = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      if (el.dataset.cursor === "icons") {
        const rect = el.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (el.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
      if (el.dataset.cursorLabel) {
        setLabel(el.dataset.cursorLabel);
        ring.classList.add("cursor-ring-active");
      }
    };
    const onOut = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
      if (el.dataset.cursorLabel) {
        setLabel("");
        ring.classList.remove("cursor-ring-active");
      }
    };
    hoverEls.forEach((el) => {
      el.addEventListener("mouseover", onOver);
      el.addEventListener("mouseout", onOut);
    });

    // Magnetic buttons: pull elements with [data-magnetic] a few px toward
    // the cursor, snap back on leave.
    const magneticEls = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const magneticHandlers = magneticEls.map((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(el, { x: relX * 0.3, y: relY * 0.3, duration: 0.3, ease: "power2.out" });
      };
      const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return { el, onMove, onLeave };
    });

    // Card tilt: elements with [data-tilt] rotate toward the cursor.
    const tiltEls = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const tiltHandlers = tiltEls.map((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          rotateX: py * -8,
          rotateY: px * 8,
          transformPerspective: 700,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const onLeave = () =>
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return { el, onMove, onLeave };
    });

    // Click ripples.
    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      rippleLayer.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.6 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseover", onOver);
        el.removeEventListener("mouseout", onOut);
      });
      magneticHandlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
      tiltHandlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div className="cursor-spotlight" ref={spotlightRef}></div>
      <div className="cursor-trail">
        {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
          <div key={i} ref={(el) => (trailRefs.current[i] = el)} className="cursor-trail-dot" />
        ))}
      </div>
      <div className="cursor-ring" ref={ringRef}>
        {label && <span className="cursor-ring-label">{label}</span>}
      </div>
      <div className="cursor-main" ref={cursorRef}></div>
      <div className="cursor-ripple-layer" ref={rippleLayerRef}></div>
    </>
  );
};

export default Cursor;
