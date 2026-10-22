import { Link } from "react-router-dom";
import { config } from "../config";
import { getProjectVisualDataUri } from "../utils/projectVisual";
import "./MyWorks.css";

const MyWorks = () => {
  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of my projects. Most shipped under NDA — no client names, pricing, or private code.</p>
      </div>

      <div className="myworks-grid">
        {config.projects.map((project, index) => (
          <div className="myworks-card" key={project.id} data-tilt>
            <div className="myworks-card-number">{String(index + 1).padStart(2, "0")}</div>
            {project.status && (
              <div className="myworks-card-status">{project.status}</div>
            )}
            <div className="myworks-card-image">
              <img
                src={getProjectVisualDataUri(project.visual, project.title)}
                alt={project.title}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="myworks-card-info">
              <h3>{project.title}</h3>
              <p className="myworks-card-category">{project.category}</p>
              <p className="myworks-card-description">
                <strong>Problem:</strong> {project.problem}
              </p>
              <p className="myworks-card-description">
                <strong>What I built:</strong> {project.built}
              </p>
              <p className="myworks-card-description">
                <strong>Result:</strong> {project.result}
              </p>
              <p className="myworks-card-tech">{project.technologies}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="myworks-nda-note">{config.ndaNote}</p>
    </div>
  );
};

export default MyWorks;
