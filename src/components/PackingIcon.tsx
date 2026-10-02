/** Tabler outline icons, MIT licensed. See docs/licenses/tabler-icons.md. */
const PATHS = {
  user: ['M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0', 'M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2'],
  friends: [
    'M5 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
    'M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5',
    'M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
    'M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4',
  ],
};

export default function PackingIcon({ name }: { name: keyof typeof PATHS }) {
  return (
    <svg
      className="packing__icon"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
