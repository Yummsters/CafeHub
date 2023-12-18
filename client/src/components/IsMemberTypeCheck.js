export const IsUserCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);
    const memberData = loginData.member;
    const member = JSON.parse(memberData);
    return member.memberType === "USER";
};

export const IsStoreCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);
    const memberData = loginData.member;
    const member = JSON.parse(memberData);
    return member.memberType === "STORE";
};  

export const IsSManagerCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);
    const memberData = loginData.member;
    const member = JSON.parse(memberData);
    return member.memberType === "MANAGER";
};
