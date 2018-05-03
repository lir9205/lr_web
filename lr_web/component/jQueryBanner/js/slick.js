(function($){
	var pictures=$('#banner').children('div'),
		dots=$('.dots').children('span'),
		len=pictures.length,
		index=0,
		timer=null;

	function slideImg(){
		// 滑过清除定时器, 离开继续
		$('.main').mouseover(function(event){
			// 清除定时器
			if (timer) {
				clearInterval(timer);
			}
		}).mouseout(function(event){
			// 开启定时器
			timer=setInterval(function(){
				 index++;
				 if (index>=len) {
				 	index = 0;
				 }
				 changeImg();
			}, 2000);
		});

		// 调用 onmouseout 方法，使得一进到当前页面就切换图片
		$('.main').mouseout();

		// 点击圆点切换图片，遍历所有圆点，且绑定点击事件
		for (var i = 0; i < len; i++) {

			dots.eq(i).prop('id',i);

			dots.eq(i).click(function(event){				
				index=$(this).prop('id');
				changeImg();
			})
		}

		// 点击按钮切换图片
		$('.prev').click(function(event){
			index--;
			if (index<0) {
				index=len-1;
			}
			changeImg();
		})

		$('.next').click(function(event){
			index++;
			if (index>=len) {
			 	index = 0;
			 }
			 changeImg();
		})
	}

	function changeImg(){
		for (var i = 0; i < len; i++) {
			pictures.eq(i).css('display','none');
			dots.eq(i).removeClass('active');
		}
		pictures.eq(index).css('display', 'block');
		dots.eq(index).addClass('active');
	}

	slideImg();
	
})(jQuery)