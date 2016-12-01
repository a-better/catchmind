var ColorPicker = function(canvas, image){
	colorPicker = this;
	console.log(canvas);
	this.ctx = canvas.getContext('2d');
	console.log(this.ctx);
	$(image).on('load', function(){
		canvas.width = image.width;
		canvas.height = image.height;
		colorPicker.ctx.drawImage(image,0, 0, image.width, image.height);	
		$('#color_picker').click(function(event){
		  // getting user coordinates
		  var x = event.pageX - this.offsetLeft;
		  var y = event.pageY - this.offsetTop;
		  // getting image data and RGB values
		  var img_data = colorPicker.ctx.getImageData(x, y, 1, 1).data;
		  var R = img_data[0];
		  var G = img_data[1];
		  var B = img_data[2];  
		  colorPicker.rgba = 'rgba('+R + ',' + G + ',' + B + ',' + '1)';
		  console.log(colorPicker.rgba);
		  // convert RGB to HEX
		  // making the color the value of the input
		});
	});
	this.rgba = 'rgba(0, 0, 0, 0.8)';
	$('#color_picker').hide();
	//$('#color_picker').show();

};

ColorPicker.prototype.constructor = ColorPicker;

ColorPicker.prototype ={

};

module.exports = ColorPicker;