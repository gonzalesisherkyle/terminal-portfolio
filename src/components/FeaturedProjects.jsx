import OutputLine from './OutputLine';
import ProjectCard from './ProjectCard';
import Prompt from './Prompt';

export default function FeaturedProjects({ projects = [], limit = 3 }) {
  const allFeaturedProjects = projects.filter((project) => project.featured);
  const featuredProjects = allFeaturedProjects.slice(0, limit);

  if (!featuredProjects.length) {
    return null;
  }

  return (
    <section className="mt-3">
      <Prompt path="~/portfolio/home" cmd="ls ./projects --featured" />
      <div className="mt-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
      {allFeaturedProjects.length > limit ? (
        <OutputLine value="# more featured projects available in ./projects" variant="dim" />
      ) : null}
    </section>
  );
}
