//define some sample data
 var tabledata = [
    {id:1,fname:"Jacob", lname:"Darvin", name:"Valorant", email:"jacobisdarvin@gmail.com", contact:"0918894", dob:"1/20/20", car:"false"},
    {id:2,fname:"Jacob", lname:"Darvin", name:"White Teeth Inc", email:"jacobisdarvin@gmail.com", contact:"2381203", dob:"1/20/20", car:"true"},
    {id:3,fname:"Jacob", lname:"Darvin", name:"Clinic Passion", email:"jacobisdarvin@gmail.com", contact:"1324124", dob:"1/20/20", car:"false"},
    {id:4,fname:"Jacob", lname:"Darvin", name:"Arthaland Dental", email:"jacobisdarvin@gmail.com", contact:"2133321", dob:"1/20/20", car:"false"},
    {id:5,fname:"Jacob", lname:"Darvin", name:"Counter Strike", email:"jacobisdarvin@gmail.com", contact:"2141242", dob:"1/20/20", car:"true"},
    {id:6,fname:"Jacob", lname:"Darvin", name:"Dota", email:"jacobisdarvin@gmail.com", contact:"1983921", dob:"1/20/20", car:"true"},
 ];

var table = new Tabulator("#example-table", {
    resizableRows:false,
    resizableColumns:true,
    pagination:"local",
    paginationSize:6,
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"First Name", field:"fname"},
        {title:"Last Name", field:"lname"},
        {title:"Clinic Name", field:"name"},
        {title:"Employer Email", field:"email"},
        {title:"Contact", field:"contact"},
        {title:"Date Filed", field:"dob", sorter:"date", hozAlign:"center"},
        {title:"Status", field:"car", hozAlign:"center", formatter:"tickCross"},
    ],
    rowClick:function(e, row){ //trigger an alert message when the row is clicked
        alert("Entry " + row.getData().id + " clicked");
    },
});