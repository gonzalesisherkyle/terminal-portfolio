export default function SkillRow({ skill }) {
  return (
    <div className="flex items-center gap-3 my-1 font-mono text-xs">
      <span className="text-term-green-dim shrink-0">-&gt;</span>
      <span className="text-term-text flex-1 min-w-0 truncate">{skill.name}</span>
    </div>
  );
}
