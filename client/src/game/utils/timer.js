var Timer = function(){
    this.interval = null;
};
Timer.prototype.constructor = Timer;
Timer.prototype = {
    dailyMissionTimer : function(duration){     
       var timer = duration * 3600;
       var hours, minutes, seconds;
       
       this.interval = setInterval(function(){
           hours   = parseInt(timer / 3600, 10);
           minutes = parseInt(timer / 60 % 60, 10);
           seconds = parseInt(timer % 60, 10);
           
           hours   = hours < 10 ? "0" + hours : hours;
           minutes = minutes < 10 ? "0" + minutes : minutes;
           seconds = seconds < 10 ? "0" + seconds : seconds;
           
           $('#time-hour').text(hours + ' ');
           $('#time-min').text(minutes+ ' ');
           $('#time-sec').text(seconds+ ' ');

           if (--timer < 0) {
               timer = 0;
               clearInterval(this.interval);
           }
       }, 1000);
   }
    
};


module.exports = Timer; 