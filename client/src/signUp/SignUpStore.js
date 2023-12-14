import { useState, useRef, useEffect } from 'react';
import signUpStoreStyle from './signUpStoreStyle.css';
import axios from 'axios';
import Swal from 'sweetalert2';
const { daum } = window;

const SignUpStore = () => {
    const [member, setMember] = useState({ name: "", nickname: "", id: "", password: "", passwordConfirm: "", phone: "", phoneConfirm: "", email: "",cafeName: "" });

    const [store, setStore] = useState({ cafeName: ""});
    const [valid, setValid] = useState({ id: false, password: false, email: false, phone: false })
    const [check, setCheck] = useState({ nickname: false, id: false, email: false })
    const [warnings, setWarnings] = useState({ name: false, nickname: false, id: false, password: false, passwordConfirm: false, phone: false, phoneConfirm: false, email: false });
    const [picture, setPicture] = useState("");
    const [randomCode, setRandomCode] = useState(0);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    const [tagList, setTagList] = useState([
        '#카공',
        '#애견동반',
        '#TakoOut',
        '#노키즈존',
        '#베이커리',
        '#이색',
        '#커피전문',
        '#주류판매',
        '#감성'
    ]);

   
    // 유효성 정규표현식
    const inputRegexs = {
        idRegex: /^[a-z0-9]{5,12}$/,
        passwordRegex: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
        phoneRegex: /^[0-9]+$/,
        emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };


    const change = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setMember({ ...member, [name]: value });
        setStore({...store,[name]: value});
    }

    const fileChange = (e) => {
        const file = e.target.files[0];
        setPicture(file);

        // 업로드 로직은 아직
    }

    useEffect(() => {
        const signUpStore = document.querySelector('.signUpStore');
       
        if (signUpStore) {
            window.addEventListener('scroll', function () {
                const scrollTop = window.scrollY;

                if (scrollTop > 30) {
                    signUpStore.style.top = `${scrollTop}px`;
                } else {
                    signUpStore.style.top = '20px';
                }

            });
        } else {
            console.error("Element with class 'signUpStore' not found.");
        }
    }, [])

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

        // 값이 변경되면 check도 다시 하도록
        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
        }));

        validUserCheck(name, value);
    };



    // 유효성 검증
    const validUserCheck = (name, value) => {
        let isValid;

        if (name === 'id') {
            isValid = inputRegexs.idRegex.test(value);
        }
        else if (name === 'password') {
            isValid = inputRegexs.passwordRegex.test(value);
        }
        else if (name === 'email') {
            isValid = inputRegexs.emailRegex.test(value);
        }
        else if (name === 'phone') {
            isValid = inputRegexs.phoneRegex.test(value);
        }

        setValid((prevChecks) => ({
            ...prevChecks,
            [name]: isValid,
        }));
    }

    const searchAddr = () => { // 주소 입력
        new daum.Postcode({
            oncomplete: function (data) {
                // var roadAddr = data.roadAddress; // 도로명 주소 변수
                document.getElementById('location').value = data.address;
                Promise.resolve(data).then(o => {
                    const { address } = data;
                    return new Promise((resolve, reject) => {
                        const geocoder = new daum.maps.services.Geocoder();
                        geocoder.addressSearch(address, (result, status) => {
                            if (status === daum.maps.services.Status.OK) {
                                const { x, y } = result[0];
                                resolve({ lat: y, lon: x })
                            } else {
                                reject();
                            }
                        });
                    })
                }).then(result => {
                    console.log("111" + result)
                    console.log("222" + result.lat)
                    console.log("333" + result.lon)
                });

            }
        }).open();
    }

    // swal
    const toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 1500
    })

    const businessNo = () => { // 사업자번호 확인
        axios.post(`http://localhost:8080/business/${store.businessNo}`)
            .then((res) => {
                if (res.data.data[0].tax_type === "국세청에 등록되지 않은 사업자등록번호입니다.") {
                    toast.fire({
                        title: '사업자 인증 실패!',
                        text: '다시 입력해주세요',
                        icon: 'error',
                    })
                } else {
                    toast.fire({
                        title: '사업자 인증 성공!',
                        text: '성공적으로 등록되었습니다',
                        icon: 'success',
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // 휴대폰 번호 인증 -> 휴대폰 인증
    const sendPhoneCode = () => {
        const random = Math.floor(Math.random() * 9000) + 1000;
        setRandomCode(random);
        console.log("Random code set:", random);
        console.log(member.phone);
        // axios.get(`http://localhost:8080/check/sendSMS?phone=${member.phone}&code=${randomCode}`)
        // .then((res) => {
        //     console.log(res.data);
        //     toast.fire({
        //         title: '인증번호가 발송되었습니다',
        //         icon: 'success',
        //     });
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
    };

    // 인증번호 일치여부 -> 확인버튼
    const phoneCodeCheck = () => {
        if (member.authNum == randomCode) {
            toast.fire({
                title: "휴대폰 번호 인증 성공!",
                icon: "success",
            });
        } else {
            toast.fire({
                title: "인증번호가 틀렸습니다",
                text: "확인 후 다시 입력해주세요",
                icon: "error",
            });
        }
    };

    // 이메일 중복 체크
    const getEmailCheck = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
        }));

        if (member.email) {
            axios.get(`http://localhost:8080/email/${member.email}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: false
                        }));
                    }
                    else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: true
                        }));
                    }

                })
                .catch(err => {
                    console.log(err.data);
                })
        }
    }

    // 회원가입 제출 가능 여부 확인
    const submitSignUP =
        member.name !== '' && member.nickname !== '' && member.id !== '' && member.password !== '' && member.passwordConfirm !== '' && member.phone !== '' && member.email !== '' &&
        valid.id && valid.password && valid.email && valid.phone && check.nickname && check.id && check.email&&store.cafeName;

        

    // 제출 버튼 클릭
    const handleClick = (e) => {
        e.preventDefault();
        console.log(submitSignUP);
        const formData = new FormData();
        formData.append('cafeName', store.cafeName);
        console.log("카페이름", store.cafeName);
        axios
            .post('http://localhost:8080/cafe/store', formData)
            .then((res)=> {
                console.log('성공'+res.data);
            })
            .catch((err)=> {
                console.log('error입니다', err.response ? err.response.data : err.message);
                console.log('error입니다'+err.data);
            });
            

        // 빈값에 대한 warning 체크
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
        
        if (!check.id) {
            axios.get(`http://localhost:8080/id/${member.id}`)
                .then(res => {
                    console.log("제출전아이디" + res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            id: false
                        }));
                    } else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            id: true
                        }));
                    }
                }).catch(err => {
                    console.log(err.data);
                })
        }

        if (!check.nickname) {
            axios.get(`http://localhost:8080/nickname/${member.nickname}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            nickname: false
                        }));
                    }
                    else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            nickname: true
                        }));
                    }
                })
                .catch(err => {
                    console.log(err.data);
                })
        }

        if (check.email) {
            axios.get(`http://localhost:8080/email/${member.email}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            email: false
                        }));
                    }
                    else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            email: true
                        }));
                    }

                })
                .catch(err => {
                    console.log(err.data);
                })
        }

       
        if (submitSignUP) {
           
            axios.post(`http://localhost:8080/signUpStore`, member)
                .then(res => {
                    Toast.fire({
                        icon: 'success',
                        title: '회원가입이 완료되었습니다 '
                    })
                    setTimeout(() => {
                        window.location.href = "/login?showLoginPage=STORE";
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);
                    console.log(err.data);
                    Toast.fire({
                        icon: 'error',
                        title: '가입이 불가능한 아이디입니다 다시 확인해 주세요'
                    })
                })
        } else {
            Toast.fire({
                icon: 'error',
                title: '인증 여부를 다시 확인해주세요'
            })
        }
    };
    // 아이디 중복 체크
    const getIdCheck = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        console.log("이거다" + member.id);

        if (member.id) {
            axios.get(`http://localhost:8080/id/${member.id}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: false
                        }));
                    }
                    else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: true
                        }));
                    }
                })
                .catch(err => {
                    console.log(err.data);
                })
        }
    }
    //닉네임
    const getNicknameCheck = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
        }));

        if (member.nickname) {
            axios.get(`http://localhost:8080/nickname/${member.nickname}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: false
                        }));
                    }
                    else {
                        setCheck((prevWarnings) => ({
                            ...prevWarnings,
                            [name]: true
                        }));
                    }
                })
                .catch(err => {
                    console.log(err.data);
                })
        }

    }



    return (
        <div className='signUpStore-container'>
            <div className='signUpStore-left-section'>
                <div className='signUpStore-title'>SignUp</div> <br />
                <form>
                    <div className='signUpStoreInputDiv'>
                        <label>이름 <br />
                            <span className='signUpUser-auth'>
                                {warnings.name && "이름을 입력하세요"}
                            </span>
                            <input type="text" place="이름을 입력하세요" id="name" name="name" value={member.name} onChange={changeMember} />
                        </label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>닉네임
                            <span className='signUpStore-auth' id="checkNickname">
                                {warnings.nickname && "닉네임을 입력하세요"}
                                {member.nickname ? (!check.nickname ? "사용 불가능한 닉네임입니다" : "사용 가능한 닉네임입니다") : ""}
                            </span><br />
                            <input type="text" id="nickname" name="nickname" onChange={changeMember} onFocus={getNicknameCheck} onBlur={getNicknameCheck} /></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>아이디 <span className='signUpStore-auth' id="checkId">
                            {warnings.id ? "아이디를 입력하세요" :
                                (member.id && !valid.id ? "5~12자 이내로 작성하세요" : "")}
                            {member.id && !(member.id && !valid.id) ? (!check.id ? "사용 불가능한 아이디입니다" : "사용 가능한 아이디입니다") : ""}
                        </span><br /><input type="text" id="id" name="id" onChange={changeMember} onBlur={getIdCheck} /></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>비밀번호
                            <span className='signUpStore-auth'>
                                {warnings.password && "비밀번호를 입력하세요"}
                                {member.password && !valid.password ? "소문자/숫자/특수문자 포함 8~20자로 작성하세요" : ""}
                            </span><br />
                            <input type="password" id="password" name="password" onChange={changeMember} /></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>비밀번호 확인
                            <span className='signUpStore-auth'>
                                {warnings.passwordConfirm && "비밀번호를 확인하세요"}
                                {member.passwordConfirm && (member.password !== member.passwordConfirm) ? "비밀번호가 일치하지 않습니다" : ""}
                            </span><br />
                            <input type="password" id="passwordCk" name="passwordConfirm" onChange={changeMember} /></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv-other'>
                        <label> 휴대폰 번호   <span className='signUpStore-auth'>
                            {warnings.phone && "휴대폰 번호를 입력하세요"}
                            {member.phone && !valid.phone ? "하이픈(-) 제외 숫자로 작성하세요" : ""}

                        </span><br />  <input type="text" id="phone" name="phone" onChange={changeMember} /></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={sendPhoneCode}> 휴대폰 <br />인증 </button> {/* onClick={sendPhoneCode} */}
                    </div> <br />
                    <div className='signUpStoreInputDiv-other'>
                        <label>인증번호<span className='signUpStore-auth'>인증번호를 확인하세요</span><br />
                            <input type="text" id="authNum" name="authNum" onChange={change} /></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={phoneCodeCheck}> 확인 </button>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>이메일 <span className='signUpStore-auth' id="checkEmail">
                            {warnings.email ? "이메일을 입력하세요" :
                                (member.email && !valid.email ? "이메일 형식을 확인하세요" : "")}
                            {member.email && !(member.email && !valid.email) ? (check.email ? '사용 가능한 이메일입니다' : '사용 불가능한 이메일입니다') : ""}
                        </span><br /> <input type="text" id="email" name="email" onChange={changeMember} onBlur={getEmailCheck} /></label>
                    </div> <br />

                    <div className='signUpStoreInputDiv'>
                        <label>가게명 <br />
                            <input type="text" id="cafeName" name="cafeName" onChange={change} value={store.cafeName}/></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>가게 전화번호 <br />
                            <input type="text" id="storePhone" name="storePhone" onChange={changeMember} /></label>
                    </div> <br />

                    <div className='signUpStoreInputDiv-other'>
                        <label> 사업자 번호 <span className='signUpStore-auth'> 하이픈(-)을 제외하고 입력하세요</span><br />
                            <input type="text" id="businessNo" name="businessNo" onChange={changeMember} /></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={businessNo}> 사업자 <br /> 인증 </button>
                    </div> <br />
                    <div className='signUpStoreInputDiv-other'>
                        <label> 위치 <br />
                            <input type="text" id="location" name="location" onChange={changeMember} /></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={searchAddr}> 위치 <br />검색 </button>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>운영시간 <br />
                            <input type="text" id="time" name="time" onChange={changeMember} /></label>
                    </div> <br />

                    <input type="file" id="picture" name="picture" onChange={fileChange} style={{ display: 'none' }} />

                    <div className='signUpStoreInputDiv-other'>
                        <label> 썸네일 <br />
                            <input className="signUpStoreInput-text" type="text" id="picture" name="picture" value={picture ? picture.name : '사진을 선택하세요'} readOnly /></label>
                    </div>

                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={() => document.getElementById("picture").click()}> 썸네일 <br />선택 </button>
                    </div><br />

                    <div className='SignUpStore-tag'>
                        {tagList.length !== 0 &&
                            tagList.map((tag, index) =>
                                <span className='SignUpStore-tagList' key={index}>
                                    <button className='SignUpStore-tag1' id={`tag${index}`} name={tag}> {tag}  </button>
                                    {index % 3 === 2 ? <><br /></> : ""}
                                </span>)}

                    </div>

                    <div className='signUpStore-button'>
                        <button onClick={handleClick} > SignUp </button>
                    </div> <br />
                </form>
            </div>

            <div className='signUpStore-right-section'>
                <div className='signUpStore'>
                    <div className='signUpStore-storeName'> {store.storeName ? store.storeName : '가게 이름'}</div>
                    <div className='signUpStore-picture' >
                        {picture && <img src={URL.createObjectURL(picture)} style={{ width: "320px", height: "320px", borderRadius: "20px" }} alt="썸네일" />}
                    </div>
                    <div className='signUpStore-location'>{store.location ? store.location : '위치를 입력하세요.'}</div>
                    <div className='signUpStore-time'>운영 시간 : {store.time ? store.time : '시간을 입력하세요.'}</div>
                </div>
            </div>
        </div>
    );
}


export default SignUpStore;