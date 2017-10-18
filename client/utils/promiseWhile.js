import Promise from 'bluebird';

const promiseWhile = Promise.method((condition, action) => {
  if (!condition()) {
    return null;
  }

  const timeout = () =>
    new Promise(resolve => setTimeout(() => resolve(), 5000));

    return action().then(timeout).then(promiseWhile.bind(null, condition, action));

});

export default promiseWhile;
