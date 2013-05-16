//counter.js v1.7 - debug
var day;
var todayHours;
var todayMinutes;
var todayDesc;
var nextDay = false;

setInterval(function doCount(){
    var t1Hours = [9,9,10,11,11,11,12,13,14,15];
    var t1Minutes = [0,5,5,10,30,50,50,55,15,15];
    var t1Desc = ["School Starts","Period 1","Period 2","Lunch","Lunch 2","Period 3","Period 4","Recess","Period 5","End of Day"];

    var t2Hours = [9,9,10,11,11,12,12,13,14,15];
    var t2Minutes = [0,5,5,10,30,30,50,10,10,15];
    var t2Desc = ["School Starts","Period 1","Period 2","Recess","Period 3","Lunch","Lunch 2","Period 4","Period 5","End of Day"];

    var t3Hours = [9,9,10,11,11,12,13,14,14,15];
    var t3Minutes = [25,30,25,25,45,5,0,0,20,15];
    var t3Desc = ["School Starts","Period 1","Period 2","Lunch","Lunch 2","Period 3","Period 4","Recess","Period 5","Weekends"];

    var now = new Date();
    day = now.getDay();
    var nowHours = now.getHours();
    var nowMinutes = now.getMinutes();
    var nowSeconds = now.getSeconds();

    //weekday overnight correction
    if ((nowHours*60 + nowMinutes)>=915 && day!=6){
        day += 1;
        nextDay = true;
    }

    //grab timetables
    switch (day){
        case 3: //wed
        case 4:
            todayHours = t2Hours.slice(0);
            todayMinutes = t2Minutes.slice(0);
            todayDesc = t2Desc.slice(0);
            break;
        case 5: //fri
            todayHours = t3Hours.slice(0);
            todayMinutes = t3Minutes.slice(0);
            todayDesc = t3Desc.slice(0);
            break;
        default:
            todayHours = t1Hours.slice(0);
            todayMinutes = t1Minutes.slice(0);
            todayDesc = t1Desc.slice(0);
            break;
    }
    var i = 0;

    if (nextDay==true){
        todayHours[i] += 24;
    }

    //weekend correction
    if (day==6){
        todayHours[i] += 48;
    }else if (day==0){
        todayHours[i] += 24
    }

    //next period
    var nowAbsolute = nowHours*60 + nowMinutes;
    while ((todayHours[i]*60 + todayMinutes[i] - 1) < nowAbsolute && nowAbsolute < 915){i++}
    if (i==10){i=0}


    //put last
    var rHours = (todayHours[i]-nowHours);
    var rMinutes = (todayMinutes[i]-nowMinutes-1);
    var rSeconds = (60-nowSeconds);
    if (rSeconds == 60){
        rMinutes += 1;
        rSeconds = 0;
    }

    //negative correction
    if (todayMinutes[i]-1 < nowMinutes){
        rHours -= 1;
        rMinutes += 60;
    }

    //display
    document.getElementById("description").innerHTML= todayDesc[i];
    if (rHours!=0){
        document.getElementById("counter").innerHTML= "<b>"+rHours+"</b>h, <b>"+ zeroPad(rMinutes) +"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
    }
    else{
        document.getElementById("counter").innerHTML= "<b>"+zeroPad(rMinutes)+"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
    }
    document.getElementById("debug").innerHTML= "Debug: Now="+nowHours+":"+nowMinutes+":"+nowSeconds+", Target="+todayHours[i]+":"+todayMinutes[i];

}, 500);

function zeroPad(num) {
    var s = "000" + num;
    return s.substr(s.length-2);
}
