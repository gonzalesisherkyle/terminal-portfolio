import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import TerminalReady from '../components/TerminalReady';
import { usePublicData } from '../context/PublicDataContext';
import { usePagination } from '../hooks/usePagination';

export default function Projects() {
  const { projects } = usePublicData();

  const pagination = usePagination(projects, 6);

  if (projects.length === 0) {
    return (
      <TerminalWindow path="~/portfolio/projects" title="Projects">
        <TerminalReady path="~/portfolio/projects" cmd="ls ./projects # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/projects" title="Projects">
      <Prompt path="~/portfolio/projects" cmd="ls ./projects --featured-first" />
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
      <TerminalReady path="~/portfolio/projects" />
    </TerminalWindow>
  );
}
