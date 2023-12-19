import './headerStyle.css';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {persistor} from '../App';
import { getCookie, removeCookie} from './Cookie';
import Swal from 'sweetalert2';
import { checkLogin} from '../login/TokenCheck';
import { IsUserCheck } from './IsMemberTypeCheck';

const Header = () => {
    const memberType = useSelector(state=>state.persistedReducer.member.memberType);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state=>state.persistedReducer.isLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
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

    // 마이페이지
    const mypage = (e) =>{
        e.preventDefault();
        checkLogin(dispatch, accessToken, isLogin, navigate)
        .then(()=>{
            if(memberType == "USER") navigate('/userInfo');
            else if(memberType =="STORE") navigate('/storeuserInfo');
            else if(memberType == "MANAGER") navigate('/managerAd');
        })
        .catch(()=>{
            Toast.fire({
                icon: 'error',
                title: '다시 로그인 해주세요',
            }).then(()=>{
                persistor.purge();
            })
        })
    }

    // 로그아웃
    const logout = (e) =>{
        e.preventDefault();
        
        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        dispatch({type:"accessToken", payload:""});
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:""});
        dispatch({type:"cafe", payload:""});
        dispatch({type:"payment", payload:""})
        removeCookie("refreshToken");

        Toast.fire({
                icon: 'success',
                title: '로그아웃 되었습니다',
        }).then(()=>{
            navigate("/login");
        })
    }

    const handleCafeRecommendClick = (e) => {
        e.preventDefault();
        navigate("/recoReviewCafe");
    };

    return (
        <div className='navBox'>
            <div className='navContent'>
                <a href="/" style={{textDecoration:"none"}}><div className='logo'>Café<span className="hub">Hub</span></div></a>
                <div className='center'>
                <p><a href="#Main2" onClick={handleCafeRecommendClick}>카페 리뷰 추천</a></p>
                    <p><a href="/reviewList">리뷰 게시판</a></p>
                    <p><a href="/map">내 근처 카페</a></p>
                </div>
                <div className='right'>

                {/* 추후 토큰 시간 관련하여 추가 설정 필요 */}
                    <p>{ memberType==="MANAGER" ? <a href="/" onClick={mypage}> 관리자 마이페이지 </a>: 
                    (memberType === "STORE" ? <a href="/storeInfo" onClick={mypage}>내 가게 관리</a> : 
                    <a href= "/userInfo" onClick={mypage}>마이페이지</a>)}</p>

                    <p> {!isLogin ? <a href="/login">로그인</a> : <a href="#" onClick={logout}>로그아웃</a>}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;