var table = new Tabulator('#example-table2', {
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
        { title: 'Contact', field: 'contact' },
        {
            title: 'Date Filed',
            field: 'created',
            formatter: 'datetime',
            formatterParams: {
                outputFormat: 'MM/DD/YYYY',
            },
            sorter: 'date',
            sorterParams: {
                format: 'MM/DD/YYYY',
                alignEmptyValues: 'top',
            },
            hozAlign: 'center',
        },
        {
            title: 'Status',
            field: 'accepted',
            hozAlign: 'center',
            formatter: 'tickCross',
        },
    ],
});

table.setData('/employers');

console.log(table);
