import { useEffect, useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import OutputLine from '../components/OutputLine';
import StatusBar from '../components/StatusBar';
import TerminalReady from '../components/TerminalReady';
import ResumeLink from '../components/ResumeLink';
import { getAbout } from '../api/about';

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .catch(() => {
        setAbout(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !about) {
    return (
      <TerminalWindow path="~/portfolio/about">
        <TerminalReady path="~/portfolio/about" cmd="cat ./about # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/about">
      <Prompt path="~/portfolio/about" cmd="cat ./bio" />
      {loading ? (
        <OutputLine value="loading bio..." variant="dim" />
      ) : (
        <>
          <StatusBar status={about.availability} location={about.location} />
          <OutputLine label="name" value={about.name} variant="bright" />
          <OutputLine label="title" value={about.title} variant="cyan" />
          <ResumeLink href={about.resumeUrl} />
          <OutputLine label="bio" value={about.bio} multiline justify />
        </>
      )}
      <TerminalReady path="~/portfolio/about" />
    </TerminalWindow>
  );
}
