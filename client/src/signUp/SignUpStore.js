import { useState, useRef, useEffect } from 'react';
import signUpStoreStyle from './signUpStoreStyle.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { CheckoutPage } from '../payment/CheckoutPage';
import { url } from '../config.js'
import { Toast } from '../components/Toast.js';
const { daum } = window;

const SignUpStore = () => {
    const [member, setMember] = useState({ name: "", nickname: "", id: "", password: "", passwordConfirm: "", phone: "", phoneConfirm: "", email: "", cafeName: "",authNum:"" });
    const [store, setStore] = useState({ cafeName: "", tel: "", address: "", businessNo: "", operTime: "", lat: "", lng: "" ,tagName:""});
    const [thumbnail, setThumbnail] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [valid, setValid] = useState({ id: false, password: false, email: false, phone: false, businessNo: false, authNum: false })
    const [check, setCheck] = useState({ nickname: false, id: false, email: false, businsssNo: false, authNum: false})
    const [warnings, setWarnings] = useState({ name: false, nickname: false, id: false, password: false, passwordConfirm: false, phone: false, phoneConfirm: false, email: false, cafeName: false, tel: false, businessNo: false, address: false,operTime: false ,authNum:false});
    const [picture, setPicture] = useState("");
    const [randomCode, setRandomCode] = useState(0);
    const [tagName, setTagName] = useState([]);

    // 페이먼트 관련
    const [memNo, setMemNo] = useState(0);
    const payment = useSelector(state=>state.persistedReducer.payment);
    const [paymentModal, setPaymentModal] = useState(false);
    const paymentData = {price: 5000, orderName: "입점비", memNo: memNo};
    const dispatch = useDispatch();
    const openModal = () => {
        setPaymentModal(true);
    };
    const paymentClose = () => {
        setPaymentModal(false);
        failSignup(); // 결제창 열린 후(등록 완료된 상태) -> 회원정보 삭제
    }

    // 페이먼트 관련
    useEffect(() => {
        if(payment && payment.memNo !== null) {
            if(payment.isSuccess) { // memNo이 존재(직전에회원가입)하고 결제완료된 경우 컬럼 update
                axios.put(`${url}/signUpStore`, { memNo: payment.memNo, paymentKey: payment.paymentKey })
                .then((res) => {
                    console.log(res.data)
                    Toast('success', '가입 및 카페등록이 완료되었습니다')
                    dispatch({ type:"payment", payload:"" })
                    setTimeout(() => {
                        window.location.href="/login";
                    }, 2000);
                })
                .catch((error) => console.log(error))
            } else { // memNo이 존재(직전에 회원가입)하고 결제실패한 경우 가입된 정보 삭제
                failSignup();
            }
        }
    }, [])

    const failSignup = () => {
        axios.delete(`${url}/signUpStore/${payment.memNo}`)
        .then((res) => {
            console.log(res.data);
            dispatch({type:"payment", payload:''});
            Toast('error', '회원가입에 실패했습니다\n사유: 결제 오류')
        })
    }


    useEffect(()=>{
        axios.get(`${url}/storeTagList`)
        .then(res=>{
            console.log(res.data);
            setTagName([...res.data]);
            console.log(tagName);
        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    // 유효성 정규표현식
    const inputRegexs = {
        idRegex: /^[a-z0-9]{5,12}$/,
        passwordRegex: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
        phoneRegex: /^[0-9]+$/,
        emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        businessNoRegex: /^[0-9]+$/
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

        // 값이 변경되면 check도 다시 하도록
        setCheck((prevWarnings) => ({
            ...prevWarnings,
            [name]: false
        }));

        validUserCheck(name, value);
    };
    const changeStore = (e) => {
        const { name, value } = e.target;
        setStore((prevInputs) => ({
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
        else if (name === 'businessNo') {
            isValid = inputRegexs.businessNoRegex.test(value);
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
                document.getElementById('address').value = data.address;
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
                    setStore(prevStore => ({
                        ...prevStore,
                        latitude: result.lat,
                        longitude: result.lon,
                        address: data.address,
                    }));
                });

            }
        }).open();
    }

    const businessNo = () => { // 사업자번호 확인
       
        axios.post(`${url}/business/${store.businessNo}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.data[0].tax_type === "국세청에 등록되지 않은 사업자등록번호입니다.") {
                    Toast('error', '등록되지 않은 사업자등록번호입니다')
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        businsssNo: false
                    }));

                } else {
                    Toast('success', '사업자 인증 성공\n성공적으로 등록되었습니다')
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        businsssNo: true
                    }));    
                }
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
};    
  
    // 휴대폰 번호 인증 -> 휴대폰 인증
    const sendPhoneCode = () => {
        const random = Math.floor(Math.random() * 9000) + 1000;
        setRandomCode(random);
        console.log("Random code set:", random);
        // axios.get(`${url}/check/sendSMS?phone=${member.phone}&code=${random}`)
        // .then((res) => {
        //      Toast('success', '인증번호가 발송되었습니다')
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
    };

    // 인증번호 일치여부 -> 확인버튼
    const phoneCodeCheck = () => {
        if (member.authNum == randomCode) {
            Toast('success', '휴대폰 번호 인증 성공!')
            setCheck((prevWarnings) => ({
                ...prevWarnings,
                authNum: true
            }));
        } else {
            Toast('error', '인증번호가 틀렸습니다\n확인 후 다시 입력해주세요')
            setCheck((prevWarnings) => ({
                ...prevWarnings,
                authNum: false
            }));  
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
            axios.get(`${url}/email/${member.email}`)
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
        store.cafeName !=='' && store.tel !== ''  && store.businessNo !== '' &&  store.address !== '' && store.operTime !== '' && member.authNum !== '' &&
        valid.id && valid.password && valid.email && valid.phone && check.nickname && check.id && check.email && check.businsssNo && check.authNum;

       
    // 제출 버튼 클릭
    const handleClick = (e) => {
        e.preventDefault();

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
            email: member.email.trim() === '',
            cafeName: store.cafeName.trim() === '',
            tel: store.tel.trim() === '',
            businessNo: store.businessNo.trim() === '',
            address: store.address.trim() === '',
            operTime: store.operTime.trim() === '',
            authNum: member.authNum.trim() === '',
        }));

        if (!check.id) {
            axios.get(`${url}/id/${member.id}`)
                .then(res => {
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
            axios.get(`${url}/nickname/${member.nickname}`)
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
            axios.get(`${url}/email/${member.email}`)
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
            
            try {
                const formData = new FormData();
                formData.append('cafeName', store.cafeName);
                formData.append('tel', store.tel);
                formData.append('address', store.address);
                formData.append('lat', store.latitude);
                formData.append('lng', store.longitude);
                formData.append('businessNo', store.businessNo);
                formData.append('operTime', store.operTime);
                formData.append('tagName', JSON.stringify(selectedTags));

                if (selectedFile) {
                    formData.append('file', selectedFile);
                }else{
                    Toast('error', '썸네일을 선택하세요')
                }

                // 카페 생성
                axios.post(`${url}/cafeStore/store`, formData)
                    .then((cafeResponse) => {
                        console.log(cafeResponse);
                        const cafeNo = cafeResponse.data;

                        // 회원가입
                        axios.post(`${url}/signUpStore/${cafeNo}`, member)
                            .then((res) => {
                                console.log(res.data);
                                setMemNo(res.data.memNo);
                                dispatch({type:"payment", payload: { isSuccess: false, memNo: res.data.memNo }}); // 결제 전 새로고침하는 경우 회원가입 방지
                                openModal(); // 결제창
                            })
                            .catch((error) => {
                                console.log(error);
                                Toast('error', '입력한 정보를 확인해주세요')
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            } catch (error) {
                console.log(error);
            } 
        } else {
            Toast('error', '인증 여부를 다시 확인해주세요')
        }
    };
    // 아이디 중복 체크
    const getIdCheck = (e) => {
        
        e.preventDefault();
        const { name, value } = e.target;

        if (member.id) {
            axios.get(`${url}/id/${member.id}`)
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
            axios.get(`${url}/nickname/${member.nickname}`)
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
    const fileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const thumbnailURL = URL.createObjectURL(file);
            setThumbnail(thumbnailURL);
            setIsFileSelected(true);
        }
    };

    const [selectedTags, setSelectedTags] = useState([]);

    const tagClick = (i) => {
        let updatedTags;

        if (selectedTags.includes(i)) {
            updatedTags = selectedTags.filter((item) => item !== i);
        } else {
            updatedTags = [...selectedTags, i];
        }

        if (updatedTags.length > 1) {
            Toast('error', '1개까지 선택 가능합니다')
        } else {
            setSelectedTags(updatedTags);
        }
    };

    return (
        <div className='signUpStore-container'>
            <div className='signUpStore-left-section'>
                <div className='signUpStore-title'>SignUp</div> <br />
                <form>
                    <div className='signUpStoreInputDiv'>
                        <label>이름
                            <span className='signUpUser-auth'>
                                {warnings.name && "이름을 입력하세요"}
                                
                            </span>
                            <br/>
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
                        <label>인증번호
                            <input type="text" id="authNum" name="authNum" onChange={changeMember} /></label>
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
                        <label>카페명 <span className='signUpUser-auth'>
                                {warnings.cafeName && "카페명을 입력하세요"}
                            </span>
                            <br/>
                            <input type="text" id="cafeName" name="cafeName" onChange={changeStore} value={store.cafeName} /></label>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>카페 전화번호 <span className='signUpUser-auth'>
                                {warnings.tel && "카페 전화번호를 입력하세요"}
                            </span><br/>
                            <input type="text" id="tel" name="tel" onChange={changeStore} value={store.tel} /></label>
                    </div> <br />

                    <div className='signUpStoreInputDiv-other'>
                        <label> 사업자 번호 
                            <span className='signUpUser-auth'> 
                    {warnings.businessNo && "사업자 번호를 입력하세요"}
                            {store.businessNo && !valid.businessNo ? "하이픈(-) 제외 숫자로 작성하세요" : ""}
                            </span><br />
                            <input type="text" id="businessNo" name="businessNo" onChange={changeStore} value={store.businessNo} /></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={businessNo}> 사업자 <br /> 인증 </button>
                    </div> <br />
                    <div className='signUpStoreInputDiv-other'>
                        <label> 위치<span className='signUpUser-auth'>
                                {warnings.address && "위치를 입력하세요"}
                            </span>
                            <input type="text" id="address" name="address" onChange={changeStore} value={store.address}/></label>
                    </div>
                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={searchAddr}> 위치 <br />검색 </button>
                    </div> <br />
                    <div className='signUpStoreInputDiv'>
                        <label>운영시간 <span className='signUpUser-auth'>
                                {warnings.operTime && "운영시간을 입력하세요"}
                            </span><br/>
                            <input type="text" id="operTime" name="operTime" onChange={changeStore} value={store.operTime} /></label>
                    </div> <br />

                    <input type="file" id="picture" name="picture" onChange={fileChange} style={{ display: 'none' }} />

                    <div className='signUpStoreInputDiv-other'>
                        <label> 썸네일 <br />
                            <input className="signUpStoreInput-text" type="text" id="picture" name="picture" value={selectedFile ? selectedFile.name : '사진을 선택하세요'} readOnly /></label>
                    </div>

                    <div className='searchStoreAuthNum'>
                        <button type="button" onClick={() => document.getElementById("picture").click()} > 썸네일 <br />선택 </button>
                    </div><br />

                    <div className='SignUpStore-tag'>
                        {tagName.map((tags, i) => (
                            <div
                                key={i}
                                className={selectedTags.includes(i) ? 'selectTags' : 'tags'}
                                onClick={() => tagClick(i)}>
                                {tags.storeTagName}
                            </div>
                        ))}
                    </div>

                    <div className='signUpStore-button'>
                        <button onClick={handleClick} > SignUp </button>
                    </div> <br />
                </form>
            </div>
            <div className='signUpStore-right-section'>
                <div className='signUpStore'>
                    <div className='signUpStore-storeName'> {store.cafeName ? store.cafeName : '카페 이름'}</div>
                    <div className='signUpStore-picture' >
                        {selectedFile && <img src={URL.createObjectURL(selectedFile)} style={{ width: "295px", height: "295px", borderRadius: "20px" }} alt="썸네일" />}
                    </div>
                    <div className='signUpStore-location'>{store.address ? store.address : '위치를 입력하세요.'}</div>
                    <div className='signUpStore-time'>운영 시간 : {store.operTime ? store.operTime : '시간을 입력하세요.'}</div>
                </div>
            </div>
            {paymentModal && (
                <>
                <CheckoutPage paymentData={paymentData}>
                    <button className='beanPurchaseBtn' onClick={paymentClose}>취소</button>
                </CheckoutPage>
                </>
            )}
        </div>
    );
}

export default SignUpStore;