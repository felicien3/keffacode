const styles = {
  easy: 'text-easy border-easy/30 bg-easy/5',
  medium: 'text-medium border-medium/30 bg-medium/5',
  hard: 'text-hard border-hard/30 bg-hard/5',
};

export default function Difficulty({ level }) {
  return (
    <span className={`rounded border px-2 py-0.5 text-xs font-medium capitalize ${styles[level] || ''}`}>
      {level}
    </span>
  );
}
