import { useEffect, useMemo, useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import Prompt from '../components/Prompt';
import SkillRow from '../components/SkillRow';
import Pagination from '../components/Pagination';
import OutputLine from '../components/OutputLine';
import TerminalReady from '../components/TerminalReady';
import { getSkills } from '../api/skills';
import { usePagination } from '../hooks/usePagination';
import { flattenSkillGroups, groupSkillsByCategory } from '../utils/terminal';

export default function Skills() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  const flatSkills = useMemo(() => flattenSkillGroups(groups), [groups]);
  const pagination = usePagination(flatSkills, 20);
  const pageGroups = useMemo(() => groupSkillsByCategory(pagination.items), [pagination.items]);

  if (!loading && flatSkills.length === 0) {
    return (
      <TerminalWindow path="~/portfolio/skills">
        <TerminalReady path="~/portfolio/skills" cmd="ls ./skills # empty" />
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow path="~/portfolio/skills">
      <Prompt path="~/portfolio/skills" cmd="find ./skills -type skill" />
      {loading ? (
        <OutputLine value="loading skills..." variant="dim" />
      ) : (
        <>
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
        </>
      )}
      <TerminalReady path="~/portfolio/skills" />
    </TerminalWindow>
  );
}
