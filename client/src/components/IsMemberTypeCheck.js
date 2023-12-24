export const IsUserCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);

    if(!loginData || loginData.member === undefined || loginData.member === null){
        return false;
    }
    const member = JSON.parse(loginData.member);
    return member.memberType === "USER";
};

export const IsStoreCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);

    if(!loginData || loginData.member === undefined || loginData.member === null){
        return false;
    }
    const member = JSON.parse(loginData.member);
    return member.memberType === "STORE";
};  

export const IsSManagerCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);

    if(!loginData || loginData.member === undefined || loginData.member === null){
        return false;
    }
    const member = JSON.parse(loginData.member);
    return member.memberType === "MANAGER";
};
