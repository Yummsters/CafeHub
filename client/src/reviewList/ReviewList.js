import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './ReviewListStyle.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage:1,
        reviewsPerPage:10,
        startPage:1,
        endPage:1,
        totalPages:1
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/reviewList`, {
            params: {
                page: pageInfo.currentPage - 1,
                size: pageInfo.reviewsPerPage,
            },
        })
            .then((response) => {
                console.log(response.data)
                setReviews(response.data.content);
                let totalPages = response.data.totalPages;                ;
                let startPage = Math.floor((pageInfo.currentPage-1)/pageInfo.reviewsPerPage)+1;
		        let endPage = Math.min(startPage+pageInfo.reviewsPerPage-1, totalPages);
                console.log(totalPages)
                console.log(startPage)
                console.log(endPage)
                setPageInfo({...pageInfo, startPage:startPage, endPage:endPage, totalPages:totalPages})
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
                    // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생한 경우
                    console.error('오류를 발생시키는 중에 문제 발생:', error.message);
                }
            });
    }, [pageInfo.currentPage]);

    // const indexOfLastReview = currentPage * reviewsPerPage;
    // const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    // const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handlePageChange = (pageNumber) => {
        setPageInfo({...pageInfo, currentPage:pageNumber})
        //setCurrentPage(pageNumber);
    };

    return (
        <div className='reviewWrapper'>
            <div className='reviewListBox'>
                <div className='searchBar'>
                    <input className='searchBox'></input>
                    <img src='/img/searchIcon.png' alt='' />
                </div>
                <div className='reviewline' />
                <div><a href='/reviewwrite'><button className='reviewBtn'>리뷰 등록</button></a></div>

                <div className='reviewtable'>
                    <Table hover >
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.reviewNo}>
                                    <th scope='row'>
                                        <img className='listImg' src={review.thumbImg} alt='' />
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
                                            <img src='/img/cookies.png' alt='' />
                                            {`${review.nickname} | 추천 ${review.likeCount}`}
                                        </div>
                                        <div className='dateTime'>{review.regDate}</div>
                                    </td>
                                </tr>
                            ))}
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
                                <button className="page-link" onClick={() => handlePageChange(index+pageInfo.startPage )}>{index+pageInfo.startPage }</button>
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

export default ReviewList;