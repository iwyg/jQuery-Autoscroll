
 
 # jQuery Autoscroll: an autoscrolling
 ## Plugin for the jQuery Javascript Library
 
 - name: jquery.autoscroll.js
 - author: thomas appel, mail(at)thomas-appel(dot)com
 - copyright: thomas appel
 - version: 2

 ### usage:
  
  1. create html container which contains something like a unordered list
  2. setup plugin like this: $(mycontainer).autoscroll();
  
 ### options:
  
  - scrollOnClick : boolean; if set, you my create navigation "links" for back and forward scrolling
    - These links must not be children of the container element. 
    - Also note that scrollOnClick is only useful/working if the scrollable content (e.g. a html List Element) has equal heights/width
    - Typically set your container to 600px width if your list items are 200px wide each, and you want to show 3 items at one time.
 	 
  - navNext : navigation element for scrolling forward  // jQuery Object
  - navPrev : navigation element for scrolling backward // jQuery Object
  - scrollOnClickEasing : easing method for scrollOnClick option // default 'swing'
  - scrollOnClickDuration : scrollanimation duration for scrollOnClick option
  
 ### misc:

  - camptible with jquery.events.destroyed
  - plugin will detroy itself if container is removed from DOM
  - if you want di teardown the plugin manually, just call: $(mycontainer).data('autoscroll').destroy();
    or simply $(mycontainer).trigger('destroyed');

 ### revision:

  - 2

 ### known issues:

  - removed support for tables
