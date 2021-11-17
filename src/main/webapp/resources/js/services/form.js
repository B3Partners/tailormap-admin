/*
 * Copyright (C) 2012-2017 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global Ext */

Ext.define('vieweradmin.components.Form', {

    extend: "Ext.ux.b3p.CrudGrid",

    config: {
        forms:[],
        gridurl: "",
        editurl: "",
        itemname: i18next.t('viewer_admin_attribute_gtitle'),
        getfeaturetypesurl: "",
        setDefaultFeaturesource: ""
    },
    constructor: function(config) {
        this.initConfig(config);
        vieweradmin.components.Form.superclass.constructor.call(this, this.config);
        vieweradmin.components.Menu.setActiveLink('menu_forms');
        this.convertDefaultFSSelect();
    },

    simpleFeatureTypeChange: function(simpleFeatureTypeId) {
        var gridStore = this.getStore();
        gridStore.proxy.extraParams.simpleFeatureTypeId = simpleFeatureTypeId.getValue();
        // Go back to page 1 and reload store
        gridStore.load({params: {
                start: 0,
                page: 1,
                limit: 10
            }});
        gridStore.loadPage(1, {limit:10});
    },

    getGridColumns: function() {
        return [
            {
                id: 'id',
                text: i18next.t('viewer_admin_form_col_id'),
                dataIndex: 'id',
                width: 100,
            },{
                id: 'featureTypeName',
                text: i18next.t('viewer_admin_form_col_featuretypename'),
                filter: {
                    xtype: 'textfield'
                },
                dataIndex: 'featureTypeName',
                flex: 1,

            },{
                id: 'name',
                text: i18next.t('viewer_admin_form_col_name'),
                dataIndex: 'name',
                flex: 1,
                filter: {
                    xtype: 'textfield'
                }
            }, {
                id: 'attribute',
                text: '',
                dataIndex: 'id',
                flex: 1,
                menuDisabled: true,
                sortable: false,
                hideable: false,
                renderer: function (value) {
                    return [
                        Ext.String.format('<a href="#" class="editobject">' + i18next.t('viewer_admin_document_3') + '</a>'),
                        Ext.String.format('<a href="#" class="removeobject">' + i18next.t('viewer_admin_document_4') + '</a>')
                    ].join(" | ");
                }
            }
    ];
    },

    getGridModel: function() {
        return [
            {name: 'id', type: 'int' },
            {name: 'name', type: 'string'},
            {name: 'featureTypeName', type: 'string'},
        ];
    },

    getEditUrl: function(record) {
        return this.createUrl(this.config.editurl, { form: record.get('id') });
    },

    getRemoveUrl: function(record) {
        return this.createUrl(this.config.deleteurl, { form: record.get('id') });
    },

    convertDefaultFSSelect: function() {
        var values = [];
        var a = document.getElementById("editFrame");

        var defaultFSSelect = document.getElementById("defaultFSSelector");
        defaultFSSelect.style.display = 'none';
        for(var i = 0; i < defaultFSSelect.options.length; i++) {
            values.push({
                value: defaultFSSelect.options[i].value,
                label: defaultFSSelect.options[i].innerHTML
            });
        }
        var applications = Ext.create('Ext.data.Store', {
            fields: ['value', 'label'],
            data : values
        });
        Ext.create('Ext.container.Container',{
            renderTo: defaultFSSelect.parentNode,
            padding: '20 0 10 0',
            style: {
                color: '#666666'
            },
            html: i18next.t('viewer_admin_form_defaultfs')
        });
        Ext.create('Ext.form.ComboBox', {
            fieldLabel: i18next.t('viewer_admin_form_lookupfs'),
            store: applications,
            queryMode: 'local',
            displayField: 'label',
            valueField: 'value',
            value: defaultFSSelect.value,
            renderTo: defaultFSSelect.parentNode,
            labelWidth: 150,
            width: 375,
            listeners: {
                change: {
                    fn: function(combo, newvalue) {
                        combo.setLoading(i18next.t('viewer_admin_form_saving'));
                        this.defaultApplicationChanged(combo, applications.findRecord("value", newvalue, 0, false, false, /*exactMatch=*/true));
                    },
                    scope: this
                }
            }
        });
    },

    defaultApplicationChanged: function (combobox, application) {
        var defaultFs, appLabel;
        if (application === null) {
            defaultFs = null;
            appLabel = i18next.t('viewer_admin_chooseapplication_15')
        } else {
            defaultFs = application.get('value');
            appLabel = ': "' + application.get('label') + '"';
        }
        Ext.Ajax.request({
            url: this.config.setDefaultFeaturesource,
            params: {
                defaultFeatureSource: defaultFs
            },
            scope: this,
            success: function(result) {
                var response = Ext.JSON.decode(result.responseText);
                combobox.setLoading(false);
                if(!response.success) {
                    Ext.MessageBox.alert(i18next.t('viewer_admin_chooseapplication_16'), i18next.t('viewer_admin_chooseapplication_17'));
                } else {
                    Ext.MessageBox.alert(i18next.t('viewer_admin_chooseapplication_18'), i18next.t('viewer_admin_chooseapplication_19') + appLabel);
                }
            },
            failure: function(result) {
                combobox.setLoading(false);
                Ext.MessageBox.alert(i18next.t('viewer_admin_chooseapplication_20'), i18next.t('viewer_admin_chooseapplication_21'));
            }
        });
    }


});
