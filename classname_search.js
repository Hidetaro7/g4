function classNameSearch () {

	var classNameData;
	var reserve_keywords; // 日本語も含めたあるあるキーワードの予備検索用jsonデータ
	var suggestData;//サジェスト検索用の配列
	var inputTimer;
	var kw = $("#kw")
	var button = $("#button")
	var button_txt = "";
	var result_icons = $("#result_icons")

	// http://www.enjoyxstudy.com/javascript/suggest/

	function init () {
		$.ajax({
			url: "./iconfont_data/classname_data.txt",
			dataType: "text",
			success: setClassNameData
		})

		$.ajax({
			url: "./iconfont_data/suggest_data.txt",
			dataType: "text",
			success: setSuggestData
		})

		$.ajax({
			url: "./iconfont_data/reserve_keywords.json",
			dataType: "json",
			success: function (res) {
				reserve_keywords = res
			}
		})
	}
	init()

	function setClassNameData (res) {
		classNameData = res.split(",")
	}
	function setSuggestData (res) {
		suggestData = res.split(",")
		startSuggest();
		onkey();
	}

	function search (str) {
		if(!classNameData.length) {
			console.log("classNameError !");
		}
		var res = []
		if(str.length < 2) return false;
		//一旦すべて小文字に変換
		//console.log(str)
		str = str.toLowerCase();

		// さらに、未知のキーワード、例えば"mail"などはfont-awesomeに登録されていないため、予備キーワードがマッチしないか検索する。
		for (var i=0; i<reserve_keywords.length; i++) {
			var wd = reserve_keywords[i];
			for (var j=0; j<wd.reserve.length; j++) {
				var single_reserve = wd.reserve[j];
				if(single_reserve.indexOf(str) != -1) {
					//console.log("hit!!!", wd.id)
					//以下、同じキーワードが重複しないようにチェックしてpushする
					if(res.indexOf(wd.id) === -1) {
						str+= " " + wd.id
					}
				}
			}
		}
		//console.log("str: " + str)
		// 入力3文字以上でサジェスト開始する
		var strs = str.split(/ |　/ig);
		// スペース区切りで複数キーワードに対応するため、キーワードを配列にしてstrsに。

		//予備追加ここまで

		for (var i=0,l=classNameData.length; i<l; i++) {
			// CSSクラス名を巡回
			for (var j=0; j<strs.length; j++) {
				if(strs[j].length > 2) {
					// 検索キーワードを巡回
					//単独キーワードがクラス名にマッチするか判定
					if(classNameData[i].indexOf(strs[j]) != -1 && res.indexOf(strs[j]) === -1) {
						res.push(classNameData[i])
					}
				}
			}
		}
		//console.log(res)
		// マッチしたCSSクラス名の配列が返る
		return res;
	}

	function startSuggest() {
	  new Suggest.LocalMulti(
	        "kw",    // 入力のエレメントID
	        "suggest", // 補完候補を表示するエリアのID
	        suggestData,      // 補完候補の検索対象となる配列
	        {dispMax: 10, interval: 1000, dispAllKey: true}); // オプション
	}
	function onkey () {
		kw.on("change, blur, keyup", disp_result)
		button.on("keyup", buttonTyped)
		result_icons.on("click", resultIconClicked)
		$("#suggest").on("click", function () {
			setTimeout(function () {
				disp_result()
			},10)
		})
		/*var old_kw;
		setInterval(function (){
			if(kw.val() != "" && kw.val() != old_kw) {
				console.log(kw.val())
				disp_result();
				old_kw = kw.val()
			}
		},1000)*/
	}
	function disp_result () {
		result_icons.empty()
		var scres = search(kw.val())
		var count = scres.length;
		while(count--) {
			var el = $("<i class='fa' />").addClass(scres[count]);
			result_icons.append(el)
		}
		if(button.find("i").size() <= 0) {
			button.prepend("<i id='icon_1' class='fa' />");
		}
		/*button.find("i").attr("class", "fa").addClass(scres[0])
		App.selectedIconName = scres[0];*/
		App.setHTML();
		App.forceRender();
	}
	function buttonTyped () {
		if( button.text() != button_txt ) {
			//kw.val(button.text());
			disp_result();
			button_txt = button.text()
		}
	}
	function resultIconClicked (e) {
		var target = e.target;
		if(target.tagName.toLowerCase() === "i") {
			console.log(target.className)
			App.selectedIconName = target.className.replace("fa ", "");
			button.find("i").attr("class", target.className);
			TextDesignEngine.changeEnableIcon(true)
		}
		App.setHTML();
	}
	
}

































