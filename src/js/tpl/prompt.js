module.exports=function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+=''+
((__t=(data.message))==null?'':__t)+
' <div class="kub-prompt-input-wrapper"><input placeholder="'+
((__t=( data.placeholder))==null?'':__t)+
'" type="'+
((__t=( data.inputType))==null?'':__t)+
'" id="J_input" value="'+
((__t=( data.defaultValue))==null?'':__t)+
'" class="kub-prompt-input"></div>';
}
return __p;
};