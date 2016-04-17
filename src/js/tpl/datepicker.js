module.exports=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="kub-datepicker"><div class="kub-datepicker-column year" data-type="year"><ul><li class="kub-datepicker-show"></li> ';
for(var i=data.yearRange[0];i<=data.yearRange[1];i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( i ))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column month" data-type="month"><ul><li class="kub-datepicker-show"></li> ';
for(var i=1 ;i<= 12; i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i-1))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column day" data-type="day"><ul><li class="kub-datepicker-show"></li> ';
for(var i=1 ;i<=31;i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column hour" data-type="hour"><ul><li class="kub-datepicker-show"></li> ';
for(var i=0 ;i<=23;i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column minute" data-type="minute"><ul><li class="kub-datepicker-show"></li> ';
for(var i=0 ;i<=59;i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column second" data-type="second"><ul><li class="kub-datepicker-show"></li> ';
for(var i=0 ;i<=59;i++){
__p+=' <li class="kub-datepicker-show" data-value="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-overlay"></div></div>';
}
return __p;
};