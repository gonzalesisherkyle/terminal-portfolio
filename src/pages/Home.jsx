import { useEffect, useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import OutputLine from '../components/OutputLine';
import TerminalReady from '../components/TerminalReady';
import SectionDivider from '../components/SectionDivider';
import StatusBar from '../components/StatusBar';
import FeaturedProjects from '../components/FeaturedProjects';
import { getAbout } from '../api/about';
import { getProjects } from '../api/projects';

const banner = String.raw`
 _______  _______  ______   __   __
|       ||       ||    _ | |  |_|  |
|_     _||    ___||   | || |       |
  |   |  |   |___ |   |_||_|       |
  |   |  |    ___||    __  |       |
  |   |  |   |___ |   |  | | ||_|| |
  |___|  |_______||___|  |_|_|   |_|
`;

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAbout().catch(() => null),
      getProjects().catch(() => [])
    ])
      .then(([aboutData, projectData]) => {
        setAbout(aboutData);
        setProjects(projectData);
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredProjects = projects.filter((project) => project.featured);

  if (!loading && !about && !featuredProjects.length) {
    return (
      <TerminalWindow path="~/portfolio/home">
        <TerminalReady path="~/portfolio/home" cmd="cat ./home # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/home">
      <Prompt path="~/portfolio/home" cmd="boot ./profile" />
      <pre className="font-mono text-xs text-term-green leading-tight animate-glitch overflow-x-auto my-3">
        {banner}
      </pre>
      {loading ? (
        <OutputLine value="loading profile..." variant="dim" />
      ) : (
        <>
          {about ? (
            <>
              <StatusBar status={about.availability} location={about.location} />
              <OutputLine label="name" value={about.name} variant="bright" />
              <OutputLine label="role" value={about.title} variant="cyan" />
              <OutputLine label="mode" value="full-stack javascript" variant="amber" />
              <SectionDivider />
              <OutputLine value={about.bioSnippet || about.bio} multiline justify />
            </>
          ) : null}
          <FeaturedProjects projects={projects} />
        </>
      )}
      <TerminalReady path="~/portfolio/home" />
    </TerminalWindow>
  );
}
