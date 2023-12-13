import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, ButtonGroup,PaginationLink } from "reactstrap";
import {useSelector} from 'react-redux';
import './storeReviewStyle.css';
import axios from 'axios';
import StoreSideTab from '../components/StoreSideTab';

const StoreReview = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);

    const [cafeNo, setCafeNo] = useState(1);

    const [reviewList, setReviewList] = useState([]);
    const [pageInfo, setPageInfo] = useState({page : 1, size : 5, totalElements : 1, totalPages : 1});
    const [page, setPage] = useState(1);
    const [curPage, setCurPage] = useState(page);

    let firstNum = curPage - (curPage % 5) + 1;
    let lastNum = curPage - (curPage % 5) + 5;
    let total =  Math.min(4, (pageInfo.totalPages ===0 ? 1 : pageInfo.totalPages) - firstNum);


    useEffect(()=>{
        getPage(page);
    },[])
    
    // 페이지 조회
    const getPage = (page) => {
        setPage(page);
        setCurPage(page);
        axios.get(`http://localhost:8080/review/storeList/${cafeNo}?page=${page}&&size=5`,
        {
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
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
        .catch(err=>{
            console.log(err);
        })
    }

    const reviewDetail = (reviewNo) =>{
        window.location.href = '/reviewDetail/'+reviewNo;
    }

    return (
        <div className='storeReview-container'>
            <StoreSideTab/>
            <div className='storeReviewListBox'>
                <br/><label className='listTitle'>리뷰 조회</label><br/><br/>
                <div className='storeReview-table'>
                    <Table hover>
                        <tbody>
                            {reviewList.length != 0 && reviewList.map(list=>{
                                return(
                                    <tr  key={list.reviewNo} onClick={()=>{reviewDetail(list.reviewNo)}}>
                                        <th scope="row" style={{width : "150px"}}> <img className='listImg' src = {`http://localhost:8080/thumbImg/${list.thumbImg}`}  alt=''/></th>
                                        <td colSpan={8}><div className='listMiniTitle'>{list.title}</div>
                                            <div className='reviewUser'>{list.nickName}</div></td>
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

export default StoreReview;