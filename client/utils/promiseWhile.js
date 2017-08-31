import Promise from 'bluebird';

const promiseWhile = Promise.method((condition, action) => {
  if (condition() < 0) {
    return null;
  }

  setTimeout(() => action().then(promiseWhile.bind(null, condition, action)), condition());
});

export default promiseWhile;
