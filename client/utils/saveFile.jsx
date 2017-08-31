import filesaver from 'browser-filesaver';
import CSV from 'comma-separated-values';

const map = (columns, data) => data.map(record => {
  const mappedRecord = { };
  columns.forEach(c => {
    mappedRecord[c.columnName] = new Function('user', 'return ' + c.userAttribute + ' || \'\'')(record);
  });
  return mappedRecord;
});

export const toCSV = (filename, columns, data) => {
  const mappedData = map(columns, data);
  const output = new CSV(mappedData, { header: true, cellDelimiter: '\t' }).encode();

  const csv = output.split('\n');
  const blob = new Blob(csv, { type: 'text/plain;charset=utf-8' });
  filesaver.saveAs(blob, filename);
}

export const toJSON = (filename, columns, data) => {
  const mappedData = (columns && columns.length) ? map(columns, data) : data;

  const json = [ JSON.stringify(mappedData, null, 2) ];
  const blob = new Blob(json, { type: 'text/plain;charset=utf-8' });
  filesaver.saveAs(blob, filename);
};
