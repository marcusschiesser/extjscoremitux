/*
The MIT License

Copyright (c) 2009 Niko Ni (bluepspower@163.com)

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

// namespace
Ext.namespace('Ext.ux');

/**
 * @class Ext.ux.MessageSlides
 *
 * @author Niko Ni
 * @version v0.3
 * @create 2009-06-20
 * @update 2009-06-21
 */
Ext.ux.MessageSlides = Ext.extend(Ext.util.Observable, {
    //------------------------------------------------------------
    // config options
    //------------------------------------------------------------
    /**
     * @config {Array} array of message slides config object
     *                 Example object item:
     *                 {
     *                     content: 'some content',
     *                     url: 'some url',
     *                     tip: 'some tip (optional)',
     *                     target: 'target element (optional)'
     *                 }
     */
    items : [],

    /**
     * @config {Int} display message index
     */
    displayIndex : 0,

    /**
     * @config {Int} interval time seconds (recommend number more than 1)
     */
    intervalTime : 4,

    //------------------------------------------------------------
    // class constructor
    //------------------------------------------------------------
    /**
     * @constructor
     * @param el
     * @param config
     */
    constructor : function(el, config) {
        Ext.apply(this, config);
        Ext.ux.MessageSlides.superclass.constructor.call(this);

        // add custom event
        this.addEvents('change');

        // initialize
        this.init(el, config);
    },

    //------------------------------------------------------------
    // public/private methods
    //------------------------------------------------------------
    /**
     * @private
     */
    init : function(el, cfg) {
		// properties
        this.el = Ext.get(el);
        this.items = cfg.items;
        this.activeItem = this.items[this.displayIndex];

		// init markup
        this.initMarkup();

		// init events
        this.initEvents();
    },

    /**
     * @private
     */
    initMarkup : function() {
        // message container
        this.containerEl = this.el.createChild({
            tag : 'div',
            cls : 'ux-msg-slides-container'
        });
        // inner message element
        this.innerEl = this.containerEl.createChild({
            tag : 'div',
            cls : 'ux-msg-slides-inner'
        });

        // message link element
        var currItem = this.activeItem;
        this.innerEl.createChild({
            tag : 'a',
            href : currItem.url,
            html : currItem.content,
            title : currItem.tip || currItem.content,
            target : currItem.target || '_blank'
        });
    },
    
    /**
     * @private
     */
    initEvents : function() {
        // set hover action
        // equal to addClassOnOver
        this.innerEl.hover(function() {
            Ext.fly(this).addClass('msg-over');
        }, function() {
            Ext.fly(this).removeClass('msg-over');
        });

        this.containerEl.on('click', function() {
            this.fireEvent('change', this.activeItem, this.displayIndex);
        }, this, {
            delegate : 'a'
        });

        // show the default message
        this.showMsg(this.displayIndex);

        // set interval action
        var _this = this;
        window.setInterval(function() {
			// if hover, do nothing
			if(!_this.innerEl.hasClass('msg-over')) {
				_this.displayIndex = _this.items[_this.displayIndex + 1] ? _this.displayIndex + 1 : 0;
				_this.showMsg(_this.displayIndex);
			}
        }, this.intervalTime * 1000);
    },

    /**
     * @private
     */
    showMsg : function(index) {
        // if hover, do nothing
        if(!this.innerEl.hasClass('msg-over')) {
            this.activeItem = this.items[index];
            if(this.containerEl.isVisible()) {
                this.containerEl.slideOut('b', {
                    callback : this.updateMsg,
                    scope : this
                });
            } else {
                this.updateMsg();
            }
        }
    },

    /**
     * @private
     */
    updateMsg : function() {
        // update message
        var currItem = this.activeItem;
        var linkEl = this.innerEl.child('a');
        linkEl.update(currItem.content);
        linkEl.dom.href = currItem.url;
        linkEl.dom.title = currItem.tip || currItem.content;
        linkEl.dom.target = currItem.target || '_blank';
        
        this.containerEl.slideIn('b', {
            duration: 0.2
        });
    }

});  // end of Ext.ux.MessageSlides