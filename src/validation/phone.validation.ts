function validatePhoneNumber(phoneNumber : string) {
    const regex = /^0(5|6|7)[0-9]{8}$/;
    return regex.test(phoneNumber);
}

export default validatePhoneNumber;