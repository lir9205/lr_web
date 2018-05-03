
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof oldonload != 'function') {
		window.onload = func;
	} else {
		window.onload = function(){
			oldonload();
			func();
		}
	}
}
// 编写insertAfter函数
function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}
// // 动态创建元素
// <img id="placeholder" src="images/placeholder.jpg" alt="my image gallery" />
// <p id="description">Choose an image.</p> 
function preparePlaceholder() {

	if (!document.createElement) return false;
	if (!document.createTextNode) return false;
	if (!document.getElementById) return false;
	if (!document.getElementById('imagegallery')) return false;

	var placeholder = document.createElement('img');
	placeholder.setAttribute('id', 'placeholder');
	placeholder.setAttribute('src', "images/placeholder.jpg");
	placeholder.setAttribute('alt', "my image gallery");
	var description = document.createElement('p');
	description.setAttribute('id', 'description');
	var desctext = document.createTextNode('Choose an image.');
	description.appendChild(desctext);

	var gallery = document.getElementById('imagegallery');
	insertAfter(placeholder, gallery);
	insertAfter(description, placeholder);
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
