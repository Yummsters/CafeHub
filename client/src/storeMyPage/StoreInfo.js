import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import storeInfoStyle from './storeInfoStyle.css';
import StoreSideTab from '../components/StoreSideTab';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';
import { useDispatch } from 'react-redux';
import { tokenCreate, tokenExpried } from '../login/TokenCheck';
import { url } from '../config.js'
const { daum } = window;

const StoreInfo = () => {
    const memNo = useSelector(state => state.persistedReducer.member.memNo);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [point, setPoint] = useState(0);
    const [fileNum, setFileNum] = useState(0);
    const cafeNo = useSelector(state => state.persistedReducer.cafe.cafeNo);
    const [valid, setValid] = useState({ businessNo: false });
    const [cafe, setCafe] = useState({ cafeName: "", tel: "", address: "", businessNo: "", operTime: "", lat: "", lng: "", tagName: "", thumbImg: "" });
    const [check, setCheck] = useState({ businessNo: false });
    const [warnings, setWarnings] = useState({ businessNo: false });
    const [isBusinessNoChanged, setIsBusinessNoChanged] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [owner, setOwner] = useState({
        name: "", id: "", password: "", passwordCk: "", phone: "", email: "",
        storeName: "", storePhone: "", storeNum: "", location: "", time: ""
    });


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
                    setCafe(prevStore => ({
                        ...prevStore,
                        latitude: result.lat,
                        longitude: result.lon,
                        address: data.address,
                    }));
                });

            }
        }).open();
    }

    useEffect(() => {
        axios
            .get(`${url}/cafe/${cafeNo}`)
            .then((res) => {
                console.log(res.data);
                const cafeData = res.data;

                if (cafeData) {
                    setCafe({
                        cafeName: cafeData.cafeName,
                        tel: cafeData.tel,
                        address: cafeData.address,
                        businessNo: cafeData.businessNo,
                        operTime: cafeData.operTime,
                        thumbImg: cafeData.thumbImg,
                        storeTag: cafeData.storeTag.storeTagNo
                    });
                    setSelectedTags([cafeData.storeTag.storeTagNo - 1]);
                } else {
                    console.error('카페 정보가 없습니다.');
                }
            })
            .catch((error) => {
                console.error('카페 정보 가져오기 실패:', error);
            });
    }, [accessToken]);

    useEffect(() => {
        // Fetch cafe image
        if (cafe.thumbImg) {
            axios.get(`${url}/common/upload/${cafe.thumbImg}`, {
                responseType: 'blob',
            })

                .then((res) => {
                    // Blob 객체를 URL로 변환
                    const imageUrl = URL.createObjectURL(res.data);
                    console.log(imageUrl);

                    // 이미지 데이터를 state에 설정
                    setCafe((prevCafe) => ({
                        ...prevCafe,
                        imageUrl: imageUrl,
                    }));
                })
                .catch((error) => {
                    console.error('카페 사진 가져오기 실패:', error);
                });
        }
    }, [cafe.thumbImg]);


    const businessNo = () => { // 사업자번호 확인

        axios.post(`${url}/business/${cafe.businessNo}`)
            .then((res) => {
                console.log(res.data);
                if (res.data.data[0].tax_type === "국세청에 등록되지 않은 사업자등록번호입니다.") {

                    MyToast.fire({
                        title: '사업자 인증 실패!',
                        text: '다시 입력해주세요',
                        icon: 'error',
                    })
                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        businessNo: false
                    }));

                } else {
                    MyToast.fire({
                        title: '사업자 인증 성공!',
                        text: '성공적으로 등록되었습니다',
                        icon: 'success',
                    })

                    setCheck((prevWarnings) => ({
                        ...prevWarnings,
                        businessNo: true
                    }));
                }

            })
            .catch((error) => {
                console.log(error);
                return false;
            })

    };

    // 유효성 검증
    const validUserCheck = (name, value) => {
        let isValid;

        if (name === 'businessNo') {
            isValid = inputRegexs.businessNoRegex.test(value);
        }

        setValid((prevChecks) => ({
            ...prevChecks,
            [name]: isValid,
        }));
    }

    const StoreInfo = async (e) => {
        e.preventDefault();
        if (!isBusinessNoChanged) {
            MyToast.fire({
                title: '사업자 등록번호 변경',
                text: '사업자 등록번호를 변경하세요.',
                icon: 'error',
            });
            return;
        }
        console.log("tag = " + selectedTags);

        const formData = new FormData();
        formData.append('cafeName', cafe.cafeName);
        formData.append('tel', cafe.tel);
        formData.append('businessNo', cafe.businessNo);
        formData.append('address', cafe.address);
        formData.append('operTime', cafe.operTime);
        formData.append('tagName', selectedTags);

        // 이미지 파일이 선택된 경우에만 추가
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            // 서버로 요청을 보낼 때는 formData를 config 객체에 넣어서 보냅니다.
            const response = await axios.put(`${url}/cafe/store/${cafeNo}`, formData, {
                headers: {
                    Authorization: accessToken,
                    Refresh: getCookie("refreshToken"),
                    'Content-Type': 'multipart/form-data', // 중요: FormData를 보낼 때 Content-Type을 설정해야 합니다.
                },
            });

            Swal.fire({
                title: '수정 성공!',
                text: '리뷰가 성공적으로 등록되었습니다',
                icon: 'success',
                confirmButtonText: '확인',
            }).then(() => {
                // 리덕스 정보도 수정                
                dispatch({ type: "cafe", payload: {cafeNo, ...cafe} });
            });


            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const [tagList, setTagList] = useState([]);
    useEffect(() => {
        axios.get(`${url}/storeTagList`)
            .then(res => {
                console.log(res);
                console.log(res.data);
                setTagList([...res.data]);
                console.log(tagList);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    // swal
    const MyToast = Swal.mixin({
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
    // 유효성 정규표현식
    const inputRegexs = {

        businessNoRegex: /^[0-9]+$/
    };

    const change = (e) => {
        const { name, value } = e.target;
        validUserCheck(name, value);
        if (name === 'businessNo' && cafe.businessNo !== value) {
            setIsBusinessNoChanged(false);
        }
        console.log('흠,,' + businessNo);
        setCafe((prevCafe) => ({ ...prevCafe, [name]: value }));

    };


    const fileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);


        const imageUrl = URL.createObjectURL(file);
        setCafe((prevCafe) => ({
            ...prevCafe,
            imageUrl: imageUrl,
        }));
    }


    useEffect(() => {

        const storeInfo = document.querySelector('.storeInfo-right-section');

        if (storeInfo) {
            window.addEventListener('scroll', function () {
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
    useEffect(() => {
        axios.get(`${url}/member/point/${memNo}`, {

            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(res => {
                const resPoint = res.data;
                tokenCreate(dispatch, setCookie, res.headers)
                    .then(() => {
                        setPoint(resPoint);
                    })
            })
            .catch(err => {
                console.log(err);
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                }
            })
    }, [])

    const pointCalReq = () => {
        if (point < 100) {
            MyToast.fire({
                icon: 'error',
                title: '100개 이상부터 정산 신청이 가능합니다'
            })
        } else {
            axios.post(`${url}/store/point/calculate/${memNo}`, null, {
                headers: {
                    Authorization: accessToken,
                    Refresh: getCookie("refreshToken")
                }
            })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    tokenCreate(dispatch, setCookie, res.headers)
                        .then(() => {
                            setPoint(res.data);
                            MyToast.fire({
                                icon: 'success',
                                title: '포인트 정산 신청이 완료되었습니다'
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                    if (err.response !== undefined) {
                        tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                    }
                })
        }
    }

    const [selectedTags, setSelectedTags] = useState([]);

    const tagClick = (i) => {
        let updatedTags;
        console.log(i);

        if (selectedTags.includes(i)) {
            updatedTags = selectedTags.filter((item) => item !== i);
        } else {
            updatedTags = [...selectedTags, i];
        }
        if (updatedTags.length > 1) {
            Swal.fire({
                title: '1개까지 선택 가능합니다',
                icon: 'error',
                confirmButtonText: '확인',
            });
        } else {
            setSelectedTags(updatedTags);
        }
    };


    return (
        <div className='storeInfo-container'>
            <StoreSideTab />
            <div className='storeInfo-container-other'>
                <div className='storeInfo-left-section'>
                    <div className='storeInfo'>
                        <div className='storeInfo-storeName'>{cafe.cafeName ? cafe.cafeName : '가게 이름'}</div>
                        <div className='storeInfo-picture' >
                            {cafe.imageUrl && (
                                <img src={cafe.imageUrl} style={{ width: "320px", height: "320px", borderRadius: "20px" }} alt="썸네일" />
                            )}
                        </div>
                        <div className='storeInfo-location'>{cafe.address ? cafe.address : '위치를 입력하세요.'}</div>
                        <div className='storeInfo-time'>운영 시간 : {cafe.operTime ? cafe.operTime : '시간을 입력하세요.'}</div>
                    </div> <br />
                    <div className='storeInfo-point'>
                        보유 커피콩
                        <img className='storeInfo-pointImg' src="/img/bean.png" alt='bean' /> {point}개
                    </div>
                    <button className='storeInfo-pointCheck' onClick={pointCalReq}>환급신청</button>
                </div>


                <div className='storeInfo-right-section'>
                    <form>

                        <div className='storeInfoInputDiv'>
                            <label>가게명 <br />
                                <input type="text" id="cafeName" name="cafeName" onChange={change} value={cafe.cafeName} /></label>
                        </div> <br />
                        <div className='storeInfoInputDiv'>
                            <label>가게 전화번호 <br />
                                <input type="text" id="tel" name="tel" onChange={change} value={cafe.tel} /></label>
                        </div> <br />
                        <div className='storeInfoInputDiv-other'>
                            <label> 사업자 등록 번호
                                <span className='storeInfo-auth'>
                                    {/* {cafe.businessNo && !valid.businessNo ? "하이픈(-) 제외 숫자로 작성하세요" : ""} */}
                                    {!isBusinessNoChanged && cafe.businessNo && !valid.businessNo ? "하이픈(-) 제외 숫자로 작성하세요" : ""}

                                </span><br />
                                <input type="text" id="businessNo" name="businessNo" onChange={change} value={cafe.businessNo} /></label>
                        </div>
                        <div className='storeInfoAuthNum'>
                            <button type="button" onClick={businessNo}>
                                사업자 <br /> 인증 </button>
                        </div> <br />
                        <div className='storeInfoInputDiv-other'>
                            <label> 위치 <br />
                                <input type="text" id="address" name="address" onChange={change} value={cafe.address} /></label>
                        </div>
                        <div className='storeInfoAuthNum'>
                            <button type="button" onClick={searchAddr}> 위치 <br /> 검색 </button>
                        </div> <br />
                        <div className='storeInfoInputDiv'>
                            <label>운영시간 <br />
                                <input type="text" id="operTime" name="operTime" onChange={change} value={cafe.operTime} /></label>
                        </div> <br />

                        <input
                            type="file"
                            id="thumbImg"
                            name="thumbImg"
                            onChange={fileChange}
                            style={{ display: 'none' }}
                        />
                        <div className='storeInfoInputDiv-other'>
                            <label> 썸네일 <br />
                                <input
                                    className="storeInfoInput-text"
                                    type="text"
                                    id="thumbImg"
                                    name="thumbImg"
                                    value={cafe.imageUrl}
                                    readOnly
                                />
                            </label>
                        </div>
                        <div className='storeInfoAuthNum'>
                            <button
                                type="button"
                                onClick={() => document.getElementById("thumbImg").click()}
                            >
                                썸네일 <br />선택
                            </button> </div><br />

                        {/* 사장님 선택 태그 */}
                        <div className='StoreInfo-tag'>
                            {tagList.map((tags, i) => (
                                <div
                                    key={i}
                                    className={selectedTags.includes(i) ? 'selectTags' : 'tags'}
                                    onClick={() => tagClick(i)}>
                                    {tags.storeTagName}
                                </div>
                            ))}
                        </div>
                        <div className='storeInfo-button'>
                            <button type="button" onClick={StoreInfo}> 정보 수정 </button>
                        </div> <br />
                    </form>
                </div>
            </div>
        </div>
    );
}


export default StoreInfo;