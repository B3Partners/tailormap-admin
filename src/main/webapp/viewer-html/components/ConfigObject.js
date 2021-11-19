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
/**
 * Superclass for the classes that create configuration elements for a component.
 */
Ext.define("viewer.components.ConfigObject",{
    parentId: null,
    configObject: null,
    formWidth: 750,
    labelWidth: 300,
    formPadding: 5,
    //options for checkboxes
    checkBoxes: null,
    checkPanel: null,
    checkPanelHeight: 300,
    form: null,
    //URL for getting Layers
    requestPath: "",
    constructor: function (parentId, configObject, configPage) {
        this.parentId = parentId;
        this.configObject = configObject || {};
        this.configPage = configPage;
        this.requestPath = configPage.getContextpath() + "/action/componentConfigList";
    },
    /**
     * Must return the configuration that is set by the user.
     * 
     */
    getConfiguration: function(){
        var config=new Object();        
        if (this.checkBoxes!=null){
            config.layers=this.checkBoxes.getChecked();  
            config.defaultOnLayers = this.checkBoxes.getDefaultChecked();
        }
        Ext.apply(config,this.getValuesFromContainer(this.form));
        return config;
    },
    /**
     * Get the item values of the given container.
     */
    getValuesFromContainer: function(container){
        var config=new Object();
        for( var i = 0 ; i < container.items.length ; i++){
            //if its a radiogroup get the values with the function and apply the values to the config.
            if ("radiogroup"==container.items.get(i).xtype){
                Ext.apply(config, container.items.get(i).getValue());       
            }else if("htmleditor"==container.items.get(i).xtype) {
                config[container.items.get(i).getName()] = container.items.get(i).getValue();
            }else if ("container"==container.items.get(i).xtype || "checkboxgroup"==container.items.get(i).xtype || "fieldset"==container.items.get(i).xtype){
                Ext.apply(config,this.getValuesFromContainer(container.items.get(i)));
            }else if (container.items.get(i).name!=undefined)
                config[container.items.get(i).name] = container.items.get(i).value;
        }
        return config;
    },
    /**
     *Create a layer list with checkboxes.
     *@param checkedIds a array of id's that need to be checked at init.
     *@param requestParams the params that are send with the ajax request.
     */
    createCheckBoxes: function (checkedIds,requestParams, defaultOnIds){
        if (requestParams==undefined || requestParams==null){
            requestParams=new Object();
        }
        //add the application id that needs to be send with the ajax
        requestParams.appId = this.getApplicationId();
        
        if (checkedIds==undefined)
            checkedIds=[];
        //create the formpanel
        var me=this;
        var id = 'layerListContainer' + Ext.id();
        this.checkPanel=Ext.create("Ext.form.FormPanel",{
            title: i18next.t('viewer_components_configobject_0'),
            id: id,
            style: {
                marginTop: "10px"
            },
            layout: 'fit',
            frame: false,
            bodyPadding: me.formPadding,
            width: me.formWidth,
            height: me.checkPanelHeight,
            renderTo: this.parentId
        });
        this.checkPanel.setLoading(i18next.t('viewer_components_configobject_1'),);
        this.checkBoxes=Ext.create("Ext.ux.b3p.FilterableCheckboxes",{
            requestUrl: me.requestPath,
            requestParams: requestParams,
            renderTo: id,
            checked: checkedIds,
            layerFilter: me.configObject.layerFilter,
            checkedDefaultOn: defaultOnIds
        });   
    },

    getFilterableLayers: function(callback){
        var me = this;
        Ext.Ajax.request({
            url: me.requestPath,
            scope:this,
            params: {
                filterable: true,
                appId: this.getApplicationId(),
                includeAttributes:true,
            },
            timeout:120000,
            success: function ( result, request ) {
                var layers = Ext.JSON.decode(result.responseText);
                var appLayers = {};
                for(var i = 0 ; i < layers.length ;i++){
                    var l = layers[i];
                    appLayers[l.id] =l ;
                }
                callback.call(this, appLayers);
            },
            failure: function() {
                Ext.MessageBox.alert(i18next.t('viewer_admin_filterablecheckboxes_1'), i18next.t('viewer_admin_filterablecheckboxes_2'));
            }
        });
    },
    getActionBeanUrl: function(name) {
        return this.configPage.getActionBeanUrl(name);
    },
    getContextpath: function() {
        return this.configPage.getContextpath();
    },
    getApplicationId: function() {
        return this.configPage.getApplicationId();
    },
    getAppConfig: function() {
        return this.configPage.getAppConfig();
    },
    getDefaultValues: function() {
        return {};
    }

});

