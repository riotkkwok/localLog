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
        var exist = this.read(key) ? this.read(key)+';' : '';
        var ts = this.getConfig('timestamp') ? '['+(new Date).toTimeString().split(' ')[0]+'] ' : '';
        window.localStorage.setItem(key, exist+ts+val);
    };
    logger.prototype.read = function(key){
        if(key === undefined){
            key = this.getConfig('key');
        }
        return window.localStorage.getItem(key);
    };
    logger.prototype.readAsList = function(key){
        var tmp, time, result = this.read(key);
        result = result.split(';');
        for(var i=0; i<result.length; i++){
            time = result[i].match(/^\[[0-9]+\:[0-9]+\:[0-9]+\]/g);
            if(time instanceof Array){
                tmp = result[i].replace(time[0]+' ', '');
                time = time[0].replace(/\[|\]/g, '');
            }else{
                tmp = result[i];
                time = null;
            }
            result[i] = {
                time: time,
                val: unescape(tmp)
            };
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

        conf.key = conf.name + conf.today;

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
            if((new RegExp('^'+name+'[0-9]{8}$')).test(key)){
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