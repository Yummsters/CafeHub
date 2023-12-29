import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import searchId from '../searchId/searchIdStyle.css';
import {useState} from 'react';
import { url } from '../config.js'
import { Toast } from '../components/Toast.js'

const SearchPwResult = () => {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const [warning, setWarnings] = useState('');
    const location = useLocation();
    const id = location.state.result; // 찾기 시도한 id

    // input 데이터 저장
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' && !/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(value) && value.trim() !== '') {
          setWarnings('소문자/숫자/특수문자 포함 8~20자');
        } else {
          setWarnings('');
        }
      setData({ ...data, [name]: value });
    }
    
    // 폼 제출
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.password || !data.passwordCheck) {
          Toast('error', '비밀번호를 입력해주세요')
            return;
        }
        if (data.password !== data.passwordCheck) {
          Toast('error', '비밀번호가 일치하지 않습니다')
            return;
        }

        axios.put(`${url}/resetPw/${id}`, { password: data.password })
        .then((res) => {
            Toast('error', '완료되었습니다\n로그인 페이지로 이동합니다')
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        })
        .catch((error) => {
            Toast('error', '실패했습니다\n다시 시도해주세요')
        })
    }

    return(
        <div className='searchId-container'>
        <div className='searchPw-bg'>
        <div className='searchId-section'>
            <div className='searchId-title'>비밀번호 재설정</div> <br/>
            <form onSubmit={handleSubmit}>
            <div className='searchIdInputDiv'>
                <label>새 비밀번호 {warning && <span className='searchId-AuthPhone'>{warning}</span>}<br/>
                <input type="password" id="password" name="password" onChange={handleChange} /></label>
            </div>
              <br/><br/>
            <div className='searchIdInputDiv'>
              <label> 새 비밀번호 확인</label>
              <input type="password" id="passwordCheck" name="passwordCheck" onChange={handleChange} />
            </div>
            <div className='searchId-button'>
                <button type="submit"> 확인 </button>
            </div>
            <div className='searchInfo'> <a href="/login">회원가입/로그인</a></div>
            </form>
        </div>
        </div>
        </div>
    );
}

export default SearchPwResult;

