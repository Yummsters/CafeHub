import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './ReviewListStyle.css';

const ReviewList = () => {
    return (
        <div className='reviewWrapper'>
        <div className='reviewListBox'>
            <div className='searchBar'>
                <input className='searchBox'></input>
                <img src='/img/searchIcon.png' alt=''/>
            </div>
                    <div className='reviewline'/>
                    <a href='/reviewModify'><button className='reviewBtn'>리뷰 등록</button></a>
                    
             <div className='reviewtable'>
            <Table hover >
                <tbody>
                    

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad1.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>따뜻한 느낌의 책 읽기 좋은 카페</div>
                        <div className='description1'>따뜻한 카페</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/cookies.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.15 11:01</div>
                    </td>
                    </tr>
                    
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad2.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>편하게 이야기 나눌 수 있는 곳 발견</div>
                        <div className='description1'>편한 이야기 카페</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/cupcake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.15 21:14</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad3.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>베리가 가득해 더욱 맛있는</div>
                        <div className='description1'>여수밤바다</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/icecream.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.16 12:30</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad4.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 감성카페</div>
                        <div className='description1'>혜리 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/macaroon.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.17 10:03</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>선진 집</div>
                    </td>
                    <td colSpan={2}>
                        <div className='writeInfo'>
                            <img src='/img/pancake.png' alt=''/>
                            선진언니바보 | 추천 24
                        </div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                <tr>
              
                </tr>
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