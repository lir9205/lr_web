function addLoadEvent(func){
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function(){
			oldonload();
			func();
		}
	}
}

function insertAfter(newElement, targetElement) {
	var parentNode = targetElement.parentNode;
	if (parentNode.lastChild == targetElement) {
		parentNode.appendChild(newElement);
	} else {
		parentNode.insertBefore(newElement, targetElement.nextSibling);
	}
}

function addClass(element, value) {
	if (!element.className) {
		element.className = value;
	} else {
		var newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}
// 页面突出显示
function highlightPage() {
	// 检查浏览器是否支持DOM方法
	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	// 检查header和nav元素是否存在
	var headers = document.getElementsByTagName('header');
	if (headers.length == 0) return false;
	var navs = headers[0].getElementsByTagName('nav');
	if (navs.length == 0) return false;
	// 获取导航链接
	var links = navs[0].getElementsByTagName('a');
	var linkUrl;
	for (var i = 0; i < links.length; i++) {
		// 获得当前链接URL
		linkUrl = links[i].getAttribute('href');
		// 判断当前页面的URL是否包含当前链接的URL，如果包含的话
		if (window.location.href.indexOf(linkUrl) != -1) {
			// 给当前链接添加here类
			links[i].className = "here";
			// 把当前链接的文本的小写形式作为当前页面的body元素id属性
			var linktext = links[i].lastChild.nodeValue.toLowerCase();
			document.body.setAttribute('id', linktext);
		}
	}
}

addLoadEvent(highlightPage);

// 移动元素
function moveElement(elementID, final_x, final_y, interval) {
	// 确保浏览器支持DOM方法
	if (!document.getElementById) return false;
	if (!document.getElementById(elementID)) return false;
	// 确保元素存在
	var elem = document.getElementById(elementID);
	// 将变量movement设置为elem的属性
	if (elem.movement) {
		clearTimeout(elem.movement);
	}
	// 安全性检查
	if (!elem.style.left) {
		elem.style.left = "0px";
	}
	if (!elem.style.top) {
		elem.style.top = "0px";
	}
	// 获得初始位置
	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.top);
	var dist = 0;

	if (xpos == final_x && ypos == final_y) {
		return true;
	}
	if (xpos < final_x) {
		// 计算移动的距离，速度由快变慢
		dist = Math.ceil((final_x - xpos)/10);
		xpos+=dist;
	}
	if (xpos > final_x) {
		dist = Math.ceil((xpos - final_x)/10);
		xpos-=dist;
	}
	
	if (ypos < final_y) {
		dist = Math.ceil((final_y - ypos)/10);
		ypos+=dist;
	}
	if (ypos > final_y) {
		dist = Math.ceil((ypos - final_y)/10);
		ypos-=dist;
	}

	elem.style.left = xpos + "px";
	elem.style.top = ypos + "px";
	var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
	// 递归调用
	elem.movement = setTimeout(repeat,interval);
}
// 创建幻灯片
function prepareSlideshow() {
	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	if (!document.getElementById('intro')) return false;

	var intro = document.getElementById('intro');
	var slideshow = document.createElement('div');
	slideshow.setAttribute('id', 'slideshow');

	// 创建圆角背景图片
	var frame = document.createElement('img');
	frame.setAttribute('src', 'images/frame.gif');
	frame.setAttribute('alt', '');
	frame.setAttribute('id', 'frame');
	slideshow.appendChild(frame);

	var preview = document.createElement('img');
	preview.setAttribute('id', 'preview');
	preview.setAttribute('src', 'images/slideshow.gif');
	preview.setAttribute('alt', 'a glimpse of what awaits you');
	slideshow.appendChild(preview);
	insertAfter(slideshow, intro);

	// 触发导航链接和intro里面的链接都会触发幻灯片动画
	var links = document.getElementsByTagName('a');
	var destination;
	for (var i = 0; i < links.length; i++) {
		links[i].onmouseover = function() {
			destination = this.getAttribute('href');
			if (destination.indexOf('index.html') != -1) {
				moveElement('preview', 0, 0, 5);
			}
			if (destination.indexOf('about.html') != -1) {
				moveElement('preview', -150, 0, 5);
			}
			if (destination.indexOf('photos.html') != -1) {
				moveElement('preview', -300, 0, 5);
			}
			if (destination.indexOf('live.html') != -1) {
				moveElement('preview', -450, 0, 5);
			}
			if (destination.indexOf('contact.html') != -1) {
				moveElement('preview', -600, 0, 5);
			}
		}
	}
}

addLoadEvent(prepareSlideshow);

// 实现内部导航
function showSection(id) {
	var sections = document.getElementsByTagName('section');
	for (var i = 0; i < sections.length; i++) {
		if (sections[i].getAttribute('id') != id) {
			sections[i].style.display = "none";
		} else {
			sections[i].style.display = "block";
		}
	}
}
function prepareInternalnav() {
	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	
	var articles = document.getElementsByTagName('article');
	if (articles.length == 0) return false;
	var navs = articles[0].getElementsByTagName('nav');
	if (navs.length == 0) return false;
	var nav = navs[0];
	var links = nav.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var sectionId = links[i].getAttribute('href').split('#')[1];
		// 如果id为sectionId的section不存在继续下一循环
		if (!document.getElementById(sectionId)) continue;
		// 默认隐藏所有部分
		document.getElementById(sectionId).style.display = "none";
		// 利用属性保存sectionId，因为sectionId是一个局部变量，只在prepareInternalnav函数执行期间存在，
		// 等到事件处理函数执行的时候已经不存在了
		links[i].destination = sectionId;
		links[i].onclick = function() {
			showSection(this.destination);
			return false; 
		}
	}
}

addLoadEvent(prepareInternalnav);

// 实现图片库
// 动态创建元素
// <img id="placeholder" src="images/placeholder.jpg" alt="my image gallery" />
// <p id="description">Choose an image.</p> 
function preparePlaceholder() {

	if (!document.createElement) return false;
	if (!document.createTextNode) return false;
	if (!document.getElementById) return false;
	if (!document.getElementById('imagegallery')) return false;

	var placeholder = document.createElement('img');
	placeholder.setAttribute('id', 'placeholder');
	placeholder.setAttribute('src', "images/placeholder.gif");
	placeholder.setAttribute('alt', "my image gallery");
	var description = document.createElement('p');
	description.setAttribute('id', 'description');
	var desctext = document.createTextNode('Choose an image.');
	description.appendChild(desctext);

	var gallery = document.getElementById('imagegallery');
	insertAfter(description, gallery);
	insertAfter(placeholder, description);
}
// 负责处理事件
function prepareGallery(){
	// 对象检测，向后兼容
	if (!document.getElementById) return false;
	if (!document.getElementsByTagName) return false;
	// 预防性检测
	if (!document.getElementById('imagegallery')) return false;

	var gallery = document.getElementById('imagegallery');
	var links = gallery.getElementsByTagName('a');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick=function() {
			// 是否取消默认行为是由showPic函数决定的，
			// showPic函数返回true，图片更新成功，取反返回false，浏览器不会打开链接
			// showPic函数返回false，图片没有更新，返回true以允许默认行为发生。
			return showPic(this) ? false : true; 
		}
	}
}
// 负责把占位图片切换为目标图片
function showPic(whichPic){
	if (!document.getElementById('placeholder')) return false; 
	var source = whichPic.getAttribute('href');
	var placeholder = document.getElementById('placeholder');	
	if (placeholder.nodeName != 'IMG') return false;
	placeholder.setAttribute('src',source);

	if (document.getElementById('description')) {
		
		var title = whichPic.getAttribute('title') ? whichPic.getAttribute('title') : "";
		var description = document.getElementById('description');
		if (description.firstChild.nodeType == 3) {
			description.firstChild.nodeValue = title;
		}
	}
	return true;//返回true代表图片更新成功，false跟新失败
}
addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);

// 增强表格
function stripeTables() {
	if (!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName('table');
	var odd,rows;
	for (var i = 0; i < tables.length; i++) {
		odd = false;
		rows = tables[i].getElementsByTagName('tr');
		for (var j = 0; j < rows.length; j++) {
			if (odd == true) {
				// rows[j].style.backgroundColor = "#ffc";
				addClass(rows[j], 'odd');
				odd = false;
			} else {
				odd = true;
			}
		}
	}
}
addLoadEvent(stripeTables);

// 斑马线效果
function highlightRows() {
	if (!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName('tr');
	for (var i = 0; i < rows.length; i++) {
		rows[i].oldClassName = rows[i].className;
		rows[i].onmouseover = function(){
			addClass(this, 'highlight');
		}
		rows[i].onmouseout = function(){
			this.className = this.oldClassName;
		}
	}
}
addLoadEvent(highlightRows);

// 显示缩略语列表
function displayAbbreviations(targetElementName) {
	// 检查兼容性
	if (!document.getElementsByTagName) return false;
	if (!document.createElement) return false;
	if (!document.createTextNode) return false;
	// 获取所有的缩略词
	var abbreviations = document.getElementsByTagName('abbr');
	if (abbreviations.length < 1) return false;
	var defs = new Array();
	// 遍历这些缩略词
	for (var i = 0; i < abbreviations.length; i++) {
		var current_abbr = abbreviations[i];
		// 为了兼容IE浏览器，因为IE浏览器在统计abbr元素的子节点个数是总是返回一个错误的值--零。
		if (current_abbr.childNodes.length < 1) return false;
		var definition = current_abbr.getAttribute('title');
		var key = current_abbr.lastChild.nodeValue;
		defs[key] = definition;
	}
	// 创建定义列表
	var dlist = document.createElement('dl');
	// 遍历定义
	for (key in defs) {
		var definition = defs[key];
		// 创建定义标题
		var dtitle = document.createElement('dt');
		var dtitle_text = document.createTextNode(key);
		dtitle.appendChild(dtitle_text);
		// 创建定义描述
		var ddesc = document.createElement('dd');
		var ddesc_text = document.createTextNode(definition);
		ddesc.appendChild(ddesc_text);
		// 把它们添加到定义列表
		dlist.appendChild(dtitle);
		dlist.appendChild(ddesc);
	}
	// des为空时，就不会创建dt和dd元素，如果dlist没有子节点就立刻退出。
	if (dlist.childNodes.length < 1) return false;
	// 创建标题
	var header = document.createElement('h3');
	var header_text = document.createTextNode('Abbreviations');
	header.appendChild(header_text);
	
	var targets = document.getElementsByTagName(targetElementName);
	if (targets.length == 0) return false;
	var target = targets[0];
	target.appendChild(header);// 将标题添加到页面主体	
	target.appendChild(dlist);// 将定义列表添加到页面主体
}
addLoadEvent(function(){
	displayAbbreviations('article');
});

// 使label中的文本被点击，关联的表单字段就会获得焦点
// 很多浏览器都实现了这一默认行为，但是并不是所有的浏览器都实现了该行为，所以我们使用JavaScript来实现。
function focusLabels() {
	if (!document.getElementsByTagName) return false;	
	var labels = document.getElementsByTagName('label');
	for (var i = 0; i < labels.length; i++) {
		if (!labels[i].getAttribute('for')) continue;
		labels[i].onclick = function() {
			var id = this.getAttribute('for');
			if (!document.getElementById(id)) return false;
			var element = document.getElementById(id);
			element.focus();
		}
	}
}

addLoadEvent(focusLabels);


// 添加占位符文本
function resetFields(whichform) {
	// 如果浏览器支持placeholder属性，直接返回
	if (Modernizr.input.placeholder) return;
	// 循环遍历表单中的每个表单元素
	for (var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i];
		// 如果当前元素是提交按钮，跳过
		if (element.type == 'submit') continue;
		// 如果当前元素没有设置placeholder属性值，跳过
		var check = element.placeholder || element.getAttribute('placeholder');
		if (!check) continue;
		// 为元素获得焦点的事件添加处理函数
		element.onfocus = function() {
			var text = this.placeholder || this.getAttribute('placeholder');
			if (this.value == text) {
				this.className = '';
				this.value = '';
			}
		};
		// 为元素失去焦点的事件添加处理函数
		element.onblur = function() {
			if (this.value == '') {
				this.className = 'placeholder';//为了应用样式，添加placeholder类
				this.value = this.placeholder || this.getAttribute('placeholder');
			}
		}
		element.onblur();
	}
}

function prepareForms() {
	for (var i = 0; i < document.forms.length; i++) {
		var thisform = document.forms[i];
		// 添加占位符文本
		resetFields(thisform);
		// 验证表单
		// 无论什么时候提交表单，都会触发submit事件，而事件会被onsubmit事件处理函数拦截。
		thisform.onsubmit = function() {
			// return validateForm(this);
			if (!validateForm(this)) return false;
			var article = document.getElementsByTagName('article')[0];
			// 如果submitFormWithAjax函数成功发送了Ajax请求并返回true，则让onsubmit事件处理函数返回false，以便阻止浏览器重复提交表单。
			if (submitFormWithAjax(this, article)) return false;
			// submitFormWithAjax函数没有成功发送Ajax请求，则让onsubmit事件处理函数返回true，让表单像什么都没有发生一样继续通过页面提交。
			return true;
		}
	}
}

addLoadEvent(prepareForms);

// 验证表单数据
function validateForm(whichform) {
	for (var i = 0; i < whichform.elements.length; i++) {
		var element = whichform.elements[i];
		if (element.required == 'required') {
			if (!isFilled(element)) {
				alert('Please fill in the ' + element.name + ' field.');
				return false;
			}
		}
		if (element.type == 'email') {
			if (!isEmail(element)) {
				alert('The ' + element.name + ' filed must be a valid email address.');
				return false;
			}
		}
	}
	return true;
}

function isFilled(field) {
	if (field.value.replace(' ', '').length == 0) return false;
	var placeholder = field.placeholder || field.getAttribute('placeholder');
	return field.value != placeholder;
}

function isEmail(field) {
	return (field.value.indexOf('@') != -1) && (field.value.indexOf('.') != -1);
}


// 提交表单
// 创建XMLHttpRequest对象
function getHTTPObject() {
	// IE浏览器
	if (typeof XMLHttpRequest == 'undefined') {
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
			catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
			catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); }
			catch (e) {}
		return false;
	}
	return new XMLHttpRequest();//其他浏览器
}
// 创建加载图像
function displayAjaxLoading(element) {
	// 移除所有子节点
	while (element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
	// 创建加载图像节点
	var content = document.createElement("img");
	content.setAttribute('src', 'images/loading.gif');
	content.setAttribute('alt', 'Loading...');
	element.appendChild(content);
}

// 提交表单数据
function submitFormWithAjax(whichform, thetarget) {
	// 创建XMLHttpRequest对象
	var request = getHTTPObject();
	if (!request) return false;
	// 显示加载图像
	displayAjaxLoading(thetarget);

	// 获取请求数据
	var dataParts = [];
	var element;
	for (var i = 0; i < whichform.elements.length; i++) {
		element = whichform.elements[i];
		dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
	}
	var data = dataParts.join('&');
	// 向原始表单的action属性指定的处理函数发送POST请求
	request.open('POST', whichform.getAttribute('action'), true);
	// 添加application/x-www-form-urlencoded头部
	// 这个头部信息对于POST请求是必要的，它表示请求中包含URL编码的表单。
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	// 创建处理响应的onreadystatechange事件处理程序
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200 || request.status == 0) {
				var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
				if (matches.length > 0) {
					thetarget.innerHTML = matches[1];
				} else {
					thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>';
				}
			} else {
				thetarget.innerHTML = '<p>' + request.statusText + '</p>';
			}
		}
	};
	//发送请求
	request.send(data);
	// 表示函数已经成功发送请求
	return true;
}





























