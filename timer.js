var colors = require('colors');
var moment = require('moment-timezone');
const EventEmitter = require('events');
const emitter = new EventEmitter();

var currentDate = moment();
finalTime=process.argv[2];
var endDate = moment.tz(finalTime, "Europe/Moscow");
var seconds = (endDate-currentDate) / 1000;

var minutes = seconds/60; 
var hours = minutes/60;
var days = hours / 24;
minutes = (hours - Math.floor(hours)) * 60; 
days = Math.floor(days);
hours =  Math.floor(hours)- days * 24; 

seconds = Math.floor((minutes - Math.floor(minutes)) * 60); 
minutes = Math.floor(minutes); 

class Timers {
    constructor({ type, payload }) {
        this.type = type;
        this.payload = payload;
    }
}

const generateNewTimers = () => {
  const TimersType = {
    type: 'timer',
    payload: 'timer is working',
};

  return new Timers(TimersType);
};

function initializeTimer() {
	
	if (days < 0) {
		console.log(colors.red("Установлено неверное время таймера!!!"));
		emitter.removeListener('timer', initializeTimer); 
		clearInterval(timerId);
		process.exit();
	}

	if (seconds > 0) {
		setTimePage(days, hours, minutes, seconds); 
		return;
	} 

	if (seconds === 0) {
		return;
	} 
		
	else {
		console.log(colors.red("Введите время в формате  ISO8601,например: 2021-10-29T12:00:00 "));
		process.exit();
	}
}

const secOut = async () => {
	const { type, payload } = generateNewTimers();
	const delay = 1000;
	emitter.emit(type, payload);
  if (seconds == 0) { 
	  if (minutes == 0) { 
		  if (hours == 0) { 
				 if(days == 0){
					console.log(colors.red("Время вышло!!!"));
					emitter.removeListener('timer', initializeTimer); 
					clearInterval(timerId);
					process.exit();
				  }
				  else{
					  days--; 
					  hours = 24; 
					minutes = 59; 
					seconds = 59; 
					clearInterval(timerId);
				  }
		  }
		  else {
			  hours--; 
			  minutes = 59; 
			  seconds = 59; 
			  clearInterval(timerId);
		  }
	  }
	  else {
		  minutes--; 
		  seconds = 59; 
		  clearInterval(timerId);
	  }
  }
  else {
	  seconds--; 
	  clearInterval(timerId);
  }

  await new Promise(resolve => setTimeout(resolve, delay));
  await secOut();
}
timerId = setInterval(secOut, 1000) 

function setTimePage(d,h,m,s) { 
 
	console.log(colors.yellow("Осталось дней: "+ d), colors.blue(" часов:" +h), colors.green(" минут:" +m),colors.red(" секунд:" +s));
	setTimeout(console.clear, 1000);
   
  }
 
emitter.on('timer', initializeTimer);



