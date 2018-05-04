// 封装一个代替 getElementById()的方法
function byId(id) {
	return typeof(id)==="string"?document.getElementById(id):id;
}
// 全局变量
var index=0,
	timer=null,
	pics=byId("banner").getElementsByTagName("div"),	
	dots=byId("dots").getElementsByTagName("span"),
	prev=byId("prev"),
	next=byId("next"),
	len=pics.length,
	menu=byId("menu-content"),
	menuItems=menu.getElementsByClassName("menu-item"),
	submenu=byId("sub-menu"),
	innerBox=submenu.getElementsByClassName("inner-box");
	// 注意：getElementsByClassName方法在IE8及以下浏览器中，不能使用。

function slideImg(){
	var main=byId("main");
	// 滑过清除定时器, 离开继续
	main.onmouseover=function(){
		// 滑过清除定时器
		 if (timer) {
		 	clearInterval(timer);
		 }
	}
	main.onmouseout=function(){
		// 重新启动定时器
		timer=setInterval(function(){
			index++;
			if (index>=len) {
				index=0;
			} 
			// 切换图片
			changeImg();
		},3000);
	}
	// 调用 onmouseout 方法，使得一进到当前页面就切换图片，
	// 自动在 main 上触发鼠标离开的事件
	main.onmouseout();


	// 点击圆点切换图片，遍历所有圆点，且绑定点击事件
	for (var d = 0; d < len; d++) {
		// 给所有span添加一个id的属性，值为d,作为当前span的索引
		dots[d].id=d;
		dots[d].onclick=function(){
			// 改变 index 为当前 span 的索引
			// alert(d);//3是d的最终值

			// 改变 index 为当前 span 的id
			index=this.id;
			// this.className="active";
			// 调用 changeImg，实现图片切换
			changeImg();
		}
	}

	// 点击按钮切换图片
	// 上一张
	prev.onclick=function(){
		index--;
		if (index<0) {
			index=2;
		} 
		changeImg();
	}
	// 下一张
	next.onclick=function(){
		index++;
		if (index>=len) {
			index=0;
		} 
		changeImg();
	}


	// 导航菜单
	// 遍历主菜单，且绑定事件
	for (var m = 0; m < menuItems.length; m++) {
		menuItems[m].setAttribute("data-index",m);
		menuItems[m].onmouseover=function(){
			// 显示子菜单
			submenu.className="sub-menu";
			// 给每一个 menu-item 定义 data-index 属性，作为索引
			var idx=this.getAttribute("data-index");
			
			// 遍历所有子菜单，让所有子菜单隐藏
			for (var j = 0; j < innerBox.length; j++) {
				innerBox[j].style.display="none";
				menuItems[j].style.background="none";				
			}
			innerBox[idx].style.display="block";
			menuItems[idx].style.background="rgba(0,0,0,0.1)";
			// console.log(idx);
		}
	}

	menu.onmouseout=function(){
		submenu.className="sub-menu hide";
	}
	submenu.onmouseover=function(){
		submenu.className="sub-menu";
	}
	submenu.onmouseout=function(){
		submenu.className="sub-menu hide";
	}

}
// 切换图片
function changeImg() {
	// 不管元素上有没有类，className 属性设置的类会重写元素上的类
	// pics[index].className = "slide-action";

	// 遍历banner下的所有的div及所有的span，将div隐藏, 将span清除类
	for (var i = 0; i < len; i++) {
		pics[i].style.display="none";
		dots[i].className="";
	}
	// 根据 index 索引找到当前 div 和当前 span，将其显示出来和设为当前
	pics[index].style.display="block";
	dots[index].className="active";
}


slideImg();

