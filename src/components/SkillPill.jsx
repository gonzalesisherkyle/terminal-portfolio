export default function SkillPill({ name }) {
  return (
    <span className="inline-flex items-center font-mono text-xs px-2.5 py-1.5 rounded-sm bg-term-green/[0.04] border border-term-green/20 text-term-green-mid transition-all duration-200 hover:bg-term-green/10 hover:border-term-green hover:text-term-green cursor-default">
      <span className="text-term-green-dim mr-1">-&gt;</span>
      {name}
    </span>
  );
}
