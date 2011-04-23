# jQuery Autoscroll #

## An autoscrolling Plugin for the jQuery Javascript Library
 
 - name: jquery.autoscroll.js
 - author: thomas appel, mail(at)thomas-appel(dot)com
 - copyright: thomas appel
 - version: 1

### usage:
  
  1. create html container which contains something like an unordered list
  2. setup plugin like this: $(mycontainer).autoscroll();
  
### options:

- easeOut : boolean. If set, scrolling isn’t cut off abrubt when mouse leaves scrolling area
- easeOutResistance : any float value float from 0 to 1  

- scrollOnClick : boolean; if set, you my create navigation "links" for back and forward scrolling
    - These links must not be children of the container element. 
    - Also note that scrollOnClick is only useful/working if the scrollable content (e.g. a html List Element) has equal heights/width
    - Typically set your container to 600px width if your list items are 200px wide each, and you want to show 3 items at one time.
 	 
- navNext : navigation element for scrolling forward  // jQuery Object
- navPrev : navigation element for scrolling backward // jQuery Object
- scrollOnClickEasing : easing method for scrollOnClick option // default 'swing'
- scrollOnClickDuration : scrollanimation duration for scrollOnClick option
  
### misc:

- compatible with jquery.events.destroyed
- plugin will detroy itself if container is removed from DOM
- if you want to teardown the plugin manually, just call: $(mycontainer).data('autoscroll').destroy();
    - or simply $(mycontainer).trigger('destroyed');

### revision:

- 2

### known issues:

- scrollOnClick : animation is ugly if duration is greater than 600ms
