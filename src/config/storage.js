const  filtersStorage=(obj, action) => {
     let _storage = action?localStorage.setItem(obj.key, JSON.stringify(obj.value)): JSON.parse(localStorage.getItem(obj)) 
    return _storage;
 }
 export default filtersStorage