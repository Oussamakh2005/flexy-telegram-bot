function getPlan(phoneNumber : string){
    if(phoneNumber.startsWith("05")){
        return 0;
    }else if(phoneNumber.startsWith("06")){
        return 1;
    }else{
        return 2;
    }
}

export default getPlan;
