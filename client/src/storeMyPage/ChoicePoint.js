import axios from "axios";
import { useParams } from "react-router";
import {useSelector} from 'react-redux';
import { Button } from "reactstrap";
import Swal from 'sweetalert2';
import { useState } from "react";
import { useNavigate } from 'react-router';



// 포인트 및 리뷰권한 테이블 생성 후 로직 추가 필요
const ChoicePoint = () => {
    const {memNo} = useParams();
    const navigate = useNavigate();
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const [cafeNo,setCafeNo] = useState(1);

    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // 포인트 적립
    const pointSave = (e) =>{
        e.preventDefault();
        axios.post(`http://localhost:8080/point/save/${memNo}/cafe/${cafeNo}`,{
            headers : {
                Authorization :accessToken,
            }
        })
        .then(res=>{
            Toast.fire({
                icon: 'success',
                title: '보유 커피콩 : '+res.data
            }).then(()=>{
                navigate("/keypad");
            })
        })
        .catch(err=>{
            Toast.fire({
                icon: 'error',
                title: err.name
            })
        })
    }

    // 포인트 사용 >> 사용 포인트 입력페이지 이동
    const pointUse = (e) =>{
        e.preventDefault();
        navigate("/usePoint/"+memNo);
    }

    return(
        <div className="choicePoint-container">
            <div className="choicePoint-title">커피콩 적립/사용</div>
            <div className="choiceButton-container">
                <Button className="choicePoint-save" onClick={pointSave}> 적립 </Button>
                <Button className="choicePoint-use" onClick={pointUse}> 사용</Button>
            </div>
        </div>
    );
}

export default ChoicePoint;