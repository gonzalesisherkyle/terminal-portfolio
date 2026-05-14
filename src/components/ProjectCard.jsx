import TerminalLink from './TerminalLink';

export default function ProjectCard({ project }) {
  return (
    <article className="relative border border-term-border rounded-sm px-4 py-3 my-2 transition-all duration-200 group hover:border-term-green/40 hover:bg-term-green/[0.02]">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-term-green opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <p className="font-mono text-sm text-term-cyan font-bold mb-1">{project.title}</p>
      <p className="font-mono text-xs text-term-text text-justify whitespace-pre-line mb-2">{project.description}</p>
      {project.technologies?.length ? (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.technologies.map((technology) => (
            <span key={technology} className="font-mono text-xs text-term-amber">
              {technology}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 text-xs">
        {project.liveUrl ? (
          <TerminalLink href={project.liveUrl} size="xs">
            ./live
          </TerminalLink>
        ) : null}
        {project.repoUrl ? (
          <TerminalLink href={project.repoUrl} size="xs">
            ./repo
          </TerminalLink>
        ) : null}
      </div>
    </article>
  );
}
