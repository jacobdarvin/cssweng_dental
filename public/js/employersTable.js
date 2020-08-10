var table = new Tabulator('#example-table', {
    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 6,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        //Define Table Columns

        { title: 'First Name', field: 'first' },
        { title: 'Last Name', field: 'last' },
        { title: 'Clinic Name', field: 'clinicName' },
        { title: 'Employer email', field: 'accEmail' },
        { title: 'Contact', field: 'phone' },
        {
            title: 'Date Filed',
            field: 'created',
            formatter: 'datetime',
            formatterParams: {
                outputFormat: 'DD/MM/YYYY',
            },
            sorter: 'date',
            sorterParams: {
                format: 'DD/MM/YYYY',
                alignEmptyValues: 'top',
            },
            hozAlign: 'center',
        },
        {
            title: 'Status',
            field: 'accStatus',
            hozAlign: 'center',
            formatter: 'tickCross',
        },
    ],
});

table.setData('/employers');

console.log(table);
