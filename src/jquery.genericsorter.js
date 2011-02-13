/*
 * jQuery Generic Sorter
 * Copyright (c) 2011 Marcus Ekwall
 *
 * http://writeless.se/projects/jquery-generic-sorter/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Based off James Padolsey's Sort Plugin
 *   http://james.padolsey.com/javascript/sorting-elements-with-jquery/
 */
(function($){

var sort = [].sort;
$.genericSorter = function(){
    var sorter = {
        // default options
        options: {
            comparator: "natural",
            source: [],
            inverse: false,
            extractor: function(){ return this; }
        },
        // initialize generic sorter
        _init: function(){
            var self = this;
            // set initial source and extractor
            this.source( this.options.source, this.options.extractor );
            // set initial comparator
            this.comparator( this.options.comparator );
            return this;
        },
        // sorting
        sort: function(inverse){
            inverse = inverse || this.options.inverse;
            var self = this;
            // create a copy of the source
            this._sorted = this._source.slice(0);
            return sort.call( this._sorted, inverse ?
                             function( a, b ){ return self._comparator( b, a ); } : 
                             this._comparator);
        },
        // set source
        source: function( source, extractor ){
            this._source = source;
            if ( extractor ) {
                this._extractor = extractor;
            }
            return this;
        },
        // set comparator
        comparator: function( comparator ){
            // load the comparator
            this._comparator = ( $.type( this.options.comparator ) === "function" ) ? 
                this.options.comparator( this.options.extractor ) : 
                $.genericSorter.comparators[this.options.comparator]( this.options.extractor );
            return this;
        }
    };
    if ( $.type( arguments[0]) === "object" ) {
        sorter.options = $.extend(sorter.options, arguments[0]);
    } else if ( $.type(arguments[0]) == "string" ) {
        sorter.options.comparator = arguments[0];
    }
    if ( $.type( arguments[1] ) === "function" ) {
        sorter.options.source = arguments[1];
    }
    sorter._init();
    return sorter;
}

// extend with generic sorters
$.genericSorter.comparators = $.extend( {}, $.genericSorter.comparators, {
    basic: function( extractor ) {
        return function( a, b ){
            return extractor.call( a ) > extractor.call( b ) ? 1 : -1;
        }
    },
    numeric: function( extractor ) {
        return function( a, b ){
            return parseFloat( extractor.call( a ) ) > parseFloat( extractor.call( b ) ) ? 1 : -1;
        }
    }
});

})( jQuery );