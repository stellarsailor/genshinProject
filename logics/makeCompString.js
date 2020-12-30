export default function makeCompString (array, needSort){

    let tempArr
    if(needSort){
        tempArr = array.slice(0).sort((a, b) => a - b)
    } else {
        tempArr = array
    }

    let str = ''

    if(tempArr.length === 8 || tempArr.length === 4){
        for(let i = 0; i < tempArr.length; i++){
            if(tempArr[i] / 10 < 1) {
                str += '0' 
                str += tempArr[i]
            } else {
                str += tempArr[i]
            }
        }
    } else {
        for(let i = 0; i < tempArr.length; i++){
            if(tempArr[i] / 10 < 1) {
                str += '0' 
                str += tempArr[i]
            } else {
                str += tempArr[i]
            }
        }
        for(let i = 0; i < 4 - tempArr.length; i++){
            str += '99'
        }
    }
    return str
}