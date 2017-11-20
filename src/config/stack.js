
export const stackUpdata = () => {
    let _stackData = filtersStorage('stackData')
    if (_stackData) {
        for (var i in _stackData) {
            //   console.log(i, a[i])
            (function(uri, data) {
                feathers.service(uri).create(data).then(res=>{
                    delete _stackData[uri]
                    filtersStorage({'stackData':_stackData}, 'save')
                });
            })(i, _stackData[i])
        }
    }
}