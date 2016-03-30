// Make an error
export function error(message) {
  return JSON.stringify({ // eslint-disable-line prefer-template
    error: message,
  }) + '\n';
}
