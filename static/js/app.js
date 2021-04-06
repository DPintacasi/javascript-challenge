// ------- build table ------- 

// from data.js
var tableData = data;

// table builder function
var tbody = d3.select("tbody")
function buildTable(data) {
    tbody.html("");
    data.forEach(function(obj) {
        // console.log(obj);
        var row = tbody.append("tr");
        Object.entries(obj).forEach(function([key, value]) {
        // console.log(key, value);
          var cell = row.append("td");
          cell.text(value);
        }  
        )
    }
    )
}
buildTable(tableData);

// ------- create list for dropdown --------

function listOptions(selectedKey) {
    var sortedData = tableData
    var dimensionOptions = d3.select(`#${selectedKey}`);
    var dimensions = [];
    tableData.forEach(function(obj){
        if (!(dimensions.includes(obj[`${selectedKey}`]))){
            var option = dimensionOptions.append("option");
            option.text(obj[`${selectedKey}`]);
            dimensions.push(obj[`${selectedKey}`]);
        }  
    }
    )
}

listOptions("state");
listOptions("country");
listOptions("shape");


// --------- create filters ----------

var form = d3.select("#form")
var button = d3.select("button")

button.on("click", filterTable);
form.on("submit",filterTable);

function filterTable() {

    d3.event.preventDefault();

    // --- build object with filter inputs ---

    // pull raw inputs from form
    var filterObjRaw = {
        datetime: d3.select("#datetime").property("value"),
        city: d3.select("#city").property("value"),
        state: d3.select("#state").property("value"),
        country: d3.select("#country").property("value"),
        shape: d3.select("#shape").property("value"),
    };

    // clean object will "default" unspecifced filters
    function clean(obj) {
        for (var keyValue in obj) {
          if (obj[keyValue] === "select item" || obj[keyValue] === "") {
            delete obj[keyValue];
          }
        }
        return obj
      }
    
    // object with desired values
    var filterObj = clean(filterObjRaw)
   
    console.log('Will filter on:')
    console.log(filterObj);

    // --- filter data --- 

    filteredData = tableData.filter(function(row) {
        for (var keyValue in filterObj){
            if(row[keyValue] != filterObj[keyValue]){
                return false;
            }
        }
        return true;
    }
    );

    // --- build table with filtered data ---
    
    //if filters are cleared we can retrive unfilter table
    if (Object.keys(filterObj).length === 0){
        buildTable(tableData);
    }
    else{  
        buildTable(filteredData);
    }
}



