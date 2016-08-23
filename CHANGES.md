# Change Log

This file lists changes as they occur between releases.

To view changes per commit, use `git log` instead.

Strict adherence to [semantic versioning](semver.org) will be
implemented moving forward, but was not used for versions 1.6.0 and less.

Download any of these versions listed below on
[archived releases page](http://scotthorlbeck.com/code/tochecklist/?action=releases).

## Version 1.6.0

Requires jQuery 1.9.x

Added the `"val"` method which is equivalent to jQuery's `.val()` method.
Presently, this is a getter only, and cannot be used to set the value.
Also added the ability to call `.isChecklist()` by passing in the string
`'isChecklist'` or `'is'` so that all methods are contained within the 
`.toChecklist()` namespace. However, `isChecklist()` has not been removed
yet. This is preparation for removal of `isChecklist()` in a future
version.


## Version 1.5.0

Requires jQuery 1.9.x

Removed a lot of deprecated methods that caused this plug-in to break as 
soon as jQuery 1.6.x was released. This version probably works fine with 
jQuery 1.8.x but no guarantees. Also improved the search functionality so
that it displays any item containing the text anywhere in the line, not 
just the beginning of the line. Furthermore, searching does not simply 
scroll to the found item in the list, but actually hides non-matching 
items. 


## Verson 1.4.3

Requires jQuery 1.4.x

Added ability to click on an item in the "selected items" list in order to
deselect it. Added missing semi-colons that caused some JavaScript engines
to complain. Adjusted options so that `preferIdOverName` can be set to 
false in order to work with Ruby on Rails (this is a different way of 
solving the same problem addressed by
[marashliev's patch](http://github.com/marashliev/toChecklist-plug-in-for-jQuery)). 
Attempted to fix issue with unusual characters used in the select box 
id/name as well as in the options (characters such as `% , . / < >`). 
Please submit a bug report if there are still problems using this version. 


## Version 1.4.2

Requires jQuery 1.3.x

Fixed a small bug that can arise when a list has more than the maximum 
number of selections pre-selected before it is converted to a checklist.


## Version 1.4.1

Requires jQuery 1.3.x

Added the option `maxNumOfSelections` and the corresponding function
`onMaxNumExceeded()`, allowing developers to limit the number of 
selections a user can make in each checklist. 


## Version 1.4.0

Requires jQuery 1.3.x

`toChecklist` now works with multi-SELECT boxes that have `optgroup` tags
(used to separate the choices into groups). Also added the option 
`preferIdOverName`, so it can be made to work with Drupal's Views module. 


## Version 1.3.1

Requires jQuery 1.3.x

Minor CSS update. Upgrade from 1.3.0 is unnecessary if everything looks 
fine to you. Added `margin` and `padding` declarations on the internal 
checklist `label` elements to reset them to zero, so that these properties
will not appear to mess up the design if they inherit a site-wide style.


## Version 1.3.0

Requires jQuery 1.3.x

Added the option `searchBoxText` to allow developers to specify the text
manually.


## Version 1.2.0

Requires jQuery 1.3.x

Added the option `submitDataAsArray`, which makes it possible to use an 
array in the `name` attribute of the select box when it is set to true, 
e.g. `<select name="mySelectBox[]" multiple="multiple"></select>`. 
(Defaults to true, for compatibility with PHP.) Fixed inconsistencies in 
styling due to line-height property in documentation stylesheet cascading
down to the plug-in style. In other words, default plug-in styles on a 
blank page have similar spacing as in the documentation now.



## Version 1.1.1

Requires jQuery 1.3.x

Fixed bug in IE that prevented selection/deselection of checkboxes when 
`showCheckBoxes` was set to false. Also fixed a problem with IE7 `label` 
elements interfering with the `li:hover` styling on the checklists. Not 
perfect, but much better.



## Version 1.1.0

Requires jQuery 1.3.x

Added ability to check/uncheck all items, or invert the selection. 
Added `isChecklist()` method.



## Version 1.0.1

Requires jQuery 1.2.x

No changes. (Initial Release) 

Version 1.0 was never officially released. I had already tagged 1.0 when 
I noticed a few bugs, so I fixed them, incremented the version, and 
released 1.0.1 as the first official release.
