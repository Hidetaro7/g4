function App () {
	var box_css = "", text_css = "", icon_css = "";
	var button = $("#button");
	var icon_tag = $("#icon_1");

	$.support.cors = true;

	$("h1 label input[type=checkbox]").on("click", function () {
		var wrapsection = $(this).closest("section");
		if(!this.checked) {
			wrapsection.addClass("hide_params")
		}else{
			wrapsection.removeClass("hide_params")
		}
	})

	var color_picker_arr = $(".icon_color_picker").colorPicker({
		renderCallback: function (elm, toggled) {
			//console.log($(elm).closest(".uis")[0].id)
			if(elm[0].id === "artboard") return false;
			var ev = new Event("changeColor");
			ev.color = elm.text;
			ev.id = elm[0].id;
			ev.target = elm[0];
			ev.category = $(elm).closest(".uis")[0].id;
			//console.log(event)
			if(ev.color != "" && ev.id != "" && ev.category !="") {
				//if(!event) {
					window.dispatchEvent(ev)
				//}
			}
		},
		buildCallback: function (elm) {
		}
	});

	arguments.callee.color_picker_arr = color_picker_arr;
	arguments.callee.findPickerFromId = function (_id) {
		for (var i=0; i<color_picker_arr.length; i++) {
			if(color_picker_arr[i].id === _id) {
				return color_picker_arr[i];
			}
		}
	}
	
	arguments.callee.color2rgba = function (_color, _opacity) {
		_opacity /= 100;
		if(_opacity === 1) {
			return _color
		} else {
			var color = _color.replace("#","");
			var r = parseInt(color.substring(0,2), 16)
			var g = parseInt(color.substring(2,4), 16)
			var b = parseInt(color.substring(4,6), 16)
			return "rgba("+r+","+g+","+b+","+_opacity+")";
		}
	}

	arguments.callee.changeButton = function (_obj) {
		ButtonDesignEngine.changeProp(_obj.data.btn)
		TextDesignEngine.changeProp(_obj.data.txt)
		//"<a class="btn_59" href="#"><i class="fa fa-jpy"></i>500</a>"
		var ctt = $(_obj.html).find("i")[0].className
		//console.log(_obj)
		$("#icon_1").prop("class", ctt);
		$("#button").find("span").text($(_obj.html).text());
		outputCSS();
		$("#html_code code").text(_obj.html.replace(/btn_\d+/, "btn"));
	}
	
	arguments.callee.forceRender = function (_css) {
		outputCSS();
	}
	arguments.callee.setButtonCSS = function (_css) {
		box_css = _css;
		outputCSS();
	}
	arguments.callee.setTextCSS = function (_css, _icon_css) {
		icon_css = _icon_css;
		text_css = _css;
		outputCSS();
	}
	arguments.callee.setHTML = function () {
		outputHTML()
	}
	arguments.callee.BASE_URL = "http://grad4.tuqulore.com/";
	arguments.callee.selectedIconName = "";

	/*arguments.callee.galleryClicked = function (_html, _css, _id) {
		//CSS分解

	}
	App.galleryClicked({
		css: ".btn_39 {display: inline-block;background-image: linear-gradient(0deg,  rgb(0, 0, 0), rgb(54, 42, 42));border-radius: 68px;padding:0.1em 0.3em;text-decoration: none;line-height: 1;color: #ffffff;font-size: 1em;font-weight: normal;font-family: sans-serif;text-shadow:0px 1px 0px rgb(0, 0, 0);}.btn_39 i {font-size: 2.5em;margin-left: 0em;}",
		html: '<a class="btn_39" href="#"><i class="fa fa-github"></i></a>',
		id: 39
	})
	//gallery_test
*/
	function outputCSS () {
		var css = box_css + text_css;
		button.attr("style", css);
		if(icon_css != "") {
			icon_tag.attr("style", icon_css)
		}else{
			icon_tag.removeAttr("style")
		}
		var code = "&nbsp;&nbsp;" + css.replace(/;/g, ";<br>&nbsp;&nbsp;<span class='cc_2'>");
		code = code.replace(/:/g, "</span>:")
		code = "<span class='cc_1'>.btn</span><span class='cc_2'> {<br>" + code + "}";
		if(icon_tag.attr("class") != "fa") {
			var icode = "&nbsp;&nbsp;" + icon_css.replace(/;/g, ";<br>&nbsp;&nbsp;<span class='cc_2'>");
			icode = icode.replace(/:/g, "</span>:")
			icode = "<br><span class='cc_1'>.btn i</span> {<br><span class='cc_2'>" + icode + "}";
			code += icode;
		}
		$("#css_code .wrap").html(code)
	}

	function outputHTML () {
		var content = button.find("span").text();
		var iclass = button.find("i").attr("class");
		var code = '&lt;a class="btn" href="#"&gt;';
		var icode = (TextDesignEngine.iconEnabled()) ? '&lt;i class="'+iclass+'"&gt;&lt;/i&gt;': "";
		if(TextDesignEngine.getIconSide() === "left") {
			code += icode + content + '&lt;/a&gt;'
		}else{
			code += content + icode + '&lt;/a&gt;'
		}
		$("#html_code .wrap").html(code)
	}

	(function codeClickSelect () {
		$(".code_wrapper code").on("click", function (e) {
			var range = document.createRange();
			range.selectNodeContents(e.target);
			var selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		})
	})()


}
App()