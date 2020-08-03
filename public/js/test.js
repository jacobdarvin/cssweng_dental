var table = new Tabulator('#example-table2', {
    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 6,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        //Define Table Columns
        { title: 'E-mail address', field: 'accEmail' },
        {
            title: 'Date Filed',
            field: 'created',
            formatter: 'datetime',
            formatterParams: {
                outputFormat: 'MM/DD/YYYY',
            },
        },
    ],
});

table.setData('/employers');

console.log(table);
