/*
 * Copyright (C) 2020 B3Partners B.V.
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
 * Custom configuration object for AttributeList configuration
 * @author Meine Toonen
 */
Ext.define("viewer.components.CustomConfiguration",{
    extend: "viewer.components.SelectionWindowConfig",
    constructor: function (parentId, configObject, configPage) {
        configObject.showLabelconfig =true;
        viewer.components.CustomConfiguration.superclass.constructor.call(this, parentId, configObject, configPage);
        this.form.add({
            xtype: 'checkbox',
            fieldLabel: i18next.t('gbi_config_0'),
            inputValue: true,
            name: 'useSelectedLayerFilter',
            checked: typeof this.configObject.useSelectedLayerFilter !== 'undefined'
                ? this.configObject.useSelectedLayerFilter
                : true,
            labelWidth: this.labelWidth
        });
    },
    getDefaultValues: function() {
        return {
            details: {
                minWidth: 600,
                minHeight: 300
            }
        };
    }
});



