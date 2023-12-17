const loginDataString = localStorage.getItem("persist:root");
const loginData = JSON.parse(loginDataString);
const memberData = loginData.member;

export const IsUserCheck = () => {
    
    const member = JSON.parse(memberData);
    return member.memberType === "USER";
};

export const IsStoreCheck = () => {
    const member = JSON.parse(memberData);
    return member.memberType === "STORE";
};  

export const IsSManagerCheck = () => {
    const member = JSON.parse(memberData);
    return member.memberType === "MANAGER";
};
