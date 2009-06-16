/*
The MIT License

Copyright (c) 2009 Mats Bryntse

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
 * Ext.ux.FingerMenu
 *
 * @author    Mats Bryntse 
 * @version   1.0
 * 
 * This menu fires a 'change' event when an item is activated
 * 
 */
 
Ext.ns('Ext.ux');

Ext.ux.FingerMenu = Ext.extend(Ext.util.Observable, {
    /*
     * @cfg (array) array of menu config objects 
     *              The menu is built for 32x32 icons, if you need different size icons
     *              you'll have to modify the CSS.
     * 
     *              Example object : 
     *              {
     *                  text : 'Menu item 1',
     *                  iconCls : 'myIconClass',    
     *                  tooltip : 'This option is optional'
     *              }
     *
     */
    items : [],
    
    /*
     * @cfg (int) selected menu index
     */
    selectedIndex : 0,
    
    /*
     * @cfg (int) the X position of a selected menu item
     */
    expandedX: 0,
    
    /*
     * @cfg (int) the X position of the collapsed menu items
     */
    collapsedX : -150,
    
    /*
     * @cfg (int) the X position of a menu item on hover
     */
    hoverX : -147,
    
    /*
     * @public (int) returns the currently selected item index
     */
    getSelectedIndex : function() {
        return this.selectedIndex;
    },
    
    /*
     * @private
     */
    onItemClick : function(e, t) {
        var target = Ext.get(t);
        
        if (!target.hasClass('fingermenu-show')){
            var current = Ext.select('.fingermenu-show');
            current.removeClass('fingermenu-show');
            target.addClass('fingermenu-show');
            
            current.setX(this.collapsedX, {
                duration : 0.3
            });
            
            target.setX(this.expandedX, {
                duration : 0.3,
                callback : function() {
                    this.selectedIndex = parseInt(t.id.substring('menuitem-'.length), 10);
                    this.fireEvent.defer(10, this, ['change', this, this.selectedIndex]);
                },
                scope : this
            });
        }
   },
   
   /*
     * @private
     */
   onHover : function(e, t) {
       var target = Ext.get(t);
       target = target.is('div') ? target : target.up('div');
       if (target.getX() === this.collapsedX){
           target.setX(this.hoverX, {
                duration : 0.1
           });
       }
   },
   
   /*
    * @private
    */
   onHoverLeave : function(e, t) {
       var target = Ext.get(t);
       target = target.is('div') ? target : target.up('div');
       
       if (!target.hasClass('fingermenu-show')){
           target.setX(this.collapsedX,{
                duration : 0.2
           });
       }
   },
    
   /*
    * @private
    */
   constructor : function(config) {
        if (!config || !config.items) throw 'Invalid arguments, see documentation';
        
        Ext.apply(this, config);
        
        var tabCfg = {
                tag: 'div',
                cls: 'fingermenu-panel ' + (config.cls || ''),
                children : []
            },
            items = config.items,
            item,
            selected,
            i;
        
        this.addEvents('change');
        
        for (i = 0; i < items.length; i++) {
            item = items[i];
            selected = (i === this.selectedIndex);
            
            tabCfg.children.push({
                id : 'menuitem-' + i,
                cls : selected ? 'fingermenu-show' : '',
                style : {
                    width : '190px',
                    position : 'absolute',
                    left : (selected ? this.expandedX : this.collapsedX) + 'px',
                    top : (i*42) + 'px'
                },
                tag: 'div', children : [{
                        tag : 'span',
                        cls : item.iconCls ? ('fingermenu-icon ' + item.iconCls) : '',
                        html : item.text,
                        title : item.tooltip || item.text
                    }
                ]
            });
        }
        
        this.el = Ext.DomHelper.append(Ext.getBody(), tabCfg, true);
        
        this.el.on('click', this.onItemClick, this, { delegate: 'div' });
        
        var divs = this.el.select('div');
        divs.on('mouseenter', this.onHover, this);
        divs.on('mouseleave', this.onHoverLeave, this);
        
        Ext.ux.FingerMenu.superclass.constructor.call(this);
    }
});