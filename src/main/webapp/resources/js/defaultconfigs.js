/* 
 * Copyright (C) 2011-2016 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Get parent function for iframes / popups
function getParent() {
    if (window.opener){
        return window.opener;
    }else if (window.parent){
        return window.parent;
    }else{
        return window;
    }
}

function appendPanel(header, content, container) {
    var headerobj = document.getElementById(header);
    var contentobj = document.getElementById(content);
    if(headerobj && contentobj) {
        var headercontent = headerobj.innerText || headerobj.textContent;
        headerobj.style.display = 'none';
        contentobj.className += ' insidePanel';
        
        var panelContainer = container || Ext.getBody();
        var panel = Ext.create('Ext.panel.Panel', {
            title: headercontent,
            contentEl: contentobj,
            width: '100%',
            height: '100%',
            renderTo: panelContainer,
            autoScroll: true
        });
        Ext.on('resize', function () {
            panel.updateLayout();
        });
    }
}

Ext.onReady(function() {
    document.body.addEventListener('click', function(e) {
        if(e.target && e.target.className && e.target.className.indexOf('inlinehelp-toggle') !== -1) {
            var target = e.target.getAttribute('data-target');
            if(target) {
                var targetEl = document.querySelector('.' + target);
                if(targetEl) {
                    targetEl.style.display = targetEl.style.display === 'none' ? 'block' : 'none';
                }
            }
        }
        if(e.target && e.target.className && e.target.className.indexOf('helplink') !== -1) {
            e.preventDefault();
            e.stopPropagation();
            vieweradmin.components.HelpController.showHelp(e.target);
        }
    });
});

Ext.define('vieweradmin.components.iFramePopupController', {
    iframe: null,
    singleton: true,
    constructor: function(conf) {
        Ext.onReady(this.initPopup.bind(this));
    },
    initPopup: function() {
        this.iframeid = Ext.id();
        this.popupWindow = Ext.create('Ext.window.Window', {
            closeAction: 'hide',
            hideMode: 'offsets',
            width: 600,
            height: 400,
            layout: 'fit',
            renderTo: Ext.getBody(),
            bodyStyle: {
                background: '#FFFFFF'
            },
            items : [{
                id: this.iframeid,
                xtype : "component",
                autoEl : {
                    tag : "iframe",
                    style: "border: 0px none;",
                    frameborder: 0
                }
            }]
        });
    },
    getIframe: function() {
        if(this.iframe === null) this.iframe = Ext.get(this.iframeid);
        return this.iframe;
    },
    loadPage: function(url, frametitle) {
        var iframe = this.getIframe();
        if(!frametitle) frametitle = '';
        if(iframe) {              
            iframe.set({ src: url });
            this.popupWindow.setTitle(frametitle);
            this.popupWindow.show();
        }
    }
});

Ext.define('vieweradmin.components.HelpController', {
    singleton: true,
    helppath: helppath,
    showHelp: function(htmlel) {
        var extel = Ext.fly(htmlel);
        var hash = extel.getAttribute('href');
        // IE fix, href in IE8 and lower is the complete URL + hash, not just the hash
        hash = hash.substring(hash.lastIndexOf('#'));
        var iframeurl = this.helppath + hash;
        vieweradmin.components.iFramePopupController.loadPage(iframeurl, i18next.t('viewer_admin_defaultconfigs_0'));
    }
});

Ext.define("vieweradmin.components.DefaultConfgurations", {

    singleton: true,

    getDefaultGridConfig: function() {
        return {
            autoWidth: true,
            height: '100%',
            disableSelection: false,
            loadMask: true,
            viewConfig: {
                trackOver: true,
                stripeRows: true
            }
        };
    },

    getDefaultHtmlEditorTableConfig: function() {
        return {
            langTitle: i18next.t('viewer_admin_defaultconfigs_25'),
            langInsert: i18next.t('viewer_admin_defaultconfigs_26'),
            langCancel: i18next.t('viewer_admin_defaultconfigs_27'),
            langRows: i18next.t('viewer_admin_defaultconfigs_28'),
            langColumns: i18next.t('viewer_admin_defaultconfigs_29'),
            langBorder: i18next.t('viewer_admin_defaultconfigs_30'),
            langCellLabel: i18next.t('viewer_admin_defaultconfigs_31')
        };
    }

});

Ext.override(Ext.form.field.HtmlEditor, 
    // Fix upside down question mark appearing
    // http://www.sencha.com/forum/showthread.php?79190-Mysterious-postdata-from-htmleditor
    { defaultValue: "" }
);