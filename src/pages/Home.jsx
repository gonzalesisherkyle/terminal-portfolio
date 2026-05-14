import { useMemo } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import OutputLine from '../components/OutputLine';
import TerminalReady from '../components/TerminalReady';
import SectionDivider from '../components/SectionDivider';
import StatusBar from '../components/StatusBar';
import FeaturedProjects from '../components/FeaturedProjects';
import ResumeLink from '../components/ResumeLink';
import { usePublicData } from '../context/PublicDataContext';

export default function Home() {
  const { about, projects } = usePublicData();
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    [projects]
  );

  if (!about && !featuredProjects.length) {
    return (
      <TerminalWindow path="~/portfolio/home">
        <TerminalReady path="~/portfolio/home" cmd="cat ./home # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/home">
      <Prompt path="~/portfolio/home" cmd="boot ./profile" />
      {about ? (
        <>
          <StatusBar status={about.availability} location={about.location} />
          <OutputLine label="name" value={about.name} variant="bright" />
          <OutputLine label="role" value={about.title} variant="cyan" />
          <OutputLine label="mode" value="full-stack javascript" variant="amber" />
          <ResumeLink href={about.resumeUrl} />
          <SectionDivider />
          <OutputLine value={about.bioSnippet || about.bio} multiline justify />
        </>
      ) : null}
      <FeaturedProjects projects={projects} />
      <TerminalReady path="~/portfolio/home" />
    </TerminalWindow>
  );
}
