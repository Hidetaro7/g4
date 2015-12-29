function SocialShare () {
	var twitter_data = {}, dt = {}//送信用
	var like_local = [], like_world = []//likeしたボタン情報の配列

	$("#doSocialShare").on("click", function () {
		if(!$(this).hasClass("disable")) {
			$(this).addClass("disable")
			createData ();
			$.ajax({
				url: App.BASE_URL+"api/insert.php",
				type: "POST",
				data: dt,
				dataType: "text",
				success: function (res) {
					alert(res + "シェアしました！");
					setTimeout(function (){
						$("#doSocialShare").removeClass("disable")
					}, 5000)
					setTimeout(function (){
						insert_new_user()
						gallery.reload()
					},1000)
				},
				error: function (e) {
					console.log(e)
					alert("error: "+e.toString());
				}
			})
		}
	})
	function createData () {
		dt = {
			"html": $("#html_code code").text(),
			"css": $("#css_code code").text(),
			"twitter_id": twitter_data.id,
			"twitter_name": twitter_data.name,
			"screen_name": twitter_data.screen_name,
			"location": twitter_data.location,
			"description": twitter_data.description,
			"url": twitter_data.url,
			"lang": twitter_data.lang,
			"img": twitter_data.img
		}
		return dt;
	}

	function insert_new_user () {
		// check and registration user
		createData ();
		$.ajax({
			url: App.BASE_URL+"api/user_insert.php",
			type: "POST",
			data: dt,
			dataType: "text",
			success: function (res) {
				console.log(res)
				//loadComplete(res)
			},
			error: function (e) {
				console.log(e)
				//alert("ギャラリーエラー: "+e.toString());
			}
		})
	}

	// gallery
	function gallery() {
		var gallery_data;
		//console.log(twitter_data.screen_name)
		var load = function () {
			$.ajax({
  crossDomain: true,
				url: App.BASE_URL+"api/gallery.php",
				type: "GET",
				data: (twitter_data.screen_name) ? {"user":twitter_data.screen_name} : "",
				dataType: "json",
				success: function (res) {
					//console.log(res)
					loadComplete(res)
				},
				error: function (e) {
					console.log(e)
					alert("ギャラリーエラー: "+e.toString());
				}
			})
		}
		var loadComplete = function (res) {
			gallery_data = res
			gallery_render()
		}
		var gallery_render = function () {
			var ul = $("#sharedGallery>section>ul").empty()
			for (var i=0; i<gallery_data.length; i++) {
				//console.log(dt)
				var dt = gallery_data[i];
				var className = "btn_"+dt.id;
				var li = $("<li><div class='gwrap'><div class='btnWrap'></div><div class='socialCount'><div class='tw_user'><img /><span></span></div><div class='like'><i class='fa fa-heart'></i><span></span><div class='likers_icon'></div></div></div><style></style></div></li>")//<div class='watch'><i class='fa fa-eye'></i><span></span></div>
				var btnDom = $(dt.html.replace("btn", className));
				dt.css = dt.css.replace(/.btn/gi, "."+className).replace(/\\/gi, "").replace(/;  /gi, ";").replace(/{  /gi, "{");
				li.prop("id","btn_id_"+dt.id)
				li.find("style").append(dt.css)
				//console.log(dt.likers)
				li.find(".watch span").text(dt.watch)
				li.find(".like span").text(dt.like)
				li.find(".btnWrap").html(btnDom)
				if(dt.isLike){li.find(".like").addClass("my_like")}
				li.find(".tw_user img").prop({"src":dt.img, "alt": dt.screen_name}).next("span").text(dt.screen_name)
				
				var likers_5 = dt.likers_5.split(",");
				var likers_5_name = dt.likers_5_name.split(",");
				var icon_wrap = li.find(".likers_icon");
				for (var j=0; j<likers_5.length-1;j++) {
					var igs = $("<img/>").prop({src: likers_5[j], alt: likers_5_name[j]})
					icon_wrap.append(igs)
				}
				//
				ul.append(li)
			}
		}

		load();

		$("#twitter_login").on("click", function () {
			//window.open("login.php", 'Twitterでログイン', 'width=600, height=400, menubar=no, toolbar=no, scrollbars=yes')
			window.open().location.href=App.BASE_URL+"login.php";
		})
		//likeボタンの実装をする
		var isLikeBusy = false;
		$("#sharedGallery ul").on("click", "li .like", function (e) {
			if(!twitter_data.id || isLikeBusy) return false;
			isLikeBusy = true;
			var id = $(this).closest("li").attr("id").replace("btn_id_", "");
			var inc = 0;
			var span = $(this).find("span");
			var currentLikeNum = Number(span.text());
			//console.log(this)
			if($(this).hasClass("my_like")) {
				$(this).removeClass("my_like")
				inc--
				// 自分がlikeしていたらアイコンを消さなきゃね
				if(twitter_data.screen_name) {
					$(this).find(".likers_icon img").each(function (){
						if($(this).prop("alt") === twitter_data.screen_name) {
							var remove_img = $(this)
							$(this).addClass("fadeout")
							setTimeout(function () {
								remove_img.remove();
							},500)
						}
					})
				}
			}else{
				$(this).addClass("my_like")
				inc++
				// イイねしたら自分のアイコンが割って入るよ
				// twitter_data.img
				var newicon = $("<img/>").prop({src:twitter_data.img,alt:twitter_data.screen_name}).addClass("fadeout")
				$(this).find(".likers_icon").append(newicon)
				setTimeout(function () {
					newicon.removeClass("fadeout")
				},500)

			}
			currentLikeNum = (currentLikeNum+inc) < 0 ? 0 : currentLikeNum+inc;
			span.text(currentLikeNum);
			like_local.push({"id": id, "screen_name":twitter_data.screen_name, "twitter_id": twitter_data.id, "increment": inc})
			setTimeout(function () {
				isLikeBusy = false;
			},1000)
		})

		// like post
		var isLikePosting = false
		function likePost () {
			//console.log(like_local)
			if(like_local.length > 0 && !isLikePosting) {
				isLikePosting = true;
				like_world = like_local.concat();
				$.ajax({
					url: App.BASE_URL+"api/likes_insert.php",
					type: "POST",
					data: {"likes": JSON.stringify(like_world)},
					dataType: "text",
					success: function (res) {
						console.log(res)
						isLikePosting = false
						like_local.length = 0;
					},
					error: function (e) {
						isLikePosting = false
						console.log("error" , e)
						//alert("ギャラリーエラー: "+e.toString());
					}
				})
			}
			setTimeout(likePost, 10000)
		}
		likePost();
		gallery.arguments.callee.reload = load;
	}

	function check_login () {
		$("#twitter_login").hide();
		$("#doSocialShare").hide();
		$.getJSON( App.BASE_URL+"mypage.php", function( data ) {
			//console.log(data)
			if(data) {
				$("#doSocialShare").show().find("img").prop({"src":data.profile_image_url, "alt": data.screen_name}).next("span").text(data.screen_name.toUpperCase());
				$("#twitter_login").hide();
				twitter_data = {"id": data.id, "name": data.name, "screen_name": data.screen_name, "location": data.location, "description": data.description, "url": data.url, "lang": data.lang, "img": data.profile_image_url};
				cheched_login(true)
			}else{
				cheched_login(false)
			}
		}).fail(function() {
			$("#twitter_login").show();
			$("#doSocialShare").hide();
			cheched_login(false)
		})
	}
	check_login()

	function cheched_login (b) {
		gallery()
		getSharedCount()
	}

	function getSharedCount () {
		$.ajax({
			url: App.BASE_URL+"api/gallery_count.php",
			dataType: "text",
			success: function (res) {
				$("#socialShare .share_count").text(res)
			},
			error: function (e) {
				$("#socialShare .share_count").css("opacity",0)
			}
		})
	}

	$("#sharedGallery ul").on("click", "li .btnWrap a", function (e) {
		e.preventDefault();
		var _css = $(this).closest('li').find("style")[0].innerText;
		var _html = $(this).closest('.btnWrap').html();
		var _data = code2Data({"css":_css});
		App.changeButton({"data": _data, "html": _html, "css": _css})
		$('html,body').animate({scrollTop: 0}, 300);
	})
}
window.onload = function () {
	setTimeout(function () {
		SocialShare()
	},1000)
}
