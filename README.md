ic_boilerplate
==============

HTML "IC" boilerplate

js/ic.js
--------
The main framework file. Other ic.*.js files depend on this. Establishes the `IC` namespace and some helper functions.
ECMA Script 5 "polyfills" and augmented native objects.

- `Array.inArray()`
- `Array.isArray()`
- `Object.isObject()`

Improved `localStorage` with support for storing JSON objects.

- `IC.localStorage`

A function to rapidly create HTML elements and add them to the DOM

- `IC.Element.drawElement(content, element, parent, attributes)`

A function to add events to elements (which only exists because of IE's lack of `addEventListener` support)

js/ic.list.js
-------------

- `new IC.List(parent, data, id, className, containerClassName)`

With the data format as follows:

`
{
>	title:"(Optional) The title of my list",
>	items:[
>>		{text:"April promotions", attributes:{href:"#"}},
>>		{text:"January renewals", attributes:{href:"#"}}
>	]
}
`

js/data.js
----------
Just a file with some javascript objects to supply some sample data. 
In a normal scenario, this file would not exist for this purpose, instead, AJAX would query JSON data.
