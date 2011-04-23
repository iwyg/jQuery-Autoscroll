/**
 *
 * jQuery Autoscroll: an autoscrolling Plugin for the jQuery Javascript Library
 * --------------------------------------------------------------------------------------------
 * usage: 
 * 
 * - create html container which contains something like an unordered list
 * - setup plugin like this: $(mycontainer).autoscroll();
 * 
 * --------------------------------------------------------------------------------------------
 * options: 
 * 
 * - scrollOnClick : boolean; if set, you my create navigation "links" for back and forward scrolling
 *	 ### These links must not be children of the container element. ###
 *	 ### Also note that scrollOnClick is only useful/working if the scrollable content (e.g. a html List Element) has equal heights/width
 *	 ### Typically set your container to 600px width if your list items are 200px wide each, and you want to show 3 items at one time.
 *	 
 * - navNext : navigation element for scrolling forward  // jQuery Object
 * - navPrev : navigation element for scrolling backward // jQuery Object
 * - scrollOnClickEasing : easing method for scrollOnClick option // default 'swing'
 * - scrollOnClickDuration : scrollanimation duration for scrollOnClick option
 * 
 * --------------------------------------------------------------------------------------------
 * misc:
 * --------------------------------------------------------------------------------------------
 * - compatible with jquery.events.destroyed
 * - plugin will destroy itself if container is removed from DOM
 * - if you want di teardown the plugin manually, just call: $(mycontainer).data('autoscroll').destroy();
 *	 or simply $(mycontainer).trigger('destroyed');
 * --------------------------------------------------------------------------------------------
 * revision: 2
 * --------------------------------------------------------------------------------------------
 * 
 * known issues:
 * --------------------------------------------------------------------------------------------
 * - removed support for tables
 * --------------------------------------------------------------------------------------------
 * @name jquery.autoscroll.js
 * @author thomas appel, mail(at)thomas-appel(dot)com
 * @copyright thomas appel
 * @version 1
 */


(function ($){

	var propertyStack = {
		W_H:['width','height'],
		INNER_W_H:['innerWidth', 'innerHeight'],
		OUTER_W_H:['outerWidth', 'outerHeight'],
		L_T:['left','top'],
		MARGIN_A:['marginLeft','marginTop'],
		MARGIN_B:['marginRight','marginBottom'],
		SCROLL : ['scrollLeft', 'scrollTop'],
		SCROLL_W_H : ['scrollWidth', 'scrollHeight'],
		OFFSET : ['offsetLeft', 'offsetTop'],		
		MOUSE_O : ['pageX', 'pageY']		
	},
	events = {
		IN : 'mouseenter',
		OUT : 'mouseleave',
		MOVE : 'mousemove',
		CLICK : 'click',
		DESTROYED: 'destroyed'
	};
	
	// PRIVATE FUNCTIONS	
	function scroll( elem, pos ){		
		var that = this,
			w = elem[propertyStack.INNER_W_H[this.orient]](),		// scrollcontainer inner width or height
			// so = elem[0][propertyStack.SCROLL[this.orient]],		// scrollcontainer ScrollLeft or ScrollTop
			sw = elem[0][propertyStack.SCROLL_W_H[this.orient]],	// scrollcontainer ScrollWidth or ScrollHeight
			ab = w/ 2 ,
			cc = pos - ab,
			cd = sw / ab,
			aac = ( sw ) / ab,
			sca,
			speed = Math.ceil(100*(cc)/ab)/100;			
			this.__tmp__.scs += speed * aac ;
			sca = Math.round( this.__tmp__.scs );
			elem[0][propertyStack.SCROLL[this.orient]] = sca ;	
			
		if ( elem[0][propertyStack.SCROLL[this.orient]] !== sca ) {
			this.__tmp__.scs = this.__tmp__.m;
				
			clearTimeout(this.__tmp__.timer);
			this.__tmp__.timer = false;
		} else {
			this.__tmp__.m = this.__tmp__.scs;
			/*
			 * triggering loop
			 **/
			this.__tmp__.timer = setTimeout(function (){
				that._getScroll();
			},15);
		}
	}	
	
	
	function getOrientation( elem ){
		return elem.width() > elem.height() ? 0 : 1;
	}
	
	function getDimension ( elem, index ) {
		var nodeName, dimension=0,children = elem.children();
		if (!index === 1 ) {
			return true;
		}
		if ( children.length < 2 ) {
			nodeName = children[0].nodeName.toLowerCase();
			if ( nodeName === 'ul' || nodeName === 'ol' || nodeName === 'dl' || nodeName === 'div') {
					children.children().each( function () {
					dimension+= $(this)[ propertyStack.OUTER_W_H[ index ] ]() + parseInt($(this).css( propertyStack.MARGIN_A[ index ] ) ) + parseInt($(this).css(propertyStack.MARGIN_B[ index ]));
				});
				children.css( propertyStack.W_H[index], dimension );
				return dimension;
			} 
			else if ( nodeName === 'table' ){
				return false;
			} else {
				throw new Error('scrollcontainer child is supposed to be a list, div or table' );
			}
		} else {
			throw new Error('scrollcontainer is supposed to have exaclty 1 child element, but saw '+ elem.children().length);
		}
	}
	
	// Autoscroll Contructor
	function Autoscroll() {
		this.setup.apply(this, arguments);	
	}
	
	Autoscroll.prototype = {
		name : 'autoscroll',
		handleEvents : function ( event ){
			
			switch ( event.type ) {
				case events.IN:
					this.startScroll( event );
					break;
				case events.OUT:
					this.endScroll( event );
					break;					
					break;
				case events.MOVE:
					this.scroll( event );
					break;
				case events.CLICK:
					this.scrollStepWise( event );
					break;
				case events.DESTROYED:
					this.destroy();
					break;
				default:
					break;
			}
		},	
		
		startScroll : function ( e ) {
			this.__tmp__.scs = this.__tmp__.scs = this.elem[0][propertyStack.SCROLL[this.orient]];	
			this.__tmp__.m_pos = e[propertyStack.MOUSE_O[this.orient]] - this.elem.offset()[propertyStack.L_T[this.orient]];			
			this.__tmp__.m = this.__tmp__.scs;
			scroll.apply(this, [this.elem, this.__tmp__.m_pos]);
			this.elem.bind(events.MOVE + '.' + this.name, $.proxy( this.handleEvents, this ) );
		},
		
		scroll : function ( e ) {
			if (!this.__tmp__.timer) {
				scroll.apply(this, [this.elem, this.__tmp__.m_pos]);	
			}			
			this.__tmp__.m_pos = e[propertyStack.MOUSE_O[this.orient]] - this.elem.offset()[propertyStack.L_T[this.orient]];
		},		
		
		endScroll : function ( e ) {
			clearTimeout(this.__tmp__.timer);
		},	
		
		scrollStepWise : function( e ) {
			e.preventDefault();
			var that = this, anim = {},	val, 
			w = this.elem[propertyStack.INNER_W_H[this.orient]](),			// scroll container inner width or height
			s = this.elem[0][propertyStack.SCROLL[this.orient]],			// current scroll offset
			ss = this.elem[0][propertyStack.SCROLL_W_H[this.orient]],		// overall scroll width	or height
			sup = w > s ? w%s : s%w;
			if ( e.target === this.settings.navNext[0]) {
				val = ( isNaN(sup) || sup === 0 ) ? ( w + s ) : Math.ceil(s/w) * w;				
			}
			if ( e.target === this.settings.navPrev[0]) {	
				val = ( isNaN(sup) || sup === 0 ) ? ( s - w ) : (Math.ceil(s/w) * w) - w;				
			}
			anim[propertyStack.SCROLL[this.orient]] = Math.max(Math.min(val, ss-w),0);
			this.elem.animate(anim, this.settings.scrollOnClickDuration * 1000, this.settings.scrollOnClickEasing );	
			
		},		
		_getScroll	: function ( nav ) {
			scroll.apply(this, [this.elem, this.__tmp__.m_pos]);
		},
		
		_bind : function ( nav ) {
			this.elem.bind(events.IN + '.' + this.name, $.proxy( this.handleEvents, this ) );
			this.elem.bind(events.OUT + '.' + this.name, $.proxy( this.handleEvents, this ) );			
			this.elem.bind(events.DESTROYED, $.proxy( this.handleEvents, this ) );
			
			if ( nav ) {
				this.settings.navNext.bind(events.CLICK + '.' + this.name, $.proxy( this.handleEvents, this ) );				
				this.settings.navPrev.bind(events.CLICK + '.' + this.name, $.proxy( this.handleEvents, this ) );				
			}
		},	
		_unbind : function ( nav ) {
			this.elem.unbind(events.IN + '.' + this.name );
			this.elem.unbind(events.OUT + '.' + this.name );
			this.elem.unbind(events.MOVE + '.' + this.name );			
			
			if ( nav ) {
				this.settings.navNext.unbind(events.CLICK + '.' + this.name );				
				this.settings.navPrev.unbind(events.CLICK + '.' + this.name );				
			}			
		},			
		
		setup : function ( elem, options ) {
			var dim;
			this.elem = elem;
			this.settings = options;
			this.orient = getOrientation( this.elem );
			this.__tmp__ = {};

			this._bind( this.settings.scrollOnClick );

			dim = getDimension(this.elem, this.orient);			
			if ( !dim ) {
				this.elem.trigger( events.DESTROYED );
			}
		},
		destroy : function( ){			
			this.elem.unbind( events.DESTROYED );			
			this.teardown( this.elem, this.name );
		},
		teardown : function ( elem, name ) {
			this._unbind( this.settings.scrollOnClick );					
			setTimeout(function(){
				elem.removeData( name );		
			},0)			
		}		
	}
	
	$.fn.autoscroll = function (options) {
		var o={}, defaults = {
			scrollOnClick : false,
			navNext : '', // jQuery element
			navPrev : '', // jQuery element
			scrollOnClickEasing : 'swing',
			scrollOnClickDuration : 1
			
		};

		$.extend(o, defaults, options);
    
		return this.each(function (){
			var elem = $(this);
			elem.data( Autoscroll.prototype.name , new Autoscroll( elem, o ) );
		});
	};
}(this.jQuery));
