import React from 'react';
import { Table } from 'reactstrap';
import './storeReviewStyle.css';
import StoreSideTab from '../components/StoreSideTab';

const StoreReview = () => {
    return (
        <div className='storeReview-container'>
            <StoreSideTab/>
            <div className='storeReviewListBox'>
                <br/><label className='listTitle'>리뷰 조회</label><br/><br/>
                <div className='storeReview-table'>
                    <Table hover>
                        <tbody>
                            <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad1.png' alt=''/>
                            </th>
                            <td colSpan={10}>
                                <div className='listMiniTitle'>빵이 맛있어욤</div>
                                <div className='reviewUser'>곽두팔1</div>
                            </td>
                            <td colSpan={2}>
                                <div className='reviewLikeCount'>추천 24</div>
                                <div className='dateTime'>2023.11.15 11:01</div>
                            </td>
                            </tr>
                            
                            <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad2.png' alt=''/>
                            </th>
                            <td colSpan={10}>
                                <div className='listMiniTitle'>감성카페</div>
                                <div className='reviewUser'>곽두팔2</div>
                            </td>
                            <td colSpan={2}>
                                <div className='reviewLikeCount'>추천 10000</div>
                                <div className='dateTime'>2023.11.15 21:14</div>
                            </td>
                            </tr>

                            <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad3.png' alt=''/>
                            </th>
                            <td colSpan={10}>
                                <div className='listMiniTitle'>디저트 카페</div>
                                <div className='reviewUser'>곽두팔3</div>
                            </td>
                            <td colSpan={2}>
                                <div className='reviewLikeCount'>추천 45</div>
                                <div className='dateTime'>2023.11.16 12:30</div>
                            </td>
                            </tr>

                            <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad4.png' alt=''/>
                            </th>
                            <td colSpan={10}>
                                <div className='listMiniTitle'>빈티지 갬성</div>
                                <div className='reviewUser'>곽두팔4</div>
                            </td>
                            <td colSpan={2}>
                                <div className='reviewLikeCount'>추천 8</div>
                                <div className='dateTime'>2023.11.17 10:03</div>
                            </td>
                            </tr>

                            <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad5.png' alt=''/>
                            </th>
                            <td colSpan={10}>
                                <div className='listMiniTitle'>수비니가 좋아하는 디저트 카페</div>
                                <div className='reviewUser'>곽두팔5</div>
                            </td>
                            <td colSpan={2}>
                                <div className='reviewLikeCount'>추천 11</div>
                                <div className='dateTime'>2023.11.18 18:30</div>
                            </td>
                            </tr>

                        </tbody>
                    </Table>
                </div>
                <div className='manager-pagination'>
                    <div className='manager-prevPage'>&lt;</div>
                    <div className='manager-page'>1 2 3 맵사용해~</div>
                    <div className='manager-nextPage'>&gt;</div>
                </div>
            </div>
        </div>
    );
};

export default StoreReview;