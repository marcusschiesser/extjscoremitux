/**
 * @author schiesser
 */
Ext.ns('Extensive.behaviours');

Extensive.behaviours.setInfoText = function(element, infoText, infoClass){
    //--- added var in front to create a new local variable
    infoClass = infoClass || 'extensive-info-text';
    test2 = "esta"
    //--- updated to allow and element, dom or text id to be passed
    var element = element.dom ? element : Ext.get(element);
    //--- set value using the value of the dom before we set - to assure it works when it has and does not have a value
    var value = element.dom.value;
    //--- updated to work properly in the event that the field initially contains a value
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
