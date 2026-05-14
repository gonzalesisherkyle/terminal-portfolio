import { useEffect, useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import OutputLine from '../components/OutputLine';
import TerminalReady from '../components/TerminalReady';
import { getProjects } from '../api/projects';
import { usePagination } from '../hooks/usePagination';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const pagination = usePagination(projects, 6);

  if (!loading && projects.length === 0) {
    return (
      <TerminalWindow path="~/portfolio/projects">
        <TerminalReady path="~/portfolio/projects" cmd="ls ./projects # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/projects">
      <Prompt path="~/portfolio/projects" cmd="ls ./projects --featured-first" />
      {loading ? (
        <OutputLine value="loading projects..." variant="dim" />
      ) : (
        <>
          <div className="mt-2">
            {pagination.items.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onPageChange={pagination.goToPage}
          />
        </>
      )}
      <TerminalReady path="~/portfolio/projects" />
    </TerminalWindow>
  );
}
