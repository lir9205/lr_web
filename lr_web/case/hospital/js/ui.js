// ui-search 定义
$.fn.UiSearch=function(){
	//this === $('.ui-search'), 使用$(this)是为了安全，保证这是这是一个jQuery对象。
	var ui = $(this); 
	
	// 给 ui 里面的 .ui-search-selected 添加点击事件
	$('.ui-search-selected', ui).on('click', function(){
		$('.ui-search-selecte-list').show();
		return false; //取消事件传递
	});
	// .ui-search-selecte-list 里面的a成员被点击的时候，使用a成员的文本替换.ui-search-selected的文本，并隐藏.ui-search-selecte-list
	$('.ui-search-selecte-list a', ui).on('click', function(){
		$('.ui-search-selected').text($(this).text());
		$('.ui-search-selecte-list').hide();
		return false;
	});

	$('body').on('click', function(){
		$('.ui-search-selecte-list').hide();
	})
}
// ui-tab 定义
/**
* @param {string} header TAB组件，所有选项卡 item
* @param {string} content TAB组件，所有内容区域  item
* @param {string} focus_prefix 选项卡高亮样式前缀，可选
*/ 
$.fn.UiTab = function(header, content, focus_prefix) {
	var ui = $(this);
	var tabs = $(header, ui);
	var cons = $(content, ui);
	var focus_prefix = focus_prefix || '';
	// 选项卡点击事件
	tabs.on('click', function(){
		// index() 获取当前元素在父元素中的同级子元素中的索引
		var index = $(this).index();
		// 切换选项卡的选中样式
		tabs.removeClass(focus_prefix + 'item_focus').eq(index).addClass(focus_prefix + 'item_focus');
		cons.hide().eq(index).show();
		return false;
	})
}

// ui-backTop
$.fn.UiBackTop = function(){
	var ui = $(this);
	var el = $('<a class="ui-backTop" href="#0"></a>');
	ui.append(el);

	var windowHeight = $(window).height();

	$(window).on('scroll', function(){
		// 获取当前滚动条的高度
		var top = $(window).scrollTop();
		console.log(top);
		if (top > windowHeight) {
			el.show();
		} else {
			el.hide();
		}
	});

	el.on('click', function(){
		// 滚动到顶部
		$(window).scrollTop(0);
	});

}

// ui-slider

// 1、左右箭头需要控制翻页
// 2、翻页的时候，进度点，要联动进行focus
// 3、翻到第三页的时候，下一页要回到第一页；翻到第一页的时候同理

// 4、进度点，再点击的时候，需要切换相应的页面

// 5、没有(进度点点击、翻页操作)的时候需要进行自动滚动

// 6、滚动过程中，屏蔽其他操作(自动滚动、左右翻页】进度点点击)

// 7、高级--无缝滚动 （自己实现）
$.fn.UiSlider = function() {
	var ui = $(this);

	var wrap = $('.ui-slider-wrap', ui);

	var btn_prev = $('.ui-slider-arrow .left', ui);
	var btn_next = $('.ui-slider-arrow .right', ui);

	var items = $('.ui-slider-wrap .item', ui);
	var tips = $('.ui-slider-process .item', ui);

	var current = 0;
	var size = items.size();
	var width = items.eq(0).width();
	var enableAuto = true;

	// 设置自动滚动感应（如果鼠标在 wrap 中，不要自动滚动）
	ui.on('mouseover', function(){
		enableAuto = false;
	}).on('mouseout', function(){
		enableAuto = true;
	});

	// 具体操作
	wrap
	.on('move_prev', function(){
		
		if (current <= 0) {
			current = size;
		}
		current--;
		wrap.triggerHandler('move_to', current);
	})
	.on('move_next', function(){
		
		if (current >= size-1) {
			current = -1;
		}
		current++;
		wrap.triggerHandler('move_to', current);

	})
	.on('move_to', function(event, index){		
		wrap.css('left',index * width * (-1));
		tips.removeClass('item_focus').eq(index).addClass('item_focus');
	})
	.on('auto_move', function(){	
		setInterval(function(){
			// 可以自动滚动的时候才滚动
			enableAuto && wrap.triggerHandler('move_next');
		}, 2000);
	})
	.triggerHandler('auto_move');

	// 事件
	btn_prev.on('click', function(){
		wrap.triggerHandler('move_prev');
	});
	btn_next.on('click', function(){
		wrap.triggerHandler('move_next');
	});
	tips.on('click',function(){
		var index = $(this).index();
		wrap.triggerHandler('move_to', index);
	});

}

// ui-cascading
$.fn.UiCascading = function() {
	var ui = $(this);
	var selects = $('select', ui);

	selects
	.on('change', function(){
		var val = $(this).val();
		var index = selects.index(this);

		// 触发下一个select的更新，根据当前的值
		var where = $(this).attr('data-where');
		where = where ? where.split(',') : [];
		where.push($(this).val());
		selects.eq(index+1)
		.attr('data-where', where.join(',')).triggerHandler('reloadOptions');

		// 触发下一个之后的select的初始化（清除不应该的数据项）
		ui.find('select:gt(' + (index+1) + ')').each(function(){
			$(this)
			.attr('data-where', '')
			.triggerHandler('reloadOptions');
		})		
	})
	.on('reloadOptions', function(){
		var method = $(this).attr('data-search');
		var args = $(this).attr('data-where').split(',');
		// apply(target,arguments)
		var data = AjaxRemoteGetData[method].apply(this, args);	

		// 把当前select的option都清除掉
		var select = $(this);
		select.find('option').remove();
		// 追加option内容

		$.each(data, function(i, item) {
			var el = $('<option value="' + item + '">' + item + '</option>')
			select.append(el);
		})	
	})

	selects.eq(0).triggerHandler('reloadOptions');
}

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();

	$('.content-tab').UiTab('.caption > .item', '.block > .item');
	$('.content-tab .block .item').UiTab('.block-caption > .block-caption-item', '.block-content > .block-wrap', 'block-caption-');

	$('body').UiBackTop();

	$('.ui-slider').UiSlider();

	$('.ui-cascading').UiCascading();
});

