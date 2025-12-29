function amountValidation(amount : string){
    const parsedAmount = parseInt(amount);
    return isNaN(parsedAmount) ? false : parsedAmount;
}

export default amountValidation;