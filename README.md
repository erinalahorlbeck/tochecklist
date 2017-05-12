**THIS PLUG-IN IS NO LONGER ACTIVELY MAINTAINED.**

Furthermore, it is only available under GPL, not MIT, license. You are strongly encouraged to look into other more modern, more freely-licensed plug-ins to replace the well-known shortcomings of `<select multiple="multiple">`

# toChecklist plug-in for jQuery

The toChecklist plug-in for jQuery will give you the functionality of a `<select multiple="multiple">` menu without the need to `ctrl+click` items to select/deselect them (`cmd+click` on Mac).

This is necessary because the average, non-computer-savvy user is generally unaware of `ctrl+click`.

[View Demo Page](http://scotthorlbeck.com/code/tochecklist)


## Installation

The goal is to have `toChecklist` available via `npm`, but for now, you will have to set it up manually:

1.  First, make sure you include [jQuery](http://jquery.com) 1.9.x or greater on your page, typically in the `<head>` section of your html. See example html below.  (Most features seem to work, up through jQuery 3.1.0, the present version.)
2.  Copy the css and js files for `toChecklist` from the `src` folder to a directory that is publicly accessible on your web site.
3.  Add them to your `<head>` section like so:


```html
<head>
	<!-- Stylesheet -->
	<link type="text/css" rel="stylesheet" media="screen" href="path/to/jquery.toChecklist.css" />

	<!-- Also, make sure you have jQuery itself along with the toChecklist plug-in -->
	<script src="path/to/jquery.js"></script>

	<!-- Note that many web servers are case-sensitive when it comes to file names -->
	<script src="path/to/jquery.toChecklist.js"></script>
</head>
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


## Roadmap

For next major version, 2.0.0:

* Add ability to set the value of a checklist using the `'val'` method (which is currently just a getter).
* Completely eliminate `.isChecklist()` in favor of properly namespaced method `.toChecklist('is')`
* Make `animateSearch` default to `false` instead of true
* Consider moving all options that start with `css` (such as `cssEven` and `cssOdd`) to a dedicated `css` object, so you could pass in `{ css : { even : 'even', odd : 'odd' } }` instead, and access at `css.even` and `css.odd` internally.
