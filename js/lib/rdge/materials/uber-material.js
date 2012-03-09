/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Material = require("js/lib/rdge/materials/material").Material;

var UberMaterial = function UberMaterial() {
    ///////////////////////////////////////////////////////////////////////
    // Instance variables
    ///////////////////////////////////////////////////////////////////////
	this._name = "UberMaterial";
	this._shaderName = "uber";
	this.getShaderName = function()	{  return this._shaderName;  };

	// set some default values
	this._ambientColor  = [ 0.0, 0.0, 0.0, 1.0 ];
	this._diffuseColor  = [ 1.0, 1.0, 1.0, 1.0 ];
	this._specularColor = [ 1.0, 1.0, 1.0, 1.0 ];
	this._specularPower = 32.0;
	this._environmentAmount = 0.2;		// 0 .. 1

	// set the default maps
	this._diffuseMapOb = { 'texture' : 'assets/images/rocky-diffuse.jpg', 'wrap' : 'REPEAT' };
	this._normalMapOb = { 'texture' : 'assets/images/rocky-normal.jpg', 'wrap' : 'REPEAT' };
	this._specularMapOb = { 'texture' : 'assets/images/rocky-spec.jpg', 'wrap' : 'REPEAT' };
	this._environmentMapOb = { 'texture' : 'assets/images/silver.png', 'wrap' : 'CLAMP', 'envReflection' : this._environmentAmount };

	this._useDiffuseMap		= true;
	this._useNormalMap		= true;
	this._useSpecularMap	= true;
	this._useEnvironmentMap	= true;
	this._useLights			= [true, true, true, true];

    ///////////////////////////////////////////////////////////////////////
    // Material Property Accessors
    ///////////////////////////////////////////////////////////////////////
	this._propNames			= ["ambientColor",	"diffuseColor",		"specularColor",	"specularPower"	,	"diffuseMap",	"normalMap",	"specularMap",		"environmentMap",		"environmentAmount" ];
	this._propLabels		= ["Ambient Color",	"Diffuse Color",	"Specular Color",	"Specular Power",	"Texture Map",	"Bump Map",		"Specular Map",		"Environment Map",		"Environment Map Amount" ];
	this._propTypes			= ["color",			"color",			"color",			"float",			"file",			"file",			"file",				"file",					"float"		];
	this._propValues		= [];

	this._propValues[ this._propNames[0] ] = this._ambientColor.slice(0);
	this._propValues[ this._propNames[1] ] = this._diffuseColor.slice(0);
	this._propValues[ this._propNames[2] ] = this._specularColor.slice(0);
	this._propValues[ this._propNames[3] ] = this._specularPower;
	this._propValues[ this._propNames[4] ] = this._diffuseMapOb['texture'];
	this._propValues[ this._propNames[5] ] = this._normalMapOb['texture'];
	this._propValues[ this._propNames[6] ] = this._specularMapOb['texture'];
	this._propValues[ this._propNames[7] ] = this._environmentMapOb['texture'];
	this._propValues[ this._propNames[8] ] = this._environmentMapOb['envReflection'];

	this.setProperty = function( prop, value ) {
		if (prop == "color")  prop = "ambientColor";
		var valid = this.validateProperty( prop, value );
		if (valid) {
			this._propValues[prop] = value;

			switch (prop)
			{
				case "diffuseMap":
					this.updateDiffuseMap();
					break;
				case "normalMap":
					this.updateNormalMap();
					break;
				case "specularMap":
					this.updateSpecularMap();
					break;
				case "environmentMap":
					this.updateEnvironmentMap();
					break;
				case "environmentAmount":
					this.updateEnvironmentAmount( value );
					break;
				case "specularPower":
					this.updateSpecularPower( value );
					break;
				case "ambientColor":
					this.updateAmbientColor( value );
					break;
				case "diffuseColor":
					this.updateDiffuseColor( value );
					break;
				case "specularColor":
					this.updateSpecularColor( value );
					break;
			}
		}
	};
    ///////////////////////////////////////////////////////////////////////

	// define the 4 lights
	this._lights = [

		{
			'type' : 'point',                           // can be 'directional', 'point' or 'spot'
			'spotInnerCutoff' : 14.0,                   // fragments in the inner cutoff 'cone' are full intensity.
			'spotOuterCutoff' : 15.0,                   // fragments outside the outer cutoff 'cone' are unlit.
			'position' : [ 8.0, 2.0, 8.0 ],             // light position; ignored for directional lights
			'direction' : [ -1.0, -1.0, -1.0 ],         // light direction; ignored for point lights
			'attenuation' : [ 1.0, 0.025, 0.00125 ],    // light attenuation; constant, linear, quadratic 
			'diffuseColor' : [ 1.0, 0.5, 0.5, 1.0 ],    // diffuse light color
			'specularColor' : [ 1.0, 1.0, 1.0, 1.0 ]    // specular light color  
		},
		{
			'type' : 'point',
			'spotInnerCutoff' : 9.0,               
			'spotOuterCutoff' : 20.0,               
			'position' : [ -8.0, 2.0, 8.0 ],         
			'direction' : [ 1.0, -1.0, -1.0 ],
			'attenuation' : [ 1.0, 0.025, 0.00125 ],
			'diffuseColor' : [ 0.5, 1.0, 0.5, 1.0 ],
			'specularColor' : [ 1.0, 1.0, 1.0, 1.0 ]
		},
		{
			'type' : 'point',
			'spotInnerCutoff' : 9.0,               
			'spotOuterCutoff' : 20.0,               
			'position' : [ -8.0, 2.0, -8.0 ],
			'direction' : [ 1.0, -1.0, 1.0 ],
			'attenuation' : [ 1.0, 0.25, 0.0125 ], 
			'diffuseColor' : [ 0.5, 0.5, 1.0, 1.0 ],
			'specularColor' : [ 1.0, 1.0, 1.0, 1.0 ]
		},
		{
			'type' : 'point',
			'spotInnerCutoff' : 9.0,               
			'spotOuterCutoff' : 20.0,               
			'position' : [ 8.0, 4.0, -8.0 ],
			'direction' : [ -1.0, -1.0, 1.0 ],
			'attenuation' : [ 1.0, 0.25, 0.0125 ],
			'diffuseColor' : [ 1.0, 1.0, 0.5, 1.0 ],
			'specularColor' : [ 1.0, 1.0, 1.0, 1.0 ]
		}
	];

	this._ubershaderCaps =
	{
		// ubershader material properties. 
		'material' : {
			'ambientColor'    : this._ambientColor,    // material ambient color
			'diffuseColor'    : this._diffuseColor,    // material diffuse color
			'specularColor'   : this._specularColor,   // material specular color
			'specularPower'   : this._specularPower    // material specular power (shininess)
		},
 
		// ubershader supports up to four lights. 
		'lighting' : {
			'light0' : this._lights[0],
			'light1' : this._lights[1],
			'light2' : this._lights[2],        
			'light3' : this._lights[3]                                     
		},
    
		// uvTransform can be used to scale or offset the texture coordinates.
		'uvTransform' : [ 2.0, 0, 0, 0, 0, 2.0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
    
		// optional diffuse map
		'diffuseMap' : this._diffuseMapOb,
    
		// optional normal map
		'normalMap' : this._normalMapOb,
    
		// optional specular map
		'specularMap' : this._specularMapOb,
    
		// optional environment map
		'environmentMap' : this._environmentMapOb
	};

	this.updateAmbientColor = function() {
		this._ambientColor = this._propValues['ambientColor'].slice(0);
		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram.defaultTechnique;    
			technique.u_ambientColor.set(this._ambientColor);
		}
	};

	this.updateDiffuseColor = function() {
		this._diffuseColor = this._propValues['diffuseColor'].slice(0);

		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram.defaultTechnique;    
			technique.u_diffuseColor.set(this._diffuseColor);
		}
	};

	this.updateSpecularColor = function( value ) {
		this._specularColor = this._propValues['specularColor'];

		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram.defaultTechnique;    
			technique.u_specularColor.set(this._specularColor);
		}
	};

	this.updateSpecularPower = function( value) {
		this._specularPower = this._propValues['specularPower'];

		var material = this._materialNode;
		if (material)
		{
			var technique = material.shaderProgram.defaultTechnique;    
			technique.u_specularPower.set([this._specularPower]);
		}
	};

	this.updateEnvironmentAmount = function(value) {
		this._environmentMapOb.envReflectionAmount = value;

		var material = this._materialNode;
		if (material) {
			var technique = material.shaderProgram.defaultTechnique;
			technique.u_envReflection.set([this._environmentMapOb.envReflection]);
		}
	};

	this.updateEnvironmentMap = function() {
		var value = this._propValues[ "environmentMap" ];
		this._environmentMapOb.texture = value;

		if ((value == null) || (value.length == 0)) {
			if (this._useEnvironmentMap) {
				this._useEnvironmentMap = false;
				this.rebuildShader();
			}
		} else {
			if (!this._useEnvironmentMap) {
				this._useEnvironmentMap = true;
				this.rebuildShader();
			} else {
				var material = this._materialNode;
				if (material) {
					var technique = material.shaderProgram.defaultTechnique;
					var renderer = g_Engine.getContext().renderer;
					if (renderer && technique) {
						var tex = renderer.getTextureByName(value, caps.environmentMap.wrap);
						this.registerTexture( tex );
						technique.s_environmentMap.set( tex );
					}
				}
			}
		}
	};

	this.updateDiffuseMap = function(value) {
		var value = this._propValues[ "diffuseMap" ];
		this._diffuseMapOb.texture = value;

		if ((value == null) || (value.length == 0)) {
			if (this._useDiffuseMap) {
				this._useDiffuseMap = false;
				this.rebuildShader();
			}
		} else {
			if (!this._useDiffuseMap) {
				this._useDiffuseMap = true;
				this.rebuildShader();
			} else {
				var material = this._materialNode;
				if (material) {
					var technique = material.shaderProgram.defaultTechnique;
					var renderer = g_Engine.getContext().renderer;
					if (renderer && technique) {
						var tex = renderer.getTextureByName(value, caps.diffuseMap.wrap);
						this.registerTexture( tex );
						technique.s_diffuseMap.set( tex );
					}
				}
			}
		}
	};

	this.updateSpecularMap = function() {
		var value = this._propValues[ "specularMap" ];
		this._specularMapOb.texture = value;

		if ((value == null) || (value.length == 0)) {
			if (this._useSpecularMap) {
				this._useSpecularMap = false;
				this.rebuildShader();
			}
		} else {
			if (!this._useSpecularMap) {
				this._useSpecularMap = true;
				this.rebuildShader();
			} else {
				var material = this._materialNode;
				if (material) {
					var technique = material.shaderProgram.defaultTechnique;
					var renderer = g_Engine.getContext().renderer;
					if (renderer && technique) {
						var tex = renderer.getTextureByName(value, caps.specularMap.wrap);
						this.registerTexture( tex );
						technique.s_specularMap.set( tex );
					}
				}
			}
		}
	};

	this.updateNormalMap = function(value) {
		var value = this._propValues[ "normalMap" ];
		this._normalMapOb.texture = value;

		if ((value == null) || (value.length == 0)) {
			if (this._useNormalMap) {
				this._useNormalMap = false;
				this.rebuildShader();
			}
		} else {
			if (!this._useNormalMap) {
				this._useNormalMap = true;
				this.rebuildShader();
			} else {
				var material = this._materialNode;
				if (material) {
					var technique = material.shaderProgram.defaultTechnique;
					var renderer = g_Engine.getContext().renderer;
					if (renderer && technique) {
						var tex = renderer.getTextureByName(value, caps.normalMap.wrap);
						this.registerTexture( tex );
						technique.s_normalMap.set( tex );
					}
				}
			}
		}
	};
	
	// duplcate method requirde
	this.dup = function() {
		// allocate a new uber material
		var newMat = new UberMaterial();

		newMat._useDiffuseMap = this._useDiffuseMap;
		newMat._useEnvironmentMap = this._useEnvironmentMap;
		newMat._useLights = this._useLights;
		newMat._useNormalMap = this._useNormalMap;
		newMat._useSpecularMap = this._useSpecularMap;
		newMat.rebuildShader();

		// copy over the current values;
		var propNames = [],  propValues = [],  propTypes = [],  propLabels = [];
		this.getAllProperties( propNames,  propValues,  propTypes,  propLabels);
		var n = propNames.length;
		for (var i=0;  i<n;  i++)
			newMat.setProperty( propNames[i], propValues[i] );

		return newMat;
	};

	this.init = function( world )
	{
		// save the world
		if (world)  this.setWorld( world );

		// set up the shader
		this._shader = this.buildUberShader( this._ubershaderCaps );

		// set up the material node
		this._materialNode = createMaterialNode("uberMaterial");
		this._materialNode.setShader(this._shader);
	};

	this.buildUberShader = function(caps)
	{
		var preproc = "";
		var paramBlock = {};
   
		paramBlock['u_uvMatrix'] = { 'type' : 'mat4' };    
    
		if (typeof caps.material != 'undefined') {
			preproc += '#define MATERIAL\n';   
			paramBlock['u_ambientColor'] = { 'type' : 'vec4' };
			paramBlock['u_diffuseColor'] = { 'type' : 'vec4' };
			paramBlock['u_specularColor'] = { 'type' : 'vec4' };
			paramBlock['u_specularPower'] = { 'type' : 'float' };
		}
		if (typeof caps.lighting != 'undefined') {
			preproc += '#define LIGHTING\n';
			preproc += '#define SPECULAR\n';
			for(var i = 0; i < 4; ++i) {
				var light = caps.lighting['light' + i];
				var t;
				if (typeof light != 'undefined') {
					switch(light.type) {
						case 'directional'  : t = 0;    break;
						case 'point'        : t = 1;    break;
						case 'spot'         : t = 2;    break;
					}
					preproc += '#define LIGHT_'+i+' '+t+'\n';
					preproc += '#define LIGHT_'+i+'_SPECULAR\n';
					if(t == 0 || t == 2) {
						paramBlock['u_light'+i+'Dir'] = { 'type' : 'vec3' };
					}
					if(t == 2) {
						paramBlock['u_light'+i+'Spot'] = { 'type' : 'vec2' };
					}			       
					paramBlock['u_light'+i+'Pos'] = { 'type' : 'vec3' };
					paramBlock['u_light'+i+'Color'] = { 'type' : 'vec4' };
					paramBlock['u_light'+i+'Atten'] = { 'type' : 'vec3' };
					paramBlock['u_light'+i+'Specular'] = { 'type' : 'vec4' };            
				}        
			}
		}

		if(typeof caps.diffuseMap != 'undefined') {
			preproc += '#define DIFFUSE_MAP\n';
			paramBlock['s_diffuseMap'] = { 'type' : 'tex2d' };
		}

		if(typeof caps.normalMap != 'undefined') {
			preproc += '#define NORMAL_MAP\n';
			paramBlock['s_normalMap'] = { 'type' : 'tex2d' };
		}

		if(typeof caps.specularMap != 'undefined') {
			preproc += '#define SPECULAR_MAP\n';
			paramBlock['s_specMap'] = { 'type' : 'tex2d' };
		}

		if(typeof caps.environmentMap != 'undefined') {
			preproc += '#define ENVIRONMENT_MAP\n';
			paramBlock['s_envMap'] = { 'type' : 'tex2d' };
			paramBlock['u_envReflection'] = { 'type' : 'float' };
		}

		// load the shaders as text
		var uberVShader,  uberFShader;
		var r = new XMLHttpRequest();
		r.open('GET', "assets/shaders/ub_vshader.glsl", false);
		r.send(null);
		if (r.status == 200) {
			uberVShader = r.responseText;
		}

		r.open('GET', "assets/shaders/ub_fshader.glsl", false);
		r.send(null);
		if (r.status == 200) {
			uberFShader = r.responseText;
		}
    
		// prefix preprocessor settings
		var vshader = preproc + uberVShader; 
		var fshader = preproc + uberFShader;

		// build output jshader  
		var uberJShader = new jshader();
		uberJShader.def = {
			'shaders': {
				'defaultVShader': vshader,				
				'defaultFShader': fshader
			},
			'techniques': { 
				'defaultTechnique': [{
					'vshader' : 'defaultVShader',
					'fshader' : 'defaultFShader',
					'attributes' : {
						'a_pos' : { 'type' : 'vec3' },
						'a_normal' : { 'type' : 'vec3' },
						'a_texcoord' : { 'type' : 'vec2' }
					},
					'params' : paramBlock,
					 'states' : {	
						'depthEnable' : true,
						'blendEnable' : false,
						'culling' : true,
						'cullFace' : "FRONT"
					 }
				}]
			}												
		};
		// initialize the jshader
		try
		{
			uberJShader.init();
		}
		catch(e)
		{
			console.log( "error initializing the uber shader: " + e );
		}
	
		// initialize shader parameters
		var technique = uberJShader.defaultTechnique;
		if (typeof caps.material != 'undefined') {
			technique.u_ambientColor.set(caps.material.ambientColor);
			technique.u_diffuseColor.set(caps.material.diffuseColor);
			technique.u_specularColor.set(caps.material.specularColor);
			technique.u_specularPower.set([ caps.material.specularPower ]);
		}

		if (typeof caps.lighting != 'undefined') {
			for(i = 0; i < 4; ++i) {
				var light = caps.lighting["light" + i];
				if( typeof light != "undefined") {
					if(light.type == 'directional') {
						paramBlock['u_light'+i+'Dir'] = { 'type' : 'vec3' };
						technique['u_light'+i+'Dir'].set(light['direction'] || [ 0, 0, 1 ]);
					} else if(light.type == 'spot') {
						paramBlock['u_light'+i+'Spot'] = { 'type' : 'vec2' };
						technique['u_light'+i+'Pos'].set(light['position'] || [ 0, 0, 0 ]);
						var deg2Rad = Math.PI / 180;
						technique['u_light'+i+'Spot'].set([ Math.cos( ( light['spotInnerCutoff'] || 45.0 )  * deg2Rad ), 
															Math.cos( ( light['spotOuterCutoff'] || 90.0 ) * deg2Rad )]);
						technique['u_light'+i+'Atten'].set(light['attenuation'] || [ 1,0,0 ]);                
					} else {
						technique['u_light'+i+'Pos'].set(light['position'] || [ 0, 0, 0 ]);                        
						technique['u_light'+i+'Atten'].set(light['attenuation'] || [ 1,0,0 ]);                
					}
					technique['u_light'+i+'Color'].set(light['diffuseColor'] || [ 1,1,1,1 ]);
					technique['u_light'+i+'Specular'].set(light['specularColor'] || [ 1, 1, 1, 1 ]);           
				}
			}
		}
		technique.u_uvMatrix.set(caps.uvTransform || mat4.identity());
	
		var renderer = g_Engine.getContext().renderer;
		if(this._useDiffuseMap) {
			var tex = renderer.getTextureByName(caps.diffuseMap.texture, caps.diffuseMap.wrap, caps.diffuseMap.mips);
			this.registerTexture( tex );
			technique.s_diffuseMap.set( tex );
		}

		if(this._useNormalMap) {
			var tex = renderer.getTextureByName(caps.normalMap.texture, caps.normalMap.wrap, caps.normalMap.mips);
			this.registerTexture( tex );
			technique.s_normalMap.set( tex );
		}

		if(this._useSpecularMap) {
			var tex = renderer.getTextureByName(caps.specularMap.texture, caps.specularMap.wrap);
			this.registerTexture( tex );
			technique.s_specMap.set( tex );
		}

		if(this._useEnvironmentMap) {
			var tex = renderer.getTextureByName(caps.environmentMap.texture, caps.environmentMap.wrap);
			this.registerTexture( tex );
			technique.s_envMap.set( tex );
			technique.u_envReflection.set([ caps.environmentMap.envReflection || 1.0 ] );
		}

		return uberJShader;
	};

	this.rebuildShader = function() {
		this._ubershaderCaps['material']['ambientColor'] = this._ambientColor;
		this._ubershaderCaps['material']['diffuseColor'] = this._diffuseColor;
		this._ubershaderCaps['material']['specularColor'] = this._specularColor;
		this._ubershaderCaps['material']['specularPower'] = this._specularPower;
		var useDiffuse = this._useDiffuseMap;
		if( !useDiffuse ) {
			if( typeof this._ubershaderCaps['diffuseMap'] != 'undefined' ) {
				delete this._ubershaderCaps['diffuseMap'];
            }
		} else {
			this._ubershaderCaps['diffuseMap'] = this._diffuseMapOb;
        }
    
		var useNormal = this._useNormalMap;    
		if( !useNormal ) {
			if( typeof this._ubershaderCaps['normalMap'] != 'undefined' ) {
				delete this._ubershaderCaps['normalMap'];
            }
		} else {
			this._ubershaderCaps['normalMap'] = this._normalMapOb;
        }

		var useSpecular = this._useSpecularMap;    
		if( !useSpecular ) {
			if( typeof this._ubershaderCaps['specularMap'] != 'undefined' ) {
				delete this._ubershaderCaps['specularMap'];
            }
		} else {
			this._ubershaderCaps['specularMap'] = this._specularMapOb;
        }
       
		var useEnvironment = this._useEnvironmentMap;    
		if( !useEnvironment ) {
			if( typeof this._ubershaderCaps['environmentMap'] != 'undefined' ) {
				delete this._ubershaderCaps['environmentMap'];
            }
		} else {
			this._ubershaderCaps['environmentMap'] = this._environmentMapOb;
        }
    
		for( i = 0; i < 4; ++i ) {
			var useLight = this._useLights[i];  
			if( !useLight ) {
				if( typeof this._ubershaderCaps['lighting']['light'+i] != 'undefined' ) {
					delete this._ubershaderCaps['lighting']['light'+i];
                }
			} else {
				this._ubershaderCaps['lighting']['light'+i] = this._lights[i];
            }
		}
        
		var material = this._materialNode;  
		if (material) {
			material.setShader( buildUbershader(this._ubershaderCaps) );
        }
	};
};

UberMaterial.prototype = new Material();

if (typeof exports === "object") {
    exports.UberMaterial = UberMaterial;
}