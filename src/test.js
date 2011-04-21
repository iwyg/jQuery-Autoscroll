/* carousel scroller
------------------------------------------------------------------------------------
------------------------------------------------------------------------------------*/
/*
**
*
* Since jQuery.carScroller is an implementation of the jQuery smScroll Plugin (to be released in 2010)
* the documentation can be foud there.
*
*
*/

(function($){

    function scroller(opts){
        var container = opts.self,
            ul = container.find('ul:first'),
            self = this,
            eventData,
            ch,
            my,targetY,tempY,
            tc,
            v=0,
            speed = 0,
            scOffset,
            toTop, toBottom,
            scrollTimer,                        
            stop = false,            
            initStop = opts.scrollSpeed,            
            initStart = 0,
			a, // hover image
			tempspeed,            
			timerSpeed = opts.timerRate,			
			cOffsetTop;
        
		this.scroll = function(){            

            targetY = my - container.offset().top;
            ch = container.height(),
            tc = Math.floor(ch/2);
            toTop = targetY < tc;
            toBottom = targetY > tc;
            
			scOffset = Math.abs((ul.offset().top) - cOffsetTop);

			speed = (targetY-tc)/tc;                
			stop && (initStop += -1);                
			!stop && (initStop = Math.min(16,++initStart));                  
            v = scOffset+(initStop*speed) >> 0.1;
            
			if (v >= ul.height()-ch){
				v = ul.height()-ch;
			};
            
			if (v <=0){
				v = 0;
            }; 
			
			container.scrollTop(v);

			tempspeed = speed; // getting up/down direction

			scrollTimer = setTimeout(function(){
                self.scroll();
                tempY = my;
            },timerSpeed);
        }
        container.bind('mousemove.carScroller',this,function(e){
        	
        	        if (container.is(':animated')){
        	
        	return false;
        	
        	}
        	
		else {
            my = e.pageY;
		}
            
        })

            .bind('mouseenter.carScroller',this,function(e){
            	
            	stop = false;
            	initStop = opts.scrollSpeed;
            	initStart = 0;
            	
            	cOffsetTop = container.offset().top;
                
                my = e.pageY;

                eventData = e.data;

                eventData.scroll();

                return;

            })

            .bind('mouseleave.carScroller',this,function(e){
            	
            	stop = true;

                setTimeout(function(){

                    clearTimeout(scrollTimer);

                },500);
                
//            if ($.browser.msie) {
//            	
//            	   	return false;
//            	
//            	};

            });

        if (opts.hoverItems){ // my be we should attach this directly to the image itself
				container.bind('mouseover.carScroller',this,function(e){
                a = $([e.target,e.target.parentNode]).filter('img')[0];
                if (a)
                    $(a).fadeTo(350,1)
            })
            .bind('mouseout.carScroller',this,function(e){            
                if (a)
                    $(a).not('.current').stop(true,false).fadeTo(350,0.5);

            });

            function filter (){                
                return this.nodeName.toLowerCase() === 'img' && !!$(this).parents('li:not(.active)')[0];
            };
		}
/*
        opts.images.hover(function(){

            $(this).fadeTo(250,1)

        },function(){


            $(this).not('.current').fadeTo(250,0.5)

        });

*/



        return this;
    };

    $.fn.carScroller = function(options) {

        var defaults = {

	        self :  this,
	        
	        scrollSpeed : 12

        },

        opts = $.extend({},defaults, options);

        opts.namespace = 'carScroller';

        opts.images = this.find('img');
        
        $.browser.msie && (function(){
        	
        	        	opts.hoverItems=false;
			        	opts.self.scrollTop(0);        	
        	
        	})();


        opts.self.data('scroller',new scroller(opts));
        


    return this;


    };
})(jQuery);/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


