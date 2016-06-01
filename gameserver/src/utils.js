export function parseAuthorizationHeader(header) {
  const parts = header.split(' ');

  if (parts.length !== 2) {
    throw new Error('Invalid authorization header');
  } else if (parts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header');
  } else {
    return parts[1];
  }
}
