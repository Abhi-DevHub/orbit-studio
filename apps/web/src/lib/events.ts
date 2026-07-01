export const ORBIT_EVENTS = {
  EXPORT_PNG: 'orbit:export-png',
  EXPORT_SVG: 'orbit:export-svg',
  EXPORT_JSON: 'orbit:export-json',
  SAVE: 'orbit:save',
  AUTO_LAYOUT: 'orbit:auto-layout',
} as const;

export function dispatch(event: string) {
  window.dispatchEvent(new CustomEvent(event));
}
