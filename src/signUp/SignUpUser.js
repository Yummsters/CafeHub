import { useState} from 'react';
import signUpUserStyle from './signUpUserStyle.css';

const SignUp_User = () =>{

    return (
        <div className='signUpUser-container'>
          <div className='signUpUser-left-section'>
            <div className='signUpUer-title'>SignUp</div> <br/>
            <form>
            <div className='signUpUserInputDiv'>
                <label>이름 <br/>
                <input type="text" id="name" name="name" /></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>닉네임 <br/>
                <input type="text" id="nickName" name="nickName" /></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>아이디 <span className='signUpUser-auth'>5~12자로 작성하세요</span><br/>
                <input type="text" id="id" name="id" /></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>비밀번호 <span className='signUpUser-auth'>소문자/숫자/특수문자 포함 5~12자로 작성하세요</span><br/>
                <input type="password" id="password" name="password" /></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>비밀번호 확인 <span className='signUpUser-auth'>비밀번호가 일치하지 않습니다</span><br/>
                <input type="password" id="passwordCk" name="passwordCk" /></label>
            </div> <br/>
            <div className='signUpUserInputDiv-phone'>
              <label> 휴대폰 번호 <span className='signUpUser-auth'>휴대폰 번호를 확인하세요</span><br/>
              <input type="text" id="phone" name="phone"/></label>
            </div>
            <div className='searchPhoneAuthNum'>
                <button type="button" href="#"> 휴대폰 <br/> 인증 </button>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>인증번호<span className='signUpUser-auth'>인증번호를 확인하세요</span><br/>
                <input type="text" id="authNum" name="authNum"/></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label>이메일 <span className='signUpUser-auth'>이메일을 확인하세요</span><br/>
                <input type="text" id="email" name="email" /></label>
            </div> <br/>
            
            <div className='signUpUser-button'>
                <button type="submit" > SignUp </button>
            </div>
            </form>
            </div>

            {/* 오른쪽에 사진 */}
          <div className='signUpUser-right-section'/>
    </div>
    );
}


export default SignUp_User;