export function buildPromptPath(section = '~') {
  return section.startsWith('~') ? section : `~/portfolio/${section}`;
}

export function flattenSkillGroups(groups) {
  if (!Array.isArray(groups)) {
    return [];
  }

  return groups.flatMap((group) =>
    (group.skills || []).map((skill) => ({
      ...skill,
      category: skill.category || group.category
    }))
  );
}

export function groupSkillsByCategory(skills) {
  const groups = (Array.isArray(skills) ? skills : []).reduce((result, skill) => {
    const category = skill.category || 'uncategorized';
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(skill);
    return result;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      skills: groups[category].sort((a, b) => a.name.localeCompare(b.name))
    }));
}
