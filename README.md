FullTagger
==========
jQuery.fullTagger 

fullTagger is a lite and functional Plug-in that allows you to @Mention and #Hashtag, with the ability of customising
its a very simple jQuery code that will let any level developer to understand and edit.

fullTagger is written by Tareq Al Bajjaly (DevTareq) as a private project and its now availabe for everyone to contribute. 

Introduction 
==========

fullTagger will let you experience the "hashtags and mentions" like many social media websites using "contenteditable" Attribute for a regular DIV tag.

PLEASE REPORT ANY BUGS/ISSUES, AND FEEL FREE TO MAKE THIS PLUG-IN EVEN MORE FUNCTIONAL.
==========

Implementation 
==========

1) Add scripts references

    <script src="./jquery.min.js" type="text/javascript"></script> // jQuery 1.11+
    <script src="./fullTagger.js" type="text/javascript"></script> 

2) Add the following HTML structure to your project

    * Feel free to change the container class name, but the contenteditable class name must stay the same.
    * The outer container structure must be the same if you are taking this (as is), you can edit the main library for your needs

   <div class="conatiner">
     <div class="contenteditable" contenteditable="true"></div>
     <div class="autocomplete"></div>
   </div>
   
3) Call the Plug-in
    $('.contenteditable').fullTagger();

  aaand That's it!!
  
What you should know! 
==========

* By default the @mention functionality is active and the #hashtag is not, you can switch or implement both of them by passing the settings object.

    $('.contenteditable').fullTagger({hashtag: true});
or 
    $('.contenteditable').fullTagger({hashtag: true, mention: false});
   
* To use a real JSON results(file) for autocomplete you should set the "sample" to "false", and of course the "url" to your request link.

    $('.contenteditable').fullTagger({sample: false, url: 'example.com/results.json'}); 
    
* Your jQuery Version should be 1.11+.

* This is a front-end project, and i didn't write anything related to security (Injection, XSS) yet. 
  you should keep that in mind.

* This Plug-in is quite new so it is tested under the modern Browsers.







