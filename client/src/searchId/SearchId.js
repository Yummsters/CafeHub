import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchId from './searchIdStyle.css';
import {useState} from 'react';
import Swal from 'sweetalert2';

const SearchId = () => {
    const [data, setData] = useState({ name: '', phone: '' });
    const navigate = useNavigate();
    const [warning, setWarnings] = useState('');

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })

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
                title: '회원 정보를 입력하세요',
                icon: 'error',
            });
            return; 
        }
      
        if (!/^[0-9]+$/.test(data.phone)) {
          setWarnings('하이픈(-) 제외 숫자로 작성하세요');
          return;
        }
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
            Toast.fire({
                title: '회원정보가 일치하지 않습니다',
                icon: 'error',
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

