function validatePhoneNumber(phoneNumber : string) {
    const regex = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/;
    return regex.test(phoneNumber);
}

export default validatePhoneNumber;