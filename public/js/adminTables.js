var employersTable = new Tabulator('#employers-table', {
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

var applicantsTable = new Tabulator('#applicants-table', {
    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 6,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        //Define Table Columns

        { title: 'First Name', field: 'fName' },
        { title: 'Last Name', field: 'lName' },
        { title: 'Applicant email', field: 'accEmail' },
        { title: 'Contact', field: 'phone' },
    ],
});

employersTable.setData('/employers');
applicantsTable.setData('/applicants');
