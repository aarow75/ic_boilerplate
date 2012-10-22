IC.List = function(parent, data, id, className, containerClassName) {
	function drawList(parent, data) {
		var lC = document.querySelector("." + containerClassName);
		var listContainer = lC!==null?lC: document.createElement("div");
		listContainer.innerHTML = "";
		if (data.title !== undefined) {
			var title = document.createElement("h2");
			title.appendChild(document.createTextNode(data.title));
			listContainer.appendChild(title);
		}
				
		var list = document.createElement("ul");
		list.id = id;
		list.className = className;
		listContainer.className = containerClassName;
		
		for (var i = 0; i < data.items.length; i++) {
			var listItem = document.createElement("li");
			var listItemAnchor = document.createElement("a");
			listItemAnchor.innerHTML = data.items[i].text;
			IC.Element.addAttributes(listItemAnchor, data.items[i].attributes);
			listItem.appendChild(listItemAnchor);
			list.appendChild(listItem);
		}
		listContainer.appendChild(list);
		parent.appendChild(listContainer);
		
		
	}
	
	drawList(parent, data);
};