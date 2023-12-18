import keypadStyle from './keypadStyle.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import {Container, Col, Row} from 'reactstrap';
import {useSelector} from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getCookie } from '../components/Cookie';


const Keypad = () =>{
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const navigate = useNavigate();
    const [phone, setPhone] = useState('010'); 

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
            setPhone(phone + innerText);
        } 
        else{
            if(phone.length !== 3) setPhone(phone.slice(0, -1));
            
        } 
    };

    const phoneSubmit = (e) =>{
       e.preventDefault();

       setPhone('010');

       axios.get(`http://localhost:8080/member/phone/${phone}`,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
       })
       .then(res=>{
            navigate('/choicePoint/'+res.data);
       })
       .catch(err=>{
            console.log(err);
            const error = err.response.data;
            Toast.fire({
                icon: 'error',
                title: error
            });
       })
        
    }

    const backPoint = () =>{
        window.location.href="/storeInfo"
    }
    
    return(
        <div className="keypad-container">
            <div className="closeBtn">
                <img onClick={backPoint} src='/img/X.png' />
             </div>
            <input className="keypadInput" type="text" id="phoneNum" name="phoneNum" style={{ height: '20vh' }} value={phone}/>
            <div className="keypadNum-section">
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
                    <Col className='keypad-confirm' onClick={phoneSubmit}>확인</Col>
                    <Col className='keypad' name="0" onClick={handleClick}>0</Col>
                    <Col className='keypad' name="cancel" onClick={handleClick}>⬅️</Col>
                </Row>
               </Container>
            </div>
        </div>
    );
}

export default Keypad;