import { useState} from 'react';
import signUpUserStyle from './signUpUserStyle.css';
import axios from 'axios';

// 유효성 정규표현식 더 정확하게 다듬기
// 커서 관련하여 매끄럽지 않은 부분 수정 필요
// 입력하자마자 사용 불가능하다는 부분 수정 필요
// 디비 연동 완료로 다듬기만 하면 완료
const SignUp_User = () =>{
    const [member, setMember] = useState({name : "", nickname : "", id : "", password : "", passwordConfirm : "", phone : "", phoneConfirm : "", email : ""});
    const [valid, setValid] = useState({ id : false, password : false, email : false, phone : false})
    const [check, setCheck] = useState({nickname : false, id : false, email : false})
    const [warnings, setWarnings] = useState({name : false, nickname : false, id : false, password : false, passwordConfirm : false, phone : false, phoneConfirm : false, email : false});

    // 회원가입 제출 가능 여부 확인
    const submitSignUP = 
        member.name !=='' && member.nickname !== '' && member.id !== '' && member.password !== '' && member.passwordConfirm !== '' && member.phone!== ''  && member.email !== '' && 
        valid.id && valid.password && valid.email && valid.phone && check.nickname && check.id && check.email;
    
    // 빈 값에 대한 warning 처리
    const handleClick = (e) => {
        e.preventDefault();
        console.log(submitSignUP);

        setWarnings((prevWarnings) => ({
            ...prevWarnings,
            name: member.name.trim() === '',
            nickname: member.nickname.trim() === '',
            id: member.id.trim() === '',
            password: member.password.trim() === '',
            passwordConfirm: member.passwordConfirm.trim() === '',
            phone: member.phone.trim() === '',
            phoneConfirm: member.phoneConfirm.trim() === '',
            email: member.email.trim() === ''
        }));

        if(submitSignUP){
            axios.post(`http://localhost:8080/signUpUser`, member)
            .then(res =>{
                window.location.href="/login?showLoginPage=USER";
            })
            .catch(err=>{
                console.log(err);
                console.log(err.data);
            })
        }
    };

    // 유효성 정규표현식
    const inputRegexs = {
        idRegex: /^[a-z0-9]{5,12}$/,
        passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=<>?]).{8,}$/,
        phoneRegex : /^[0-9]+$/,
        emailRegex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };

    const changeMember = (e) => {
        const { name, value } = e.target;
        setMember((prevInputs) => ({
          ...prevInputs,
          [name]: value
        }));
    
        // 입력이 변경될 때마다 해당 입력 필드에 대한 경고를 숨깁니다.
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [name]: false
        }));

        validUserCheck(name, value);
    };

    // 유효성 검증
    const validUserCheck = (name, value) =>{
        let isValid;
    
        if (name === 'id') {
          isValid = inputRegexs.idRegex.test(value);
        }
        else if (name === 'password') {
          isValid = inputRegexs.passwordRegex.test(value);
        }
        else if(name === 'email'){
            isValid = inputRegexs.emailRegex.test(value);
        }
        else if(name === 'phone'){
            isValid = inputRegexs.phoneRegex.test(value);
        }

        setValid((prevChecks) => ({
          ...prevChecks,
          [name]: isValid,
        }));
      }

    // 아이디 중복 체크
    const getIdCheck = (e) =>{
        e.preventDefault();
        const { name, value } = e.target;

        console.log(member.id);

        if(member.id){
            axios.get(`http://localhost:8080/id/${member.id}`)
            .then(res =>{
                console.log(res.data);
                if(res.data) {
                    setCheck((prevWarnings) => ({
                    ...prevWarnings,
                    [name]: false
                  }));
                }
                else{
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        [name]: true
                      }));
                }
            })
            .catch(err =>{
                console.log(err.data);
            })
        }
    }

    const getNicknameCheck = (e) =>{
        e.preventDefault();
        const { name, value } = e.target;

        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
          }));

        if(member.nickname){
            axios.get(`http://localhost:8080/nickname/${member.nickname}`)
            .then(res =>{
                console.log(res.data);
                if(res.data){
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        [name]: false
                    }));
                } 
                else{
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        [name]: true
                    }));
                }
            })
            .catch(err =>{
                console.log(err.data);
            })
        }
    }

    // 이메일 중복 체크
    const getEmailCheck = (e) =>{
        e.preventDefault();
        const { name, value } = e.target;

        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
        }));

        if(member.email){
            axios.get(`http://localhost:8080/email/${member.email}`)
            .then(res =>{
                console.log(res.data);
                if(res.data){
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        [name]: false
                    }));
                } 
                else{
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        [name]: true
                    }));
                }

            })
            .catch(err =>{
                console.log(err.data);
            })
        }
    }

    return (
        
        <div className='signUpUser-container'>
          <div className='signUpUser-left-section'>
            <div className='signUpUer-title'>SignUp</div> <br/>
            <form>
            <div className='signUpUserInputDiv'>
                <label>이름 
                    <span className='signUpUser-auth'>
                        {warnings.name && "이름을 입력하세요"}
                    </span> <br/>
                <input type="text" place="이름을 입력하세요" id="name" name="name" value = {member.name} onChange={changeMember} />
                </label>
            </div> <br/>

            <div className='signUpUserInputDiv'>
                <label>닉네임 
                    <span className='signUpUser-auth' id="checkNickname">
                        {warnings.nickname && "닉네임을 입력하세요"}
                        {member.nickname ? (!check.nickname ? "사용 불가능한 닉네임입니다" : "사용 가능한 닉네임입니다"):""}
                        </span><br/>
                <input type="text" id="nickname" name="nickname" onChange={changeMember} onBlur={getNicknameCheck}/></label>
            </div> <br/>
            <div className='signUpUserInputDiv'>
                <label htmlFor="id">아이디 
                <span className='signUpUser-auth' id="checkId">
                    {warnings.id ? "아이디를 입력하세요"  : 
                    (member.id && !valid.id ? "5~12자 이내로 작성하세요" : "")}
                    {member.id && !(member.id && !valid.id) ? (!check.id ? "사용 불가능한 아이디입니다" : "사용 가능한 아이디입니다") : ""}
                </span><br/>
                <input type="text" id="id" name="id" onChange={changeMember} onBlur={getIdCheck}/>
                </label>
            </div> <br/>

            <div className='signUpUserInputDiv'>
                <label>비밀번호 
                    <span className='signUpUser-auth'>
                        {warnings.password && "비밀번호를 입력하세요"}
                        {member.password && !valid.password ? "소문자/숫자/특수문자 포함 8~20자로 작성하세요": ""}
                    </span><br/>
                <input type="password" id="password" name="password" onChange={changeMember}/>
                </label>
            </div> <br/>

            <div className='signUpUserInputDiv'>
                <label>비밀번호 확인 
                    <span className='signUpUser-auth'>
                        {warnings.passwordConfirm && "비밀번호를 확인하세요"}
                        {member.passwordConfirm && (member.password !== member.passwordConfirm) ? "비밀번호가 일치하지 않습니다": ""}
                    </span><br/>
                <input type="password" id="passwordCk" name="passwordConfirm" onChange={changeMember}/>
                </label>
            </div> <br/>
            
            <div className='signUpUserInputDiv-phone'>
              <label> 휴대폰 번호 
                <span className='signUpUser-auth'>
                    {warnings.phone && "휴대폰 번호를 입력하세요"}
                    {member.phone && !valid.phone ? "하이픈(-) 제외 숫자로 작성하세요": ""}
                    {/*휴대폰 인증 관련 문구 추가 필요 */}
                </span><br/>
              <input type="text" id="phone" name="phone" onChange={changeMember}/>
              </label>
            </div>
            <div className='searchPhoneAuthNum'>
                <button type="button" href="#"> 휴대폰 <br/> 인증 </button>
            </div> <br/>

            <div className='signUpUserInputDiv'>
                <label>인증번호
                    <span className='signUpUser-auth'>
                        {/*휴대폰 인증 관련 문구 추가 필요 */}
                        {warnings.phoneConfirm && "인증번호를 입력하세요"}
                    </span><br/>
                <input type="text" id="authNum" name="phoneConfirm" onChange={changeMember}/>
                </label>
            </div> <br/>

            <div className='signUpUserInputDiv'>
                <label>이메일 
                    <span className='signUpUser-auth' id="checkEmail">
                        {warnings.email ? "이메일을 입력하세요" : 
                        (member.email && !valid.email ? "이메일 형식을 확인하세요" : "")}
                        {member.email && !(member.email && !valid.email) ? (check.email ? '사용 가능한 이메일입니다' : '사용 불가능한 이메일입니다') : ""}
                    </span><br/>
                <input type="text" id="email" name="email" onChange={changeMember} onBlur={getEmailCheck}/>
                </label>
            </div> <br/>
            
            <div className='signUpUser-button'>
                <button onClick={handleClick}> SignUp </button>
            </div>

            </form>
            </div>

          <div className='signUpUser-right-section'/>
    </div>
    );
}


export default SignUp_User;