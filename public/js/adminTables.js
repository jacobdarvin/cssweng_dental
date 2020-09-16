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
    paginationSize: 8,
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
    rowClick: function(e, row) {
        $("#admin_applicantModal").modal();
        rowData = row.getData();

        console.log(rowData);

        document.getElementById("appModalTitle").innerHTML = "Managing account for " + "<b>" + rowData.fName + ' ' + rowData.lName + "</b>";

        document.getElementById("appModalBody").innerHTML = 
        "Account Details <br>" + 
        "<b>ID:          </b>" + rowData._id + "<br>" +
        "<b>Full Name:   </b>" + rowData.fName + " " + rowData.lName + "<br>" +
        "<b>Email:       </b>" + '<a href="mailto:rowData.accEmail">' + rowData.accEmail + "</a>" + "<br>" + 
        "<b>Phone:       </b>" + rowData.phone + "<br>" +
        "<b>Placement:   </b>" + rowData.placement + "<br>" +
        "<b>Position:    </b>" + rowData.position + "<br>" +
        "<hr>" +
        "Account Address <br>" + 
        "<b>Street:      </b>" + rowData.streetAdd + "<br>" +
        "<b>House No:    </b>" + rowData.houseNo + "<br>" +
        "<b>City:        </b>" + rowData.city + "<br>" +
        "<b>State:       </b>" + rowData.state + "<br>" +
        "<b>Zip:         </b>" + rowData.zip + "<br>" +

        "<hr>";
        let showStatus = "";
    },

    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        { title: 'First Name', field: 'fName' },
        { title: 'Last Name', field: 'lName' },
        { title: 'Applicant email', field: 'accEmail' },
        { title: 'Contact', field: 'phone' },
        { title: 'ID', field: '_id' },
        { title: 'Placement', field: 'placement' },
        { title: 'Position', field: 'position' },

        { title: 'Street', field: 'streetAdd' },
        { title: 'House No.', field: 'houseNo' },
        { title: 'City', field: 'city' },
        { title: 'State', field: 'state' },
        { title: 'Zip', field: 'zip' },
    ],
});

var jobsTable = new Tabulator('#jobs-table', {
    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [

        { title: 'Clinic Name', field: 'clinicName' },
        { title: 'Placement', field: 'placement' },
        { title: 'Position', field: 'position' },
        { title: 'Clinic City', field: 'clinic_city' },
        { title: 'Clinic State', field: 'clinic_state' },
        { title: 'Created', field: 'created' },
        { title: 'Job ID', field: '_id' },
        
    ],
});

jobsTable.setData('/jobs');
employersTable.setData('/employers');
applicantsTable.setData('/applicants');
