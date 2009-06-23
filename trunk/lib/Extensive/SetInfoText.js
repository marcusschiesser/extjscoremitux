/*
The MIT License

Copyright (c) 2009 author schiesser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
 * @author schiesser
 * 6-16-2009 - Updated by Joseph Francis (Joe)
 *   Updates: Now works when a default value is provided.  Now allows an element, dom or id to be passed.
 */
Ext.ns('Extensive.behaviours');

Extensive.behaviours.setInfoText = function(element, infoText, infoClass){
    infoClass = infoClass || 'extensive-info-text';
    element = element.dom ? element : Ext.get(element);
    var value = element.dom.value;
    if (element.dom.value === '' ){
	    element.dom.value = infoText;
	    element.addClass(infoClass);
    }
    
    var onBlur = function(e){
        value = e.target.value;
        if (value === '') {
            e.target.value = infoText;
            Ext.fly(e.target).addClass(infoClass);
        }
    };
    
    var onFocus = function(e){
        Ext.fly(e.target).removeClass(infoClass);
        if (value === '') {
            e.target.value = '';
        }
    };
    element.on('focus', onFocus);
    element.on('blur', onBlur);
};
