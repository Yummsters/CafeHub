import { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import storeBannerStyle from './storeBannerStyle.css';
import StoreSideTab from '../components/StoreSideTab';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from '../components/Cookie';

const StoreBanner = () => {
    const [cafeAd, setCafeAd] = useState({description : '', menu : '', approved:false});
    const [thumbImg, setThumbImg] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileNum, setFileNum] = useState(0);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);

    const cafe= useSelector(state => state.persistedReducer.cafe);
    const cafeNo = cafe.cafeNo;

    const inputRef = useRef(null);

    // 광고 승인 여부도 같이 확인해서 T/F 결정
    const [isAdExist, setIsAdExist] = useState(false); // 광고 신청 여부 조회
    const [isApprove, setIsApprove] = useState(false); // 광고 승인 여부 조회

    const submitCheck = thumbImg && cafeAd.description !=='' && cafeAd.menu !==''; 

    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 900,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // 초기화 버튼, 광고 신청 / 취소 버튼 등 현재 isApprove와 isAdExist에 따른 결과 산출이 잘 되고 있는지 확인 필요
    useEffect(()=>{
        var descrInput = document.getElementById("description");
        var menuInput = document.getElementById("menu");
        // 사진 선택도 안되도록 막는 로직 추가 필요

        axios.get(`http://localhost:8080/cafeAd/${cafeNo}`,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
        })
        .then(res=>{
            console.log(res);
            if(res.data.approved){ // 광고가 존재하면서 승인이 되어 있는 경우
                setIsAdExist(true);
                setIsApprove(true);
                setCafeAd(res.data);
                descrInput.disabled = true;
                menuInput.disabled = true;

            } else{ // 광고가 존재하면서 승인이 안되어 있는 경우
                setIsAdExist(true); 
                setIsApprove(false);
                setCafeAd(res.data); // 광고 내용 저장
                setFileNum(res.data.fileVo.fileNum); // 파일 번호 저장
                
                descrInput.disabled = true;
                menuInput.disabled = true;
            }
        })
        .catch(err=>{ // 광고가 존재하지 않거나, 이미 광고 기간이 끝난 경우
            console.log(err);
            console.log(err.data);
            setIsAdExist(false);
            setIsApprove(false);
            descrInput.disabled = false;
            menuInput.disabled = false;
            setCafeAd({thumbImg : null, description : '', menu : '', approved:false});
        })
    },[])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbImg(file);
            const thumbUrl = URL.createObjectURL(file);
            setFileUrl(thumbUrl);
        }
    };

    const handleImageClick = () => {
        if(!isAdExist) inputRef.current.click();
    };

    const handleCafeAdChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setCafeAd(prevState => ({ ...prevState, [id]: value }));
    };
    

    const handleReset = (e) => {
        e.preventDefault();
        setCafeAd(prevState => ({ ...prevState, description: '', menu: ''}));
        setThumbImg(null);
        setFileUrl(null);
    };

    const submitAd = (e) =>{
        e.preventDefault();

        if(submitCheck){
            var descrInput = document.getElementById("description");
            var menuInput = document.getElementById("menu");

            const formData = new FormData();
            formData.append("description",cafeAd.description);
            formData.append("menu", cafeAd.menu);
            formData.append("thumbImg", thumbImg);

            axios.post(`http://localhost:8080/cafeAd/${cafeNo}`,formData ,
            {
                headers : {
                    Authorization :accessToken,
                    Refresh : getCookie("refreshToken"),
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res=>{

                setIsAdExist(true); 
                setIsApprove(false);
                setCafeAd(res.data);
                descrInput.disabled = true;
                menuInput.disabled = true;

                Toast.fire({
                    icon: 'success',
                    title: '광고 신청이 완료되었습니다'
                }).then(()=>{
                    window.location.reload();
                })
                
            })
            .catch(err=>{
                console.log(err);
                Toast.fire({
                    icon: 'error',
                    title: '광고 신청에 실패하였습니다 관리자에게 문의하세요'
                })
            })
        }else{
            Toast.fire({
                icon: 'error',
                title: '이미지 / 설명 / 메뉴를 모두 입력하세요'
            })
        }
    }

    return (
        <div className='storeBanner-container'>
            <StoreSideTab />
            <div className='storeBanner-wrapper'>
                <div className='storeBanner-content'>
                    <div className='storeBanner-preview' onClick={handleImageClick}>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={inputRef}
                        />
                        <div className='storeBanner-img' id='thumbImg' style={{backgroundImage : `url(${fileUrl || `http://localhost:8080/common/upload/${fileNum}`})`}}>                            {fileNum != null ? null : <div className='preview-text'>클릭해서 사진을 첨부하세요</div>}
                        </div>
                        <div className='storeBanner-info'>
                            <div className='storeBanner-title'>{cafe.cafeName},</div>
                            <div className='storeBanner-description'>
                                <br />{cafeAd.description}
                            </div>
                            <div className='storeBanner-menu'>
                                <br />대표메뉴: {cafeAd.menu}
                            </div>
                            <div className='storeBanner-address'>
                                {cafe.address}
                            </div>
                        </div>
                    </div>

                    <div className='storeBanner-input-description-wrap'>
                        <div className='storeBanner-input-description-box'>
                            <label style={{display:"flex"}}>
                            <div className='storeBanner-input-description-title'>
                                <div style={{ fontSize: "20px" }}>카페 설명 입력</div>
                                <div style={{ fontSize: "15px" }}>(최대 30자)</div>
                            </div>
                            <input
                                type='text'
                                className='storeBanner-input-description'
                                id = 'description'
                                value={cafeAd.description}
                                onChange={handleCafeAdChange}
                                style={{ fontSize: "20px" }}
                                maxLength="30"
                            /></label>
                        </div>
                        {!(isAdExist || isApprove) && <button className='storeBanner-cancelBtn' onClick={handleReset}>초기화</button>}
                    </div>

                    <div className='hl' />

                    <div className='storeBanner-input-menu-wrap'>
                        <div className='storeBanner-input-menu-box'>
                            <label style={{display:"flex"}}>
                            <div className='storeBanner-input-menu-title'>
                                <div style={{ fontSize: "20px" }}>대표 메뉴 입력</div>
                                <div style={{ fontSize: "15px" }}>(최대 3가지 권장)</div>
                            </div>
                            <input
                                type='text'
                                className='storeBanner-input-menu'
                                id='menu'
                                value={cafeAd.menu}
                                onChange={handleCafeAdChange}
                                style={{ fontSize: "20px" }}
                            />
                            </label>
                        </div>
                        {!isAdExist ? <button className='storeBanner-regBtn' onClick={submitAd}>광고 신청</button> :  (!isApprove ? <button className='storeBanner-regBtn'>광고 취소</button> : '')}
                    </div>

                    <div className='hl' />

                </div>
            </div>
        </div>
    )
}

export default StoreBanner;