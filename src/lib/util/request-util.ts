var qs = require('querystring')


export class RequestUtil {
    constructor(){}

    queryString(dict:any){
        return qs.stringify(dict);
    }

    sortedQueryString(dict: any) {
        var keys: string[] = [];
        var sorted_obj = {};
        for(var key in dict){
            keys.push(key);
        }
        // sort keys
        keys.sort();
        // create new array based on Sorted Keys
        for(var i in keys) {
            sorted_obj[keys[i]] = dict[keys[i]];
        }
        return qs.stringify(sorted_obj);
    }
    sortedQueryKeyValue(dict: any) {
        var keys: string[] = [];
        for(var key in dict){
            keys.push(key);
        }
        // sort keys
        keys.sort();
        // create new array based on Sorted Keys
        var ret: string = "";
        for(var i in keys) {
            ret += keys[i] + "=" + dict[keys[i]];
        }
        return ret;
    }


}
