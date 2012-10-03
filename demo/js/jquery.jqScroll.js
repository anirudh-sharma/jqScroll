(function($){
	
  /**
   * plugin for creating custom scrollbars
   * this supports 
   * horizontal and vertical scrollbars
   * custom scroll event handler 
   * custom scroll stop event handler
   * custom scrollbar width
   * custom scroll handle length
   */ 
	  $.fn.jqScroll = function(options){
			
				
				
					  				
			var defaults = {
				scrollbarWidth:25,       					//must be between 10px and 25px	
				scrollThumbLength:false,					//scrollbar length would be altered according to content size
				scrollbarOverTheContent:true,				//scrollbar position whether over the content or by its side
				scrollLatency:false,						//div will be scrolled after few milliseconds
				scrollTrackVisible:false,
				scrollEasing:"linear",						//refer to the jquery easing functions.
				scrollTrackStyleClass:false,
				scrollThumbStyleClass:false,
				mousewheelVelocity:20,
				autoHide:true,								//scrollbars will hide automatically on mouseleave event
				scroll:function(scrollPos){},				//event handler while scrollbars are scrolling
				scrollStop:function(scrollPos){}			//event handler just after scrolling stops
			};
		  	
			
			
			/*
			 * extending defaults values with custom settings.
			 */
		  	$.extend(defaults, options);
		  	
		  	
			if(defaults.scrollbarWidth < 10){
				defaults.scrollbarWidth = 10;
			}
			if(defaults.scrollbarWidth > 25){
				defaults.scrollbarWidth = 25;
			}
			
			
			 
			//alert(this.innerHeight());
		  	return this.each(function(){
		  		
		  		var divRef = $(this);
		  		
		  		$(window).load(function(){
		  		var containerHeight = divRef.height();
				var containerWidth = divRef.width();
				
				var latency = (defaults.scrollLatency)?defaults.scrollLatency:0;
				
				
				divRef.wrap("<div class='tscrollbarContainer' ></div>");
				var divContainer = divRef.parent(".tscrollbarContainer");
					
				divRef.wrapInner("<div class='tscrollbarInnerContentContainer' ></div>");
				
				var divPosition = divRef.position();
				
				var pluginContainerHeight = (defaults.scrollbarOverTheContent)?containerHeight:containerHeight+defaults.scrollbarWidth;
				var pluginContainerWidth = (defaults.scrollbarOverTheContent)?containerWidth:containerWidth+defaults.scrollbarWidth;
				divRef.parent(".tscrollbarContainer").css({
					position  :"absolute",
					left	  :divPosition.left,
					top		  :divPosition.top,
					height	  :pluginContainerHeight,
					width	  :pluginContainerWidth
					
				});
				
				divRef.css({
					position  :"absolute",
					left	  :0,
					top		  :0,
					height	  :containerHeight,
					width	  :containerWidth
				});
				
				
				divRef.css({"overflow":"hidden"});
				var divWidth = divRef.prop('scrollWidth');
				var divHeight = divRef.prop('scrollHeight');
				
				divRef.find(".tscrollbarInnerContentContainer").css({
								/*float:"left",*/
								width:divWidth,
								height:divHeight
									
							});

				
				var containerContentHeight = divHeight;
				
				var containerContentWidth = divWidth;
				
				var verticalScrollHeight = 0;
				
				var mouseWheelFixedScrollRatio = 1;
					
				/*
				 * binding vertical scrollbar and other scroll events
				 */
				if(containerHeight < containerContentHeight){
					
					var scrollTopPos = pluginContainerWidth-defaults.scrollbarWidth;
					var verticalScrollbar = $("<div class='verticalScroll'/>");
					
					divContainer.append(verticalScrollbar);
					verticalScrollHeight = divContainer.find(".verticalScroll")
												.css({
													position  :"absolute",
													left	  :scrollTopPos,
													top		  :0,
													height	  :(defaults.scrollbarOverTheContent)?(containerHeight-defaults.scrollbarWidth):containerHeight,
													width	  :defaults.scrollbarWidth,
													background:"transparent"
												})
												.html("<div class='verticalScrollHandle'/>")
												.height();
					
					if(defaults.scrollTrackVisible){
						divContainer.find(".verticalScroll").prepend("<center><div class='verticalScrollPath'/></center>");
						divContainer.find(".verticalScrollPath").css({
							position:"absolute",
							width:"40%",
							left:"30%",
							top:"0%",
							height:"100%",
							"opacity":0.6,
							"filter"    : "alpha(opacity = 60)"
						});
						if(defaults.scrollTrackStyleClass){
							divContainer.find(".verticalScrollPath").addClass(defaults.scrollTrackStyleClass)
						}else{
							divContainer.find(".verticalScrollPath").css({background:"black"});
						}
					}
					
					var verticalScrollbarLength = defaults.scrollThumbLength;
					var verticalScrollLengthRatio = containerHeight/containerContentHeight * 100;
					
					var verticalScrollbarLengthTemp = (verticalScrollLengthRatio*verticalScrollHeight)/100;
					if(!defaults.scrollThumbLength){
						verticalScrollbarLength		=	verticalScrollbarLengthTemp;
					}
					
					var pos = 0;
					
					var verticalFixedScrollLengthRatio = 1;
					
					if(defaults.scrollThumbLength){
						verticalFixedScrollLengthRatio = (verticalScrollHeight-verticalScrollbarLengthTemp)/(verticalScrollHeight-defaults.scrollThumbLength);
						mouseWheelFixedScrollRatio	=	verticalScrollbarLengthTemp/defaults.scrollThumbLength;
					}
					
					divContainer.find(".verticalScrollHandle")
					.css({
						position  :"absolute",
						height	  :	verticalScrollbarLength,
						top		  :"0%",
						width	  :"100%",
						"opacity" :0.6,
						"filter"  : "alpha(opacity = 60)"

					})
					.draggable({ containment: "parent" })
					.bind("drag",function(event,ui){
						pos    = $(this).position().top;
						
						var scrollPercent = (pos*verticalFixedScrollLengthRatio/verticalScrollHeight)*100;
						var scrollPos = containerContentHeight*scrollPercent/100;
						
						divRef.animate({scrollTop:scrollPos},{duration:latency,easing:defaults.scrollEasing});
						defaults.scroll(pos);
					})
					.bind("dragstop",function(event,ui){
						defaults.scrollStop(pos);
						
					});
					
					if(defaults.scrollThumbStyleClass){
						divContainer.find(".verticalScrollHandle").addClass(defaults.scrollThumbStyleClass)
					}else{
						divContainer.find(".verticalScrollHandle").css({background:"black"});
					}
						
						
						
						
				}
				
				/*
				 * binding horizontal scrollbar and other scroll events
				 */
				if(containerWidth < containerContentWidth){
					
					var scrollLeftPos = divPosition.left;
					var horizontalScrollbar = $("<div class='horizontalScroll'/>");
					divContainer.append(horizontalScrollbar);
					
					var horizontalScrollWidth =	 divContainer.find(".horizontalScroll")
												.css({
													position  :"absolute",
													left	  :0,
													top		  :pluginContainerHeight-defaults.scrollbarWidth,
													height	  :defaults.scrollbarWidth,
													width	  :(defaults.scrollbarOverTheContent)?(containerWidth-defaults.scrollbarWidth):containerWidth,
													background:"transparent"
												})
												.html("<div class='horizontalScrollHandle'/>")
												.width();
					
					if(defaults.scrollTrackVisible){
						divContainer.find(".horizontalScroll").prepend("<center><div class='horizontalScrollPath'/></center>");
						divContainer.find(".horizontalScrollPath").css({
							position:"absolute",
							width:"100%",
							left:"0%",
							top:"30%",
							height:"40%",
							width:"100%",
							"opacity":0.6,
							"filter"    : "alpha(opacity = 60)"
							
						});
						if(defaults.scrollTrackStyleClass){
							divContainer.find(".horizontalScrollPath").addClass(defaults.scrollTrackStyleClass)
						}else{
							divContainer.find(".horizontalScrollPath").css({background:"black"});
						}
					}
					
					var horizontalScrollbarLength = defaults.scrollThumbLength;
					
					var horizontalScrollLengthRatio = containerWidth/containerContentWidth * 100;
					
					var horizontalScrollbarLengthTemp = (horizontalScrollLengthRatio*horizontalScrollWidth)/100;
					if(!defaults.scrollThumbLength){
						
						horizontalScrollbarLength = horizontalScrollbarLengthTemp;
						
					}
					var pos=0;
					
					var horizontalFixedScrollLengthRatio = 1;
					
					if(defaults.scrollThumbLength){
						horizontalFixedScrollLengthRatio = (horizontalScrollWidth-horizontalScrollbarLengthTemp)/(horizontalScrollWidth-defaults.scrollThumbLength);
						
					}
					
					divContainer.find(".horizontalScrollHandle")
					.css({
						position  :"absolute",
						height		:"100%",
						top		 	:"0%",
						left		:"0%",
						width		:horizontalScrollbarLength,
						"opacity" 	:0.6,
						"filter"    : "alpha(opacity = 60)"
					})
					.draggable({ containment: "parent" })
					.bind("drag",function(){
						pos    = $(this).position().left;
						
						var scrollPercent = (pos*horizontalFixedScrollLengthRatio/horizontalScrollWidth)*100;
						var scrollPos = containerContentWidth*scrollPercent/100;
						
						divRef.scrollLeft(scrollPos);
						divRef.animate({scrollLeft:scrollPos},{duration:0});
						defaults.scroll(pos);
						
					})
					.bind("dragstop",function(){
						defaults.scrollStop(pos);

					});
					
					if(defaults.scrollThumbStyleClass){
						divContainer.find(".horizontalScrollHandle").addClass(defaults.scrollThumbStyleClass);
					}else{
						divContainer.find(".horizontalScrollHandle").css({background:"black"});
					}
				}
				
				if(defaults.autoHide){
					var scrollbars = divContainer.find(".verticalScroll,.horizontalScroll");
					scrollbars.hide();
					divContainer.on("mouseenter",function(){
						scrollbars.fadeIn(100);
						
					});
					divContainer.on("mouseleave",function(event){
						
						scrollbars.fadeOut(500);
						
					});
					
					
				}
				
				var limitingCondition = pluginContainerHeight-defaults.scrollThumbLength-defaults.scrollbarWidth;
				
				var mousewheelEvtHandler = function(e){
					
					var dir = (e.wheelDelta)?((e.wheelDelta>0)?1:-1):((e.detail>0)?-1:1);
					var velocity = defaults.mousewheelVelocity;
					
					var vel = dir*velocity;
					
					var scrollPos = divRef.scrollTop()-vel;
					
					divRef.animate({scrollTop:scrollPos},{duration:0,easing:defaults.scrollEasing});
					
					var scrollTop = divRef.scrollTop();
					var scrollPercent = scrollTop/divHeight*100;
					var scrollBarPos = (scrollPercent*verticalScrollHeight)/(100*verticalFixedScrollLengthRatio);
					
					divContainer.find(".verticalScrollHandle").css({top:(scrollBarPos>=limitingCondition)?limitingCondition:scrollBarPos});

					
				};
				
				var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
					 
				if (document.attachEvent)
					 divRef.find(".tscrollbarInnerContentContainer").get(0).attachEvent("on"+mousewheelevt, function(e){
				    	mousewheelEvtHandler(e);
				    });
				else if (document.addEventListener) //WC3 browsers
				    divRef.find(".tscrollbarInnerContentContainer").get(0).addEventListener(mousewheelevt, function(e){
						    	mousewheelEvtHandler(e);
						    }, false);

		  		
		  	});
								
			});
  
		};
  })(jQuery);