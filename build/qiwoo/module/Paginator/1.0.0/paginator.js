(function(define, global) { 
define(['module/module/widget/1.0.0/widget'], function(Widget) {
Widget = Widget || this.Widget;


    function Paginator() {};
    return Paginator;
}); 
}) ( typeof define === 'function' && define.amd ? define : function (name, requires, factory) { if(typeof name === 'function') { factory = name; } else if(typeof requires === 'function') { factory = requires; } if(typeof module != 'undefined'){ module.exports = factory(require); }else if(typeof window != 'undefined'){ window.Paginator= factory(); } }, this);