/*
 * Copyright (C) 2012-2013 B3Partners B.V.
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
/* global Ext, contextPath, MobileManager, actionBeans, i18next, viewer, FlamingoAppLoader */

/**
 * Drawing component
 * Creates a Drawing component
 * @author <a href="mailto:meinetoonen@b3partners.nl">Meine Toonen</a>
 */
Ext.define ("viewer.components.Drawing",{
    extend: "viewer.components.Component",
    iconPath: null,
    // Forms
    formdraw : null,
    formselect : null,
    formsave : null,
    formopen : null,
    vectorLayer:null,
    // Items in forms. Convience accessor
    colorPicker:null,
    label:null,
    title:null,
    comment:null,
    deActivatedTools: null,
    file:null,
    // Current active feature
    activeFeature:null,
    features:null,
    // Boolean to check if window is hidden temporarily for mobile mode
    mobileHide: false,
    pointType:"circle",
    defaultProps:null,
    popupClosed: true,
    updateFormLayoutTimer: null,
    config:{
        title: "",
        reactivateTools:null,
        iconUrl: "",
        tooltip: "",
        color: "",
        label: "",
        details: {
            minWidth: 340,
            minHeight: 500,
            useExtLayout: true,
            usePopupScrolling: false
        }
    },
    constructor: function (conf){
        this.initConfig(conf);
        this.config.details.minWidth = this.config.dummyUser ? 250 : this.config.details.minWidth;
        this.config.details.minHeight = this.config.dummyUser ? 170 : this.config.details.minHeight;
	    viewer.components.Drawing.superclass.constructor.call(this, this.config);
        if(this.config.color === ""){
            this.config.color = "ff0000";
        }
        this.features = new Object();
        var me = this;
        this.renderButton({
            handler: function(){
                me.showWindow();
            },
            text: me.config.title,
            icon: me.config.iconUrl,
            tooltip: me.config.tooltip,
            label: me.config.label
        });

        // Needed to untoggle the buttons when drawing is finished
        this.drawingButtonIds = {
            'point': Ext.id(),
            'line': Ext.id(),
            'polygon': Ext.id(),
            'circle': Ext.id()
        };


        this.config.viewerController.addListener(viewer.viewercontroller.controller.Event.ON_SELECTEDCONTENT_CHANGE,this.selectedContentChanged,this );
        this.config.viewerController.addListener(viewer.viewercontroller.controller.Event.ON_LAYERS_INITIALIZED,this.createVectorLayer, this);
        this.iconPath=FlamingoAppLoader.get('contextPath')+"/viewer-html/components/resources/images/drawing/";
        this.loadWindow();
        if (!this.isPopup) {
            this.deActivatedTools = this.config.viewerController.mapComponent.deactivateTools();
        } else {
            this.popup.addListener("hide", this.hideWindow, this);
        }
        return this;
    },
    activate: function(){
        this.vectorLayer.bringToFront();
    },
    showWindow : function (){
        this.deActivatedTools = this.config.viewerController.mapComponent.deactivateTools();
        this.mobileHide = false;
        this.popup.show();
        this.vectorLayer.bringToFront();
        this.popupClosed = false;
        if (this.config.dummyUser) {
            this.drawFreeHand();
        }
    },
    hideWindow: function () {
        if(this.mobileHide) {
            return;
        }
        this.popupClosed = true;
        if (this.config.dummyUser) {
            this.vectorLayer.stopDrawing();
        }
        if (!this.config.reactivateTools) {
            return;
        }
        for (var i = 0; i < this.deActivatedTools.length; i++) {
            this.deActivatedTools[i].activate();
        }
        this.deActivatedTools = [];
    },
    selectedContentChanged : function (){
        if(this.vectorLayer === null){
            this.createVectorLayer();
        }else{
            this.config.viewerController.mapComponent.getMap().addLayer(this.vectorLayer);
        }
    },
    createVectorLayer : function (){
        this.config.color = this.config.color ?  this.config.color : 'FF0000';
        this.defaultProps = {
            'fontColor': "#000000",
            'fontSize': "13px",
            'labelOutlineColor': "#ffffff",
            'labelOutlineWidth': 2,
            'pointRadius': 6,
            'labelAlign': "cm",
            'fillColor': '#' + this.config.color,
            'fillOpacity': 0.5,
            'strokeDashstyle' : 'solid',
            'strokeColor': '#' + this.config.color,
            'strokeOpacity': 0.5,
            'strokeWidth':this.config.dummyUser ? 8 : 3
        };
        this.defaultStyle = Ext.create('viewer.viewercontroller.controller.FeatureStyle', this.defaultProps);
        this.vectorLayer=this.config.viewerController.mapComponent.createVectorLayer({
            name:'drawingVectorLayer' + this.config.name,
            geometrytypes:["Circle","Polygon","Point","LineString"],
            showmeasures:true,
            viewerController: this.config.viewerController,
            defaultFeatureStyle: this.defaultStyle,
            addStyleToFeature: true,
            mustCreateVertices: !this.config.dummyUser
        });
        this.config.viewerController.registerSnappingLayer(this.vectorLayer);
        this.config.viewerController.mapComponent.getMap().addLayer(this.vectorLayer);

        this.vectorLayer.addListener (viewer.viewercontroller.controller.Event.ON_ACTIVE_FEATURE_CHANGED,this.activeFeatureChanged,this);
        this.vectorLayer.addListener (viewer.viewercontroller.controller.Event.ON_FEATURE_ADDED,this.activeFeatureFinished,this);
    },
    /**
     * Create the GUI
     */
    loadWindow : function(){
        var me=this;

        this.colorPicker = Ext.create("Ext.ux.ColorField",{
            width: 70,
            showText: false,
            name: 'color',
            id:'color',
            value: this.config.color ? this.config.color : 'FF0000',
            listeners :{
                select : {
                    fn: this.featureStyleChanged,
                    scope : this
                }
            }
        });

        this.labelField = Ext.create("Ext.form.field.Text",{
            name: 'labelObject',
            hidden:this.config.dummyUser,
            flex: 1,
            style: {
                marginRight:'5px'
            },
            id: 'labelObject' + this.name,
            listeners:{
                change:{
                    fn: this.labelChanged,
                    scope:this
                }
            }
        });
        var drawingItems = [{
                xtype: "splitbutton",
                icon: this.iconPath + "circle.png",
                hidden: this.config.dummyUser,
                id: this.drawingButtonIds.point,
                listeners: {
                    click: {
                        scope: me,
                        fn: me.drawPoint
                    }
                },
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            icon: this.iconPath + "circle.png",
                            text: i18next.t('viewer_components_drawing_0'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () {
                                        this.drawingTypeChanged("circle", true);
                                    }
                                }
                            }
                        },
                        {
                            text: i18next.t('viewer_components_drawing_27'),
                            icon: this.iconPath + "square.png",
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () {
                                        this.drawingTypeChanged("square", true);
                                    }
                                }
                            }
                        },
                        {
                            icon: this.iconPath + "cross.png",
                            text: i18next.t('viewer_components_drawing_28'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () { this.drawingTypeChanged("cross", true);}
                                }
                            }
                        },
                        {
                            icon: this.iconPath + "star.png",
                            text: i18next.t('viewer_components_drawing_29'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () { this.drawingTypeChanged("star", true);}
                                }
                            }
                        },
                        {
                            icon: this.iconPath + "x.png",
                            text: i18next.t('viewer_components_drawing_30'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () { this.drawingTypeChanged("x", true);}
                                }
                            }
                        },
                        {
                            icon: this.iconPath + "triangle.png",
                            text: i18next.t('viewer_components_drawing_31'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: function () { this.drawingTypeChanged("triangle", true);}
                                }
                            }
                        }
                    ]
                })
        },
        {
            xtype: 'button',
            id: this.drawingButtonIds.line,
            icon: this.iconPath+"line_red.png",
            tooltip: i18next.t('viewer_components_drawing_1'),
            enableToggle: true,
            hidden: this.config.dummyUser,
            toggleGroup: 'drawingTools',
            listeners: {
                click:{
                    scope: me,
                    fn: me.drawLine
                }
            }
        },
        {
            xtype: 'button',
            id: this.drawingButtonIds.polygon,
            icon: this.iconPath+"shape_square_red.png",
            tooltip: i18next.t('viewer_components_drawing_2'),
            enableToggle: true,
            toggleGroup: 'drawingTools',
            hidden: this.config.dummyUser,
            listeners: {
                click:{
                    scope: me,
                    fn: me.drawPolygon
                }
            }
        }];
        if(!viewer.components.MobileManager.isMobile()) {
            drawingItems.push({
                xtype: 'button',
                id: this.drawingButtonIds.circle,
                icon: this.iconPath+"shape_circle_red.png",
                tooltip: i18next.t('viewer_components_drawing_3'),
                enableToggle: true,
                hidden: this.config.dummyUser,
                toggleGroup: 'drawingTools',
                listeners: {
                    click:{
                        scope: me,
                        fn: me.drawCircle
                    }
                }
            });
        }
        drawingItems.push(this.colorPicker);
        if(!this.config.dummyUser){
            drawingItems.push({
                xtype: 'button',
                icon: this.iconPath + "delete.png",
                hidden: this.config.dummyUser,
                tooltip: i18next.t('viewer_components_drawing_7'),
                listeners: {
                    click: {
                        scope: me,
                        fn: me.deleteObject
                    }
                }
            });
        }
        this.formdraw = new Ext.form.FormPanel({
            border: 0,
            items: [{
                xtype: 'fieldset',
                defaultType: 'textfield',
                padding: 0,
                style: {
                    border: '0px none'
                },
                items: [
                    {
                        xtype: 'label',
                        text: i18next.t('viewer_components_drawing_5')
                    },
                    {
                        xtype: 'fieldset',
                        border: 0,
                        margin: 0,
                        padding: 0,
                        style: {
                            border: 0
                        },
                        layout:{
                            type: 'hbox'
                        },
                        defaults: {
                            margin: '5 5 0 0'
                        },
                        items: drawingItems
                    },
                    {
                        xtype: 'fieldset',
                        title: i18next.t('viewer_components_drawing_32'),
                        collapsed:true,
                        collapsible:true,
                        hidden:this.config.dummyUser,
                        border: 0,
                        margin: 0,
                        padding: 0,
                        style: {
                            border: 0
                        },
                        listeners: {
                            collapse: {
                                fn: function() {
                                    this.mainContainer.updateLayout();
                                },
                                scope: this
                            },
                            expand: {
                                fn: function() {
                                    this.mainContainer.updateLayout();
                                },
                                scope: this
                            }
                        },
                        layout:{
                            type: 'vbox',
                            align: 'stretch'
                        },
                        defaults: {
                                margin: '5 5 0 0'
                            },
                            items: [{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_33'),
                                    queryMode: 'local',
                                    store: [['solid', 'Doorgetrokken lijn'], ['dot', 'Stippellijn'], ['dash', 'Gestreepte lijn']],
                                    name: 'dashStyle',
                                    itemId: 'dashStyle',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_34'),
                                    queryMode: 'local',
                                    store: [['2', 'Dun'], ['3', 'Normaal'], ['8', 'Dik']],
                                    name: 'lineWidth',
                                    itemId: 'lineWidth',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_35'),
                                    queryMode: 'local',
                                    store: [['2', 'Klein'], ['6', 'Normaal'], ['10', 'Groot']],
                                    name: 'pointRadius',
                                    itemId: 'pointRadius',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'slider',
                                    fieldLabel: i18next.t('viewer_components_drawing_36'),
                                    name: 'fillOpacity',
                                    itemId: 'fillOpacity',
                                    value: 50,
                                    increment: 10,
                                    min: 0,
                                    max: 100,
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_37'),
                                    queryMode: 'local',
                                    store: [// First off: it's called labelAlign, but's counterintuitive: it's the position of the point
                                         //  relative to the label. So 'rb' means the anchorpoint of the label is on the right bottem of the label. Yeah.
                                         // Also: This is not very useful for something other than points, as for lines it uses the first
                                        ['rm', 'Links'],  // point and polygons it's center.
                                        ['cm', 'Midden'],
                                        ['lm', 'Rechts']],
                                    name: 'labelAlign',
                                    itemId: 'labelAlign',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_38'),
                                    queryMode: 'local',
                                    multiSelect:true,
                                    store: [ ['bold', 'Dikgedrukt'], ['italic', 'Schuin']],
                                    name: 'fontStyle',
                                    itemId: 'fontStyle',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                },{
                                    xtype: 'combobox',
                                    editable: false,
                                    fieldLabel: i18next.t('viewer_components_drawing_39'),
                                    queryMode: 'local',
                                    store: [['8px', '8px'], ['13px', '13px'], ['18px', '18px'], ['24px', '24px']],
                                    name: 'fontSize',
                                    itemId: 'fontSize',
                                    listeners: {
                                        change: {
                                            scope: this,
                                            fn: this.featureStyleChanged
                                        }
                                    }
                                }]
                    }
                ]
            }]
        });

        this.formselect = new Ext.form.FormPanel({
            border: 0,
            style: {
                marginBottom: '10px'
            },
            items: [
            {
                xtype: 'fieldset',
                defaultType: 'textfield',
                border: 0,
                style: {
                    border: '0px none',
                    marginBottom: '0px',
                    padding: '0px'
                },
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'label',
                        hidden:this.config.dummyUser,
                        text: i18next.t('viewer_components_drawing_6')
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '5 0 0 0',
                        items: [
                            this.labelField,
                            {
                                xtype: 'button',
                                hidden:this.config.dummyUser,
                                icon: this.iconPath+"calculator_edit.png",
                                tooltip: "Gebruik lengte/oppervlakte als label",
                                listeners: {
                                    click:{
                                        scope: me,
                                        fn: me.measureToLabel
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
            ]
        });

        // Convience accessor
        this.titleField = Ext.create("Ext.form.field.Text",{
            fieldLabel: i18next.t('viewer_components_drawing_8'),
            name: 'title',
            allowBlank:false,
            id: 'title'+ this.name,
            margin: '0 0 2 0'
        });
        this.description = Ext.create("Ext.form.field.TextArea",
        {
            fieldLabel: i18next.t('viewer_components_drawing_9'),
            allowBlank:false,
            name: 'description',
            id: 'description',
            margin: '0 0 2 0'
        });
        // Build the saving form
        this.formsave = new Ext.form.FormPanel({
            border: 0,
            standardSubmit: true,
            hidden:this.config.dummyUser,
            url: actionBeans["drawing"] + "?save",
            style: {
                marginBottom: '10px'
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'label',
                    text: i18next.t('viewer_components_drawing_10'),
                    margin: '0 0 5 0'
                },
                this.titleField,
                this.description,
                {
                    xtype: 'hiddenfield',
                    name: 'saveObject',
                    id: 'saveObject'
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: i18next.t('viewer_components_drawing_11'),
                            listeners: {
                                click:{
                                    scope: me,
                                    fn: me.saveFile
                                }
                            }
                        }
                    ]
                }
            ]
        });

        this.file = Ext.create("Ext.form.field.File", {
            name: 'featureFile',
            allowBlank: false,
            msgTarget: 'side',
            buttonText: i18next.t('viewer_components_drawing_40'),
            id: 'featureFile',
            margin: '0 0 2 0'
        });
        this.formopen = new Ext.form.FormPanel({
            hidden:this.config.dummyUser,
            border: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'label',
                    text: i18next.t('viewer_components_drawing_12'),
                    margin: '0 0 5 0'
                },
                this.file,
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: i18next.t('viewer_components_drawing_13'),
                            listeners: {
                                click: {
                                    scope: me,
                                    fn: me.openFile
                                }
                            }
                        }
                    ]
                }
            ]
        });

        var items = [ this.formdraw, this.formselect ];
        if(!viewer.components.MobileManager.isMobile()) {
            items.push(this.formsave); items.push(this.formopen);
        }
        this.mainContainer = Ext.create('Ext.container.Container', {
            id: this.name + 'Container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: {
                backgroundColor: 'White'
            },
            items: [
                {
                    id: this.name + 'ContentPanel',
                    xtype: "container",
                    autoScroll: true,
                    flex: 1,
                    items: items,
                    padding: 5
                }, {
                    id: this.name + 'ClosingPanel',
                    xtype: "container",
                    layout: {
                        type:'hbox',
                        pack:'end'
                    },
                    margin: 5,
                    items: [
                        {
                            xtype: 'button',
                            text: i18next.t('viewer_components_drawing_4'),
                            handler: function() {
                                me.deleteAll();
                            }
                        },
                        {
                            xtype: 'button',
                            text:  i18next.t('viewer_components_drawing_14'),
                            handler: function() {
                                me.popup.hide();
                            }
                        }
                    ]
                }
            ]
        });
        this.getContentContainer().add(this.mainContainer);
        this.formselect.setVisible(false);
    },

    drawingTypeChanged: function (type, activateDraw) {
        var cmp = Ext.getCmp(this.drawingButtonIds.point);
        cmp.setIcon(this.iconPath + type+".png");
        this.pointType = type;
        this.featureStyleChanged();
        if(activateDraw){
            this.drawPoint();
        }
    },
    /**
     * @param vectorLayer The vectorlayer from which the feature comes
     * @param feature the feature which has been activated
     * Event handlers
     **/
    activeFeatureChanged : function (vectorLayer,feature, evt){
        this.toggleSelectForm(true);
        if (evt && evt.type && evt.type === 'afterfeaturemodified') {
            this.activeFeature = null;
            return;
        }
        this.activeFeature = this.features[feature.config.id];
        if (!this.features.hasOwnProperty(feature.config.id)) {
            feature.color = feature.color || (feature.style || {}).color || this.colorPicker.getColor();
            this.features[feature.config.id] = feature;
            this.featureStyleChanged();
        } else {
            if (this.activeFeature.getId() === feature.getId()) {
                this.updateFormLayoutTimer = window.setTimeout((function() {
                    this.changeFormToCurrentFeature(feature);
                }).bind(this), 0);

            }
        }
        if (this.activeFeature) {
            this.labelField.setValue(this.activeFeature.label);
        }
    },
    //update the wkt of the active feature with the completed feature
    activeFeatureFinished : function (vectorLayer,feature){
        this.activeFeature.config.wktgeom = feature.config.wktgeom;
        Ext.Object.each(this.drawingButtonIds, function(key, id) {
            var button = Ext.getCmp(id);
            if(button) button.toggle(false);
        });
        this.showMobilePopup();
        this.featureStyleChanged();
        if (this.updateFormLayoutTimer) {
            window.clearTimeout(this.updateFormLayoutTimer);
        }
        if(this.config.dummyUser && !this.popupClosed) {
            this.drawFreeHand();
        }
    },
    featureStyleChanged: function(){
        var ds = this.getContentContainer().query('#dashStyle')[0];
        var lw = this.getContentContainer().query('#lineWidth')[0];
        var fo = this.getContentContainer().query('#fillOpacity')[0];
        var fs = this.getContentContainer().query('#fontSize')[0];
        var la = this.getContentContainer().query('#labelAlign')[0];
        var fw = this.getContentContainer().query('#fontStyle')[0];
        var pr = this.getContentContainer().query('#pointRadius')[0];

        var dashstyle = ds.getValue();
        var width = lw.getValue();
        var color = this.colorPicker.getColor();
        var opacity = fo.getValue()/ 100;
        var fontsize = fs.getValue();
        var labelAlign = la.getValue();
        var font = fw.getValue();
        var pointRadius = pr.getValue();
        var fontWeight = font && font.indexOf("bold") !== -1;
        var fontStyle = font && font.indexOf("italic") !== -1;

        var layer = this.vectorLayer;

        var featureStyle = Ext.create('viewer.viewercontroller.controller.FeatureStyle', this.defaultProps);// this.defaultStyle;// layer.mapStyleConfigToFeatureStyle();

        featureStyle.set('strokeColor', '#' + color);
        featureStyle.set('fillColor', '#' + color);
        featureStyle.set('fillOpacity', opacity);
        featureStyle.set('strokeDashstyle', dashstyle);
        featureStyle.set('strokeWidth',width);
        featureStyle.set('fontSize', fontsize);
        featureStyle.set('labelAlign', labelAlign);
        featureStyle.set('pointRadius', pointRadius);
        featureStyle.set('fontStyle', fontStyle ? "italic" : "normal");
        featureStyle.set('fontWeight', fontWeight ? "bold" : "normal");

        featureStyle.set('graphicWidth',28);
        featureStyle.set('graphicHeight', 28);
        featureStyle.set("graphicName",this.pointType);
        if (this.activeFeature) {
            this.features[this.activeFeature.getId()].setStyle(featureStyle);
            layer.setFeatureStyle(this.activeFeature.getId(), featureStyle);
        }
    },
    changeFormToCurrentFeature: function(feature){
        var featureStyle = this.vectorLayer.frameworkStyleToFeatureStyle(feature);
        var ds = this.getContentContainer().query('#dashStyle')[0];
        var lw = this.getContentContainer().query('#lineWidth')[0];
        var fo = this.getContentContainer().query('#fillOpacity')[0];
        var fs = this.getContentContainer().query('#fontSize')[0];
        var la = this.getContentContainer().query('#labelAlign')[0];
        var fw = this.getContentContainer().query('#fontStyle')[0];
        var pr = this.getContentContainer().query('#pointRadius')[0];

        var color = feature.style.fillColor;
        color = color.substring(1);
        this.colorPicker.setValue(color);
        this.config.color = color;

        var fontWeight = featureStyle.getFontWeight();
        fontWeight = fontWeight === "normal" ? null : fontWeight;
        var fontStyle = featureStyle.getFontStyle();

        fontStyle = fontStyle === "normal" ? null : fontStyle;
        var font = [fontWeight,fontStyle];

        ds.setValue(featureStyle.getStrokeDashstyle());
        lw.setValue(featureStyle.getStrokeWidth());
        pr.setValue(featureStyle.getPointRadius());
        fo.setValue(featureStyle.getFillOpacity()*100);
        fs.setValue(featureStyle.getFontSize());
        la.setValue(featureStyle.getLabelAlign());
        fw.setValue(font);
        if(featureStyle.getGraphicName()){
            this.drawingTypeChanged(featureStyle.getGraphicName(),false);
        }
    },
    labelChanged : function (field,newValue){
        if(this.activeFeature !== null){
            this.vectorLayer.setLabel(this.activeFeature.getId(),newValue);
            this.activeFeature.label=newValue;
        }
    },
    toggleSelectForm : function(visible){
        this.mainContainer.updateLayout();
        this.formselect.setVisible(visible);
    },
    hideMobilePopup: function() {
        if(viewer.components.MobileManager.isMobile()) {
            this.mobileHide = true;
            this.popup.hide();
        }
    },
    showMobilePopup: function() {
        if(viewer.components.MobileManager.isMobile()) {
            this.mobileHide = false;
            this.popup.show();
        }
    },
    drawPoint: function(){
        this.hideMobilePopup();
        this.vectorLayer.drawFeature("Point");
    },
    drawLine: function(){
        this.hideMobilePopup();
        this.vectorLayer.drawFeature("LineString");
    },
    drawPolygon: function(){
        this.hideMobilePopup();
        this.vectorLayer.drawFeature("Polygon");
    },
    drawCircle: function(){
        this.hideMobilePopup();
        this.vectorLayer.drawFeature("Circle");
    },
    drawFreeHand: function(){
        this.hideMobilePopup();
        this.vectorLayer.drawFeature("FreehandLine");
    },
    deleteAll: function() {
        Ext.Msg.show({
            title: i18next.t('viewer_components_drawing_15'),
            msg: i18next.t('viewer_components_drawing_16'),
            fn: function(button) {
                if (button === 'yes') {
                    this.vectorLayer.removeAllFeatures();
                    this.toggleSelectForm(false);
                    this.features = {};
                    this.labelField.setValue("");
                    this.titleField.setValue("");
                    this.description.setValue("");
                    if (this.activeFeature !== null) {
                        this.activeFeature = null;
                    }
                }
            },
            scope: this,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                no: i18next.t('viewer_components_drawing_17'),
                yes: i18next.t('viewer_components_drawing_18')
            },
            icon: Ext.Msg.WARNING
        });
    },
    measureToLabel: function(){
      var feature = this.activeFeature;
      if(feature){
          var size = this.vectorLayer.getFeatureSize(feature.getId());
          if(size){
              var postfix = feature.getWktgeom().indexOf("LINESTRING") !== -1 ? " m" : " m2";
              this.labelField.setValue(Math.round(size * 100) / 100 + postfix);
          }
      }
    },
    deleteObject: function() {
        Ext.Msg.show({
            title: i18next.t('viewer_components_drawing_19'),
            msg: i18next.t('viewer_components_drawing_20'),
            fn: function(button) {
                if (button === 'yes') {
                    delete this.features[this.activeFeature.id];
                    this.vectorLayer.removeFeature(this.activeFeature);
                    this.toggleSelectForm(false);
                    if(this.activeFeature !== null){
                        this.activeFeature=null;
                    }
                    this.labelField.setValue("");
                }
            },
            scope: this,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                no: i18next.t('viewer_components_drawing_21'),
                yes: i18next.t('viewer_components_drawing_22')
            },
            icon: Ext.Msg.WARNING
        });
    },
    saveFile: function(){
        var form = this.formsave.getForm();

        var features = new Array();
        for (var featurekey in this.features){
            if(this.features.hasOwnProperty(featurekey)) {
                var feature = this.features[featurekey];
                features.push(feature.toJsonObject());
            }
        }
        form.setValues({
            "saveObject":Ext.JSON.encode(features)
        });
        this.formsave.submit({
            target: '_blank'
        } );
        return features;
    },
    openFile: function(){
        var form =this.formopen.getForm();
        if(form.isValid()){
            form.submit({
                scope:this,
                url: actionBeans["drawing"],
                waitMsg: i18next.t('viewer_components_drawing_23'),
                waitTitle: i18next.t('viewer_components_drawing_24'),
                success: function(fp, o) {
                    var json = Ext.JSON.decode(o.result.content);
                    this.titleField.setValue( json.title);
                    this.description.setValue(json.description);
                    var features = Ext.JSON.decode(json.features);
                    this.loadFeatures(features);
                    if(features.length > 0){
                        var extent = o.result.extent;
                        this.config.viewerController.mapComponent.getMap().zoomToExtent(extent);
                    }
                },
                failure: function (){
                    Ext.MessageBox.alert(i18next.t('viewer_components_drawing_25'), i18next.t('viewer_components_drawing_26'));
                }
            });
        }
    },

    loadFeatures: function(features){
        //make the vectorLayer if not created yet.
        if (features.length > 0){
            if(this.vectorLayer === null){
              this.createVectorLayer();
            }
        }

        for ( var i = 0 ; i < features.length;i++){
            var feature = features[i];
            var featureObject = Ext.create("viewer.viewercontroller.controller.Feature",feature);
            var featureStyle = this.vectorLayer.frameworkStyleToFeatureStyle({});

            featureStyle.set('strokeColor',  featureObject.getStyle().getFillColor());
            featureStyle.set('fillColor', featureObject.getStyle().getStrokeColor());
            this.vectorLayer.setDefaultFeatureStyle(featureStyle);

            this.vectorLayer.addFeature(featureObject);
            this.vectorLayer.setLabel(this.activeFeature.getId(),featureObject._label);

            this.features[this.activeFeature.getId()].setStyle(featureStyle);
            this.vectorLayer.setFeatureStyle(this.activeFeature.getId(), featureStyle);
        }

    },

    getBookmarkState: function(shortUrl){
        var features = new Array();
        for (var featurekey in this.features){
            if(this.features.hasOwnProperty(featurekey)) {
                var feature = this.features[featurekey];
                features.push(feature.toJsonObject());
            }
        }
        var obj={};
        if (features.length > 0){
            obj.features= features;
        }
        return obj;
    },

    loadVariables: function (state){
        state= Ext.decode(state);
        this.config.viewerController.addListener(viewer.viewercontroller.controller.Event.ON_LAYERS_INITIALIZED,this.loadState, this, state);
    },
    loadState: function(state){
        if (state.features){
            this.loadFeatures(state.features);
        }
        if (state.extent){
            this.config.viewerController.mapComponent.getMap().zoomToExtent(state.extent);
        }
    },
    getExtComponents: function() {
        var compIds = [
            this.mainContainer.getId(),
            this.colorPicker.getId(),
            this.labelField.getId(),
            this.formdraw.getId(),
            this.formselect.getId(),
            this.titleField.getId(),
            this.description.getId()
        ];
        if(!viewer.components.MobileManager.isMobile()) {
            compIds.push(this.formsave.getId());
            compIds.push(this.file.getId());
            compIds.push(this.formopen.getId());
        }
        return compIds;
    }
});
