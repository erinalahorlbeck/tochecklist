/**
 * toChecklist - a jQuery Plugin
 *
 * This is a work in progress and will be released under the GPL when completed.
 *
 * @author Scott Horlbeck <me@scotthorlbeck.com>
 *
*/

jQuery.fn.toChecklist = function(o) { // "o" stands for options

	// Provide default settings, which may be overridden if necessary.
	o = jQuery.extend({

		// I want this plugin to be quick and easy to add. Ideally, the
		// developer shouldn't be required to download or author extra CSS
		// classes, but shouldn't be prevented from doing so if need be.
		useIncludedPluginStyle : true,
		addScrollBar : true,
		addSearchBox : false,
		showCheckboxes : true,
		listSelectedItems : false,

		// If useIncludedPluginStyle is set to false, you should provide an external
		// stylesheet defining the class names below. In case of name conflicts,
		// you can change the class names to whatever you want to use.
		cssChecklist : 'checklist',
		cssChecklistHighlighted : 'checklistHighlighted',
		cssEven : 'even',
		cssOdd : 'odd',
		cssChecked : 'checked',
		cssDisabled : 'disabled',
		cssListOfSelectedItems : 'listOfSelectedItems',
		cssFocused : 'focused', // This cssFocused is for the li's in the checklist
		cssFindInList : 'findInList',
		cssBlurred : 'blurred' // This cssBlurred is for the findInList divs.

	}, o);

	var error = function(msg) {
		alert("jQuery Plugin Error (Plugin: toChecklist)\n\n"+msg);
	}
	
	var overflowProperty = (o.addScrollBar)? 'overflow-y: auto; overflow-x: hidden;' : '';
	
	if (o.useIncludedPluginStyle) {
		// Define our included plugin styles.
		// I realize this isn't exactly "good" coding practice (embedding styles here, instead
		// of in a separate stylesheet), but  I want this plugin to be as quick and easy to add
		// as possible.
		jQuery('<style type="text/css">'
			+'div.'+o.cssChecklist+', div.'+o.cssChecklistHighlighted+' { '+overflowProperty+' }'
			+'div.'+o.cssChecklist+' { font-family: arial; font-size: 12px; border: 1px solid gray; border-left: 3px solid #ccc; }'
			+'div.'+o.cssChecklistHighlighted+' { border: 1px solid gray; border-left: 3px solid #ffffa7; }'
			+'ul.'+o.cssChecklist+' { margin: 0; padding: 0; list-style-type: none; }'
			+'li.'+o.cssEven+', li.'+o.cssOdd+', li.'+o.cssChecked+' { padding: 3px; }'
			+'li.'+o.cssEven+' { background-color: white; }'
			+'li.'+o.cssOdd+' { background-color: #f7f7f7; }'
			+'li.'+o.cssEven+':hover, li.'+o.cssOdd+':hover, li.'+o.cssFocused+' { background-color: #dde; }'
			+'li.'+o.cssChecked+'  { background: #ffffa7; font-style: italic; }'
			+'li.'+o.cssChecked+':hover { background: #ffff22; font-style: italic; }'
			+'label.'+o.cssDisabled+' { color: #ddd; }'
			+'ul.'+o.cssListOfSelectedItems+' { height: 102px;'+overflowProperty+'font-size: .8em; list-style-position: outside; margin-left: 0; padding-left: 1.4em; color: #770; }'
			+'div.'+o.cssFindInList+' { margin-bottom: 5px; }'
			+'div.'+o.cssFindInList+' input { background-color: #ffffef; color: black; background-color: #ffffef; font-size: .9em; border: solid 1px #eee; padding: 2px; }'
			+'div.'+o.cssFindInList+' input.'+o.cssBlurred+' { color: gray; background-color: white; }'
			+'</style>').appendTo('head');
	}
	
	// Here, THIS refers to the jQuery stack object that contains all the target elements that
	// are going to be converted to checklists. Let's loop over them and do the conversion.
	this.each(function() {
	
		// Hang on to the important information about this <select> element.
		var jSelectElem = jQuery(this);
		var jSelectElemName = jSelectElem.attr('name');
		if (o.useIncludedPluginStyle) {
			var h = jSelectElem.height(); /* : '100%'; */
			var w = jSelectElem.width();
			// We have to account for the extra thick left border.
			if (o.useIncludedPluginStyle) w -= 4;
//			alert(h + ' ' + w);
//			var margin = jSelectElem.css('margin-top') +' '+ jSelectElem.css('margin-right')
//				+' '+ jSelectElem.css('margin-bottom') +' '+ jSelectElem.css('margin-left');
		}

		// Make sure it's a SELECT element, and that it's a multiple one.
		if (this.type != 'select-multiple' && this.type != 'select-one') {
			error("Can't convert element to checklist.\n"
				+"Expecting SELECT element with \"multiple\" attribute.");
			return jQuery;
		} else if (this.type == 'select-one') {
			return jQuery;
		}

		// Loop through all the options and convert them to li's
		// with checkboxes and labels.		
		jQuery('option',jSelectElem).each(function() {
			var checkboxValue = jQuery(this).attr('value');
			// The option tag may not have had a "value" attribute set. In this case,
			// Firefox automatically uses the innerHTML instead, but we need to set it
			// manually for IE.
			if (checkboxValue == '') {
				checkboxValue = this.innerHTML;
			}
			checkboxValue = checkboxValue.replace(/ /,'_');
			
			var checkboxId = jSelectElemName+'_'+checkboxValue;
			var labelText = jQuery(this).attr('innerHTML');
			var selected = '';
			if (jQuery(this).attr('disabled')) {
				var disabled = ' disabled="disabled"';
				var disabledClass = ' class="disabled"';
			} else {
				var disabled = '';
				var disabledClass = '';
				var selected = (jQuery(this).attr('selected'))? 'checked="checked"' : '';
			}
				
			jQuery(this).replaceWith('<li tabindex="0"><input type="checkbox" value="'+checkboxValue
				+'" name="'+jSelectElemName+'" id="'+checkboxId+'" ' + selected + disabled
				+' />&nbsp;<label for="'+checkboxId+'"'+disabledClass+'>'+labelText+'</label></li>');
			// Hide the checkboxes.
			if (!o.showCheckboxes) {
				jQuery('#'+checkboxId).css('display','none');
			} else {
				jQuery('#'+checkboxId).click(function() { alert('preventing default!'); });	
			}
		});
		
		var checklistName = jSelectElemName+'_'+'checklist';

		// Convert the outer SELECT elem to a <div>
		jSelectElem.replaceWith('<div id="'+checklistName+'">'
			+'<ul>'+jSelectElem.attr('innerHTML')+'</ul></div>');
		var checklistDivId = '#'+checklistName;
		
		// We MUST set the checklist div's position to either 'relative' or 'absolute'
		// (default is 'static'), or else Firefox will think the offsetParent of the inner
		// elements is BODY instead of DIV.
		jQuery(checklistDivId).css('position','relative');

		// Add the findInList div, if settings call for it.
		var findInListDivHeight = 0;
		if (o.addSearchBox) {
			
			var focusSearchBox = function() {
				// Remove "type to find..." when focusing.
				this.value = "";
				jQuery(this).removeClass(o.cssBlurred);
			}
			var blurSearchBox =function() {
				// Restore default text on blur.
				this.value = this.defaultValue;
				jQuery(this).addClass(o.cssBlurred);
			}

			jQuery(checklistDivId).before('<div class="findInList" id="'+jSelectElemName+'_findInListDiv">'
				+'<input type="text" value="Type here to search list..." id="'
				+jSelectElemName+'_findInList" class="'+o.cssBlurred+'" /></div>');

			// Set width to same as original SELECT element.
			if (o.useIncludedPluginStyle) {
				jQuery('#'+jSelectElemName+'_findInList').css('width',w);
			}
			jQuery('#'+jSelectElemName+'_findInList')
			// Attach event handlers to the input box...
			.bind('focus.focusSearchBox', focusSearchBox)
			.bind('blur.blurSearchBox',blurSearchBox)
			.keyup(function(event) {
				// Search for the actual text.
				var textbox = this; // holder
				if (this.value == '') {
					jQuery(checklistDivId).attr('scrollTop',0);
					jQuery(this).unbind('keydown.tabToFocus');
					return false;
				}
				// Scroll to the text, unless it's disabled.
				jQuery('label',checklistDivId).each(function() {
					if ( !jQuery(this).is(':disabled') ) {
						var curItem = jQuery(this).html().toLowerCase();
						var typedText = textbox.value.toLowerCase();
						
						if ( curItem.indexOf(typedText) == 0 ) { // If the label text begins
						                                         // with the text typed by user...
							var curLabelObj = this;
							var scrollValue = this.parentNode.offsetTop; // Can't use jquery offset()
							jQuery(checklistDivId).attr('scrollTop',scrollValue);
							// We want to be able to simply press tab to move the focus from the
							// search text box to the item in the list that we found with it.
							jQuery(textbox).unbind('blur.blurSearchBox').unbind('keydown.tabToFocus')
							.bind('keydown.tabToFocus', function(event) {
								if (event.keyCode == 9) {
									event.preventDefault(); // No double tabs, please...
									// Focus and then provide an event that will let the user press shift-tab
									// to get back to the search box.
									jQuery(curLabelObj.parentNode).focus().bind('keydown.tabBack', function(event) {
										if (event.keyCode == 9 && event.shiftKey) {
											event.preventDefault(); // No double tabs, please...
											jQuery(textbox)
											.unbind('focus.focusSearchBox').focus()
											.removeClass(o.cssBlurred)
											.bind('focus.focusSearchBox',focusSearchBox)
											.bind('blur.blurSearchBox',blurSearchBox);
											jQuery(this).unbind('keydown.tabBack');
										}
									});
									jQuery(this).unbind('keydown.tabToFocus');
								}
							});
							return false; // Equivalent to "break" within the each() function.
						}
					}
				});
				return;
			
			});

			// Compensate for the extra space the search box takes up by shortening the
			// height of the checklist div. Also account for margin below the search box.
			findInListDivHeight = jQuery('#'+jSelectElemName+'_findInListDiv').height() + 3;

		}

		// Add styles

		
		jQuery(checklistDivId).addClass(o.cssChecklist);
		if (o.addScrollBar) {
			jQuery(checklistDivId).height(h - findInListDivHeight).width(w);
		} else {
			jQuery(checklistDivId).height('100%').width(w);
		}
		jQuery('ul',checklistDivId).addClass(o.cssChecklist);

		// Stripe the li's
		jQuery('li:even',checklistDivId).addClass(o.cssEven);
		jQuery('li:odd',checklistDivId).addClass(o.cssOdd);
		// Emulate the :hover effect for keyboard navigation.
		jQuery('li',checklistDivId).focus(function() {
			jQuery(this).addClass(o.cssFocused);
		}).blur(function(event) {
			jQuery(this).removeClass(o.cssFocused);
		}).mouseout(function() {
			jQuery(this).removeClass(o.cssFocused);
		});
			
		// Highlight preselected ones.
		jQuery('li',checklistDivId).each(function() {
			if (jQuery('input',this).attr('checked')) {
				jQuery(this).addClass(o.cssChecked);	
			}
		});

		// ============ Event handlers ===========

		var toggleDivGlow = function() {
			// Make sure the div is glowing if something is checked in it.			
			if (jQuery('li',checklistDivId).hasClass(o.cssChecked)) {
				jQuery(checklistDivId).addClass(o.cssChecklistHighlighted);
			} else {
				jQuery(checklistDivId).removeClass(o.cssChecklistHighlighted);
			}
		}

		// Check/uncheck boxes
		var check = function(event) {
			
			// This needs to be keyboard accessible too. Only check the box it if the user
			// presses space (enter typically submits a form, so is not safe).
			if (event.type == 'keydown') {
				// Pressing spacebar in IE and Opera triggers a Page Down. We don't want that
				// to happen in this case. Opera doesn't respond to this, unfortunately...
				// We also want to prevent form submission with enter key.
				if (event.keyCode == 32 || event.keyCode == 13) event.preventDefault();
				// Tab keys need to move to the next item in IE, Opera, Safari, Chrome, etc.
				if (event.keyCode == 9 && !event.shiftKey) {
					event.preventDefault();
					// Move to the next LI
					jQuery(this).unbind('keydown.tabBack').blur().next().focus();
					
				} else if (event.keyCode == 9 && event.shiftKey) {
					// Move to the previous LI
				}

				if (event.keyCode != 32) return;
			}
			
			// Next on the keyboard accessibility agenda, we need to make sure that if
			// the user presses tab or shift-tab, or the up and down arrows, the next/previous
			// LI will be selected, and not the next checkbox or label element or whatever.
			/*
			if (event.keyCode == 32) {
				event.cancelBubble = true;
				event.stopPropagation();
			}
			*/

			// Not sure if unbind() here removes default action, but that's what I want.
			jQuery('label',this).unbind(); 
			// Make sure that the event handler isn't triggered twice (thus preventing the user
			// from actually checking the box) if clicking directly on checkbox or label.
			// Note: the && is not a mistake here. It should not be ||
			if (event.target.tagName != 'INPUT' && event.target.tagName != 'LABEL') {
				jQuery('input',this).trigger('click');
			}

			// Change the styling of the row to be checked or unchecked.
			if (jQuery('input',this).attr('checked')) {
				jQuery(this).addClass(o.cssChecked);
			} else {
				jQuery(this).removeClass(o.cssChecked);
			}
			
			toggleDivGlow();

		};
		
		// Accessibility, primarily for IE
		var handFocusToLI = function() {
			// Make sure that labels and checkboxes that receive
			// focus divert the focus to the LI itself.
			jQuery(this).parent().focus();
		};

		jQuery('li',checklistDivId).click(check).keydown(check);
		jQuery('label',checklistDivId).focus(handFocusToLI);
		jQuery('input',checklistDivId).focus(handFocusToLI);
		toggleDivGlow();

		// Make sure that resetting the form doesn't leave highlighted divs where
		// they shouldn't be and vice versa.
		/*
		var fixFormElems = function(event) {
			
		}
		jQuery('form:has(div.'+o.cssChecklist+')').bind('reset.fixFormElems',fixFormElems);
		*/

	});

};