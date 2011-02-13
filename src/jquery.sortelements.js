/*
 * jQuery Element Sorter
 * Copyright (c) 2011 Marcus Ekwall
 *
 * http://writeless.se/projects/jquery-generic-sorter/
 *
 * Depends on the generic sorter (jquery.genericsorter.js)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Based off James Padolsey's Sort Plugin
 *   http://james.padolsey.com/javascript/sorting-elements-with-jquery/
 */
(function($){

// TODO: When widget factory allows us to handle element collections, we should use that instead
$.fn.sortElements = function(){
    var widget = {
        options: {
            comparator: "natural",
            sortable: function(){return this;},
            inverse: false
        },
        _init: function(){
            var self = this;
            var placements = this.element.map(function(){
                var sortElement = self.options.sortable.call( this ),
                    parentNode = sortElement.parentNode,
                    // Since the element itself will change position, we have
                    // to have some way of storing its original position in
                    // the DOM. The easiest way is to have a 'flag' node:
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );
                
                return function() {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }
                    // Insert before flag:
                    parentNode.insertBefore(this, nextSibling );
                    // Remove flag:
                    parentNode.removeChild( nextSibling );
                };
            });
            
            this.sorter = $.genericSorter({
                comparator: this.options.comparator,
                source: this.element,
                extractor: function(){ return $( this ).text(); },
                inverse: this.options.inverse
            });
            
            var newOrder = this.sorter.sort( this.options.inverse );
            return $.each( newOrder, function( i ){
                placements[i].call(self.options.sortable.call( this ));
            });
        }
    };
    if ($.type( arguments[0] ) == "object") {
        widget.options = $.extend( widget.options, arguments[0] );
    } else if ($.type( arguments[0]) == "string" ) {
        widget.options.comparator = arguments[0];
    }
    if ($.type( arguments[1]) == "function" ) {
        widget.options.sortable = arguments[1];
    }
    widget.element = this;
    return widget._init();
};
    
})( jQuery );