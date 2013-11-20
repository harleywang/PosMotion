var Pos = function(x, y){
    this.x = x;
    this.y = y;
}
/**
 * 基于坐标的滑动效果类
 */
var PosMotion = function(){
	this.initialize.apply(this, arguments);
};
PosMotion.prototype = {
	/**
	 * 构造函数
	 * @param  {String} containerId 滑动元素的ID（必选）
	 * @param  {Object} options     参数配置对象（必选）
	 */
	initialize: function(container, options){
		this.container = container;//document.getElementById(containerId);
		options = options || {};
		this.d = options.duration || 30;                             // 滑动持续时间
		this.timeInterval = options.timeInterval || 10;				 // 滑动时间间隔
		this.t = options.currentTime || 0;				 			 // 当前时间
		this.startPos = options.startPos || new Pos(0, 0);	         // 初始坐标
		this.endPos = options.endPos || new Pos(0, 0);				 // 结束坐标
		this.tween = options.tween || this.tweenCirc.easeInOut;		 // 缓动动画算法设置
		this.timer = null;											 // 计时器钩子

		this.onStart = options.onStart || function(){};				 // 开始滑动前回调函数
		this.onStop = options.onStop || function(){};				 // 停止滑动后回调函数
	},
	/**
	 * 默认的滑动算法
	 * @type {Object}
	 */
	tweenCirc:{
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
	},
	/**
	 * 将元素移动到坐标处
	 * @param  {Pos} pos 坐标对象
	 */
	moveTo: function(pos) {
		this.container.style['left'] = pos.x + 'px';
		this.container.style['top'] = pos.y + 'px';
	},
	/**
	 * 按时间递归的移动方法
	 */
	move: function(){
		var that = this;
		clearTimeout( this.timer );
		if (this.t++ < this.d) {
			var x = Math.floor(this.tween(this.t, this.startPos.x, this.endPos.x-this.startPos.x, this.d));
			var y = Math.floor(this.tween(this.t, this.startPos.y, this.endPos.y-this.startPos.y, this.d));
			this.moveTo(new Pos(x, y));
			this.timer = setTimeout(function(){ that.move()}, this.timeInterval);
		}else{
			this.moveTo(this.endPos);
			this.onStop();
		}
	},
	/**
	 * 开始执行滑动
	 */
	run: function(){
		this.onStart();
		this.move();
	}
};
