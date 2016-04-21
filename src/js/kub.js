try{
    var Kub = window.Kub = {
        $: require('./lite'),
        core: require('./core'),
        dateHelper: require('./date'),
        cookie: require('./cookie'),
        LazyLoad: require('./lazyload'),
        Dialog: require('./dialog'),
        Alert: require('./alert'),
        Confirm: require('./confirm'),
        Prompt: require('./prompt'),
        Toast: require('./toast'),
        Loader: require('./loader'),
        Swiper: require('./swiper')
    };


    if (typeof define === 'function') {
        define(function() {
            return Kub;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Kub;
    }
}catch(e){
    alert(e.message)
}
