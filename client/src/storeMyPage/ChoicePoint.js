import axios from "axios";
import { useParams } from "react-router";
import {useSelector} from 'react-redux';
import { Button } from "reactstrap";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';
import { useDispatch } from 'react-redux';
import {tokenCreate, tokenExpried} from '../login/TokenCheck';
import { url } from '../config.js'

// 포인트 및 리뷰권한 테이블 생성 후 로직 추가 필요
const ChoicePoint = () => {
    const {memNo} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const cafeNo = useSelector(state => state.persistedReducer.cafe.cafeNo);

    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    // 포인트 적립
    const pointSave = (e) =>{
        e.preventDefault();
        axios.post(`${url}/store/point/save/${memNo}/cafe/${cafeNo}`,null,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
        })
        .then(res=>{
            tokenCreate(dispatch, setCookie, res.headers)
            .then(()=>{
                Toast.fire({
                    icon: 'success',
                    title: '보유 커피콩 : '+res.data
                }).then(()=>{
                    navigate("/keypad");
                })
            })
        })
        .catch(err=>{
            console.log(err);
            if(err.response !== undefined){
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
            }else{
                Toast.fire({
                    icon: 'error',
                    title: err
                })
            }
        })
    }

    // 포인트 사용 >> 사용 포인트 입력페이지 이동
    const pointUse = (e) =>{
        e.preventDefault();

       // 회원 포인트 조회 후 저장
       axios.get(`${url}/member/point/${memNo}`,
       {
           headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
           }
       })
       .then(res=>{
           const point = res.data;
           tokenCreate(dispatch, setCookie, res.headers)
            .then(()=>{
                if(point === 0){
                    Toast.fire({
                        icon: 'error',
                        title: '사용가능한 포인트가 없습니다'
                    })
                }else{
                    navigate("/usePoint/"+memNo);
                }
            })
       })
       .catch(err =>{
        console.log(err);
            if(err.response !== undefined){
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
            }else{
                Toast.fire({
                    icon: 'error',
                    title: '현재 포인트 사용이 불가능합니다 관리자에게 문의하세요'
                })
            }
        })
    }

    const backPoint = () =>{
        window.location.href="/storeInfo"
    }

    return(
        <div className="choicePoint-container">
            <div className="closeBtn">
                <img onClick={backPoint} src='/img/X.png' />
             </div>
            <div className="choicePoint-title">커피콩 적립/사용</div>
            <div className="choiceButton-container">
                <Button className="choicePoint-save" onClick={pointSave}> 적립 </Button>
                <Button className="choicePoint-use" onClick={pointUse}> 사용</Button>
            </div>
        </div>
    );
}

export default ChoicePoint;