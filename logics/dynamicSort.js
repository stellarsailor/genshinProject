export default function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        if( !isNaN(a[property]) ) a[property] = Number(a[property]); 
        if( !isNaN(b[property]) ) b[property] = Number(b[property]);
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}