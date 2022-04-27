function CloneDeep (obj){
    const result = Array.isArray(obj) ? [] : {};
    for(let i in obj){
        if(obj[i]&&typeof obj[i] === 'object'){
            result[i] = CloneDeep(obj[i]);
        } else {
            result[i] = obj[i];
        }
    }
    return result;
}
export default{
    CloneDeep,
}