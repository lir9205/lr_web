function waterfall(wrap, boxes) {
	//获取盒子宽度
	var boxWidth = boxes[0].offsetWidth + 20; //offsetWidth不包含外边距，是边框到边框的宽度
	//获取视觉宽度
	var windowWidth = document.documentElement.clientWidth; 
	// 计算可显示的列数
	var colsNumber = Math.floor(windowWidth / boxWidth);

	// 设置容器的宽度, 容器有了宽度之后就会居中显示
	wrap.style.width = boxWidth * colsNumber + 'px';

	// 定义一个数组并存储每一列的高度
	var everyHeight = new Array();
	for (var i = 0; i < boxes.length; i++) {
		if (i < colsNumber) {
			everyHeight[i] = boxes[i].offsetHeight + 20;//offsetHeight不包含外边距
		} else {
			// apply 是一个内建函数，第一个参数是空，数组的第一个元素赋给 minHeight，
			// 如果第二个元素比 minHeight 小就替换 minHeight 的值，否则不替换，依次类推，直到遍历完数组所有的元素，获得最小值。
			var minHeight = Math.min.apply(null, everyHeight); //获得高度数组中的最小值
			var minIndex = getIndex(minHeight, everyHeight);  //获取高度最下的那一列的索引
			var leftValue = boxes[minIndex].offsetLeft - 10; //减去外边距
			boxes[i].style.position = 'absolute';
			boxes[i].style.top = minHeight + 'px';
			boxes[i].style.left = leftValue + 'px';
			everyHeight[minIndex] += boxes[i].offsetHeight + 20;
		}
	}
};

function getIndex(minHeight, everyHeight) {
	for (index in everyHeight) {
		if (everyHeight[index] === minHeight) {
			return index;
		}
	}
}


window.onload = function() {
	var wrap = document.getElementById('wrap');
	var boxes = wrap.getElementsByTagName('div');

	waterfall(wrap, boxes);
};