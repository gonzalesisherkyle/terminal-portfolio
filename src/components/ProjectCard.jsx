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
          <a
            className="text-term-cyan border-b border-dashed border-term-cyan/30 hover:text-term-bright hover:border-term-cyan transition-all duration-200"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            ./live
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            className="text-term-cyan border-b border-dashed border-term-cyan/30 hover:text-term-bright hover:border-term-cyan transition-all duration-200"
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
          >
            ./repo
          </a>
        ) : null}
      </div>
    </article>
  );
}
