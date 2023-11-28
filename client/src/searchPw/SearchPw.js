import searchPw from './searchPwStyle.css';
import { useState} from 'react';

const SearchPw = () =>{
    return(
        <div className='searchPw-container'>
        <div className='searchPw-section'>
            <div className='searchPw-title'>비밀번호 찾기</div> <br/>
            <form>
            <div className='searchPwInputDiv'>
                <label> 아이디<br/>
                <input type="text" id="id" name="name" /></label>
            </div>
              <br/>
            <div className='searchPwInputDiv-phone'>
              <label> 휴대폰 번호  <span className='searchPw-AuthPhone'>휴대폰 번호를 확인해주세요</span><br/>
              <input type="text" id="phone" name="phone"/></label>
            </div>
            <div className='searchPwAuthNum'>
                <button type="button" href="#"> 인증 </button>
            </div>
            <br/>
            <div className='searchPwInputDiv'>
              <label> 인증번호 <span className='searchPw-Auth'>인증번호를 확인해주세요</span><br/>
              <input type="text" id="authNum" name="authNum"/> </label>
            </div>
            <div className='searchPw-button'>
                <button type="button" href="/searchPwResult"> 확인 </button>
            </div>
            <div className='searchInfo'><a href="/login">로그인/회원가입</a></div>
            </form>
        </div>
        </div>
    );
}

export default SearchPw;