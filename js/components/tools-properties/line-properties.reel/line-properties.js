/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

var Montage = require("montage/core/core").Montage,
    ToolProperties = require("js/components/tools-properties/tool-properties").ToolProperties;

exports.LineProperties = Montage.create(ToolProperties, {

    base:       { value: null },
    
    _subPrepare: {
        value: function() {
            //this.divElement.addEventListener("click", this, false);
        }
    },

    handleClick: {
        value: function(event) {
           // this.selectedElement = event._event.target.id;
        }
    },

     // Public API
    use3D: {
        get: function() { return this.base._use3D; }
    },

    strokeSize: {
        get: function() { return this.base._strokeSize; }
    },

    strokeStyle : {
        get: function() { return this.base._strokeStyle.options[this.base._strokeStyle.value].text; }
    },

    strokeStyleIndex : {
        get: function() { return this.base._strokeStyle.options[this.base._strokeStyle.value].value; }
    },

    strokeMaterial: {
        get: function() { return this.base._strokeMaterial.options[this.base._strokeMaterial.value].value; }
    },

    fillMaterial: {
        get: function() { return this.base._fillMaterial.options[this.base._fillMaterial.value].value; }
    }
});