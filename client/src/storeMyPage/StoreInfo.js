import { useState, useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import storeInfoStyle from './storeInfoStyle.css';
import StoreSideTab from '../components/StoreSideTab';
import Swal from 'sweetalert2';
import axios from 'axios';


const StoreInfo= () =>{
    const memNo = useSelector(state=>state.persistedReducer.member.memNo);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);

    const [point, setPoint] = useState(0);

    const [owner, setOwner] = useState({name:"", id:"", password:"", passwordCk:"", phone:"", email:"",
    storeName:"", storePhone:"", storeNum:"", location:"", time:""});
    const [picture, setPicture] = useState("");
    const [tagList, setTagList] = useState([
        '#카공',
        '#애견 동반',
        '#TakoOut',
        '#노키즈존',
        '#베이커리',
        '#이색',
        '#커피 전문',
        '#주류 판매',
    ]);

    // swal
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


    const change = (e) =>{
        let name = e.target.name;
        let value = e.target.value;
        
        setOwner({...owner, [name] : value});
    }

    const fileChange = (e) =>{
        const file = e.target.files[0];
        setPicture(file);

        // 업로드 로직은 아직
    }

    useEffect(()=>{
        /* 오른쪽 가게 미리보기 움직이기 */
        const storeInfo = document.querySelector('.storeInfo-right-section');

        if (storeInfo) {
            window.addEventListener('scroll', function() {
                const scrollTop = window.scrollY;

                if (scrollTop > 50) {
                    storeInfo.style.top = `${scrollTop}px`;
                } else {
                    storeInfo.style.top = '60px'; // 상황에 맞게 조절해주세요
                }
            });
        } else {
            console.error("Element with class 'storeInfo' not found.");
        }
    }, [])

    // 가게 포인트 조회
    useEffect(()=>{
        axios.get(`http://localhost:8080/point/${memNo}`,{
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            const resPoint = res.data;
            setPoint(resPoint);
        })
        .catch(err=>{
            console.log(err);
        })
    })
    
    const pointCalReq = () =>{
        if(point < 100){
            Toast.fire({
                icon: 'error',
                title: '100개 이상부터 정산 신청이 가능합니다'
            })
        }else{
            axios.post(`http://localhost:8080/point/calculate/${memNo}`,{
                headers : {
                    Authorization : accessToken
                }
            })
            .then(res=>{
                console.log(res);
                console.log(res.data);
                setPoint(res.data);
                Toast.fire({
                    icon: 'success',
                    title: '포인트 정산 신청이 완료되었습니다'
                })
            })
            .catch(err =>{
                console.log(err);
            })
        }
    }

    return (
        <div className='storeInfo-container'>
            <StoreSideTab/>
            <div className='storeInfo-container-other'>
            {/* 오른쪽에 사진 */}
          <div className='storeInfo-left-section'>
            <div className='storeInfo'>
                <div className='storeInfo-storeName'> 선진카페 </div>
                <div className='storeInfo-picture' > 
                <img src="/img/Store1.png"  style={{width:"320px", height:"320px", borderRadius:"20px"}}alt="썸네일" />
                </div>
                <div className='storeInfo-location'>서울시 금천구 가산디지털1로 70</div>
                <div className='storeInfo-time'>운영 시간 : 10:00 ~ 20:00</div>
            </div> <br/>
            <div className='storeInfo-point'>
                보유 커피콩
                <img className='storeInfo-pointImg' src="/img/bean.png" alt='bean'/> {point}개
            </div>
            <button className='storeInfo-pointCheck' onClick={pointCalReq}>환급신청</button>
          </div>


          <div className='storeInfo-right-section'>
            <form>
            <div className='storeInfoInputDiv'>
                <label>이름 <br/>
                <input type="text" id="name" name="name" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>닉네임 <br/>
                <input type="text" id="nickName" name="nickName" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>아이디 <span className='storeInfo-auth'>5~12자로 작성하세요</span><br/>
                <input type="text" id="id" name="id" onChange={change} /></label>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>비밀번호<span className='storeInfo-auth'>소문자/숫자/특수문자 포함 5~12자 이내로 작성하세요</span> <br/>
                <input type="password" id="password" name="password" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>비밀번호 확인 <span className='storeInfo-auth'>비밀번호가 일치하지 않습니다</span><br/>
                <input type="password" id="passwordCk" name="passwordCk" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv-other'>
                <label>휴대폰 번호 <span className='storeInfo-auth'>휴대폰 번호를 확인하세요</span><br/>
                <input type="text" id="phone" name="phone" onChange={change}/></label>
            </div> 
            <div className='storeInfoAuthNum'>
                <button type="button" > 휴대폰 <br/>인증 </button>
            </div> <br/>
            <div className='storeInfoInputDiv'>
              <label>이메일  <span className='storeInfo-auth'> 이메일 형식으로 입력하세요</span><br/>
              <input type="text" id="email" name="email" onChange={change}/></label>
            </div><br/>
            <div className='storeInfoInputDiv'>
                <label>가게명 <br/>
                <input type="text" id="storeName" name="storeName" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>가게 전화번호 <br/>
                <input type="text" id="storePhone" name="storePhone" onChange={change}/></label>
            </div> <br/>
            <div className='storeInfoInputDiv-other'>
              <label> 사업자 등록 번호 <span className='storeInfo-auth'> 하이픈(-)을 제외하고 입력하세요</span><br/>
              <input type="text" id="storeNum" name="storeNum" onChange={change}/></label>
            </div>
            <div className='storeInfoAuthNum'>
                <button type="button"> 사업자 <br/> 인증 </button>
            </div> <br/>
            <div className='storeInfoInputDiv-other'>
              <label> 위치 <br/>
              <input type="text" id="location" name="location" onChange={change}/></label>
            </div>
            <div className='storeInfoAuthNum'>
                <button type="button"> 위치 <br/> 검색 </button>
            </div> <br/>
            <div className='storeInfoInputDiv'>
                <label>운영시간 <br/>
                <input type="text" id="time" name="time" onChange={change}/></label>
            </div> <br/>

            <input type="file" id="picture" name="picture" onChange={fileChange} style={{ display: 'none' }}/>

            <div className='storeInfoInputDiv-other'>
                <label> 썸네일 <br/>
                <input className="storeInfoInput-text" type="text" id="picture" name="picture" value={picture ? picture.name : '사진을 선택하세요'} readOnly /></label>
            </div>
            <div className='storeInfoAuthNum'>
                <button type="button" onClick={() => document.getElementById("picture").click()}> 썸네일 <br/>선택 </button>
            </div><br/>

            {/* 사장님 선택 태그 */}
            <div className='storeInfo-tag'>
            { tagList.length !== 0 &&
            tagList.map((tag, index)=>
            <span className='storeInfo-tagList' key={index}>
                <button className='storeInfo-tag1'  id={`tag${index}`} name={tag}> {tag} </button>
                {index % 3 ===2 ? <><br/></> : ""}
            </span>)}
            </div>
            <div className='storeInfo-button'>
                <button type="button" > 정보 수정 </button>
            </div> <br/>
            </form>
        </div>      
    </div>
    </div>
    );
}


export default StoreInfo;