import Promise from 'bluebird';

const promiseWhile = Promise.method((condition, action) => {
  if (!condition()) {
    return null;
  }

  return action().then(promiseWhile.bind(null, condition, action));
});

export default promiseWhile;
