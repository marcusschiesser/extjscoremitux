Ext.ns('Ext.ux.JsonCss');
/**
 * JSON CSS
 *
 * @author    Original JQuery Version by Chris Dary <umbrae@gmail.com>
 * @copyright Copyright (c) 2008 {@link http://arc90.com Arc90 Inc.}
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
 * ExtJS version created by Clint Nelissen (cnelissen on ExtJS forum).
 *
 * ExtJS / ExtJS Core version and bug fixes by Joseph Francis (Joe on ExtJS Forum)
 *
 */

Ext.ux.JsonCss.CSSManager = function() {
    /**
    * @var object Contains an associative array of all styles that have been applied so far.
    *             This is used when using @inherit to inherit class styles.
    **/
    var allStyles = {};


    /**
    * @var object Contains all of the @variables defined in the JSON CSS file. Gets looped over
    *             and applied to every css property.
    **/
    var styleVariables = {};

    var trim = function(str) {
        var re = /^\s+|\s+$/g;
        return str.replace(re, "");
    }

    return {

        browserMap: {
            "gecko": "isGecko",
            "gecko-2": "isGecko2",
            "gecko-3": "isGecko3",
            "mozilla": "isGecko",
            "safari": "isSafari",
            "chrome": "isChrome",
            "opera": "isOpera",
            "msie": "isIE",
            "msie-6": "isIE6",
            "msie-7": "isIE7",
            "msie-8": "isIE8"
        },
        jsoncss: function(path) {
            /**
            * Get our JSON CSS and recursively apply the styles within it.
            **/
            var connection = new Ext.data.Connection().request({
                url: path,
                success: (function(o) {
                    this.applyStyles('', Ext.util.JSON.decode(o.responseText));
                    Ext.getBody().show();
                }).createDelegate(this)
            });
        },
        /**
        * Recursively apply JSON CSS styles to a selector.
        *
        * @param selector string A jquery capable selector, as defined here: http://docs.jquery.com/Selectors
        * @param styles   object A collection of CSS styles to be applied to this selector. If the value
        *                        of one of the attributes is an object, it's assumed to be a subselector,
        *                        and applyStyles will be recursively called with the key as the subselector.
        * @return void
        **/
        applyStyles: function(selector, styles) {
            /**
            * @var object Hold our browser specific styles for this selector in an associative
            *             array so that we can apply them with precedence afterward
            **/
            var browserStyles = {};

            /**
            * look for attributes that require special handling.
            * Currently: @variables, @inherit, @browser, and subselectors
            **/

            for (var styleAttrib in styles) {
                var styleValue = styles[styleAttrib];
                if (styleAttrib.substr(0, 1) == '@') {
                    if (styleAttrib == "@variables") {
                        /**
                        * Add any @variable definitions to our global styleVariables associative array
                        **/
                        Ext.apply(styleVariables, styleValue);
                    } else if (styleAttrib == "@inherit") {
                        /**
                        * Inherit any selectors defined in @inherit.
                        * Note that there can be more than one, split by commas.
                        **/
                        var inheritedStyles = styleValue.split(',');
                        for (var inheritedStyleCounter in inheritedStyles) {
                            if (inheritedStyles.hasOwnProperty(inheritedStyleCounter)) {
                                var inheritedStyleSelector = inheritedStyles[inheritedStyleCounter];

                                if (typeof allStyles[inheritedStyleSelector] != 'undefined') {
                                    var newStyle = allStyles[inheritedStyleSelector];
                                    styles = Ext.apply(newStyle, styles);
                                } else {
                                    alert('JSON CSS Error: Attempting to inherit from a selector that does not yet exist: ' + inheritedStyleSelector);
                                }
                            }
                        }
                    } else if (styleAttrib.indexOf("@browser") === 0) {
                        /**
                        * If the value of @browser[<BROWSER>] matches ours, and optionally our version
                        * (like @browser[BROWSER-VERSION]) use the CSS rules defined within this object.
                        **/
                        var browserInfo = styleAttrib.replace(/@browser\[([^\]]+)\]/, '$1');
                        browserInfo = this.browserMap[browserInfo] ? this.browserMap[browserInfo] : ("is" + browserInfo);
                        if (Ext[browserInfo] === true) {
                            browserStyles[selector] = styleValue;
                        }
                    }

                    /**
                    * Remove this from styles because it's not actually a style. Don't apply it.
                    **/
                    delete styles[styleAttrib];
                } else if (typeof styleValue == "object") {
                    /**
                    * We have a subselector. To cascade, recurse into it with it as the argument.
                    **/
                    if (selector.indexOf(',') != -1) {
                        alert("JSON CSS Error: Cannot cascade beneath a grouped selector. Action is undefined. Current selector: " + selector);
                        continue;
                    }

                    /**
                    * If the subselector starts with : or ., don't add a space because it's a class/pseudoclass selector
                    **/
                    var subSelector = selector + ((styleAttrib[0] == ':' || styleAttrib[0] == '.') ? '' : ' ') + styleAttrib;
                    this.applyStyles(subSelector, styleValue);

                    delete styles[styleAttrib];
                } else if (styleValue.indexOf('@{') != -1) {
                    /**
                    * There are @variables in this CSS Rule. Loop over known variables and replace.
                    **/
                    for (var styleVariable in styleVariables) {
                        styles[styleAttrib] = styles[styleAttrib].replace('@{' + styleVariable + '}', styleVariables[styleVariable]);
                    }
                }
            }

            /**
            * Add the styles object for this selector into allStyles for future possible inheritance.
            **/
            allStyles[trim(selector)] = styles;

            /**
            * All preprocessing is finished. Apply the cleaned CSS object to our selector.
            **/
            var mySels = Ext.select(selector);
            Ext.each(styles, function(aStyle) {
                mySels.setStyle(aStyle);
            })

            /**
            * Now apply any browser specific styling we encountered. Done last for precedence.
            **/
            for (var browserStyleSelector in browserStyles) {
                var mySels = Ext.select(browserStyleSelector);
                var myBStyles = browserStyles[browserStyleSelector];
                if (Ext.isArray(myBStyles)) {
                    Ext.each(styles, function(aStyle) {
                        mySels.setStyle(aStyle);
                    })
                } else {
                    mySels.setStyle(myBStyles);
                }
            }
        }

    };
} ();

        Ext.ux.JsonCss.jsoncss = Ext.ux.JsonCss.CSSManager.jsoncss.createDelegate( Ext.ux.JsonCss.CSSManager );
        Ext.ux.JsonCss.applyStyles = Ext.ux.JsonCss.CSSManager.applyStyles.createDelegate( Ext.ux.JsonCss.CSSManager );
