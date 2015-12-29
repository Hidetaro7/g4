function ButtonDesignEngine () {
	var props = {
		grad: {
			enable: true,
			type: "linear", // or radial
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
			enable: false,
			color: "#333",
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
	var button = $("#button");
	var ui = $("#button_ui");
	var ui_grad_bar = $("#ui_grad_bar");
	var css = "";
	var cp1 = App.findPickerFromId("grad_colorStopColor1")
	var cp2 = App.findPickerFromId("grad_colorStopColor2")
	var cp_bd = App.findPickerFromId("border_color")//border colorpicker
	var cp_sd = App.findPickerFromId("shadow_color")//shadow colorpicker
	var btn_reverse = $("#btn_reverse")
	
	function init () {
		ui.find("input").on("input", changeValue)
		ui.find("input[type=checkbox],input[type=radio]").on("change", changeValue)
		// colorpickerのcustomevent, listen
		window.addEventListener("changeColor", function (e){
			if(e.category === "button_ui") {
				var id_arr = e.id.split("_");
				props[id_arr[0]][id_arr[1]] = e.color;
				setPreview();
			}
		})
		btn_reverse.on("click", colorReversed)
		
	}

	function changeValue () {
		if(!this.id) return; // HSVは除外したいのでid持っていないinput要素を除外
		var prop1, prop2;
		var id_arr = this.id.split("_");
		var _this = this;
		prop1 = id_arr[0]
		prop2 = id_arr[1]
		//console.log( this.id)
		props[prop1][prop2] = (this.type.match(/checkbox|radio/ig)) ? (function () {
			if(_this.id.match(/enable/ig)) { return _this.checked }
				else {return _this.value}
		})() : this.value
		setPreview()
	}

	function colorReversed () {
		// do reversed
		var c1 = $.extend(true, {}, {"c":props.grad.colorStopColor1, "o":props.grad.colorStopOpacity1});
		var c2 = $.extend(true, {}, {"c":props.grad.colorStopColor2, "o":props.grad.colorStopOpacity2});
		props.grad.colorStopColor1 = c2.c;
		props.grad.colorStopOpacity1 = c2.o;
		props.grad.colorStopColor2 = c1.c;
		props.grad.colorStopOpacity2 = c1.o;
		setPreview()
	}

	function setPreview () {
		var setHideParams = function (jqo, bool) {
			//hide_params
			jqo.prop("checked", bool)
			var hidewrap = jqo.closest("section")
			if(bool) {
				hidewrap.removeClass("hide_params")
			}else{
				hidewrap.addClass("hide_params")
			}
		}
		css = "display: inline-block;";
		for(var i in props) {
			switch(i) {
				case "border":
					if(props[i].enable) {
						css += "border:" + props.border.width + "px " + "solid " + App.color2rgba(props.border.color, props.border.opacity) + ";"
					}
					setHideParams($("#border_enable"), props[i].enable)
					cp_bd.style.backgroundColor = props.border.color;
					cp_bd.value = props.border.color.replace(" ", "");
				break;

				case "shadow":
					if(props[i].enable) {
						css += "box-shadow:" + props.shadow.x + "px " + props.shadow.y + "px " + props.shadow.blur + "px " + App.color2rgba(props.shadow.color, props.shadow.opacity) + ";";
					}
					setHideParams($("#shadow_enable"), props[i].enable)
				break;

				case "radius":
					if(props[i].enable) {
						var v = props.radius.value;
						var tp = props.radius.type;
						//console.log(tp)
						if(tp === "all") {
							css += "border-radius: "+v+"px;";
							$("#radius_type_all").prop("checked", true)
						} else if (tp === "upper") {
							css += "border-radius: "+v+"px "+v+"px 0 0;";
							$("#radius_type_upper").prop("checked", true)
						} else if (tp === "lower") {
							css += "border-radius: 0 0 "+v+"px "+v+"px;";
							$("#radius_type_lower").prop("checked", true)
						}
						// ui set
						$("#radius_value").val(v);
					}
					setHideParams($("#radius_enable"), props[i].enable)
				break;

				case "padding":
						css += "padding:" + props.padding.vertical + "em " + props.padding.horizontal + "em;";
				break;

				case "grad":
					var gt = props.grad.type;
					var x = props.grad.x;
					var y = props.grad.y;
					var rotation = props.grad.rotation;
					var cs1c = App.color2rgba(props.grad.colorStopColor1, props.grad.colorStopOpacity1)
					var cs2c = App.color2rgba(props.grad.colorStopColor2, props.grad.colorStopOpacity2)

					cp1.style.backgroundColor = cs1c;
					cp2.style.backgroundColor = cs2c;
					cp1.value = cs1c.replace(" ", "");
					cp2.value = cs2c.replace(" ", "");

					var radius = props.grad.radius;
					var grad_code;
					if(gt === "linear") {
						$("#params_gradient").removeClass("radial_type")
						grad_code = "background-image: " + gt + "-gradient(" + rotation + "deg, " + cs1c + ", " + cs2c + ");"
					} else {//radial
						$("#params_gradient").addClass("radial_type")
						grad_code = "background-image: " + gt + "-gradient("+ radius +"px at " + x + "% " + y + "%, " + cs1c + ", " + cs2c + ");"
					}
					css += grad_code;
					ui_grad_bar.attr("style", "background-image: linear-gradient(to right, "+cs1c+", "+cs2c+")");
				break;

			}
		}
		//console.log(props)
		App.setButtonCSS(css)
	}

	function outputCSS () {
		var code = css.replace(/;/g, ";<br>");
		$("#css_code .wrap").html(code)
	}

	arguments.callee.changeGrad = function (obj) {
		//console.log(obj)
		props.grad.colorStopColor1 = obj.cs1
		props.grad.colorStopOpacity1 = 100
		props.grad.colorStopColor2 = obj.cs2
		props.grad.colorStopOpacity2 = 100
		setPreview(css)
		//var cp1 = $(App.color_picker_arr)//.find("#grad_colorStopColor1")
		//console.log(cp1)
		/*var ev = new Event("changeGradFromColorSample");
		ev.cp1 = obj.cs1
		window.dispatchEvent(ev)*/
		cp1.style.backgroundColor = obj.cs1;
		cp2.style.backgroundColor = obj.cs2;
		cp1.value = obj.cs1.replace(" ", "");
		cp2.value = obj.cs2.replace(" ", "");
		//console.log("cg")
	}

	arguments.callee.changeProp = function (_props) {
		props = _props;
		setPreview()
	}

	init()
	setPreview()
}

ButtonDesignEngine()