import { useEffect, useState } from 'react';
import keypadStyle from './keypadStyle.css';
import {Container, Col, Row} from 'reactstrap';
import {useSelector} from 'react-redux';
import { useParams } from "react-router";
import axios from 'axios';
import Swal from 'sweetalert2';

const UsePoint = () =>{
    const [point, setPoint] = useState(''); // 입력 포인트
    const [myPoint, setMyPoint] = useState(200); // 회원 포인트
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const {memNo} = useParams();

    useEffect(()=>{
        // 회원 포인트 조회 후 저장
        axios.get(`http://localhost:8080/point/${memNo}`,
        {
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            console.log(res.data);
            setMyPoint(res.data);
        })
        .catch(err =>{
            console.log(err);
        })
    })

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

    const handleClick = (e) => {
        // 버튼 클릭 시 동작하는 함수
        const innerText = e.target.innerText;
        console.log('Clicked:'+innerText);
        if(innerText !== '⬅️'){
            setPoint(point + +innerText);
        } 
        else{
            setPoint(point.slice(0, -1));
        } 
    };

    const pointSubmit = (e) =>{
       e.preventDefault();

       setPoint('');

       if(myPoint<point){
        Toast.fire({
            icon: 'error',
            title: '사용 가능 포인트를 확인해주세요.'
        })
        }else{
            //
            axios.post(`http://localhost:8080/point/use/${memNo}`,{
                point : point
                //cafeNo : cafeNo
                // 카페 사장의 memNo도 가져가야 함,,, 어떻게 하지,,,
                },{
                headers : {
                    Authorization : accessToken
                }
            })
        }
    }
  
    return (
      <div className="useKeypad-container" style={{ height: '80vh' }}>
        <p className='usePoint-public'>사용 가능 포인트 : {myPoint*100}원 / {myPoint}개</p>
        <input className="keypadInput-usePoint" type="text" id="phone" name="phone" style={{ height: '20vh' }} value={point + "원"}/>
            <div className="keypadNum-section" style={{ height: '80vh' }}>
               <Container>
                <Row xs="3" style={{ height: '80vh' }}>
                    <Col className='keypad' name="1" onClick={handleClick}>1</Col>
                    <Col className='keypad' name="2" onClick={handleClick}>2</Col>
                    <Col className='keypad' name="3" onClick={handleClick}>3</Col>
                    <Col className='keypad' name="4" onClick={handleClick}>4</Col>
                    <Col className='keypad' name="5" onClick={handleClick}>5</Col>
                    <Col className='keypad' name="6" onClick={handleClick}>6</Col>
                    <Col className='keypad' name="7" onClick={handleClick}>7</Col>
                    <Col className='keypad' name="8" onClick={handleClick}>8</Col>
                    <Col className='keypad' name="9" onClick={handleClick}>9</Col>
                    <Col className='keypad-confirm' onClick={pointSubmit}>사용</Col>
                    <Col className='keypad' name="0" onClick={handleClick}>0</Col>
                    <Col className='keypad' name="cancel" onClick={handleClick}>⬅️</Col>
                </Row>
               </Container>
            </div>
        </div>
    );
}

export default UsePoint;