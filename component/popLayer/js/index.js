$(function(){
	
	// 登录链接事件
	$('#loginLink').click(function(){
		// 获取登录窗体代码
		var loginHtml = $('#loginHtml').html();
		showLayer(loginHtml, 400, 300, closeCallBack);

		// 登录表单校验
		$('#loginSubmitBtn').click(function(){
			var username = $("input[name='username']").val();
			var password = $("input[name='password']").val();
			if (username === 'lirui' && password === '123') {
				alert('登录成功');
			} else {
				$(".error-msg").html("账号或密码输入错误");
			}
		})		
	});
	// 注册链接事件
	$('#registerLink').click(function(){
		// 获取注册窗体内容
		var registerHtml = $('#registerHtml').html();
		showLayer(registerHtml, 450, 340, closeCallBack);

		// 注册表单校验
		$('#registerSubmitBtn').click(function(){
			var username = $("input[name='username']").val();
			var password = $("input[name='password']").val();
			var repassword = $("input[name='repassword']").val();
			if (username === 'lirui' && password === '123' && repassword === password) {
				alert('注册成功');
			} else {
				$(".error-msg").html("账号或密码输入错误");
			}
		})				
	});

	// 弹出层关闭回调函数
	function closeCallBack(){
		$(".error-msg").html("");
	}

	// 显示弹出层
	function showLayer(html, width, height, closeCallBack){
		// 显示弹出层遮罩
		$('#layer-mask').show();
		// 显示弹出层窗体
		$('#layer-pop').show();
		// 设置弹出层窗体样式
		$('#layer-pop').css({
			width: width,
			height: height
		});

		// 设置窗体代码
		$('#layer-content').html(html);

		// 弹出层关闭按钮绑定事件
		$('#layer-close').click(function(){
			// 隐藏弹出层
			hideLayer();
			// 关闭的回调函数
			closeCallBack();
		});
	}

	// 隐藏弹出层
	function hideLayer(){
		// 弹出层关闭
		$('#layer-pop').hide();
		$('#layer-mask').hide();
	}

});