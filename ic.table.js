IC.Table = function(parent, data, id, className, containerId, containerClassName, drawSearch){

	if (containerId === undefined || containerId === "") {
		containerId = "table-" + IC.generateGUID();
	}

function drawTable(parent, data) {
	var tC = document.getElementById(containerId);
	var tableContainer = tC!==null?tC: document.createElement("section");
	tableContainer.innerHTML = "";
	var table = document.createElement("table");
	table.id = id;
	table.className = className;
	tableContainer.id = containerId;
	tableContainer.className = containerClassName;

	// Draw column header
	if (data.header !== undefined) {
		
		var columnLength = data.header.length;
		var headerRow = document.createElement("tr");
		var thead = document.createElement("thead");
		for (var columnIndex = 0; columnIndex < columnLength; columnIndex++) {
			if (data.header[columnIndex].value !== undefined) {
				var cell = document.createElement("th");
				cell.innerHTML = IC.Element.convertEntitiesToHTML(data.header[columnIndex].value);
				IC.Element.addAttributes(cell, data.header[columnIndex].attributes);
				headerRow.appendChild(cell);
			}
		}
		thead.appendChild(headerRow);
		table.appendChild(thead);
	}
	// Draw table rows
	if (data.content !== undefined) {
		var rowCount = data.content.length;
		var tbody = document.createElement("tbody");
		//tbody.appendChild(headerRow.cloneNode(true)); // add another header row so we can lock the other
		for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			var row = document.createElement("tr");
			
			// Draw cells for each column in the row
			columnLength = data.content[0].length;
			for (columnIndex = 0; columnIndex < columnLength; columnIndex++) {
				if (data.content[rowIndex][columnIndex] !== undefined) {
					if (data.content[rowIndex][columnIndex].value !== undefined) {
						cell = document.createElement("td");
						cell.innerHTML = IC.Element.convertEntitiesToHTML(data.content[rowIndex][columnIndex].value);
						IC.Element.addAttributes(cell, data.content[rowIndex][columnIndex].attributes);
						row.appendChild(cell);
					}
				}
			}

			// Add row to table
			tbody.appendChild(row);
		}
		
		// Add table to dom
		table.appendChild(tbody);
		tableContainer.appendChild(table);
		parent.appendChild(tableContainer);
		//IC.TableSort(); // TODO: make this be a library function in a protected namespace, etc.
	}
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
			drawTable(document.body, findRow(columnSelect.value, input.value));
		} else {
			drawTable(document.body, data);
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


if (drawSearch === true) drawSearchBox(parent, data);
drawTable(parent, data);

};