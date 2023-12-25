import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './ReviewListStyle.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { url } from '../config.js'
import { getCookie, removeCookie, setCookie } from '../components/Cookie';
import { normalCheck, tokenCreate, tokenExpried,checkLogin } from '../login/TokenCheck';
import { Toast } from '../components/Toast.js';
const ReviewList = () => {
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const dispatch = useDispatch();

    const member = useSelector(state => state.persistedReducer.member);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [reviews, setReviews] = useState([]);
    const [inputKeyword, setInputKeyword] = useState(''); //input에 입력될 내용, 키워드
    const [pickBadgeName, setPickBadge] = useState([]);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setInputKeyword(e.target.value);
    }

    const handleSearch = () => {
        setSearchParams((prev) => {
            prev.delete('search');
            prev.append('search', inputKeyword);
            prev.delete('page');
            prev.append('page', 1);
            return prev;
        });
    };

    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        reviewsPerPage: 10,
        startPage: 1,
        endPage: 1,
        totalPages: 1
    })

    useEffect(() => {
        console.log(searchParams.get('page'));
        setSearchKeyword(searchParams.get('search') ?? '');
        setInputKeyword(searchParams.get('search') ?? '');
        searchParams.get('page') && setPageInfo({ ...pageInfo, currentPage: parseInt(searchParams.get('page')) });
    }, [searchParams]);

    useEffect(() => {
        if (!pageInfo) return false;
        axios
            .get(`${url}/reviewList`, {
                params: {
                    search: searchKeyword,
                    page: pageInfo.currentPage - 1,
                    size: pageInfo.reviewsPerPage,
                },
            })
            .then((response) => {
                setReviews(response.data.content);
                console.log(response.data.content);
                let totalPages = response.data.totalPages;
                let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.reviewsPerPage) + 1;
                let endPage = Math.min(startPage + pageInfo.reviewsPerPage - 1, totalPages);
                setPageInfo((prev) => ({ ...prev, startPage: startPage, endPage: endPage, totalPages: totalPages }));
                response.data.content.forEach((review) => {
                    axios.get(`${url}/getMemberBadge/${review.memNo}`)
                        .then(badgeResponse => {
                            const badgeName = badgeResponse.data.badgeName || '';
                            setPickBadge((prev) => [...prev, badgeName]);
                        })
                        .catch(error => {
                            console.error('뱃지를 불러오지 못했습니다.:', error);
                        });
                })
            })
            .catch((error) => {
                console.error('리뷰 가져오기 오류:', error);
                if (error.response) {
                    // 서버 응답이 도착한 경우
                    console.error('서버 응답:', error.response.data);
                    console.error('응답 상태 코드:', error.response.status);
                } else if (error.request) {
                    // 서버에 요청이 전송되지 않은 경우
                    console.error('요청이 전송되지 않음:', error.request);
                } else {
                    // 오류를 발생시키는 요청을 설정하는 중에 문제가 발생한 경우
                    console.error('오류를 발생시키는 중에 문제 발생:', error.message);
                }
            });
    }, [pageInfo.currentPage, searchKeyword]);

    const handlePageChange = (pageNumber) => {
        setSearchParams((prev) => {
            prev.delete('page');
            prev.append('page', pageNumber);
            return prev;
        });
    };
    const clickReveiwBtn = (e) => {
        e.preventDefault();
    
        checkLogin(dispatch, accessToken, isLogin, navigate)
            .then(() => {
                navigate("/reviewWrite");
            })
            .catch(() => {
                Toast('error', '다시 로그인 해주세요')
                .then(() => {
                    dispatch({ type: "accessToken", payload: "" });
                    dispatch({ type: "isLogin", payload: false });
                    dispatch({ type: "member", payload: "" });
                    dispatch({ type: "cafe", payload: "" });
                    dispatch({ type: "payment", payload: "" });
                    removeCookie("refreshToken");
    
                    navigate("/login");
                });
            });
    };
      
    return (
        <div className='reviewWrapper'>
            <div className='reviewListBox'>
                <div className='searchBar'>
                    <input className='searchBox' value={inputKeyword} onChange={handleSearchChange}></input>
                    <img className='searchBtn' src='/img/searchIcon.png' onClick={() => handleSearch()} alt="검색" />
                </div>
                <div className='reviewline' />
                <button className='reviewBtn' onClick={ clickReveiwBtn}>
                    리뷰 등록
                </button>
                {reviews.length !== 0 ?
                    <div className='reviewtable'>
                        <Table hover >
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.reviewNo}>
                                        <th scope='row' style={{ width: "100px" }}>
                                            <img className='listImg' src={`${url}/thumbImg/${review.thumbImg}`} alt='' />
                                        </th>
                                        <td colSpan={10}>
                                            <Link to={`/reviewDetail/${review.reviewNo}`}
                                                state={{ reviewNo: `${review.reviewNo}` }} >
                                                <div className='listMiniTitle'>{review.title}</div>
                                            </Link>
                                            <div className='description1'>{review.cafeName}</div>
                                        </td>
                                        <td colSpan={2}>
                                            <div className='writeInfo'>
                                                <a href={`/userReview/${review.nickname}`}>
                                                    <img className='badgeImg' src={`/img/${pickBadgeName[0]}`} alt='' />
                                                    {review.nickname}</a> &nbsp;| 추천 {review.likeCount}
                                            </div>
                                            <div className='dateTime'>{review.regDate}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    : <div className="noWish">리뷰가 없습니다</div>}
                {reviews.length !== 0 ?
                    <div className='reviewList-pagination'>
                        <ul className="pagination">
                            <li className={`page-item ${pageInfo.currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage - 1)}>&lt;</button>
                            </li>
                            {Array.from({ length: Math.ceil(pageInfo.endPage - pageInfo.startPage + 1) }, (_, index) => (
                                <li key={index} className={`page-item ${pageInfo.currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index + pageInfo.startPage)}>{index + pageInfo.startPage}</button>
                                </li>
                            ))}
                            <li className={`page-item ${pageInfo.currentPage === pageInfo.endPage ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage + 1)}>&gt;</button>
                            </li>
                        </ul>
                    </div>
                    : <div></div>}
            </div>
        </div>
    );
};

export default ReviewList;