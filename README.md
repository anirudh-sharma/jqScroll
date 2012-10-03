transScrollbars
===============

jquery plugin custom scrollbars

plugin for creating custom scrollbars

this provides horizontal and vertical scrollbars

plugin properties:

   
   * scroll					: custom scroll event handler 
   * scrollStop				: custom scroll stop event handler
   * scrollbarWidth			: width of the scrollbar in pixels.default: 20px 
   * scrollThumbLength	 	: length of the scrollbar.default: automatic, according to content size.
   * scrollTrackVisible		: scroll path will prepended to the DOM. default: false.
   * scrollLatency  		: Scroll latency property for vertical scroll, the content will scrolled down with a 
   						  	  latency. Expressed in miliseconds. default: 0
   * scrollEasing			: the easing provided to the content scroll latency, refer to the jquery easing 
   						  	  functions. default:"linear"
   * autoHide				: autohide scrollbars. Accepts boolean value. default:true
   * scrollThumbStyleClass	: custom scrollbar handle styles.
   * scrollTrackStyleClass	: custom scrollbar path styles.
   * scrollbarOverTheContent: scrollbars will be placed over the content div
   * mousewheelVelocity		: pixels scrolled per wheel move.
   