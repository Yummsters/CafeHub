import './headerStyle.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { removeCookie } from './Cookie';
import Swal from 'sweetalert2';
import { checkLogin, normalCheck } from '../login/TokenCheck';

const Header = () => {
    const memberType = useSelector(state => state.persistedReducer.member.memberType);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // 마이페이지
    const mypage = (e) => {
        e.preventDefault();
        checkLogin(dispatch, accessToken, isLogin, navigate)
            .then(() => {
                if (memberType == "USER") navigate('/userInfo');
                else if (memberType == "STORE") navigate('/storeInfo');
                else if (memberType == "MANAGER") navigate('/managerAd');
            })
            .catch(() => {
                Toast.fire({
                    icon: 'error',
                    title: '다시 로그인 해주세요',
                }).then(() => {
                    dispatch({ type: "accessToken", payload: "" });
                    dispatch({ type: "isLogin", payload: false });
                    dispatch({ type: "member", payload: "" });
                    dispatch({ type: "cafe", payload: "" });
                    removeCookie("refreshToken");
                })
            })
    }

    // 로그아웃
    const logout = (e) => {
        e.preventDefault();

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        dispatch({ type: "accessToken", payload: "" });
        dispatch({ type: "isLogin", payload: false });
        dispatch({ type: "member", payload: "" });
        dispatch({ type: "cafe", payload: "" });
        removeCookie("refreshToken");

        Toast.fire({
            icon: 'success',
            title: '로그아웃 되었습니다',
        }).then(() => {
            navigate("/login");
        })
    }

    const logoClick = () => {
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate('/');
    }

    const cafeReview = (e) => {
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        //window.location.href = '/reviewList';
        navigate("/reviewList");
    };

    const cafeRecommendClick = (e) => {
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate("/recoReviewCafe");
    };

    const mapClick = (e) =>{
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate("/map");
    }

    return (
        <div className='navBox'>
            <div className='navContent'>
                <div className='logo' onClick={logoClick} style={{ cursor: "pointer" }}>Café<span className="hub">Hub</span></div>
                <div className='center'>
                    <p><a href="#Main2" onClick={cafeRecommendClick}>카페 리뷰 추천</a></p>
                    <p><a href="/reviewList" onClick={cafeReview}>리뷰 게시판</a></p>
                    <p><a href="/map" onClick={mapClick}>내 근처 카페</a></p>
                </div>
                <div className='right'>
                    <p>{memberType === "MANAGER" ? <a href="/" onClick={mypage}> 관리자 마이페이지 </a> :
                        (memberType === "STORE" ? <a href="/" onClick={mypage}>내 가게 관리</a> :
                            <a href="/userInfo" onClick={mypage}>마이페이지</a>)}</p>
                    <p> {!isLogin ? <a href="/login">로그인</a> : <a href="#" onClick={logout}>로그아웃</a>}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;