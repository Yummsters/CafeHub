import React from 'react';
import './myReplyStyle.css';
import Swal from "sweetalert2";
import { Table, Pagination, PaginationLink } from "reactstrap";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import UserSideTab from '../components/UserSideTab';
import { normalCheck, tokenCreate, tokenExpried } from '../login/TokenCheck';
import axios from 'axios';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';


const User5 = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const memNo = useSelector(state => state.persistedReducer.member.memNo);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [replyList, setReplyList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 1, size: 5, totalElements: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [curPage, setCurPage] = useState(page);

    let firstNum = curPage - (curPage % 5) + 1;
    let lastNum = curPage - (curPage % 5) + 5;
    let total = Math.min(4, (pageInfo.totalPages === 0 ? 1 : pageInfo.totalPages) - firstNum);

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

    useEffect(() => {
        getPage(page);
    }, [])

    const getPage = (page) => {
        setPage(page);
        setCurPage(page);

        axios.get(`http://localhost:8080/user/reply/${memNo}?page=${page}&&size=5`, {
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(res => {
                tokenCreate(dispatch, setCookie, res.headers)
                    .then(() => {
                console.log(res.data);
                const list = res.data.data;
                const resPageInfo = res.data.pageInfo;

                setReplyList([...list]);
                setPageInfo({
                    page: resPageInfo.page,
                    size: resPageInfo.size,
                    totalElements: resPageInfo.totalElements,
                    totalPages: resPageInfo.totalPages
                });

                console.log(replyList);
            })
            })
            .catch(err => {
                console.log(err);
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                }
            })
    }

    const reviewDetail = (reviewNo) => {
        if (isLogin) {
            normalCheck(dispatch, accessToken);
        }
        navigate('/reviewDetail/' + reviewNo, {state: {reviewNo: reviewNo}});    }

    const replyDeleteCheck = (e, replyNo) => {
        e.stopPropagation();

        Swal.fire({
            title: "댓글 삭제",
            text: "댓글을 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then((res) => {
            if (res.isConfirmed) {
                replyDelete(replyNo);
            }
        });
    };

    const replyDelete = (replyNo) => {
        console.log(replyNo);

        axios.delete(`http://localhost:8080/replyDelete/${replyNo}`, {
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(res => {
                console.log(res);
                tokenCreate(dispatch, setCookie, res.headers)
                    .then(() => {
                        Toast.fire({
                            title: "댓글 삭제 완료",
                            icon: "success",
                        })
                            .then(() => {
                                window.location.reload();
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

    return (
        <div className='myReply-mypage'>
            <UserSideTab />
            <div className='myReplylistBox'>
                <br /><label className='myreplylistTitle'>댓글 관리</label><br /><br />
                {replyList.length == 0 && <div className="myreply0">작성한 댓글이 없습니다</div>}
                <div className='myReply-table'>
                    <Table hover>
                        <tbody>
                            {replyList.length != 0 && replyList.map(list => {
                                return (
                                    <tr key={list.replyNo} onClick={() => { reviewDetail(list.reviewNo) }}>
                                        <td colSpan={8} >
                                            <div className='myReply-listMiniTitle'>{list.content.length >30 ? list.content.slice(0, 30)+'...' : list.content }</div>
                                            <div className='myReply-description1'>원글: {list.title}</div>
                                        </td>
                                        <td colSpan={4}>
                                            <img className='myReply-replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''
                                                onClick={(e) => replyDeleteCheck(e, list.replyNo)} /><br />
                                            <div className='myReply-dateTime'>작성일 {list.regDate}</div>
                                        </td>
                                    </tr>);
                            })}
                        </tbody>
                    </Table>
                </div>
                { replyList.length != 0 && <Pagination className="myReply-Page">
                    <PaginationLink
                        className='myReply-Button'
                        onClick={() => { getPage(page - 1); setCurPage(page - 2); }}
                        disabled={page === 1}>
                        &lt;
                    </PaginationLink>
                    <PaginationLink
                        className={`myReply-Button ${firstNum === page ? 'current-page' : ''}`}
                        onClick={() => getPage(firstNum)}
                        aria-current={page === firstNum ? "page" : null}>
                        {firstNum}
                    </PaginationLink>
                    {Array(total).fill().map((_, i) => {
                        if (i <= 2) {
                            let pageNum = firstNum + 1 + i;
                            return (
                                <PaginationLink
                                    className={`myReply-Button ${pageNum === page ? 'current-page' : ''}`}
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
                                    className={`myReply-Button ${pageNum === page ? 'current-page' : ''}`}
                                    key={i + 1}
                                    onClick={() => getPage(lastNum)}
                                    aria-current={page === lastNum ? "page" : null}>
                                    {lastNum}
                                </PaginationLink>
                            )
                        }
                    })}
                    <PaginationLink
                        className='myReply-Button'
                        onClick={() => { getPage(page + 1); setCurPage(page); }}
                        disabled={page >= pageInfo.totalPages}>
                        &gt;
                    </PaginationLink>
                </Pagination>}
            </div>
        </div>
    );
};

export default User5;