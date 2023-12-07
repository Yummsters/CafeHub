import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import {useDispatch} from 'react-redux';
import axios from 'axios';

const OAuth2 = () => {
    const dispatch = useDispatch();    
    const {accessToken} = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState({memNo:'', name : '', nickname : '', email:'', social : '', status : true, memberType:''});

    useEffect(()=> {
        console.log("accessToken:"+accessToken);
        dispatch({type:"accessToken", payload:accessToken});
        dispatch({type:"isLogin", payload:true});
        axios.get(`http://localhost:8080/member`,{
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            console.log(res);
            setMember(res.data);
            dispatch({type:"member", payload:res.data});
            navigate("/");
        })
        .catch(err =>{
            console.log(err);
        })
    }, [])
}

export default OAuth2;