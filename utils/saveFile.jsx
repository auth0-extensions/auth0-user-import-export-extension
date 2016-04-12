import filesaver from 'browser-filesaver';

const map = (columns, data) => data.map(record => {
  const mappedRecord = { };
  columns.forEach(c => {
    mappedRecord[c.columnName] = new Function('return ' + c.userAttribute).call(record)
  });
  return mappedRecord;
});

export const toCSV = (filename, columns, data) => {
  const mappedData = map(columns, data);
}

export const toJSON = (filename, columns, data) => {
  console.log('file', filename);
  console.log('columns', columns);
  console.log('data', data);
  const mappedData = map(columns, data);
  const json = [ JSON.stringify(mappedData, null, 2) ];

  const blob = new Blob(json, { type: 'text/plain;charset=utf-8' });
  filesaver.saveAs(blob, filename);
};
