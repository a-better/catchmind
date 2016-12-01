var Paint = function(oldX, oldY, x, y, rgba, brushSize){
	this.oldX = oldX;
	this.oldY = oldY;
	this.x = x;
	this.y = y;
	this.rgba = rgba;
	this.brushSize = brushSize;
};

Paint.prototype.constructor = Paint;

Paint.prototype = {
};

module.exports = Paint;