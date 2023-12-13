import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchId from './searchIdStyle.css';
import {useState} from 'react';
import Swal from 'sweetalert2';

const SearchId = () => {
    const [data, setData] = useState({ name: '', phone: '' });
    const navigate = useNavigate();
    const [warning, setWarnings] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      if(name === 'phone' && !/^[0-9]+$/.test(value)) {
        setWarnings('하이픈(-) 제외 숫자로 작성하세요');
        e.preventDefault();
      } else {
        setWarnings('');
      }
      setData({ ...data, [name]: value });
    };

    const handleSubmit = (e) => {
        if (!data.phone.trim()) {
            setWarnings('휴대폰 번호를 입력하세요');
            return;
        }
        e.preventDefault();
        axios.get('http://localhost:8080/searchId', { 
            params: {
                name: data.name,
                phone: data.phone
            }
        })
        .then((res) => {
            console.log(res.data);
            navigate('/searchIdResult', { state: { result: res.data } });
        })
        .catch((error) => {
            console.log(error);
            Swal.fire({
                title: '회원정보가 일치하지 않습니다',
                icon: 'error',
                confirmButtonText: '확인',
            });
        })
    }

    return(
        <div className='searchId-container'>
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
    );
}

export default SearchId;

