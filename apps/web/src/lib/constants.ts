export const APP_NAME = 'Orbit Studio';
export const APP_DESCRIPTION = 'AI-Native Software Architecture Platform';
export const APP_TAGLINE = 'Design. Simulate. Build. Deploy.';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Templates', href: '/templates', icon: 'LayoutTemplate' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
];

export const NODE_LIBRARY_CATEGORIES = [
  {
    name: 'Application',
    items: [
      { type: 'frontend', label: 'Frontend', icon: 'Monitor' },
      { type: 'backend', label: 'Backend', icon: 'Server' },
      { type: 'worker', label: 'Worker', icon: 'Cpu' },
      { type: 'microservice', label: 'Microservice', icon: 'Boxes' },
    ],
  },
  {
    name: 'Data',
    items: [
      { type: 'database', label: 'Database', icon: 'Database' },
      { type: 'cache', label: 'Cache', icon: 'Zap' },
      { type: 'storage', label: 'Storage', icon: 'HardDrive' },
    ],
  },
  {
    name: 'Infrastructure',
    items: [
      { type: 'docker', label: 'Docker', icon: 'Box' },
      { type: 'kubernetes', label: 'Kubernetes', icon: 'Container' },
      { type: 'lambda', label: 'Lambda', icon: 'CloudLightning' },
      { type: 'cloud', label: 'Cloud', icon: 'Cloud' },
    ],
  },
  {
    name: 'Network',
    items: [
      { type: 'gateway', label: 'API Gateway', icon: 'Waypoints' },
      { type: 'api', label: 'API', icon: 'Api' },
      { type: 'cdn', label: 'CDN', icon: 'Globe' },
      { type: 'webhook', label: 'Webhook', icon: 'Webhook' },
    ],
  },
  {
    name: 'Security',
    items: [
      { type: 'auth', label: 'Auth', icon: 'Shield' },
      { type: 'secrets', label: 'Secrets', icon: 'Key' },
    ],
  },
  {
    name: 'Messaging',
    items: [
      { type: 'queue', label: 'Queue', icon: 'MessageSquare' },
    ],
  },
  {
    name: 'AI',
    items: [
      { type: 'ai-model', label: 'AI Model', icon: 'Brain' },
    ],
  },
  {
    name: 'Monitoring',
    items: [
      { type: 'monitoring', label: 'Monitoring', icon: 'Activity' },
    ],
  },
  {
    name: 'Other',
    items: [
      { type: 'third-party', label: 'Third Party', icon: 'Puzzle' },
      { type: 'custom', label: 'Custom', icon: 'Component' },
    ],
  },
];
