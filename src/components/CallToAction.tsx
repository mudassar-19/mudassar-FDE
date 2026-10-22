import { config } from "../config";
import { lenis } from "./Navbar";
import "./styles/CallToAction.css";

const CallToAction = () => {
  const handleSeeJourney = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth > 1024) {
      e.preventDefault();
      const target = document.querySelector("#journey") as HTMLElement | null;
      if (target && lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      }
    }
  };

  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <a
          href="#journey"
          className="cta-btn cta-btn-play"
          data-cursor="disable"
          data-cursor-label="Open"
          data-magnetic
          data-tilt
          onClick={handleSeeJourney}
        >
          See my journey →
        </a>

        <a
          href={config.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
          data-cursor-label="Open"
          data-magnetic
          data-tilt
          aria-label="Hire me — opens my LinkedIn profile"
        >
          Hire Me →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
