import { getProfile, getProjects } from '@/lib/content';
import { formatMonthYear, skillBar } from '@/lib/format';
import { accentClass } from '@/lib/palette';
import { PortraitReveal } from '@/components/portrait-reveal';

export default async function HomePage() {
  const profile = getProfile();
  const projects = await getProjects();

  return (
    <>
      <section id="about" className="section-block">
        <div className="intro">
          <PortraitReveal src="/me.jpeg" alt={`Portrait of ${profile.name}`} />
          <div className="intro-text">
            <h1 className="page-title">{profile.name}</h1>
            <p className="page-lead comment">
              {profile.title}, {profile.employer.name}, {profile.employer.location}
            </p>
          </div>
        </div>

        <div className="section">
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="bio">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="section accent-purple">
          <h2 className="section-title accent-purple">Experience</h2>
          <ul>
            {profile.career.map((item) => (
              <li key={`${item.date}-${item.title}`} className="entry">
                <p className="entry-meta">since {formatMonthYear(item.date)}</p>
                <p className="entry-title">
                  {item.title}, {item.organization}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="section accent-blue">
          <h2 className="section-title accent-blue">Education</h2>
          <ul>
            {profile.education.map((item) => (
              <li key={`${item.date}-${item.title}`} className="entry">
                <p className="entry-meta">
                  {formatMonthYear(item.date)}
                  {item.endDate ? ` – ${formatMonthYear(item.endDate)}` : ''}
                </p>
                <p className="entry-title">
                  {item.title}
                  {item.organization ? `, ${item.organization}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="section accent-yellow">
          <h2 className="section-title accent-yellow">Skills</h2>
          <ul className="skill-list">
            {profile.skills.map((skill) => (
              <li key={skill.name}>
                <span className="skill-name">{skill.name}</span>{' '}
                <span className="skill-bar" aria-hidden="true">
                  {skillBar(skill.level)}
                </span>
                <span className="sr-only">{skill.level}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="projects" className="section-block">
        <h2 className="section-title accent-orange">Projects</h2>
        <p className="page-lead comment">
          {projects.length} public {projects.length === 1 ? 'repository' : 'repositories'} on GitHub
        </p>

        {projects.length === 0 ? (
          <p className="section">No projects available.</p>
        ) : (
          <ol className="index section">
            {projects.map((project, index) => (
              <li key={project.slug} id={project.slug} className={accentClass(index)}>
                <details className="project">
                  <summary>
                    <span className="toggle" aria-hidden="true">
                      <span className="toggle-closed">[+]</span>
                      <span className="toggle-open">[-]</span>
                    </span>
                    <span className="episode-link">
                      {String(index + 1).padStart(2, '0')}: {project.title}
                    </span>
                    <span className="index-meta">{project.year}</span>
                  </summary>

                  <div className="project-detail">
                    {project.summary ? <p className="page-lead">{project.summary}</p> : null}

                    <dl className="meta-block">
                      {project.stack.length > 0 ? (
                        <>
                          <dt>stack</dt>
                          <dd>{project.stack.join(', ')}</dd>
                        </>
                      ) : null}
                      <dt>year</dt>
                      <dd>{project.year}</dd>
                    </dl>

                    <ul className="action-list">
                      <li>
                        <a href={project.githubUrl} className="bracket" rel="noopener noreferrer">
                          github
                        </a>
                      </li>
                      {project.homepage ? (
                        <li>
                          <a href={project.homepage} className="bracket" rel="noopener noreferrer">
                            website
                          </a>
                        </li>
                      ) : null}
                    </ul>

                    {project.bodyHtml ? (
                      <div
                        className="project-body prose"
                        dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
                      />
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section id="contact" className="section-block">
        <h2 className="section-title accent-fuchsia">Contact</h2>
        <ul className="section action-list">
          <li>
            <a href={`mailto:${profile.links.email}`} className="bracket accent-fuchsia">
              email
            </a>
          </li>
          <li>
            <a
              href={profile.links.github}
              className="bracket accent-green"
              rel="me noopener noreferrer"
            >
              github
            </a>
          </li>
          {profile.links.linkedin ? (
            <li>
              <a
                href={profile.links.linkedin}
                className="bracket accent-blue"
                rel="me noopener noreferrer"
              >
                linkedin
              </a>
            </li>
          ) : null}
        </ul>
      </section>
    </>
  );
}
