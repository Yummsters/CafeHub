import searchId from './searchIdStyle.css';
import { useState} from 'react';

const SearchId = () =>{
    return(
        <div className='searchId-container'>
        <div className='searchId-section'>
            <div className='searchId-title'>아이디 찾기</div> <br/>
            <form>
            <div className='searchIdInputDiv'>
                <label>이름 <br/>
                <input type="text" id="name" name="name" /></label>
            </div>
              <br/><br/>
            <div className='searchIdInputDiv'>
              <label> 휴대폰 번호  <span className='searchId-AuthPhone'>휴대폰 번호를 확인해주세요</span><br/>
              <input type="text" id="phone" name="phone"/></label>
            </div>
            <div className='searchId-button'>
                <button type="submit" href="/searchIdResult"> 확인 </button>
            </div>
            <div className='searchInfo'> <a href="/login">회원가입/로그인</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchPw">비밀번호 찾기</a></div>
            </form>
        </div>
        </div>
    );
}

export default SearchId;