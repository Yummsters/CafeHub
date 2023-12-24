

export const IsLoginCheck = () => {
    const loginDataString = localStorage.getItem("persist:root");
    const loginData = JSON.parse(loginDataString);  
       
    if(!loginData || loginData.isLogin === undefined || loginData.isLogin === null) {
        return false;
    }else{
        console.log(loginData.isLogin);
        return loginData.isLogin==="false";
    }
};
