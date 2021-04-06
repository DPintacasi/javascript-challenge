// ------- build table ------- 

// from data.js
var tableData = data;

// d3 object for table body
var tbody = d3.select("tbody");

// table builder function
function buildTable(data) {

    // clear current table
    tbody.html("");

    // reset count to console log number of rows
    var count = 0;

    // appead data to tbody
    data.forEach(function(obj) {
        var row = tbody.append("tr");
        count += 1;
        Object.values(obj).forEach(function(value) {
          var cell = row.append("td");
          cell.text(value);
        }  
        );
    }
    );

    // log total number of rows in table
    if (count === 0){
        console.log("No data was found for your selection");
    }
    else if (count === 1){
        console.log("Table contains 1 row");
    }
    else{
        console.log(`Table contains ${count} rows`)
    };
};

buildTable(tableData);



// ------- create lists for dropdowns --------

function listOptions(selectedKey) {

    // extract options into array
    var dimensions = [];
    tableData.forEach(function(obj){
        if (!(dimensions.includes(obj[selectedKey]))){ 
            dimensions.push(obj[selectedKey]);
        }  
    });

    // create d3 object
    var dimensionOptions = d3.select(`#${selectedKey}`);

    // sort options into alphabetical order
    var sortedDimensions = dimensions.sort();

    // add to dropdown menu
    sortedDimensions.forEach(function(item){
        var option = dimensionOptions.append("option");
        option.text(item);
        
    });
};

// run on filters with dropdowns
listOptions("state");
listOptions("country");
listOptions("shape");



// --------- create filters ----------

// create d3 objects
var form = d3.select("#form");
var filterButton = d3.select("#filter-btn");

// create event listeners
filterButton.on("click", filterTable);
form.on("submit",filterTable);

// event handler for table filtering
function filterTable() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // --- build object with filter inputs ---

    // pull raw inputs from form
    var filterObjRaw = {
        datetime: d3.select("#datetime").property("value"),
        city: d3.select("#city").property("value").toLowerCase(),
        state: d3.select("#state").property("value"),
        country: d3.select("#country").property("value"),
        shape: d3.select("#shape").property("value"),
    };

    // clean object with "default" unspecifced filters
    function clean(obj) {
        for (var keyValue in obj) {
          if (obj[keyValue] === "select item" || obj[keyValue] === "") {
            delete obj[keyValue];
          };
        };
        return obj;
      };
    
    // object with desired values
    var filterObj = clean(filterObjRaw);
   
    // info message for filters
    console.log(`Filtering on:`);
    Object.entries(filterObj).forEach(([key, value])=>console.log(`     ${key}: ${value}`));


    // --- filter data --- 
    filteredData = tableData.filter(function(row) {
        for (var keyValue in filterObj){
            if(row[keyValue] != filterObj[keyValue]){
                return false;
            };
        };
        return true;
    });

    // --- build table with filtered data ---   
    // if filters are cleared we can retrive unfilter table
    if (Object.keys(filterObj).length === 0){
        buildTable(tableData);
    }
    else{  
        buildTable(filteredData);
    };
};

// ----- clear filters -----

var clearButton = d3.select("#clear-btn");

clearButton.on("click", function (){
    d3.selectAll("input").property("value","");
    d3.selectAll("select").property("value","select item");
    console.log("Filters Reset")
    buildTable(tableData);
});




