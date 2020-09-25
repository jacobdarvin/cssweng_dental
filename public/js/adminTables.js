
var employersTable = new Tabulator('#employers-table', {

    rowClick: function(e, row) {

        $("#admin_employerModal").modal();
        rowData = row.getData();

        document.getElementById("empModalTitle").innerHTML = "Managing for " + "<b>" + rowData.clinicName + "</b>";

        let showStatus = "";

        if(rowData.accStatus == 'Verified' ) {
            statusColor = "green"
            showStatus = "<b>Verified</b>";
        } else {
            statusColor = "red"
            showStatus = "<b>Unverified</b>";
        }

        document.getElementById("acc_id").innerHTML = rowData._id;
        document.getElementById("acc_name").innerHTML = rowData.first + " " + rowData.last;
        document.getElementById("acc_email").innerHTML = '<a href="mailto:rowData.accEmail">' + rowData.accEmail;
        document.getElementById("acc_phone").innerHTML = rowData.phone;
        document.getElementById("cl_name").innerHTML = rowData.clinicName;
        document.getElementById("acc_create").innerHTML = rowData.created;
        document.getElementById("acc_stat").innerHTML =  "<font color =" + statusColor + ">" + showStatus + "</font>";
        document.getElementById("confirm_id").value = rowData._id;
        document.getElementById("decline_id").value = rowData._id;

        // document.getElementById("empModalBody").innerHTML = 
        // "Account Details <br>" + 
        // "<b>Account Name:      </b>" + rowData.first + " " + rowData.last + "<br>" +
        // "<b>Account Email:     </b>" + '<a href="mailto:rowData.accEmail">' + rowData.accEmail + "</a>" + "<br>" + 
        // "<b>Account Phone:     </b>" + rowData.phone + "<br>" +
        // "<b>Clinic Name:       </b>" + rowData.clinicName + "<br>" +
        // "<hr>" +
        // "<b>Account Created:   </b>" + rowData.created + "<br>" +
        // "<b>Account Status:    </b>" + "<font color =" + statusColor + ">" + showStatus + "</font>";

        document.getElementById("admin_confirmApproveTitle").innerHTML = "Confirm Employer Status Approval for " + "<b>" + rowData.clinicName +"</b>" + "?";
        document.getElementById("admin_confirmDeclineTitle").innerHTML = "Confirm Employer Status Declination for " + "<b>" + rowData.clinicName + "</b>" + "?";

        if(rowData.accStatus == 'Verified') {
            document.getElementById("admin_approveBtn").innerHTML = '<button type="button" style="display: inline-block;" class="w-100 btn btn-danger" data-toggle="modal" data-target="#admin_confirmDecline" data-dismiss="modal">Decline Status</button> <button type="button" style="display: inline-block;" class="w-100 btn btn-secondary" data-dismiss="modal">Close</button>';
           
        } else{
            document.getElementById("admin_approveBtn").innerHTML = ' <button type="button" style="display: inline-block;" class="w-100 btn btn-success" data-toggle="modal" data-target="#admin_confirmApprove" data-dismiss="modal">Approve Status</button> <button type="button" style="display: inline-block;" class="w-100 btn btn-secondary" data-dismiss="modal">Close</button>';
        }
        
    },

    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        //Define Table Columns
        { title: 'Account ID', field: '_id'},
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
        },
    ],
});

var applicantsTable = new Tabulator('#applicants-table', {
    rowClick: function(e, row) {
        showApplicantDetails(row);
    },

    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        { title: 'ID', field: '_id' },
        { title: 'First Name', field: 'fName' },
        { title: 'Last Name', field: 'lName' },
        { title: 'Applicant email', field: 'accEmail' },
        { title: 'Contact', field: 'phone' },
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

    rowClick: function(e, row) {
        
        $("#admin_jobModal").modal();
        rowData = row.getData();

        document.getElementById("jobModalTitle").innerHTML = "Managing job for " + "<b>" + rowData.clinicName + "</b>";


        document.getElementById("job_clinic_name").innerHTML = rowData.clinicName;
        document.getElementById("job_clinic_city").innerHTML = rowData.placement;
        document.getElementById("job_clinic_state").innerHTML = rowData.clinic_city;
        document.getElementById("job_placement").innerHTML = rowData.clinic_state;
        document.getElementById("job_id").innerHTML = rowData._id;
        document.getElementById("job_create").innerHTML = rowData.created;
        document.getElementById("job_description").innerHTML = rowData.description;
        document.getElementById("admin_closeJobTitle").innerHTML = "Confirm to Close Job for " + "<b>" + rowData.clinicName + "</b>";
        document.getElementById("closejob_id").value = rowData._id;
    },

    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [

        { title: 'Job ID', field: '_id' },
        { title: 'Clinic Name', field: 'clinicName' },
        { title: 'Placement', field: 'placement' },
        { title: 'Position', field: 'position' },
        { title: 'Clinic City', field: 'clinic_city' },
        { title: 'Clinic State', field: 'clinic_state' },
        { title: 'Created', field: 'created' },

    ],
});


var jobApplicantsTable = new Tabulator('#job-app-table', {
    rowClick: function(e, row) {
        showApplicantDetails(row);
    },
    
    resizableRows: false,
    resizableColumns: true,
    pagination: 'local',
    paginationSize: 8,
    layout: 'fitColumns',
    index: '_id',
    columns: [
        { title: 'ID', field: '_id' },
        { title: 'First Name', field: 'fName' },
        { title: 'Last Name', field: 'lName' },
        { title: 'Applicant email', field: 'accEmail' },
        { title: 'Contact', field: 'phone' },
        { title: 'Placement', field: 'placement' },
        { title: 'Position', field: 'position' },
        { title: 'Street', field: 'streetAdd' },
        { title: 'House No.', field: 'houseNo' },
        { title: 'City', field: 'city' },
        { title: 'State', field: 'state' },
        { title: 'Zip', field: 'zip' },
    ],
})

    

jobsTable.setData('/jobs');
employersTable.setData('/employers');
applicantsTable.setData('/applicants');


// --------EVENT LISTENERS--------

document.getElementById('input-job-id').oninput = (ev) => {
    const jobIdEl = ev.target;

    jobApplicantsTable.setData(`/admin/applicants?${jobIdEl.name}=${jobIdEl.value}`);
}

document.getElementById('collapseAppList').onclick = ev => {
    const jobIdEl = document.getElementById('input-job-id');
    jobIdEl.value = document.getElementById('job_id').innerText;

    const inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', true, true)
    document.getElementById('input-job-id').dispatchEvent(inputEvent);
}

// --------EVENT LISTENERS--------

// --------FUNCTIONS--------

// display applicant modal
function showApplicantDetails(row) {
    $("#admin_applicantModal").modal();
        rowData = row.getData();

        document.getElementById("appModalTitle").innerHTML = "Viewing account details for " + "<b>" + rowData.fName + ' ' + rowData.lName + "</b>";

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
        "<b>Zip:         </b>" + rowData.zip + "<br>";

        let showStatus = "";
}
// --------FUNCTIONS--------
