import './headerStyle.css';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { removeCookie } from './Cookie';
import Swal from 'sweetalert2';
import { checkLogin, normalCheck } from '../login/TokenCheck';
import { useEffect, useState } from 'react';

const Header = () => {
    const memberType = useSelector(state => state.persistedReducer.member.memberType);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // 반응형
    const [showMenu, setShowMenu] = useState(false);
    const mobile = () => {
        if (window.innerWidth <= 880) {
            setShowMenu(false);
        }
    };
    useEffect(() => {
        window.addEventListener('resize', mobile);
        return () => {
            window.removeEventListener('resize', mobile);
        };
    }, []);

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
                    dispatch({ type: "payment", payload: "" });
                    removeCookie("refreshToken");
                })
            })
        setShowMenu(false);
    }

    // 로그아웃
    const logout = (e) => {
        e.preventDefault();

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        dispatch({ type: "accessToken", payload: "" });
        dispatch({ type: "isLogin", payload: false });
        dispatch({ type: "member", payload: "" });
        dispatch({ type: "cafe", payload: "" });
        dispatch({ type: "payment", payload: "" })
        removeCookie("refreshToken");

        Toast.fire({
            icon: 'success',
            title: '로그아웃 되었습니다',
        }).then(() => {
            navigate("/login");
        })
        setShowMenu(false);
    }

    const logoClick = () => {
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate('/');
        setShowMenu(false);
    }

    const cafeReview = (e) => {
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate("/reviewList");
        setShowMenu(false);
    };

    const cafeRecommendClick = (e) => {
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }

        if (location.pathname == '/recoReviewCafe') {
            document.getElementById('Main2').scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate("/recoReviewCafe");
            setShowMenu(false);
        }
    };

    const mapClick = (e) => {
        e.preventDefault();
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate("/map");
        setShowMenu(false);
    }

    return (
        <>
            <div className='navBox'>
                <div className='navContent'>
                    <div className='logo' onClick={logoClick} style={{ cursor: "pointer" }}>Cafe<span className="hub">Hub</span></div>
                    <div className='center'>
                        <p><a href="#Main2" onClick={cafeRecommendClick}>카페 리뷰 추천</a></p>
                        <p><a href="/reviewList" onClick={cafeReview}>리뷰 게시판</a></p>
                        <p><a href="/map" onClick={mapClick}>내 근처 카페</a></p>
                    </div>
                    <div className='right'>
                        <p>{memberType === "MANAGER" ? <a href="/" onClick={mypage}> 관리자 마이페이지 </a> :
                            (memberType === "STORE" ? <a href="/" onClick={mypage}>내 가게 관리</a> :
                                <a href="/userInfo" onClick={mypage}>마이페이지</a>)}</p>
                        <p> {!isLogin ? <a href="/login">로그인</a> : <a href="/" onClick={logout}>로그아웃</a>}</p>
                    </div>
                    <div className="hamburger-icon" onClick={() => setShowMenu(!showMenu)}><img src="/img/hamburger.png" alt="" /></div>
                </div>
            </div>

            {/* 반응형 */}
            {showMenu && (
                <div className="menu-items slide-down">
                    <p><a href="#Main2" onClick={cafeRecommendClick}>카페 리뷰 추천</a></p>
                    <p><a href="/reviewList" onClick={cafeReview}>리뷰 게시판</a></p>
                    <p><a href="/map" onClick={mapClick}>내 근처 카페</a></p>
                    <p>{memberType === "MANAGER" ? <a href="/" onClick={mypage}> 관리자 마이페이지 </a> :
                        (memberType === "STORE" ? <a href="/" onClick={mypage}>내 가게 관리</a> :
                            <a href="/userInfo" onClick={mypage}>마이페이지</a>)}</p>
                    <p> {!isLogin ? <a href="/login">로그인</a> : <a href="/" onClick={logout}>로그아웃</a>}</p>
                </div>
            )}
        </>
    );
};

export default Header;