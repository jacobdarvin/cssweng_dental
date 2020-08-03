//define some sample data
 var tabledata = [
    {id:1,fname:"Jacob", lname:"Darvin", name:"Valorant", email:"jacobisdarvin@gmail.com", contact:"0918894", dob:"1/20/20"},
    {id:2,fname:"Jacob", lname:"Darvin", name:"White Teeth Inc", email:"jacobisdarvin@gmail.com", contact:"2381203", dob:"1/20/20"},
    {id:3,fname:"Jacob", lname:"Darvin", name:"Clinic Passion", email:"jacobisdarvin@gmail.com", contact:"1324124", dob:"1/20/20"},
    {id:4,fname:"Jacob", lname:"Darvin", name:"Arthaland Dental", email:"jacobisdarvin@gmail.com", contact:"2133321", dob:"1/20/20"},
    {id:5,fname:"Jacob", lname:"Darvin", name:"Counter Strike", email:"jacobisdarvin@gmail.com", contact:"2141242", dob:"1/20/20"},
    {id:6,fname:"Jacob", lname:"Darvin", name:"Dota", email:"jacobisdarvin@gmail.com", contact:"1983921", dob:"1/20/20"},
 ];

var table = new Tabulator("#example-table", {
    resizableRows:false,
    resizableColumns:true,
    height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"First Name", field:"fname", width:150},
        {title:"Last Name", field:"lname", width:150},
        {title:"Clinic Name", field:"name", width:150},
        {title:"Employer Email", field:"email"},
        {title:"Contact", field:"contact"},
        {title:"Date Filed", field:"dob", sorter:"date", hozAlign:"center"},
    ],
    rowClick:function(e, row){ //trigger an alert message when the row is clicked
        alert("Entry " + row.getData().id + " clicked");
    },
});