/**
 * toChecklist plugin for jQuery 1.2.6+
 * @author Scott Horlbeck <me@scotthorlbeck.com>
 * @url http://www.scotthorlbeck.com/code/tochecklist
 * @version 1.0.1
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details (LICENSE.txt or
 * http://www.gnu.org/copyleft/gpl.html)
 *
 * Thanks to the UNM Health Sciences Library and Informatics Center
 * (http://hsc.unm.edu/library/) for funding the initial creation
 * of this plugin and allowing me to publish it as open source software.
*/
jQuery.fn.toChecklist = function(o) { // "o" stands for options

	// Provide default settings, which may be overridden if necessary.
	o = jQuery.extend({

		addScrollBar : true,
		addSearchBox : false,
		showCheckboxes : true,
		showSelectedItems : false,

		// In case of name conflicts, you can change the class names to whatever you want to use.
		cssChecklist : 'checklist',
		cssChecklistHighlighted : 'checklistHighlighted',
		cssLeaveRoomForCheckbox : 'leaveRoomForCheckbox', // For label elements
		cssEven : 'even',
		cssOdd : 'odd',
		cssChecked : 'checked',
		cssDisabled : 'disabled',
		cssShowSelectedItems : 'showSelectedItems',
		cssFocused : 'focused', // This cssFocused is for the li's in the checklist
		cssFindInList : 'findInList',
		cssBlurred : 'blurred' // This cssBlurred is for the findInList divs.

	}, o);

	var error = function(msg) {
		alert("jQuery Plugin Error (Plugin: toChecklist)\n\n"+msg);
	}
	
	var overflowProperty = (o.addScrollBar)? 'overflow-y: auto; overflow-x: hidden;' : '';
	var leaveRoomForCheckbox = (o.showCheckboxes)? 'padding-left: 25px' : 'padding-left: 3px';

	// Here, THIS refers to the jQuery stack object that contains all the target elements that
	// are going to be converted to checklists. Let's loop over them and do the conversion.
	this.each(function() {

		// Hang on to the important information about this <select> element.
		var jSelectElem = jQuery(this);
		var jSelectElemId = jSelectElem.attr('id');
		if (jSelectElemId == '') {
			jSelectElemId = jSelectElem.attr('name'); // This probably isn't a good idea...	
		}

		var h = jSelectElem.height(); /* : '100%'; */
		var w = jSelectElem.width();
		// We have to account for the extra thick left border.
		w -= 4;


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
			checkboxValue = checkboxValue.replace(/ /g,'_');
			
			var checkboxId = jSelectElemId+'_'+checkboxValue;
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
				+'" name="'+jSelectElemId+'" id="'+checkboxId+'" ' + selected + disabled
				+' /><label for="'+checkboxId+'"'+disabledClass+'>'+labelText+'</label></li>');
			// Hide the checkboxes.
			if (o.showCheckboxes === false) {
				jQuery('#'+checkboxId).css('display','none');
			} else {
				jQuery('label[for='+checkboxId+']').addClass(o.cssLeaveRoomForCheckbox);	
			}
		});
		
		var checklistId = jSelectElemId+'_'+'checklist';

		// Convert the outer SELECT elem to a <div>
		// Also, enclose it inside another div that has the original id, so developers
		// can access it as before. Also, this allows the search box to be inside
		// the div as well.
		jSelectElem.replaceWith('<div id="'+jSelectElemId+'"><div id="'+checklistId+'">'
			+'<ul>'+jSelectElem.attr('innerHTML')+'</ul></div></div>');
		var checklistDivId = '#'+checklistId;
		
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

			jQuery(checklistDivId).before('<div class="findInList" id="'+jSelectElemId+'_findInListDiv">'
				+'<input type="text" value="Type here to search list..." id="'
				+jSelectElemId+'_findInList" class="'+o.cssBlurred+'" /></div>');

			// Set width to same as original SELECT element.
			jQuery('#'+jSelectElemId+'_findInList').css('width',w);
			jQuery('#'+jSelectElemId+'_findInList')
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
									jQuery(curLabelObj.parentNode).bind('blur.restoreDefaultText',function() {
										// This function restores the default text to the search box when
										// you navigate away from a list item that is focused.
										var defaultVal = jQuery(textbox).attr('defaultValue');
										jQuery(textbox).attr('value',defaultVal).addClass(o.cssBlurred)
										.bind('blur.blurSearchBox',blurSearchBox);
										jQuery(this).unbind('blur.restoreDefaultText');
									}).bind('keydown.tabBack', function(event) {
										// This function lets you shift-tab to get back to the search box easily.
										if (event.keyCode == 9 && event.shiftKey) {
											event.preventDefault(); // No double tabs, please...
											jQuery(textbox)
											.unbind('focus.focusSearchBox')
											.removeClass(o.cssBlurred)
											.bind('focus.focusSearchBox',focusSearchBox)
											.bind('blur.blurSearchBox',blurSearchBox).focus();
											jQuery(this).unbind('keydown.tabBack');
										}
									}).focus(); // Focuses the actual list item found by the search box
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
			findInListDivHeight = jQuery('#'+jSelectElemId+'_findInListDiv').height() + 3;

		}

		// ============ Add styles =============

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

			// Not sure if unbind() here removes default action, but that's what I want.
			jQuery('label',this).unbind(); 
			// Make sure that the event handler isn't triggered twice (thus preventing the user
			// from actually checking the box) if clicking directly on checkbox or label.
			// Note: the && is not a mistake here. It should not be ||
			if (event.target.tagName != 'INPUT' && event.target.tagName != 'LABEL') {
				jQuery('input',this).trigger('click');
			}

			// Change the styling of the row to be checked or unchecked.
			var checkbox = jQuery('input',this).get(0);
			updateLIStyleToMatchCheckedStatus(checkbox);
			showSelectedItems();

		};
		
		var updateLIStyleToMatchCheckedStatus = function(checkbox) {
			if (checkbox.checked) {
				jQuery(checkbox).parent().addClass(o.cssChecked);
			} else {
				jQuery(checkbox).parent().removeClass(o.cssChecked);
			}
			toggleDivGlow();
		}
		
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
		var fixFormElems = function(event) {
			jQuery('input',this).each(function() {
				this.checked = this.defaultChecked;
				updateLIStyleToMatchCheckedStatus(this);
				showSelectedItems();
			}).parent();
		}
		jQuery('form:has(div.'+o.cssChecklist+')').bind('reset.fixFormElems',fixFormElems);
		
		
		// ================== List the selected items in a UL ==========================
		
		var selectedItemsListId = '#'+jSelectElemId + '_selectedItems';
		if (o.showSelectedItems) {
			jQuery(selectedItemsListId).addClass(o.cssShowSelectedItems);
		}

		var showSelectedItems = function() {
			if (o.showSelectedItems) {
				// Clear the innerHTML of the list and then add every item to it
				// that is highlighted in the checklist.
				jQuery(selectedItemsListId).html('');
				jQuery('label',checklistDivId).each(function() {
					if (jQuery(this).parent().hasClass(o.cssChecked)) {
						var labelText = jQuery.trim(this.innerHTML);
						jQuery(selectedItemsListId).append('<li>'+labelText+'</li>');
					}
				});
			}
		};
		
		// We have to run showSelectedItems() once here too, upon initial conversion.
		showSelectedItems();

	});

};

jQuery.fn.clearChecklist = function() {

		// For each checklist passed in... 
		this.each(function() {
		
			// First, make sure it IS a checklist.
			var divContainsChecklist = jQuery('#'+this.id+'_checklist',this).get();
			if (this.tagName == 'DIV' && divContainsChecklist) {
				// Grab each li in the checklist... 
				jQuery('li',this).each(function() {
					// If it's checked, force the click event handler to run.
					if (jQuery('input:checkbox',this).attr('checked')) {
						jQuery(this).trigger('click');
					}
				});
				// alert('Already a checklist.');
				return jQuery;
			}
		
		});

};