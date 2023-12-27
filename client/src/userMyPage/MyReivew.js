import React, { useEffect, useState } from 'react';
import './User.css';
import UserSideTab from '../components/UserSideTab';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Table, Pagination, PaginationLink } from "reactstrap";
import { useDispatch } from 'react-redux';
import { normalCheck, tokenCreate, tokenExpried ,checkLogin} from '../login/TokenCheck';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';
import { useNavigate } from 'react-router';
import { url } from '../config.js'

const MyReview = () => {
    const [reviews, setReviews] = useState([]);
    const [pickBadgeName, setPickBadge] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [authList, setAuthList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 1, size: 5, totalElements: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [curPage, setCurPage] = useState(page);
    const [pageInfo1, setPageInfo1] = useState({ page: 1, size: 5, totalElements: 1, totalPages: 1 });
    const [page1, setPage1] = useState(1);
    const [curPage1, setCurPage1] = useState(page);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const memNo = useSelector(state => state.persistedReducer.member.memNo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let firstNum = curPage - (curPage % 5) + 1;
    let lastNum = curPage - (curPage % 5) + 5;
    let total = Math.min(4, (pageInfo.totalPages === 0 ? 1 : pageInfo.totalPages) - firstNum);
    let firstNum1 = curPage1 - (curPage1 % 5) + 1;
    let lastNum1 = curPage1 - (curPage1 % 5) + 5;
    let total1 = Math.min(4, (pageInfo1.totalPages === 0 ? 1 : pageInfo1.totalPages) - firstNum1);

    useEffect(() => {
        getPage(page);
    }, [])

    const getPage = (page) => {
        setPage(page);
        setCurPage(page);

        axios.get(`${url}/user/myReview/${memNo}?page=${page}&size=5`, {
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(res => {
                tokenCreate(dispatch, setCookie, res.headers);
                console.log("서버 응답 데이터:", res.data);
                const list = res.data.data;
                const resPageInfo = res.data.pageInfo;

                setReviewList([...list]);
                setPageInfo({
                    page: resPageInfo.page,
                    size: resPageInfo.size,
                    totalElements: resPageInfo.totalElements,
                    totalPages: resPageInfo.totalPages
                });

            })
            .catch(err => {
                console.log(err); 
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                                      
            })
    }
    useEffect(() => {
        getAuthPage(page1);
    }, [])
    const getAuthPage = (page1) => {
        setPage1(page1);
        setCurPage1(page1);

        axios.get(`${url}/user/myReviewAuth/${memNo}?page=${page1}&size=5`, {
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(res => {
                tokenCreate(dispatch, setCookie, res.headers)
                .then(() => {
                console.log("응답 데이터:", res.data);
                const auth = res.data.data;
                const resPageInfo = res.data.pageInfo;

                setAuthList([...auth]);
                setPageInfo1({
                    page: resPageInfo.page,
                    size: resPageInfo.size,
                    totalElements: resPageInfo.totalElements,
                    totalPages: resPageInfo.totalPages
                });
            })
            })
            .catch(err => {
                console.log(err);
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                }
            })
    }

    useEffect(() => {
        reviews.forEach((review) => {
            axios
                .get(`${url}/common/upload/${review.thumbImg}`, {
                    headers: {
                        responseType: 'arraybuffer',
                        Authorization :accessToken,
                        Refresh : getCookie("refreshToken")
        
                    },
                  
                })
                .then((response) => {
                    tokenCreate(dispatch, setCookie, response.headers);
                                    
                    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
                    const imageUrl = URL.createObjectURL(imageBlob);


                    setReviews((prevReviews) => {
                        return prevReviews.map((prevReview) =>
                            prevReview.reviewNo === review.reviewNo ? { ...prevReview, imageUrl } : prevReview
                        );
                    });
                })
                .catch((error) => {
                    console.error('이미지 불러오기 오류:', error);
                    tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                                      
                });
        });
    }, [reviews]);

    useEffect(() => {
        axios.get(`${url}/getMemberBadge/${memNo}`,{
            Authorization :accessToken,
            Refresh : getCookie("refreshToken")

        })
            .then(response => {
                tokenCreate(dispatch, setCookie, response.headers);
                                   
                const badgeName = response.data.badgeName || '';
                setPickBadge([badgeName]);
               
            })
            .catch(error => {
                tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                console.error('에러 발생:', error);
            });
    }, [memNo]);

    const reviewDetail = (reviewNo) => {
    
    checkLogin(dispatch, accessToken, isLogin, navigate)
    .then(() => {
        navigate('/reviewDetail/' + reviewNo, { state: { reviewNo: reviewNo } });

    })
}
const clickReveiwBtn = (e) => {
    e.preventDefault();

    checkLogin(dispatch, accessToken, isLogin, navigate)
        .then(() => {
            navigate("/reviewWrite");
        })
};

    return (
        <div className='mypage'>
            <UserSideTab />
            <div className='reviewListBox_user4'>
                <div className='leftBox'>
                    <br /><label className='myreview-listTitle'>리뷰 관리</label><br /><br />

                    <Table hover>
                        <tbody>
                            {reviewList.length == 0 ? <sapn className="myreview0">조회된 리뷰가 없습니다</sapn> : reviewList.map(list => {
                                return (

                                    <tr key={list.reviewNo} onClick={() => { reviewDetail(list.reviewNo) }}>
                                        <th scope="row">

                                            <div
                                                className='listImg'
                                                id='listImg'
                                                style={{
                                                    backgroundImage: `url(${url}/common/upload/${list.thumbImg})`,
                                                    marginLeft: '22px',
                                                    verticalAlign: 'middle',
                                                    borderRadius: '10px',
                                                    backgroundSize: '100% 100%',
                                                }}
                                            >

                                            </div>
                                        </th>
                                        <td colSpan={10} >
                                            <Link to={`/reviewDetail/${list.reviewNo}`}
                                                state={{ reviewNo: `${list.reviewNo}` }} >
                                                <div className='listMiniTitle'>{list.title}</div>
                                                <div className='description1'>{list.cafeName}</div>
                                            </Link>


                                        </td>
                                        <td colSpan={2}>

                                            <div className='writeInfo'>
                                                <a href={`/userReview/${list.nickname}`}>
                                                    {pickBadgeName.length > 0 && <img className='myreviewbadge' src={`/img/${pickBadgeName[0]}`} alt="house" />}
                                                    {list.nickname} | 추천 {list.likeCount}
                                                </a>

                                            </div>
                                            <div className='dateTime'>{list.regDate}</div>
                                        </td>
                                    </tr>);
                            })}
                        </tbody>
                    </Table>


                    <div className='reviewpage'>
                        <Pagination className="myReview-Page">
                            <PaginationLink
                                className='myReview-Button'
                                onClick={() => { getPage(page - 1); setCurPage(page - 2); }}
                                disabled={page === 1}>
                                &lt;
                            </PaginationLink>
                            <PaginationLink
                                className={`myReview-Button ${firstNum === page ? 'current-page' : ''}`}
                                onClick={() => getPage(firstNum)}
                                aria-current={page === firstNum ? "page" : null}>
                                {firstNum}
                            </PaginationLink>
                            {Array(total).fill().map((_, i) => {
                                if (i <= 2) {
                                    let pageNum = firstNum + 1 + i;
                                    return (
                                        <PaginationLink
                                            className={`myReview-Button ${pageNum === page ? 'current-page' : ''}`}
                                            key={i + 1}
                                            onClick={() => { getPage(firstNum + 1 + i) }}
                                            aria-current={page === firstNum + 1 + i ? "page" : null}>
                                            {firstNum + 1 + i}
                                        </PaginationLink>
                                    )
                                } else if (i >= 3) {
                                    let pageNum = lastNum;
                                    return (
                                        <PaginationLink
                                            className={`myReview-Button ${pageNum === page ? 'current-page' : ''}`}
                                            key={i + 1}
                                            onClick={() => getPage(lastNum)}
                                            aria-current={page === lastNum ? "page" : null}>
                                            {lastNum}
                                        </PaginationLink>
                                    )
                                }
                            })}
                            <PaginationLink
                                className='myReview-Button'
                                onClick={() => { getPage(page + 1); setCurPage(page); }}
                                disabled={page >= pageInfo.totalPages}>
                                &gt;
                            </PaginationLink>
                        </Pagination>
                    </div>
                </div>
                <div className='rightBox'>
                    <br /><label className='cafeList'>리뷰 작성 가능 카페</label><br /><br />
                    <Table hover>
                        <tbody>
                            {authList.length == 0 ? <sapn className="myreview0">작성 가능한 카페가 없습니다</sapn> : authList.map(auth => {
                                return (

                                    <tr className='trauth'>
                                        <th scope="row">
                                        </th>
                                        <td colSpan={10} >
                                            <div className='listMiniTitle'>{auth.cafeName}</div>
                                            <div className='description1'>{auth.address}</div>
                                        </td>
                                        <td colSpan={2}>

                                            <a> <button className='regReviewBtn' onClick={clickReveiwBtn}>
                                                <div className='regReview'>리뷰 등록</div>
                                                <div className='deadline'>({auth.remainTime}일 남음)</div>
                                            </button>
                                            </a>
                                        </td>
                                    </tr>);
                            })}
                        </tbody>
                    </Table>



                    <div className='reviewpage'>
                        <Pagination className="myReview-Page">
                            <PaginationLink
                                className='myReview-Button'
                                onClick={() => { getAuthPage(page1 - 1); setCurPage1(page1 - 2); }}
                                disabled={page1 === 1}>
                                &lt;
                            </PaginationLink>
                            <PaginationLink
                                className={`myReview-Button ${firstNum1 === page1 ? 'current-page' : ''}`}
                                onClick={() => getAuthPage(firstNum1)}
                                aria-current={page1 === firstNum1 ? "page1" : null}>
                                {firstNum1}
                            </PaginationLink>
                            {Array(total1).fill().map((_, i) => {
                                if (i <= 2) {
                                    let pageNum1 = firstNum1 + 1 + i;
                                    return (
                                        <PaginationLink
                                            className={`myReview-Button ${pageNum1 === page1 ? 'current-page' : ''}`}
                                            key={i + 1}
                                            onClick={() => { getAuthPage(firstNum1 + 1 + i) }}
                                            aria-current={page1 === firstNum1 + 1 + i ? "page1" : null}>
                                            {firstNum1 + 1 + i}
                                        </PaginationLink>
                                    )
                                } else if (i >= 3) {
                                    let pageNum1 = lastNum1;
                                    return (
                                        <PaginationLink
                                            className={`myReview-Button ${pageNum1 === page1 ? 'current-page' : ''}`}
                                            key={i + 1}
                                            onClick={() => getAuthPage(lastNum1)}
                                            aria-current={page1 === lastNum1 ? "page1" : null}>
                                            {lastNum1}
                                        </PaginationLink>
                                    )
                                }
                            })}
                            <PaginationLink
                                className='myReview-Button'
                                onClick={() => { getAuthPage(page1 + 1); setCurPage1(page1); }}
                                disabled={page1 >= pageInfo1.totalPages}>
                                &gt;
                            </PaginationLink>
                        </Pagination>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReview;
