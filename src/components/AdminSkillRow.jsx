import CommandButton from './CommandButton';
import SkillRow from './SkillRow';

export default function AdminSkillRow({ skill, onEdit, onDelete }) {
  return (
    <div className="border border-term-border rounded-sm px-3 py-2 my-2">
      <SkillRow skill={skill} />
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
        <span className="font-mono text-xs text-term-dim">category: {skill.category}</span>
        <div className="flex gap-2">
          <CommandButton onClick={onEdit}>edit</CommandButton>
          <CommandButton onClick={onDelete} variant="danger">
            delete
          </CommandButton>
        </div>
      </div>
    </div>
  );
}
