const loginDataString = localStorage.getItem("persist:root");
const loginData = JSON.parse(loginDataString);

export const IsLoginCheck = () => {
    const isLogin = loginData.isLogin;
    return isLogin==="false";
};
