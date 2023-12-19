import {configureStore} from "@reduxjs/toolkit";
import {persistReducer,PERSIST, PURGE} from "redux-persist";
import storage from "redux-persist/lib/storage";  //localStorage에 저장
//import storageSession from "redux-persist/lib/storage/session";  //sessionStorage에 저장
//왜? redux의 storage 페이지를 새로고침하면 state가 사라짐
//npm install --save @reduxjs/toolkit
//npm install --save redux-persist

export const initialState = {
    isLogin:false,
    member:{memNo:'', name : '', nickname : '', email:'', social : null, status : true, memberType:null},
    accessToken:'',
    cafe:{cafeNo:'', cafeName:'', thumbImg: null, address:'', isPaid:false, paidDate : null},
    payment: {isSuccess: false, paymentKey: '', memNo: null}
}

const reducer = (currentState,action) => {
    if(currentState===undefined) {
        return initialState;
    }
    const newState = {...currentState};
    switch(action.type) {
        case "isLogin":  newState.isLogin=action.payload; break;
        case "member": newState.member=action.payload; break;
        case "accessToken": newState.accessToken=action.payload; break;
        case "cafe" : newState.cafe=action.payload; break;
        case "payment" : newState.payment=action.payload; break;
        default: 
    }
    return newState;
}

const persistConfig = {
    key:'root',
    storage, // 기본으로 로컬 스토리지 사용
}

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({reducer:{persistedReducer},
    middleware:(getDefaultMiddleware)=> 
        getDefaultMiddleware({
            serializableCheck:false,
        })
    });

export default store;