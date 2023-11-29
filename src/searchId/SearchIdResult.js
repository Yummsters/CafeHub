import searchId from './searchIdStyle.css';
import { useState} from 'react';

const SearchIdResult = () =>{
    return(
        <div className='searchId-container'>
        <div className='searchId-section'>
            <div className='searchId-title'>아아디 찾기</div> <br/>
            <div className='searchIdResult-text'>
            
            당신의 아이디는 <br/>
            '수빈이 바보' 입니다.

            
            </div>
            <div className='searchId-button'>
                <button type="submit" > 확인 </button>
            </div>
            <div className='searchInfo'><a href="/signUpUser">회원가입</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/login">로그인</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchPw">비밀번호 찾기</a></div>
        </div>
        </div>
    );
}

export default SearchIdResult;