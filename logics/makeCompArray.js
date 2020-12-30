export default function makeCompArray (array){

    let str = ''

    if(array.length === 8 || array.length === 4){
        for(let i = 0; i < array.length; i++){
            if(array[i] / 10 < 1) {
                str += '0' 
                str += array[i]
            } else {
                str += array[i]
            }
            if(i !== array.length - 1) str += ','
        }
    } 

    return str
}