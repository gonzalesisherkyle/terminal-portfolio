import AdminShell from '../../components/AdminShell';
import Prompt from '../../components/Prompt';
import OutputLine from '../../components/OutputLine';
import SectionDivider from '../../components/SectionDivider';

export default function Dashboard() {
  return (
    <AdminShell path="~/portfolio/admin">
      <Prompt path="~/portfolio/admin" cmd="ls ./manage" />
      <div className="mt-2">
        <OutputLine value="./projects   create, edit, delete project entries" />
        <OutputLine value="./about      update profile, availability, and summary skills" />
        <OutputLine value="./skills     manage categorized skill data" />
        <OutputLine value="./messages   read and clear contact submissions" />
      </div>
      <SectionDivider />
      <OutputLine value="# content remains empty until you add it here" variant="dim" />
    </AdminShell>
  );
}
