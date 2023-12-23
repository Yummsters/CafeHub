import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchId from './searchIdStyle.css';
import {useState} from 'react';
import Swal from 'sweetalert2';
import { url } from '../config.js'
import { Toast } from '../components/Toast.js'

const SearchId = () => {
    const [data, setData] = useState({ name: '', phone: '' });
    const navigate = useNavigate();
    const [warning, setWarnings] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'phone' && !/^[0-9]+$/.test(value) && value.trim() !== '') {
        setWarnings('하이픈(-) 제외 숫자로 작성하세요');
      } else {
        setWarnings('');
      }
      setData({ ...data, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.phone.trim() || !data.name.trim()) { 
            Toast.fire({
                title: '입력한 정보를 확인하세요',
                icon: 'error',
            });
            return; 
        }
        axios.post(`${url}/searchId`, { name: data.name, phone: data.phone })
        .then((res) => {
            Toast.fire({
                title: "결과 페이지로 이동합니다",
                icon: "success",
            });
            setTimeout(() => {
                navigate('/searchIdResult', { state: { result: res.data.id } });
            }, 1500);
        })
        .catch((err) => {
            Toast.fire({
                title: err.response.data,
                icon: 'error',
            })
        })
    }

    return(
        <div className='searchId-container'>
            <div className='searchId-bg'>
                <div className='searchId-section'>
                    <div className='searchId-title'>아이디 찾기</div> <br/>
                    <form onSubmit={handleSubmit}>
                    <div className='searchIdInputDiv'>
                        <label>이름 <br/>
                        <input type="text" id="name" name="name" onChange={handleChange} /></label>
                    </div>
                    <br/><br/>
                    <div className='searchIdInputDiv'>
                    <label> 휴대폰 번호  
                    {warning && <span className='searchId-AuthPhone'>{warning}</span>}<br/>
                    <input type="text" id="phone" name="phone" onChange={handleChange} /></label>
                    </div>
                    <div className='searchId-button'>
                        <button type="submit"> 확인 </button>
                    </div>
                    <div className='searchInfo'> <a href="/login">회원가입/로그인</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchPw">비밀번호 찾기</a></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SearchId;

