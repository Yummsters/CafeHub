import React from 'react';
import { Table } from 'reactstrap';
import './User.css';
import UserSideTab from '../components/UserSideTab';
const User5 = () => {
    return (
        <div className='mypage'>
            <UserSideTab/> 
        <div className='listBox'>
            <br/><label className='myreplylistTitle'>댓글 관리</label><br/><br/>
            <Table hover>
                <div className='myreplybox'>
                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>자세한 리뷰 감사해요 다음에 꼭 가봐야겠네요 군침이 싸악~</div>
                        <div className='description1'>원글: 따뜻한 느낌의 책읽기 좋은 카페</div>
                    </td>
                    <td colSpan={2}>
                        <img className='replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''/><br/>
                        <div className='dateTime'>2023.11.15 11:01</div>
                    </td>
                    </tr>
                    
                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>감성카페</div>
                        <div className='description1'>감성이 철철 흘러내리는 카페</div>
                        <div className='description2'>아메리카노, 시나몬라떼, 당근케이크</div>
                    </td>
                    <td colSpan={2}>
                    <img className='replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''/><br/>
                        <div className='dateTime'>2023.11.15 21:14</div>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>디저트 카페</div>
                        <div className='description1'>맛있는 디저트를 듬뿍 파는 카페</div>
                        <div className='description2'>달걀빵, 오렌지주스, 크림치즈라떼</div>
                    </td>
                    <td colSpan={2}>
                    <img className='replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''/><br/>
                        <div className='dateTime'>2023.11.16 12:30</div>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>빈티지 갬성</div>
                        <div className='description1'>빈티지한 느낌과 함께 쉬어갈 수 있는 ‘빈티지 카페'에 어서오세요</div>
                        <div className='description2'>콜드브루 아메리카노, 아메리카노, 콰테말라 원두 아메리카노</div>
                    </td>
                    <td colSpan={2}>
                    <img className='replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''/><br/>
                        <div className='dateTime'>2023.11.17 10:03</div>
                    </td>
                    </tr>

                    <tr>
                    <td colSpan={10}>
                        <div className='listMiniTitle'>수비니가 좋아하는 디저트 카페</div>
                        <div className='description1'>디저트가 맛있는 슈페너 카페에서 달달한 시간 보내보세요!</div>
                        <div className='description2'>아인슈페너, 밀크쉐이크, 황치즈 크럼블 치즈케이크</div>
                    </td>
                    <td colSpan={2}>
                    <img className='replyDeleteBtn' src='/img/replyDeleteBtn.png' alt=''/><br/>
                        <div className='dateTime'>2023.11.18 18:30</div>
                    </td>
                    </tr>

                </div>
                <div className='myreply-pagination'>
                    <div className='myreply-prevPage'>&lt;</div>
                    <div className='myreply-page'>1 2 3 맵사용해~</div>
                    <div className='myreply-nextPage'>&gt;</div>
                </div>
            </Table>
            
        </div>
        </div>
    );
};

export default User5;