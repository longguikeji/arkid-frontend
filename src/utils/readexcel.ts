function processTableData(sheets:any) {
  const tableBody:any = [];
  const tableHeader:any = [];
  sheets.forEach((item:any, index:any) => {
    if (tableHeader.length < 1) {
      tableHeader.push(...Object.keys(item));
    }
    tableBody.push([]);
    Object.keys(item).map((objKeyItem) => {
      tableBody[index].push(item[objKeyItem]);
    });
  });
  return [tableHeader, tableBody];
}
export { processTableData as default };
