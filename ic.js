if ( !Array.prototype.inArray ) {
	Array.prototype.inArray = function (value) {
		// Returns true if the passed value is found in the
		// array. Returns false if it is not.
		"use strict";
		var i;
		for (i = 0; i < this.length; i++) {
			if (this[i] == value) {
				return true;
			}
		}
		return false;
	};
}

// Checks to see if the value is an array.
if (!Object.prototype.isArray) {
	Object.prototype.isArray = function() {
		var serializable = Object.prototype.toString.apply(this);
		if (serializable === "[object Array]") {
			return true;
		} 
		return false;
	}
}

// Checks to see if the value is an object.
if (!Object.prototype.isObject) {
	Object.prototype.isObject = function() {
		var serializable = Object.prototype.toString.apply(this);
		if (serializable === "[object Object]") {
			return true;
		} 
		return false;
	}
}

var IC = window.IC === undefined ? { } : IC;

// This is the same as window.localStorage, except it can store and retrieve serialized Arrays and Objects
IC.generateGUID = function() {
    var S4 = function () {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };

    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
}

IC.localStorage = {
	setItem : function (key, value) {
        "use strict";
		if (Object.prototype.toString.apply(value) === "[object Object]" || Object.prototype.toString.apply(value) === "[object Array]") {
			value = JSON.stringify(value);
		}
		window.localStorage.setItem(key, value);
	},
	
	getItem : function (key) {
        "use strict";
		var value = window.localStorage.getItem(key);
        // if the value looks like serialized JSON, parse it
        return (/^(\{|\[).*(\}|\])$/).test(value) ? JSON.parse(value) : value;
	},
	
	removeItem : function (key) {
        "use strict";
		window.localStorage.removeItem(key);
	}
};

IC.Element = {};

IC.Element.addEventListener = function(element, eventType, method) {
	//"use strict";
	console.log(Function.caller)
	if (element.addEventListener) {
		element.addEventListener(eventType, method, false);
	} else {
		element.attachEvent('on' + eventType, method);
	}
};

IC.Element.addAttributes = function(element, attributes) {
	"use strict";
	if (attributes != undefined) {
		for (var attr in attributes) {
			if (attributes.hasOwnProperty(attr)) {
				element.setAttribute(attr, attributes[attr]);
			}			
		}
	}
	return element;
};

IC.Element.drawElement = function(content, element, parent, params) {
	"use strict";
	var div = document.createElement(element);
	if (params !== undefined) {
		for (var attribute in params) {
			if (typeof params[attribute] === "string") {
				div.setAttribute(attribute, params[attribute]);
			}
		}
	}
	// if the content is an array of strings, make it into an unordered list
	if (content.isArray()) {
		var ul = document.createElement("ul");
		for (var i = 0; i < content.length; i++) {
			var li = document.createElement("li");
			li.innerHTML = IC.Element.convertEntitiesToHTML(content[i]);
			ul.appendChild(li);
		}
		content = ul.outerHTML;
	} else {
		content = IC.Element.convertEntitiesToHTML(content);
	}
	
	div.innerHTML = content;
	//div.appendChild(document.createTextNode(content));
	parent.appendChild(div);
}

IC.Element.convertEntitiesToHTML = function(string) {
	if (typeof string === "string") {
		return string.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')
	} else {
		return string;
	}
	 
}
