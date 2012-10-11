// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
 
    var T, A, k;
 
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
 
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);
 
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
 
    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
 
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }
 
    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);
 
    // 7. Let k be 0
    k = 0;
 
    // 8. Repeat, while k < len
    while(k < len) {
 
      var kValue, mappedValue;
 
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
 
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];
 
        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);
 
        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.
 
        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
 
        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }
 
    // 9. return A
    return A;
  };      
}

// clean out undefines from Array
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// supply a google spreadsheet url (the one provided in the )
IC.HTTP.getSpreadsheetUrl = function(url, worksheet, callback) {
	var key = IC.HTTP.valueForParameter(url, "key");
	if (callback === undefined) {
		return "http://spreadsheets.google.com/feeds/cells/"+key+"/"+worksheet+"/public/basic?alt=json";
	} else {
		return "http://spreadsheets.google.com/feeds/cells/"+key+"/"+worksheet+"/public/basic?alt=json-in-script&callback="+callback;
	}
		
}

// a rewrite of IC.Table using Google Spreadsheets API (based on Atom RSS format)
IC.Table = function(obj){
	var parent = obj.parent;
	var data = obj.data;
	var id = obj.id;
	var className = obj.className;
	var containerId = obj.containerId ;
	var containerClassName = obj.containerClassName;
	var drawSearch = obj.drawSearch != undefined? obj.drawSearch: false;
	var title = obj.title;
	var headerRowIndex = obj.headerRowIndex !== undefined? obj.headerRowIndex: 0;
	var includeHeaderRow = obj.includeHeaderRow !== undefined? obj.includeHeaderRow: true;
	
	var tC = document.getElementById(containerId);
	var tableContainer = tC!==null?tC: document.createElement("section");
	var table = document.createElement("table");
	if (title !== undefined) {
		new IC.Element.drawElement(title,"h1",tableContainer);
	}
	if (id !== undefined) table.id = id;
	if (className !== undefined) table.className = className;
	if (containerId !== undefined) tableContainer.id = containerId;
	if (containerClassName !== undefined) tableContainer.className = containerClassName;

	// Draw search box
	if (drawSearch === true) drawSearchBox(tableContainer, data);
	
	// Draw column header
	if (data.header !== undefined) {
		drawDataHeader(data.header,table, data.header.length);

	}
	
	// This is an ATOM feed (google spreadsheet)
	if (data.feed !== undefined) {
		drawDataFeed(data, table);
	}
	
	tableContainer.appendChild(table);
	parent.appendChild(tableContainer);
	
function drawTable(parent, data, title) {
		
	// Draw table rows
	if (data.content !== undefined) {
		drawDataContent(data.content, table, data.content[0].length);		
		//IC.TableSort(); // TODO: make this be a library function in a protected namespace, etc.
	}
	
	//tableContainer.appendChild(table);
	//parent.appendChild(tableContainer);
}

function drawDataHeader(header, table, columnLength) {
	var headerRow = document.createElement("tr");
	var thead = document.createElement("thead");
	for (var columnIndex = 0; columnIndex < columnLength; columnIndex++) {
		if (header[columnIndex].value !== undefined) {
			var cell = document.createElement("th");
			cell.innerHTML = IC.Element.convertEntitiesToHTML(header[columnIndex].value);
			IC.Element.addAttributes(cell, header[columnIndex].attributes);
			headerRow.appendChild(cell);
		}
	}
	thead.appendChild(headerRow);
	table.appendChild(thead);
}

function drawDataContent(content, table, columnLength) {
	var rowCount = content.length;
	var tB = table.querySelector("tbody");
	var tbody = tB!==null?tB: document.createElement("tbody");
	tbody.innerHTML = "";
	//var tbody = document.createElement("tbody");
	//tbody.appendChild(headerRow.cloneNode(true)); // add another header row so we can lock the other
	for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		var row = document.createElement("tr");
		// Draw cells for each column in the row
		for (columnIndex = 0; columnIndex < columnLength; columnIndex++) {
		  	try {			 
				if ((content[rowIndex][columnIndex] !== undefined)) {
					if (content[rowIndex][columnIndex].value !== undefined) {
						cell = document.createElement("td");
						cell.innerHTML = IC.Element.convertEntitiesToHTML(content[rowIndex][columnIndex].value);
						IC.Element.addAttributes(cell, content[rowIndex][columnIndex].attributes);
						row.appendChild(cell);
					} 
				} else {
		  			  cell = document.createElement("td");
		  			  row.appendChild(cell);
				}
			  } catch(er) {
				  // this is just an empty row in the spreadsheet (probably used as a border or something)
	  			  // cell = document.createElement("td");
	  			  // row.appendChild(cell);
			}
		}

		// Add row to table
		
		tbody.appendChild(row);
	}
	// Add table to dom
	table.appendChild(tbody);

}

function drawDataFeed(data, table) {
	//console.log(data.feed.entry[0]);
	var rowLength = data.feed.openSearch$totalResults.$t;
	var rows = data.feed.entry;
	// determines the column index and row index of each cell to build the table.
	var content = [];
	var contentLength = [];

	for (var row = 0; row < rowLength; row++) {
		var text = rows[row].content.$t;
		var cell = rows[row].title.$t;
		var idArray = rows[row].id.$t.split("/");
		var id = idArray[idArray.length-1];
		var tableRow = id.replace("R","").split("C")[0] - 1;
		var tableColumn = id.split("C")[1] - 1;
		content[tableRow] = [];
	}
	for (var row = 0; row < rowLength; row++) {
		var text = rows[row].content.$t;
		var cell = rows[row].title.$t;
		var idArray = rows[row].id.$t.split("/");
		var id = idArray[idArray.length-1];
		var tableRow = id.replace("R","").split("C")[0] - 1;
		var tableColumn = id.split("C")[1] - 1;
		content[tableRow][tableColumn] = {value:text};
		contentLength[tableRow] = tableColumn;
	}
	// find out how many columns the table should have
	var maxColumnWidth = Math.max.apply(Math, contentLength.clean(undefined)) + 1;	// +1 since I removed something
	if (includeHeaderRow) {
		drawDataHeader(content[headerRowIndex], table, maxColumnWidth);
	}
	
	// if the header is 2nd row (index 1), remove the first and second row so the table body doesn't include the header row
	if 	(headerRowIndex == 1) content.splice(headerRowIndex, headerRowIndex);
	// remove the header row (so it doesn't display in the table body)
	content.shift();
	drawDataContent(content, table, maxColumnWidth)
	//console.log(data.feed.title.$t);
}

function drawSearchBox(parent, data) {
	var input = document.createElement("input");
	var searchButton = document.createElement("input");
	var resetButton = document.createElement("input");
	var columnSelect = document.createElement("select");
	
	// search box
	input.setAttribute("placeholder", "Search by");
	input.setAttribute("type", "text");
	// trigger the "search" button if the user hits enter
	IC.Element.addEventListener(input, "keypress", function() {
		if (window.event.keyCode === 13) searchButton.click();
	});
	parent.appendChild(input);
	
	// column selector
	for (var headerIndex = 0; headerIndex < data.header.length; headerIndex++) {
		if (data.header[headerIndex].value !== undefined) {
			columnSelect.add(new Option(data.header[headerIndex].value, headerIndex));
		}
	}
	// if the user hits "enter" after selecting a column, trigger the search.
	IC.Element.addEventListener(columnSelect, "keypress", function() {
		if (window.event.keyCode === 13) searchButton.click();
	});
	parent.appendChild(columnSelect);
	
	// reset button
	resetButton.setAttribute("type", "reset");
	IC.Element.addEventListener(resetButton, "click", function() {
		input.value = "";
		searchButton.click();
	});
	parent.appendChild(resetButton);
	
	// search button
	searchButton.value = "Search";
	searchButton.setAttribute("type", "button");
	IC.Element.addEventListener(searchButton, "click", function(){
		if (input.value !== "" || input.value !== "*") {
			//drawTable(parent, findRow(columnSelect.value, input.value));
			drawTable(parent, findRow(columnSelect.value, input.value));
		} else {
			drawTable(parent, data);
		}
	});
	parent.appendChild(searchButton);

	IC.Element.addEventListener(window, "keyup", function() {
		if (window.event.keyCode === 27) {
			resetButton.click();
		}
	});
}

function findRow(columnIndex, searchString) {
	var columns = data.header;
	var rows = data.content;
	var rowsLength = rows.length;
	var resultArray = [];
	for (var i = 0; i < rowsLength; i++) {
		var columnValue = rows[i][columnIndex].value
		// if we are searching for a number, this strips any commas from the search, unless they explicitly include a comma in the search
		if (!searchString.match(new RegExp(",", "i"))) {
			columnValue = columnValue.replace(",","").replace(",","").replace(",","");
		}
		if (columnValue.match(new RegExp(searchString, "i"))) {
			resultArray.push(rows[i]);
		}
	} 
	var newdata = {};
	newdata.header = columns;
	newdata.content = resultArray;
	return newdata;
}


drawTable(parent, data, title);

};
