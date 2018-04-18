export default function handleUnauthorizedMiddleware() {
  return () => next => action => {
    if (action && action.type && action.type.endsWith('_REJECTED') && action.payload) {
      const status = action.payload.status || action.payload.response.status;
      if (status === 401 || status === 403) {
        window.location = window.config.BASE_URL + '/login';
      }
    }

    next(action);
  };
}
