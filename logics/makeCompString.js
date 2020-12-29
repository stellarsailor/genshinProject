export default function makeCompString (array){
    let str = ''

    if(array.length === 8){
        for(let i = 0; i < 8; i++){
            if(array[i] / 10 < 1) {
                str += '0' 
                str += array[i]
            } else {
                str += array[i]
            }
        }
    }
    return str
}