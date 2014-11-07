/*
 * Full Tagger 
 * Version 1.0
 * Written by: Tareq Albajjaly (DevTareq)
 *
 * License: MIT License - http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    $.fn.fullTagger = function(options) {
        var settings = $.extend({}, {
            triggerChar: '@',
            hashtag: false,
            mention: true,
            sample: true
        }, options);

        return this.each(function() {
            removeGenerated();
            $(this).keyup(function(e) {
                var key = e.keyCode || e.charCode || e.which;
                if (key !== 40 && key !== 38) {
                    var typedText = $(this).html();
                    // check for @mention
                    if (settings.mention && $(this).text().indexOf(settings.triggerChar) >= 0) {

                        // get after triggerChar
                        var afterChar = typedText.substring(typedText.lastIndexOf(settings.triggerChar));
                        // replace triggerChar with emptySpace
                        afterChar = afterChar.replace(settings.triggerChar, '');
                        // check if text is not empty 
                        if (afterChar.length > 0 && afterChar !== '') {
                            // get everything before the first space
                            afterChar = afterChar.split(' ')[0];
                            afterChar = afterChar.replace('&nbsp;', '').replace('<br>', '');
                            if (!settings.sample) { // real ajax request 
//                                $.getJSON(ajaxURL, {q: afterChar, s: triggerChar}, function(results) {
//                                    generateAutocomplete(results);
//                                });
                            } else {
                                var sample = [{name: 'tareq'}, {name: 'ahmad'}, {name: 'ali'}];
                                generateAutocomplete($(this), sample);
                            }

                        }
                    } else if (settings.hashtag && $(this).text().indexOf('#') >= 0) { // HASHTAGS FUNCTIONALITY
                        var afterChar = typedText.substring(typedText.lastIndexOf('#'));

                        if (afterChar.length > 0 && afterChar) {
                            $(this).parent().find('.autocomplete').hide();

                            if (key == 32) {
                                // create the hashtag (custom tags after space bar pressed) or the tab
                                genereateHashtags($(this));
                            }

                        }
                    }
                }

                /**
                 * Arrow Down
                 */
                if (key == 40) {

                    if ($(this).parent().find('.autocomplete').is(':visible')) { // check if autocomplete is visible
                        // activate the first element
                        $(this).blur();
                        $(this).parent().find('.autocomplete').attr("tabindex", -1).focus();
                        if (!$(this).parent().find('.autocomplete').find('.item[tabindex=-1]')[0]) {

                            $(this).parent().find('.autocomplete').find('.item').first().attr("tabindex", -1).focus(); // set focus to the first element 
                        }
                    }
                }

                /**
                 * Backspace
                 */
                if (key == 8) {
                    var value = $(this).html().replace('<br>', '');
                    var lastchar = value.substring(value.length - 1);
                    var checkDiv = value.substring(value.length - 2);

                    if (lastchar === settings.triggerChar || lastchar === '#') { // if triggerChar removed
                        $(this).parent().find('.autocomplete').hide(); // hide autocomplete container

                    } else if (checkDiv === 'n>') {
                        placeCaretAtEnd($(this)[0]);

                        $(this).find('[id=generated]').last().remove();

                    } else if ($(this).html() === '') {
                        $(this).parent().find('.autocomplete').hide();
                    }
                }


            });
            $('[class=autocomplete]').keydown(function(e) {

                var key = e.keyCode || e.charCode || e.which;
                if (key == 40) {
                    e.preventDefault();
                    if (!$(this).find('.item[tabindex=-1]')[0]) { // check if there is focus on any tag 
                        $(this).removeAttr('tabindex'); // remove the container focus 

                        $(this).find('.item').first().attr("tabindex", -1).focus(); // set focus to the first element 

                    } else {
                        // set focus to the next item
                        $(this).find('.item[tabindex=-1]').removeAttr('tabindex').next().attr("tabindex", -1).focus();
                    }

                } else if (key === 38) {
                    e.preventDefault();
                    $(this).find('.item[tabindex=-1]').removeAttr('tabindex').prev().attr("tabindex", -1).focus();
                }
            });

            $(document).on('click', '[class=item]', function() {

                var selectedTag = $.trim($(this).text());
                selectElement($(this).parent(), selectedTag)
            });


            /**
             * On ENTER (selecting the tag) , fires the click trigger 
             */
            $('[class=autocomplete]').keypress(function(e) {
                var key = e.keyCode || e.charCode || e.which;
                if (key == 13) {
                    e.preventDefault();
                    var selectedTag = $.trim($(this).find('.item[tabindex=-1]').text());
                    selectElement($(this), selectedTag);
                }
            });
        });

        /**
         * Select element from autocomplete 
         * 
         * @param {obj} $container
         * @param {string} selectedTag
         */
        function selectElement($container, selectedTag) {
            var replacedTag;
            var enteredContent = $container.parent().find('.contenteditable').html(); // current HTML
            if (enteredContent.indexOf('@') >= 0) {
                // get after triggerChar
                replacedTag = enteredContent.substring(enteredContent.lastIndexOf(settings.triggerChar));
                // get all before the first space 
                replacedTag = replacedTag.split(' ')[0];
                var generatedHTML = '<span id="generated" class="generatedMention">' + selectedTag + '</span>&nbsp;';
            }

            var newContent = enteredContent.replace(replacedTag, generatedHTML);
            $container.parent().find('.contenteditable').html(newContent);
            placeCaretAtEnd($container.parent().find('.contenteditable')[0]);
            $container.hide();
        }

        /**
         * check for auto generated font > span (contenteditable)
         */
        function removeGenerated() {
            if ($(this).find('font')[0] || $(this).find('span')[0]) {

                var currentText = $(this).find('font').find('span').text();
                $(this).find('font').remove();
                $(this).find('span').remove();
                $(this).html($(this).html() + currentText);
            }
        }

        function generateAutocomplete($editableContainer, searchResults) {
            var autocompleteDIV = $editableContainer.parent().find('.autocomplete');
            autocompleteDIV.show();
            // show autocomplete container
            // insert search results into the container
            var generatedHTML = '';
            $.each(searchResults, function(index, val) {
                generatedHTML += '<div class="item"><img src="default.png"/><p>' + val.name + '</p></div>';
            });

            autocompleteDIV.html(' '); // clear the container
            autocompleteDIV.html(generatedHTML);
        }

        /**
         * Place caret after the selected item
         * 
         * @param {type} el
         */
        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }


        /**
         * Generate hashtags
         * @returns {undefined}
         */
        function genereateHashtags($inputContainer) {

            var enteredContent = $inputContainer.html(); // current html
            var replacedTag = enteredContent.substring(enteredContent.lastIndexOf('#')); // get after triggerChar
            var selectedTag = replacedTag.replace('&nbsp;', '');

            replacedTag = selectedTag.split(' ')[0]; // get all before the first space 
            selectedTag = replacedTag.replace('#', '').replace('&nbsp;', '');

            var hashtagHTML = '<span id="generated" class="generatedHashtag">' + selectedTag + '</span>&nbsp;';

            var newContent = enteredContent.replace(replacedTag, hashtagHTML);
            $inputContainer.html(newContent);
            placeCaretAtEnd($inputContainer[0]);

        }
        
    };
})(jQuery);