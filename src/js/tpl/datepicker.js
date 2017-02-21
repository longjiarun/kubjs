module.exports = function(data){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
__p+='<div class="kub-datepicker-header"><button class="kub-datepicker-button J_dialogButton" data-index="0"> '+
((__t=( data.cancelText))==null?'':__t)+
' </button><div class="kub-datepicker-header-text">'+
((__t=( data.title))==null?'':__t)+
'</div><button class="kub-datepicker-button J_dialogButton" data-index="1"> '+
((__t=( data.confirmText))==null?'':__t)+
' </button></div><div class="kub-datepicker"><div class="kub-datepicker-column year" data-type="year"><ul><li></li><li></li> ';
for(var i=data.yearRange[0],j=0;i<=data.yearRange[1];i++,j++){
__p+=' <li data-value="'+
((__t=( i))==null?'':__t)+
'" data-index="'+
((__t=( j))==null?'':__t)+
'"> '+
((__t=( i ))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-column month" data-type="month"><ul><li></li><li></li> ';
for(var i=1 ;i<= 12; i++){
__p+=' <li data-value="'+
((__t=( i-1))==null?'':__t)+
'" data-index="'+
((__t=( i-1))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-column day" data-type="day"><ul><li></li><li></li> ';
for(var i=1 ;i<=31;i++){
__p+=' <li data-value="'+
((__t=( i))==null?'':__t)+
'" data-index="'+
((__t=( i-1))==null?'':__t)+
'"> '+
((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-column hour" data-type="hour"><ul><li></li><li></li> ';
for(var i=0 ;i<=23;i++){
__p+=' <li data-value="'+
((__t=( i))==null?'':__t)+
'" data-index="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-column minute" data-type="minute"><ul><li></li><li></li> ';
for(var i=0 ;i<=59;i++){
__p+=' <li data-value="'+
((__t=( i))==null?'':__t)+
'" data-index="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-column second" data-type="second"><ul><li></li><li></li> ';
for(var i=0 ;i<=59;i++){
__p+=' <li data-value="'+
((__t=( i))==null?'':__t)+
'" data-index="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
' </li> ';
}
__p+=' <li></li><li></li></ul></div><div class="kub-datepicker-overlay"></div></div>';
return __p;
};