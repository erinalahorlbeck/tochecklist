# toChecklist plug-in for jQuery

The toChecklist plug-in for jQuery will give you the functionality of a SELECT box without the need to `ctrl+click` items to select them.



## Installation

The goal is to have `toChecklist` available via `npm`, but for now, you will have to set it up manually:

Make sure you include jQuery 1.9.x or greater on your page (and possibly the [jquery-migrate plug-in](https://github.com/jquery/jquery-migrate)), and then you simply need the css and js files for `toChecklist` in a publicly accessible directory, like so:


```html
<!-- Stylesheet -->
<link type="text/css" rel="stylesheet" media="screen" href="path/to/jquery.toChecklist.css" />

<!-- Also, make sure you have jQuery itself along with the toChecklist plug-in -->
<script type="text/javascript" src="path/to/jquery.js"></script>
<script type="text/javascript" src="path/to/jquery.toChecklist.js"></script>
```


## Basic Usage

First, create the html as usual, for example,



```html
<select id="mySelectBox" multiple="multiple">
	<option>Value 1</option>
	<option>Value 2</option>
	<option>Value 3</option>
</select>
```


then call:



```js
$('#mySelectBox').toChecklist();
```


## Settings

There are a number of settings that you can pass in to customize each (or every) checklist.

* [Documentation](https://github.com/shorlbeck/tochecklist/wiki)
* [Demo page](http://scotthorlbeck.com/code/tochecklist)


