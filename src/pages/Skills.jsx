import { useMemo } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import SkillRow from '../components/SkillRow';
import Pagination from '../components/Pagination';
import TerminalReady from '../components/TerminalReady';
import { usePublicData } from '../context/PublicDataContext';
import { usePagination } from '../hooks/usePagination';
import { flattenSkillGroups, groupSkillsByCategory } from '../utils/terminal';

export default function Skills() {
  const { skills: groups } = usePublicData();

  const flatSkills = useMemo(() => flattenSkillGroups(groups), [groups]);
  const pagination = usePagination(flatSkills, 20);
  const pageGroups = useMemo(() => groupSkillsByCategory(pagination.items), [pagination.items]);

  if (flatSkills.length === 0) {
    return (
      <TerminalWindow path="~/portfolio/skills" title="Skills">
        <TerminalReady path="~/portfolio/skills" cmd="ls ./skills # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/skills" title="Skills">
      <Prompt path="~/portfolio/skills" cmd="find ./skills -type skill" />
      <div className="mt-3 space-y-4">
        {pageGroups.map((group) => (
          <section key={group.category}>
            <Prompt path="~/portfolio/skills" cmd={`ls ./skills/${group.category.toLowerCase()}`} />
            <div className="mt-2">
              {group.skills.map((skill) => (
                <SkillRow key={skill._id || `${skill.category}-${skill.name}`} skill={skill} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPrev={pagination.prevPage}
        onNext={pagination.nextPage}
        onPageChange={pagination.goToPage}
      />
      <TerminalReady path="~/portfolio/skills" />
    </TerminalWindow>
  );
}
