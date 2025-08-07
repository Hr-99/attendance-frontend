import * as XLSX from "xlsx";

import * as XLSXStyle from 'xlsx-js-style';

import { saveAs } from "file-saver";


export const handleExportRows = (
  rows,
  customHeaders = {},
  ignoredColumns = [],
  keysToRemove = [],
  arrayKeyForSheet2 = 'keyforSheet2', 
  externalSheet2Data = [], 
  sheet1Name = "Sheet1",
  additionalSheetName = "AdditionalData",
  includeAdditionalSheet = false,
) => {
  if (!Array.isArray(keysToRemove)) {
    keysToRemove = [];
  }

const processRowData = (row) => {
  const dataSource = row?.original || row;

  const flattenObject = (obj, parentKey = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(acc, flattenObject(value, fullKey));
      } else {
        acc[fullKey] = value;
      }

      return acc;
    }, {});
  };

  const flatRow = flattenObject(dataSource);

 const filteredRow = Object.keys(flatRow)
  .filter((key) => {
    return Array.isArray(ignoredColumns) &&
      !ignoredColumns.some(ignored => key === ignored || key.startsWith(`${ignored}.`));
  })
  .reduce((obj, key) => {
    const value = flatRow[key];
    if (value instanceof Date) {
      obj[key] = `${value.getDate().toString().padStart(2, '0')}/${
        (value.getMonth() + 1).toString().padStart(2, '0')
      }/${value.getFullYear()}`;
    } else if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}/)) {
      const parts = value.split('/');
      obj[key] = `${parts[1].padStart(2, '0')}/${parts[0].padStart(2, '0')}/${parts[2]}`;
    } else {
      obj[key] = value;
    }
    return obj;
  }, {});


  const reorderedRow = {};
  Object.keys(filteredRow).forEach((key) => {
    reorderedRow[customHeaders[key] || key] = filteredRow[key];
  });

  return reorderedRow;
};


  const rowData = rows?.map((row) => processRowData(row));

  const worksheet = XLSX.utils.json_to_sheet(rowData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheet1Name);

  const applyHeaderStyles = (worksheet) => {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        fill: { patternType: "solid", fgColor: { rgb: "000000" } },
        font: { bold: true, color: { rgb: "ffffff" } },
      };
    }
  };

  applyHeaderStyles(worksheet);

  if (includeAdditionalSheet) {
    const nestedData = rows?.flatMap((row) => row?.original?.[arrayKeyForSheet2]?.map((item) => ({ original: item })) || []);
    const processedNestedData = nestedData.map((item) => processRowData(item));
    const processedExternalData = externalSheet2Data.map((item) => processRowData(item));
    const additionalData = [...processedNestedData, ...processedExternalData];
    const additionalWorksheet = XLSX.utils.json_to_sheet(additionalData);
    XLSX.utils.book_append_sheet(workbook, additionalWorksheet, additionalSheetName);
    applyHeaderStyles(additionalWorksheet);
  }

  const wbout = XLSXStyle.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const fileName = prompt('Enter the file name for the exported data:', '');
  if (fileName) {
    saveAs(blob, `${fileName}.xlsx`);
  }
};