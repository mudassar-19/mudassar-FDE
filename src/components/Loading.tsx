import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import { config } from "../config";

import Marquee from "react-fast-marquee";

// The exit choreography (loaded -> "Welcome" -> expand/unmount) takes a
// fixed ~2.5s once triggered. To guarantee the overlay is fully gone and
// the page interactive within MAX_TIME_TO_INTERACTIVE_MS, the hard
// timeout has to fire that much earlier, not at the deadline itself.
const EXIT_SEQUENCE_MS = 600 + 1000 + 900;
const MAX_TIME_TO_INTERACTIVE_MS = 6000;
const HARD_TIMEOUT_MS = Math.max(0, MAX_TIME_TO_INTERACTIVE_MS - EXIT_SEQUENCE_MS);

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [forceDone, setForceDone] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setForceDone(true);
  };

  // Hard timeout: never let the loader block the page longer than this,
  // regardless of how long the 3D model takes to decrypt/decompile.
  useEffect(() => {
    const timeout = setTimeout(finish, HARD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  const complete = percent >= 100 || forceDone;
  const displayPercent = complete ? 100 : percent;

  useEffect(() => {
    if (!complete) return;
    const t1 = setTimeout(() => {
      setLoaded(true);
    }, 600);
    return () => clearTimeout(t1);
  }, [complete]);

  useEffect(() => {
    if (!loaded) return;
    const t2 = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(t2);
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;
    import("./utils/initialFX").then((module) => {
      setClicked(true);
      setTimeout(() => {
        if (module.initialFX) {
          module.initialFX();
        }
        setIsLoading(false);
      }, 900);
    });
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  // As soon as the exit transition starts, stop absorbing clicks so the
  // real page underneath is interactive immediately, not after the full
  // fade-out animation finishes.
  const overlayStyle = clicked ? { pointerEvents: "none" as const } : undefined;

  return (
    <>
      <div className="loading-header" style={overlayStyle}>
        <a href="/#" className="loader-title" data-cursor="disable">
          {config.loading.brandLabel}
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen" style={overlayStyle}>
        <button
          type="button"
          className="loading-skip"
          onClick={finish}
          aria-label="Skip loading animation"
        >
          Skip →
        </button>
        <div className="loading-marquee">
          <Marquee>
            <span>&nbsp; {config.currentRole} &nbsp;</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{displayPercent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
