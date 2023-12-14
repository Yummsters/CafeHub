import React, { useState, useEffect } from 'react';
import { Table, Pagination, PaginationLink } from "reactstrap";
import { useSearchParams } from 'react-router-dom';
import {useSelector} from 'react-redux';
import './userReviewStyle.css';
import axios from 'axios';

const UserReview = () => {

    const [reviewList, setReviewList] = useState([]);
    const [pageInfo, setPageInfo] = useState({page : 1, size : 5, totalElements : 1, totalPages : 1});
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setPageInfo({...pageInfo, currentPage: parseInt(searchParams.get('page'))});
    }, [searchParams]);

    useEffect(() => {
        axios.get(`http://localhost:8080/userReview`, {
            params: {
                page: pageInfo.currentPage - 1,
                size: pageInfo.cafesPerPage,
            },
        })
            .then((response) => {
                console.log(response);
                let totalPages = response.data.totalPages;
                let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.cafesPerPage) + 1;
                let endPage = Math.min(startPage + pageInfo.cafesPerPage - 1, totalPages);
                setPageInfo({ ...pageInfo, startPage: startPage, endPage: endPage, totalPages: totalPages });
            })
            .catch(error => {
                console.error('미결제 카페 목록 가져오기 오류:', error);
            });
    }, [pageInfo.currentPage]);

    const reviewDetail = (reviewNo) =>{
        window.location.href = '/reviewDetail/'+reviewNo;
    }

    const handlePageChange = (pageNumber) => {
        setSearchParams((prev) => {
            prev.delete('page');
            prev.append('page', pageNumber);
            return prev;
        });
    };

    return (
        <div className='userReview-container'>
            <div className='userReviewListBox'>
                <br/><label className='listTitle'>곽두팔님이 작성한 리뷰</label><br/><br/>
                <div className='userReview-table'>
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
            </div>
        </div>
    );
};

export default UserReview;