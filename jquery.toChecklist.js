/**
 * toChecklist - a jQuery Plugin
 *
 * This is a work in progress and will be released under the GPL when completed.
 *
 * @author Scott Horlbeck <me@scotthorlbeck.com>
 *
*/

jQuery.fn.toChecklist = function(settings) {

	// Provide default settings, which may be overridden if necessary.
	settings = jQuery.extend({
		// I want this plugin to be quick and easy to add. Ideally, the
		// developer shouldn't be required to download or author extra CSS
		// classes, but shouldn't be prevented from doing so if need be.
		useIncludedPluginStyle : true,
		addSearchBox : false,
		listSelectedItems : false
	}, settings);

	var error = function(msg) {
		alert("jQuery Plugin Error (Plugin: toChecklist)\n\n"+msg);
	}
	
	// Define our included plugin styles.
	//
	// The reason these are not defined in an external style sheet is because
	// I want this plugin to be as quick and easy to add as possible.
	// (I realize this isn't exactly "good" coding practice.)
	jQuery('<style type="text/css">'
		+'div.checklist, div.checklistHighlighted { overflow: auto }'
		+'div.checklist { font-family: arial; font-size: 12px; border: 1px solid gray; border-left: 3px solid #ccc; }'
		+'div.checklistHighlighted { border: 1px solid gray; border-left: 3px solid #ffffa7; }'
		+'ul.checklist { margin: 0; padding: 0; list-style-type: none; }'
		+'li.even, li.odd, li.checked { padding: 3px; }'
		+'li.even { background-color: white; }'
		+'li.odd { background-color: #eef2f2; }'
		+'li.even:hover, li.odd:hover { background-color: #dde; }'
		+'li.checked  { background: #ffffa7; font-style: italic; }'
		+'li.checked:hover { background: #ffff22; font-style: italic; }'
		+'label.disabled { color: #ddd; }'
		+'ul.listOfSelectedItems { height: 102px; overflow: auto; font-size: .8em; list-style-position: outside; margin-left: 0; padding-left: 1.4em; color: #770; }'
		+'</style>').appendTo('head');
	
	// Here, THIS refers to the jQuery stack object
	// that contains all the target elements that
	// are going to be converted to checklists.
	// Let's loop over them and do the conversion.
	this.each(function() {
	
		// Hang on to the important information about this <select> element.
		var jSelectElem = jQuery(this);
		var jSelectElemName = jSelectElem.attr('name');
		if (settings.useIncludedPluginStyle) {
			var h = jSelectElem.height();
			var w = jSelectElem.width();
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
			jQuery('#'+checkboxId).css('display','none');
		});
		
		var checklistName = jSelectElemName+'_'+'checklist';

		// Convert the outer SELECT elem to a <div>
		jSelectElem.replaceWith('<div id="'+checklistName+'">'
			+'<ul>'+jSelectElem.attr('innerHTML')+'</ul></div>');

		// Add styles
		var checklistDivId = '#'+checklistName;
		if (settings.useIncludedPluginStyle) {

			jQuery(checklistDivId).addClass('checklist').height(h).width(w);
			jQuery('ul',checklistDivId).addClass('checklist');

			// Stripe the li's
			jQuery('li:even',checklistDivId).addClass('even');
			jQuery('li:odd',checklistDivId).addClass('odd');
			
			// Highlight preselected ones.
			jQuery('li',checklistDivId).each(function() {
				if (jQuery('input',this).attr('checked')) {
					jQuery(this).addClass('checked');	
				}
			});

		} else {
			// @todo
		}

		// ============ Event handlers ===========

		var toggleDivGlow = function() {
			// Make sure the div is glowing if something is checked in it.			
			if (jQuery('li',checklistDivId).hasClass('checked')) {
				jQuery(checklistDivId).addClass('checklistHighlighted');
			} else {
				jQuery(checklistDivId).removeClass('checklistHighlighted');
			}
		}

		// Check/uncheck boxes
		var check = function(event) {
			
			// This needs to be keyboard accessible too. Only activate it
			// if the user presses enter or space.
			if (event.type == 'keydown' && event.keyCode != 13 && event.keyCode != 32) return;

			// Make sure that the event handler isn't triggered
			// twice if clicking directly on checkbox or label.
			/*
			var preventDuplicateAction = function(event) {
				event.cancelBubble = true;
				if (event.stopPropagation) event.stopPropagation();
			}

			jQuery('label',this).click(preventDuplicateAction);
			*/

			// Not sure if unbind() here removes default action, but that's what I want.
			jQuery('label',this).unbind(); 
			jQuery('input',this).trigger('click');
			

			// Change the styling of the row to be checked or unchecked.
			if (jQuery('input',this).attr('checked')) {
				if (settings.useIncludedPluginStyle) {
					jQuery(this).addClass('checked');
				} else {
					// @todo
				}
			} else {
				jQuery(this).removeClass('checked');
			}
			
			toggleDivGlow();

		};

		jQuery('li',checklistDivId).click(check).keydown(check);
		toggleDivGlow();

	});
	
	

};