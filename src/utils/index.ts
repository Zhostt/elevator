/* eslint-disable no-promise-executor-return */
/* eslint-disable import/prefer-default-export */
export function wait(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
