function amountValidation(amount : string , min : number , max : number){
    const parsedAmount = parseInt(amount);
    if(isNaN(parsedAmount)){
        return false;
    }else if(parsedAmount < min){
        return false;
    }else if(parsedAmount > max){
        return false;
    }
    return parsedAmount
}

export default amountValidation;