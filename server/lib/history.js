const _ = require('lodash');

module.exports = (record, storage) =>
  storage.read()
    .then(data => {
      data = data || {};
      data.jobs = data.jobs || [];
      const job = {
        id: record.id,
        type: record.type,
        date: record.date || new Date(),
        status: record.status || 'pending',
        summary: record.summary || {}
      };

      const jobIndex = _.findIndex(data.jobs, { id: job.id });

      if (jobIndex < 0) {
        data.jobs.push(job);
      } else {
        data.jobs[jobIndex].status = job.status;
        data.jobs[jobIndex].summary = job.summary;
      }

      if (data.jobs.length > 20) {
        data.jobs = _.drop(data.jobs, data.jobs.length - 20);
      }

      return storage.write(data)
        .then(() => record);
    });
