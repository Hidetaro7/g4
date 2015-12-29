function ColorSample () {
	
	var hue_bar = $(".hue_bar");
	var hue_handle = $(".hue_handle");
	var hue_bar_wrapper = $(".hue_bar_wrapper");
	var is_dragging = false
	var bar_width = hue_bar.width();
	var saturation_bar = $(".saturation_bar");
	var lightness_bar = $(".lightness_bar");
	var current_hue = 0;
	var current_saturation = 100;
	var current_lightness = 50;
	var sample_list = $(".sample_list")
	var sample_list_num = $(".sample_list li").size()

	window.addEventListener("mouseup", function (e) {
		is_dragging = false;
	}, false)

	saturation_bar.on("input", function () {
		//console.log(this.value)
		current_saturation = this.value;
		changeHue()
		if($(".sample_list li.selected").size() != 0) {
			changeGrad2Button($(".sample_list li.selected")[0]);
		}
	})
	
	lightness_bar.on("input", function () {
		current_lightness = this.value;
		changeHue()
		if($(".sample_list li.selected").size() != 0) {
			changeGrad2Button($(".sample_list li.selected")[0]);
		}
	})

	function hue_bar_settings () {
		hue_bar_wrapper.on("mousedown", HueOnMouseDown)
		window.addEventListener("mousemove", HueOnMouseMove, false)
		function HueOnMouseDown (e) {
			is_dragging = true;
			HueOnMouseMove(e)
		}
		function HueOnMouseMove (e) {
			if(is_dragging) {
				var pos = getElementPosition(e)
				if(pos.x < 0) pos.x = 0;
				if(pos.x > bar_width) pos.x = bar_width;
				hue_handle.css("left", pos.x)
				current_hue = Math.round(pos.x / bar_width * 360)
				changeHue()
				if($(".sample_list li.selected").size() != 0) {
					changeGrad2Button($(".sample_list li.selected")[0]);
				}
			}
		}
	}
	hue_bar_settings()


	function changeHue () {
		//console.log(current_hue)
		sample_list.find("li").each(function (i, v) {
			/*var _x = 100 - (i%10*10)
			var _y = 100 - (Math.floor(i/10)*10)*/
			//sample_list_num
			var _x = 100/sample_list_num * i
			var _y = 100/sample_list_num * i
			var _s =  ((i+1) / sample_list_num *30)
			//console.log( _s)
			var h = current_hue
			//$(this).css("background-color", "hsl("+current_hue+","+_x+"%,"+_y+"%"+")")
			var cs2 = "hsl("+h+", "+(current_saturation)+"%, "+(current_lightness - _s)+"%)";
			var cs1 = "hsl("+h+", "+current_saturation+"%, "+current_lightness+"%)";
			//console.log(cs2, cs1)
			$(this).css("background-image", "linear-gradient("+cs1+", "+cs2+")")
			//$(this).css("background-color", "hsl(0, 100%, 50%)")
		})
		if($(".sample_list li.selected").size() === 0 ) {
			var fstbtn = $(".sample_list li:nth-child(13)").addClass("selected");
			changeGrad2Button(fstbtn[0])
		}
		
	}

	function getElementPosition(e){
		var rect = hue_bar[0].getBoundingClientRect();
		return {
      	x : Math.round(e.clientX - rect.left),
      	y : Math.round(e.clientY - rect.top)
	  }
	}

	$(".sample_list li").on("click", function (e) {
		$(".sample_list li").removeClass();
		$(this).addClass("selected");
		changeGrad2Button(this)
	})

	function changeGrad2Button (target) {
		var grad = $(target).attr("style");
		var strgrad = grad.replace("background-image: linear-gradient(", "");
			strgrad = strgrad.replace(");", "");
		var _grads = strgrad.split("),");
		_grads[0] = _grads[0]+")";
		ButtonDesignEngine.changeGrad( {cs2: _grads[0], cs1: _grads[1]} );
	}

	changeHue()
}

ColorSample()

