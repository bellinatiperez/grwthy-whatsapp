let counter = 0;

export function createId(): string {
  return `test_id_${++counter}`;
}

export function init() {
  return createId;
}

export function isCuid(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

export function getConstants() {
  return {};
}
