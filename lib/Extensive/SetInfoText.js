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
