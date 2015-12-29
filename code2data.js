 function code2Data (data) {
	//CSS分解
	var c1 = data.css.replace(/{|}/g, "").replace(/: /g, ":").replace(/, +/g, ",").split(/.btn_\w+ /ig);
	//var ButtonDesign = c1[1].split(";");
	var fSnakeToCamel = function(p){
        //_+小文字を大文字にする(例:_a を A)
        return p.replace(/-./g,
            function(s) {
                return s.charAt(1).toUpperCase();
            }
        );
    };
	var button_props = {
		grad: {
			enable: true,
			type: (c1.indexOf("linear-gradient") != -1) ? "radial" : "linear",
			x: 50,
			y: 50,
			colorStopColor1: "#bc0000",
			colorStopOpacity1: 100,
			colorStopColor2: "#ff0000",
			colorStopOpacity2: 100,
			rotation: 0,
			radius: 100
		},
		border: {
			enable: true,
			color: "#cccccc",
			opacity: 100,
			width: 1
		},
		shadow: {
			enable: false,
			x: 0,
			y: 1,
			blur: 2,
			inset: false,
			color: "#cccccc",
			opacity: 100
		},
		radius: {
			enable: true,
			type: "all", // or upper, lower
			value: 3
		},
		padding: {
			vertical: .8,
			horizontal: 1.6
		}
	}
	var text_props = {
		font: {
			color: "#ffffff",
			opacity: 100,
			size: 1.0,
			bold: true,
			fontfamily: "sans-serif"
		},
		textshadow: {
			enable: false,
			x: 0,
			y: 1,
			blur: 2,
			color: "#cccccc",
			opacity: 100
		},
		icon: {
			enable: false,
			size: 1.0,
			margin: .2,
			side: "left"
		}
	}
	
	var ButtonDesign = c1[1].split(";")
	var resButtonDesign = {}
	for (var i=0; i<ButtonDesign.length; i++) {
		if(ButtonDesign[i] != "") {
			var propval = ButtonDesign[i].split(":")
			var key = fSnakeToCamel(propval[0]);
			var val = propval[1];
			resButtonDesign[key] = val
		}
	}

	var IconC1 = c1[2]

	var pgg = resButtonDesign.backgroundImage;
	var bgrd = pgg.split("gradient(")[1]
	button_props.grad.type = pgg.match(/radial|linear/g)[0];
	button_props.grad.rotation = Number(bgrd.substring( 0, bgrd.indexOf("deg")));//Number(bgrd.match(/\w+deg/)[0].replace("deg", ""));
	//
	// gradient colorstop
	bgrd = bgrd.substring( 0, bgrd.length-1 )
	var colors = bgrd.split(/,r|,#/);
	var c2 = colors[colors.length-1];
	var c1 = colors[colors.length-2];
	button_props.grad.colorStopColor1 = getValidColorCode(c1);
	button_props.grad.colorStopColor2 = getValidColorCode(c2);

	//console.log(button_props.grad.colorStopColor1)
	function getValidColorCode (col) {
		if(col.indexOf("gb")!=-1) { return "r" + col.replace(/ /g, ""); } else { return "#" + col.replace(/ /g, ""); } }
	button_props.grad.colorStopOpacity1 = getOpacity(button_props.grad.colorStopColor1);
	button_props.grad.colorStopOpacity2 = getOpacity(button_props.grad.colorStopColor2);
	function getOpacity (col) {
		var op = col.split(",")[3];
		if(op) { return Number(op.replace(")", ""))*100; } else { return 100 }
	}
	//grad radius
	var rd = (bgrd.match(/\w+px/g));
	button_props.grad.radius = !rd ? 0 : Number(rd[0].replace("px", ""));
	// grad position x, y
	var pos = (bgrd.match(/\w+%/g));
	if(pos!=null) {
		button_props.grad.x = Number(pos[0].replace("%",""));
		button_props.grad.y = Number(pos[1].replace("%",""));
	}

	
	// border
	var bd = resButtonDesign.border
	if(bd) {
		button_props.border.width = Number(bd.match(/\w+px/g)[0].replace("px",""));
		var bdc = bd.replace(/\w+px solid /, "")
		button_props.border.color = bdc;
		button_props.border.opacity = getOpacityFromrgba(bdc)
		button_props.border.enable = true
	} else {
		button_props.border.enable = false
	}
	//console.log(resButtonDesign.border)

	function getOpacityFromrgba(_rgba) {
		_rgba = _rgba.replace(/rgba\(|rgb\(|\)/g, "");
		var op = _rgba.split(",")
		return op[3] ? op[3]*100 : 100
	}
	
	// padding
	var pad = resButtonDesign.padding
	var padd = pad.split(" ");
	button_props.padding.vertical = Number(padd[0].replace("em", ""))
	button_props.padding.horizontal = Number(padd[1].replace("em", ""))

	// box-shadow
	var sd = resButtonDesign.boxShadow;
	if(sd) {
		var bsd = sd.split(" ");
		button_props.shadow.x = Number(bsd[0].replace("px", ""));
		button_props.shadow.y = Number(bsd[1].replace("px", ""));
		button_props.shadow.blur = Number(bsd[2].replace("px", ""));
		button_props.shadow.color = bsd[3]
		button_props.shadow.opacity = getOpacityFromrgba(bsd[3])
		button_props.shadow.enable = true
	}else{
		button_props.shadow.enable = false
	}

	// radius
	var rd = resButtonDesign.borderRadius
	if(rd) {
		if(rd.indexOf(" ") != -1) {
			if(rd.charAt(0) != 0) {
				button_props.radius.type = "upper"
				button_props.radius.value = Number(rd.split(" ")[0].replace("px", ""))
			}else{
				button_props.radius.type = "lower"
				button_props.radius.value = Number(rd.split(" ")[2].replace("px", ""))
			}
		}else{
			button_props.radius.value = Number(rd.replace("px", ""))
			button_props.radius.type = "all"
		}
		button_props.radius.enable = true
	}else{
		button_props.radius.enable = false
	}

	//text font 
	text_props.font.size = Number(resButtonDesign.fontSize.replace("em", ""));
	text_props.font.bold = resButtonDesign.fontWeight === "normal" ? false : true;
	text_props.font.fontfamily = resButtonDesign.fontFamily;
	text_props.font.color = resButtonDesign.color;
	text_props.font.opacity = getOpacityFromrgba(resButtonDesign.color)

	// textshadow
	var ts = resButtonDesign.textShadow
	if(ts) {
		var bsd = ts.split(" ");
		text_props.textshadow.x = Number(bsd[0].replace("px", ""));
		text_props.textshadow.y = Number(bsd[1].replace("px", ""));
		text_props.textshadow.blur = Number(bsd[2].replace("px", ""));
		text_props.textshadow.color = bsd[3]
		text_props.textshadow.opacity = getOpacityFromrgba(bsd[3])
		text_props.textshadow.enable = true
	}else{
		text_props.textshadow.enable = false
	}

	// icon init 
	if(!IconC1) {
		text_props.icon.enable = false
	} else {
		text_props.icon.enable = true
		var IconDesign = IconC1.replace("i ", "").split(";")
		var resIconDesign = {};
		for (var i=0; i<IconDesign.length; i++) {
			if(IconDesign[i] != "") {
				var propval = IconDesign[i].split(":")
				var key = fSnakeToCamel(propval[0]);
				var val = propval[1];
				resIconDesign[key] = val
			}
		}

		// icon size
		console.log(resIconDesign)
		text_props.icon.size = resIconDesign.fontSize.replace(/em/g, "");
		//icon margin
		if(resIconDesign.marginLeft) {
			text_props.icon.margin = Number(resIconDesign.marginLeft.replace("em",""))
			text_props.icon.side = "right";
		}else{
			text_props.icon.margin = Number(resIconDesign.marginRight.replace("em",""))
			text_props.icon.side = "left";
		}
		
	}
	
	//console.log(text_props.icon)
	return {"btn": button_props, "txt": text_props}
}