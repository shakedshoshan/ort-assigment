interface StatsCardProps {
  title: string;
  value: number;
  icon: 'question' | 'check' | 'clock' | 'users';
  color: 'primary' | 'success' | 'warning' | 'error';
}

const iconMap = {
  question: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  check: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  clock: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  users: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  ),
};

const colorMap = {
  primary: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
  },
  success: {
    bg: 'bg-success-100',
    text: 'text-success-600',
  },
  warning: {
    bg: 'bg-warning-100',
    text: 'text-warning-600',
  },
  error: {
    bg: 'bg-error-100',
    text: 'text-error-600',
  },
};

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colors = colorMap[color];
  const iconPath = iconMap[icon];

  return (
    <div className="card card-elevated">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconPath}
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
