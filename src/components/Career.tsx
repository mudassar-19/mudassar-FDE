import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section section-container" id="journey">
      <div className="career-container">
        <h2>
          My <span>Evolution</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.journey.map((entry, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h3 className="career-role-title">{entry.title}</h3>
                </div>
                <span className="career-badge">{entry.badge}</span>
              </div>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
