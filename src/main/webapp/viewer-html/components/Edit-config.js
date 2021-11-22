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
 * Custom configuration object for HTML configuration
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define("viewer.components.CustomConfiguration", {
    extend: "viewer.components.SelectionWindowConfig",
    constructor: function (parentId, configObject, configPage) {
        if (configObject === null) {
            configObject = {};
        }
        configObject.showLabelconfig = true;
        viewer.components.CustomConfiguration.superclass.constructor.call(this, parentId, configObject, configPage);
        this.createCheckBoxes(this.configObject.layers, {editable: true});
        var hidden = {};
        if(this.configPage._metadata.hidden){
            hidden = this.configPage._metadata.hidden;
        }
        this.form.add([
            {
                xtype: 'numberfield',
                fieldLabel: i18next.t('edit_config_0'),
                name: 'clickRadius',
                value: this.configObject.clickRadius !== undefined ? this.configObject.clickRadius : 4,
                labelWidth: this.labelWidth,
                style: {
                    marginRight: "70px"
                }
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_1'),
                name: 'allowEdit',
                value: this.configObject.allowEdit !== undefined ? this.configObject.allowEdit : true,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_2'),
                name: 'allowDelete',
                value: this.configObject.allowDelete !== undefined ? this.configObject.allowDelete : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_3'),
                name: 'allowCopy',
                value: this.configObject.allowCopy !== undefined ? this.configObject.allowCopy : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_4'),
                name: 'allowNew',
                value: this.configObject.allowNew !== undefined ? this.configObject.allowNew : true,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_7'),
                name: 'allowTranslate',
                value: this.configObject.allowTranslate !== undefined ? this.configObject.allowTranslate : true,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_8'),
                name: 'showLineLength',
                value: this.configObject.showLineLength !== undefined ? this.configObject.showLineLength : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_5'),
                name: 'showEditLinkInFeatureInfo',
                hidden: hidden.showEditLinkInFeatureInfo === "true" ? true:false,
                value: this.configObject.showEditLinkInFeatureInfo !== undefined ? this.configObject.showEditLinkInFeatureInfo : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_rememberValuesInSession'),
                name: 'rememberValuesInSession',
                value: this.configObject.rememberValuesInSession !== undefined ? this.configObject.rememberValuesInSession : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_showMergeButton'),
                name: 'showMergeButton',
                value: this.configObject.showMergeButton !== undefined ? this.configObject.showMergeButton : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_showSplitButton'),
                name: 'showSplitButton',
                value: this.configObject.showSplitButton !== undefined ? this.configObject.showSplitButton : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18next.t('edit_config_showSnappingButton'),
                name: 'showSnappingButton',
                value: this.configObject.showSnappingButton !== undefined ? this.configObject.showSnappingButton : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18next.t('edit_config_editLabelWidth'),
                minValue: 100,
                maxValue: 500,
                step: 10,
                name: 'editLabelWidth',
                value: this.configObject.editLabelWidth !== undefined ? this.configObject.editLabelWidth : 100,
                labelWidth: this.labelWidth,
                style: {
                    marginRight: "70px"
                }
            },
            {
                xtype: 'textarea',
                fieldLabel: i18next.t('edit_config_6'),
                name: 'editHelpText',
                value: this.configObject.hasOwnProperty("editHelpText") ? this.configObject.editHelpText : "",
                labelWidth: this.labelWidth,
                grow: true,
                width: 700
            }
        ]);
    },
    getDefaultValues: function() {
        return {
            details: {
                minWidth: 400,
                minHeight: 250
            }
        };
    }
});

