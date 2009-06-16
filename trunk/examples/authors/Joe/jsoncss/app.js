
    Ext.onReady(function(){


        var mySource = Ext.get('source');
        var myO = Ext.decode( mySource.dom.innerHTML) ;
        Ext.ux.JsonCss.applyStyles('', myO);
    })
