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

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

Function.prototype.chain = function() {
	var that = this;
	return function() {
		// New function runs the old function
		var retVal = that.apply(this, arguments);
		// Returns "this" if old function returned nothing
		if (typeof retVal == "undefined") { return this; }
	            // else returns old value
		else { return retVal; }
	}
};

var IC = window.IC === undefined ? { } : IC;

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

// This is the same as window.localStorage, except it can store and retrieve serialized Arrays and Objects
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

// Ajax methods go here inside the HTTP module
IC.HTTP = {
	// accepts a url and a boolean telling it to return the result as an Object rather than a String
	get : function (url, asObject) {
		//"use strict";
        var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		return asObject === true ? JSON.parse(request.responseText) : request.responseText;
	},
	valueForParameter:function(url, param) {
		if (url.match(param)) {
			var vars = [], hash;
			var hashes = url.slice(url.indexOf('?') + 1).split('&');
		    for(var i = 0; i < hashes.length; i++)
		    {
		        hash = hashes[i].split('=');
		        vars.push(hash[0]);
		        vars[hash[0]] = hash[1];
		    }
		    return vars[param].split("#")[0];
		}
	},
};

IC.Element = {};

IC.Element.addEventListener = function(element, eventType, method) {
	"use strict";
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
