import React, { useState, useEffect } from 'react';
import { Table, Pagination, PaginationLink } from "reactstrap";
import { useParams } from "react-router";
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import './userReviewStyle.css';
import axios from 'axios';

const UserReview = () => {
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [reviewList, setReviewList] = useState([]);
    const [pageInfo, setPageInfo] = useState({page : 1, size : 5, totalElements : 1, totalPages : 1});
    const [page, setPage] = useState(1);
    const {nickname} = useParams();
    const [curPage, setCurPage] = useState(page);

    let firstNum = curPage - (curPage % 5) + 1;
    let lastNum = curPage - (curPage % 5) + 5;
    let total =  Math.min(4, (pageInfo.totalPages ===0 ? 1 : pageInfo.totalPages) - firstNum);

    useEffect(()=>{
        getPage(page);
    },[])

    const getPage = (page) => {
        if(isLogin){
            normalCheck(dispatch, accessToken);
        }
        
        setPage(page);
        setCurPage(page);

        axios.get(`http://localhost:8080/userReview/${nickname}?page=${page}&&size=5`)
        .then(res =>{
            console.log(res);
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
        .catch(err =>{
            console.log(err);
        })
    }

    const reviewDetail = (reviewNo) =>{
        if(isLogin){
            normalCheck(dispatch, accessToken);
        }
        navigate('/reviewDetail/'+reviewNo);
    }

    return (
        <div className='userReview-container'>
            <div className='userReviewListBox'>
                <br/><label className='listTitle'>{nickname}님이 작성한 리뷰</label><br/><br/>
                <div className='userReview-table'>
                    <Table hover>
                        <tbody>
                            {reviewList.length != 0 && reviewList.map(list=>{
                                return(
                                    <tr  key={list.reviewNo} onClick={()=>{reviewDetail(list.reviewNo)}}>
                                        <th scope="row" style={{width : "150px"}}> <img className='listImg' src = {`http://localhost:8080/thumbImg/${list.thumbImg}`}  alt=''/></th>
                                        <td colSpan={8}><div className='listMiniTitle'>{list.title}</div>
                                            <div className='reviewUser'>{list.cafeName}</div></td>
                                        <td colSpan={4}><div className='reviewLikeCount'>추천 {list.likeCount}</div>
                                            <div className='dateTime'>작성일 {list.regDate}</div></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
                <Pagination className="storeReview-Page">
                    <PaginationLink 
                    className='storeReview-Button'
                        onClick={() => {getPage(page-1); setCurPage(page-2);}} 
                        disabled={page===1}>
                        &lt;
                    </PaginationLink>  
                    <PaginationLink 
                         className={`storeReview-Button ${firstNum === page ? 'current-page' : ''}`}
                        onClick={() => getPage(firstNum)}
                        aria-current={page === firstNum ? "page" : null}>
                        {firstNum}
                    </PaginationLink>
                    {Array(total).fill().map((_, i) =>{
                        
                    if(i <=2){
                        let pageNum = firstNum+1+i;
                        return (
                            <PaginationLink
                            className={`storeReview-Button ${pageNum === page ? 'current-page' : ''}`}
                            key={i+1} 
                                onClick={() => {getPage(firstNum+1+i)}}
                                aria-current={page === firstNum+1+i ? "page" : null}>
                                {firstNum+1+i}
                            </PaginationLink>
                        )
                    }else if(i>=3){
                        let pageNum = lastNum;
                         return (
                            <PaginationLink
                            className={`storeReview-Button ${pageNum === page ? 'current-page' : ''}`}
                            key ={i+1}
                                onClick={() => getPage(lastNum)}
                                aria-current={page === lastNum ? "page" : null}>
                                {lastNum}
                            </PaginationLink>
                         )  
                        }
                    })}
                    <PaginationLink 
                      className='storeReview-Button'
                        onClick={() => {getPage(page+1); setCurPage(page);}} 
                        disabled={page >=pageInfo.totalPages}>
                        &gt;
                    </PaginationLink>
                </Pagination>
            </div>
        </div>
    );
};

export default UserReview;