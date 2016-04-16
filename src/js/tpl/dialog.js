module.exports=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="kub-dialog-modal '+
((__t=( data.className))==null?'':__t)+
' ';
if( data.modal ){
__p+=' kub-modal ';
}
__p+='"><div class="kub-dialog-wrapper"><div class="kub-dialog-container"><div class="kub-dialog" id="J_dialog"> ';
if(data.showHeader){
__p+=' <div class="kub-dialog-header clearfix"><strong> '+
((__t=( data.title))==null?'':__t)+
' </strong></div> ';
}
__p+=' <div class="kub-dialog-body"> '+
((__t=( data.message))==null?'':__t)+
' </div> ';
if(data.buttons && data.buttons.length){
__p+=' <div class="kub-dialog-footer kub-column'+
((__t=( data.buttons.length))==null?'':__t)+
'"> ';
 for (var i=0,j=data.buttons.length;i<j;i++){
__p+=' <button class="kub-dialog-button J_dialogButton '+
((__t=( data.buttons[i].className || ''))==null?'':__t)+
'" data-index="'+
((__t=( i))==null?'':__t)+
'"> '+
((__t=( data.buttons[i].text))==null?'':__t)+
' </button> ';
}
__p+=' </div> ';
}
__p+=' </div></div></div></div>';
}
return __p;
};