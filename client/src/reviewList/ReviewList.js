import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './ReviewListStyle.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; //페이지 당 리뷰 수

    useEffect(() => {
        axios.get(`http://localhost:8080/reviewList`, {
            params: {
                page: currentPage - 1,
                size: reviewsPerPage,
            },
        })
            .then((response) => {
                setReviews(response.data.content);
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
    }, [currentPage]);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                            {currentReviews.map((review) => (
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
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
                        </li>
                        {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === Math.ceil(reviews.length / reviewsPerPage) ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReviewList;