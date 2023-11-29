import React from 'react';
import { Table } from 'reactstrap';
import './User.css';
import UserSideTab from '../components/UserSideTab';

const MyReivew = () => {
    return (
        <div className='mypage'>
        <UserSideTab/>
        <div className='reviewListBox_user4'>
            <div className='leftBox'>
            <br/><label className='myreview-listTitle'>리뷰 관리</label><br/><br/>
            <Table hover>
                <tbody>
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad1.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>맛있는 빵.. 군침이 싹 도네요</div>
                        <div className='description1'>매일 갓 구운 빵을 파는 카페</div>
                    </td>
                    <td colSpan={2}>
                        <div className='recCount'>추천 24</div>
                        <div className='dateTime'>2023.11.15 11:01</div>
                    </td>
                    </tr>
                    
                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad2.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>감성이 철철..</div>
                        <div className='description1'>감성카페</div>
                    </td>
                    <td colSpan={2}>
                    <div className='recCount'>추천 67</div>
                        <div className='dateTime'>2023.11.15 21:14</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad3.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>추천합니다 안주가 맛있는 카페</div>
                        <div className='description1'>안주 카페</div>
                    </td>
                    <td colSpan={2}>
                    <div className='recCount'>추천 9</div>
                        <div className='dateTime'>2023.11.16 12:30</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad4.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>빈티지 갬성이 오져유</div>
                        <div className='description1'>빈티지 카페</div>
                    </td>
                    <td colSpan={2}>
                    <div className='recCount'>추천 198</div>
                        <div className='dateTime'>2023.11.17 10:03</div>
                    </td>
                    </tr>

                    <tr>
                    <th scope="row">
                        <img className='listImg' src='/img/Ad5.png' alt=''/>
                    </th>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>구찌갱구찌갱</div>
                        <div className='description1'>샤넬카페</div>
                    </td>
                    <td colSpan={2}>
                    <div className='recCount'>추천 12</div>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>
                </tbody>
            </Table>
            <div className='myreview1-pagination'>
                <div className='myreview1-prevPage'>&lt;</div>
                <div className='myreview1-page'>1 2 3 맵사용해~</div>
                <div className='myreview1-nextPage'>&gt;</div>
            </div>
            </div>
            <div className='rightBox'>
            <br/><label className='cafeList'>리뷰 작성 가능 카페</label><br/><br/>
            <Table hover>
                <tbody>
                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>선진 집</div>
                        <div className='description1'>서울시 금천구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'> <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(1일 남음)</div>
                        </button>
                        </a>
                    </td>
                    </tr>
                    
                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>두팔러버</div>
                        <div className='description1'>서울시 양천구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'>  <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(3일 남음)</div>
                      </button>
                      </a>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>루피 그 잡채</div>
                        <div className='description1'>서울시 강남구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'> <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(5일 남음)</div>
                        </button>
                        </a>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>루피 그 잡채</div>
                        <div className='description1'>서울시 강남구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'> <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(5일 남음)</div>
                        </button>
                        </a>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>루피 그 잡채</div>
                        <div className='description1'>서울시 강남구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'> <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(5일 남음)</div>
                        </button>
                        </a>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>루피 그 잡채</div>
                        <div className='description1'>서울시 강남구</div>
                    </td>
                    <td colSpan={2}>
                    <a href='/reviewModify'> <button className='regReviewBtn'>
                            <div className='regReview'>리뷰 등록</div>
                            <div className='deadline'>(5일 남음)</div>
                        </button>
                        </a>
                    </td>
                    </tr>

                    
            </tbody>
        </Table>
        <div className='myreview2-pagination'>
            <div className='myreview2-prevPage'>&lt;</div>
            <div className='myreview2-page'>1 2 3 맵사용해~</div>
            <div className='myreview2-nextPage'>&gt;</div>
        </div>
        </div>
        </div>
    </div>
    );
};

export default MyReivew;