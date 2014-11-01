function jetBar(){
	this.x = 0;
	this.y = 8;

	this.color = 'green';

	this.drawLine = function(length, modifier){
		ctx.fillStyle = this.color;

		ctx.beginPath();

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + length, this.y);
		
		ctx.lineWidth = 15;

		ctx.stroke();
	}
}