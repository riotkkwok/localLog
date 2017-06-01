/*
 * A client side persistent logger based on localStorage.
 *
 * Released under the MIT license
 *
 * See https://github.com/riotkkwok/localLogger for details
 *
 * Auther: Rio Kwok
 *
 * Version: 1.0.0
 *
 */

(function(factory){
    if(!window || typeof window !== 'object'){
        // non-browser
        console.log('Supports browser env only.');
        return ;
    }

    if(!window.localStorage || typeof window.localStorage !== 'object'){
        // not supports localStorage
        console.log('Browser does not support localStorage.');
        return ;
    }

    if(typeof define === 'function' && define.amd){
        // AMD
        define([], factory);
    }else if(typeof exports === 'object'){
        // CommonJS
        module.exports = factory();
    }else{
        // Browser globals
        window.LocalLogger = factory();
    }
}(function(){
    var logger = function(opt){
        var config = {};
        if(opt && typeof opt === 'object'){
            config = init(opt);
        }
        this.getConfig = function(n){
            return config[n];
        }
    };
    logger.prototype.write = function(key, val){
        if(val === undefined){
            val = key;
            key = this.getConfig('key');
        }
        val = escape(val.toString());
        var exist = this.read(false, key) ? this.read(false, key)+';' : '';
        var ts = this.getConfig('timestamp') ? '['+(new Date).toTimeString().split(' ')[0]+']' : '';
        window.localStorage.setItem(key, exist+ts+val);
    };
    logger.prototype.read = function(isGetPrev, key){
        if(key === undefined){
            key = this.getConfig('key');
        }
        if(!!isGetPrev){
            key = this.getConfig('name');
            var vals = [],
                re = new RegExp('^'+key+'__'+'[0-9]{8}'+'$');
            for(var i=0; i<window.localStorage.length; i++){
                if(re.test(window.localStorage.key(i))){
                    vals.push({
                        date: window.localStorage.key(i).replace(key+'__', ''),
                        log: window.localStorage.getItem(window.localStorage.key(i))
                    });
                }
            }
            return vals;
        }else{
            return window.localStorage.getItem(key);
        }
    };
    logger.prototype.readAsList = function(isGetPrev, key){
        var tmp, time, result = this.read(isGetPrev, key);
        if(!isGetPrev){
            result = [{
                log: result
            }];
        }
        for(var i=0; i<result.length; i++){
            result[i].log = result[i].log.split(';');
            for(var j=0; j<result[i].log.length; j++){
                time = result[i].log[j].match(/^\[[0-9]+\:[0-9]+\:[0-9]+\]/g);
                if(time instanceof Array){
                    tmp = result[i].log[j].replace(time[0], '');
                    time = time[0].replace(/\[|\]/g, '');
                }else{
                    tmp = result[i].log[j];
                    time = null;
                }
                result[i].log[j] = {
                    time: time,
                    val: unescape(tmp)
                };
            }
        }
        if(!isGetPrev){
            result = result[0].log;
        }
        return result;
    };
    logger.prototype.clean = function(daysBefore){
        clean(this.getConfig('name'), this.getConfig('now'), daysBefore);
    };

    function init(opt){
        var conf = {};

        conf.now = new Date;

        conf.today = dateString(conf.now);

        conf.name = opt.name || 'LocalLogger';

        conf.key = conf.name + '__' + conf.today;

        conf.timestamp = !!opt.timestamp;

        conf.maxDays = parseInt(opt.maxDays, 10) || 3;

        // clean expired log
        clean(conf.name, conf.now, conf.maxDays);

        return conf;
    }

    function dateString(d){
        return (d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()).replace(/\b([0-9]{1})\b/g, '0$1').replace(/\//g, '');
    }

    function clean(name, now, days){
        var length = window.localStorage.length;
        if(typeof days !== 'number' || days <= 0){
            throw new Error('Invalid arguments of \'clean\' method.');
            return;
        }
        for(var tmp, key, i=length-1; i>=0; i--){
            key = window.localStorage.key(i);
            if((new RegExp('^'+name+'__'+'[0-9]{8}$')).test(key)){
                tmp = new Date(now);
                tmp.setDate(tmp.getDate()-days);
                if(name + dateString(tmp) > key){
                    window.localStorage.removeItem(key);
                }
            }
        }

    }

    return logger;
}));