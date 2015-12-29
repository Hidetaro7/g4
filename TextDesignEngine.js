function TextDesignEngine () {
	var props = {
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
	arguments.callee.getIconSide = function () {
		return props.icon.side;
	}
	arguments.callee.iconEnabled = function () {
		return props.icon.enable;
	}
	arguments.callee.changeEnableIcon = function (_b) {
		//強制アイコン使用可能に
		props.icon.enable = _b;
		$("#icon_enable").prop("checked",true)
		$("#icon_only_setting").removeClass("hide_params")
		setPreview();
	}
	var button = $("#button");
	var ui = $("#text_ui");
	var icon_ui = $("#icon_only_setting")
	var css = "";
	var icon_css = "";
	var icon_tag = $("#icon_1");

	function init () {
		ui.find("input").on("input", changeValue)
		ui.find("input[type=checkbox],input[type=radio],select").on("change", changeValue)
		// colorpickerのcustomevent, listen
		window.addEventListener("changeColor", function (e){
			if(e.category === "text_ui") {
				var id_arr = e.id.split("_");
				props[id_arr[0]][id_arr[1]] = e.color;
				setPreview();
			}
		})
		
		icon_ui.find("input").on("input", changeValue)
		icon_ui.find("input[type=checkbox],input[type=radio]").on("change", changeValue )
		App.setHTML();

	}
	function changeValue () {
		var prop1, prop2;
		var id_arr = this.id.split("_");
		var _this = this;
		prop1 = id_arr[0], prop2 = id_arr[1]
		props[prop1][prop2] = (this.type.match(/checkbox/ig)) ? (function () {
			return _this.checked;
		})() : this.value
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
		css = "text-decoration: none;line-height: 1;";
		icon_css = "";
		for(var i in props) {
			switch(i) {
				case "font":
					css += "color: " + App.color2rgba(props.font.color, props.font.opacity) + ";"
					css += "font-size: " + props.font.size + "em;"
					css += "font-weight: " + (function () { return props.font.bold ? "bold" : "normal"})() + ";"
					css += "font-family: " + props.font.fontfamily + ";"
				break;
				case "textshadow":
					if(props[i].enable) {
						css += "text-shadow:" + props.textshadow.x + "px " + props.textshadow.y + "px " + props.textshadow.blur + "px " + App.color2rgba(props.textshadow.color, props.textshadow.opacity) + ";";
					}
					setHideParams($("#textshadow_enable"), props[i].enable)
				break;
				case "icon": 
					//console.log(App.selectedIconName)
					//var icontag = $("#icon_1");
					if(props[i].enable) {
						if(App.selectedIconName === "") {
							icon_tag.addClass("fa")
						}
						//buttonからiを追加
						//icon_css += "vertical-align: middle;"
						var marginside = props.icon.side === "right" ? "left" : "right"
						icon_css += "font-size: " + props.icon.size + "em;"
						icon_css += "margin-" + marginside + ": " + props.icon.margin + "em;"
						// move to side
						if(props.icon.side === "left") {
							icon_tag.prependTo("#button");
						}else{
							icon_tag.appendTo("#button");
						}
						App.setHTML()
						icon_tag.attr("title", "show")
					} else {
						if(App.selectedIconName === "") {
							icon_tag.attr("class", "fa")
						}
						App.setHTML()
						//buttonからiを削除
						icon_tag.attr("title", "")
					}
					setHideParams($("#icon_enable"), props[i].enable)
						//console.log(icon_tag[0].rel)
				break;
			}
		}
		
		App.setTextCSS(css, icon_css)
	}
	function outputCSS () {
		var code = css.replace(/;/g, ";<br>");
		$("#css_code .wrap").html(code)
	}

	arguments.callee.changeProp = function (_props) {
		props = _props;
		setPreview()
	}

	init()
	setPreview()
}


TextDesignEngine()