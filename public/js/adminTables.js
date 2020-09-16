var employersTable = new Tabulator('#employers-table', {

    rowClick: function(e, row) {

        $("#admin_employerModal").modal();
        rowData = row.getData();

        document.getElementById("empModalTitle").innerHTML = "Managing for " + "<b>" + rowData.clinicName + "</b>";

        let showStatus = "";

        if(rowData.accStatus == true) {
            statusColor = "green"
            showStatus = "Verified";
        } else {
            statusColor = "red"
            showStatus = "Unverified";
        }

        document.getElementById("empModalBody").innerHTML = 
        "Account Details <br>" + 
        "<b>Account Name:      </b>" + rowData.first + " " + rowData.last + "<br>" +
        "<b>Account Email:     </b>" + '<a href="mailto:rowData.accEmail">' + rowData.accEmail + "</a>" + "<br>" + 
        "<b>Account Phone:     </b>" + rowData.phone + "<br>" +
        "<b>Clinic Name:       </b>" + rowData.clinicName + "<br>" +
        "<hr>" +
        "<b>Account Created:   </b>" + rowData.created + "<br>" +
        "<b>Account Status:    </b>" + "<font color =" + statusColor + ">" + showStatus + "</font>";

        document.getElementById("admin_confirmApproveTitle").innerHTML = "Confirm Employer Status Approval for " + "<b>" + rowData.clinicName + "</b>";
        document.getElementById("admin_confirmDeclineTitle").innerHTML = "Confirm Employer Status Declination for " + "<b>" + rowData.clinicName + "</b>";
    },

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
