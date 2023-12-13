import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import searchId from '../searchId/searchIdStyle.css';
import {useState} from 'react';
import Swal from 'sweetalert2';

const SearchPwResult = () => {
    const [data, setData] = useState({ name: '', phone: '' });
    const navigate = useNavigate();
    const [warning, setWarnings] = useState('');
    const location = useLocation();
    const result = location.state.result;
    const [password, setPassword] = useState({ password: '', passwordCheck: ''})
    console.log(result.password);

    // 폼 제출
    const handleSubmit = () => {
        
    }

    // input 데이터 저장
    const handleChange = () => {

    }

    return(
        <div className='searchId-container'>
        <div className='searchId-section'>
            <div className='searchId-title'>비밀번호 재설정</div> <br/>
            <form onSubmit={handleSubmit}>
            <div className='searchIdInputDiv'>
                <label>비밀번호 <br/>
                <input type="password" id="password" name="password" onChange={handleChange} /></label>
            </div>
              <br/><br/>
            <div className='searchIdInputDiv'>
              <label> 비밀번호 확인  
              {warning && <span className='searchId-AuthPhone'>{warning}</span>}<br/>
              <input type="password" id="passwordCheck" name="passwordCheck" onChange={handleChange} /></label>
            </div>
            <div className='searchId-button'>
                <button type="submit"> 확인 </button>
            </div>
            <div className='searchInfo'> <a href="/login">회원가입/로그인</a></div>
            </form>
        </div>
        </div>
    );
}

export default SearchPwResult;

