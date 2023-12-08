import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './ReviewListStyle.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ReviewList = () => {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/reviewList`)
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error('리뷰 가져오기 오류:', error);
            });
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 로드될 때만 useEffect가 실행되도록 설정

    return (
        <div className='reviewWrapper'>
            <div className='reviewListBox'>
                <div className='searchBar'>
                    <input className='searchBox'></input>
                    <img src='/img/searchIcon.png' alt='' />
                </div>
                <div className='reviewline' />
                <a href='/reviewwrite'><button className='reviewBtn'>리뷰 등록</button></a>

                <div className='reviewtable'>
                    <Table hover >
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.reviewNo}>
                                    <th scope='row'>
                                        <img className='listImg' src={`/img/${review.thumbImg}.png`} alt='' />
                                    </th>
                                    <td colSpan={10}>
                                        <Link to={`/reviewDetail/${review.reviewNo}`}>
                                            <div className='listMiniTitle'>{review.title}</div>
                                        </Link>
                                        <div className='description1'>{review.tagName}</div>
                                    </td>
                                    <td colSpan={2}>
                                        <div className='writeInfo'>
                                            <img src='/img/cookies.png' alt='' />
                                            {`${review.member.nickname} | 추천 ${review.likeCount}`}
                                        </div>
                                        <div className='dateTime'>{review.regDate}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div className='reviewList-pagination'>
                    <div className='reviewList-prevPage'>&lt;</div>
                    <div className='reviewList-page'>1 2 3 맵사용해~</div>
                    <div className='reviewList-nextPage'>&gt;</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewList;