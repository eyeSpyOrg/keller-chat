/**
 * Generates a unique id per component instance within a build, so pages that
 * render the same component more than once (e.g. the /modules/ demo library)
 * never emit duplicate ids or duplicate landmark accessible names.
 */
let counter = 0;

export function uniqueId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
