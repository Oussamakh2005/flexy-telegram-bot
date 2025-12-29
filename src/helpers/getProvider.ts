function getProvider(phoneNumber : string){
    const prefix = phoneNumber.substring(0,3);
    if(prefix === "05"){
        return "ooredoo";
    }else if(prefix === "06"){
        return "mobilis";
    }else{
        return "djezzy"
    }
}

export default getProvider;
