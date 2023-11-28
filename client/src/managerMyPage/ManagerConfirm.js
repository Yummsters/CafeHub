import React from 'react';
import { Table } from 'reactstrap';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';


const Manager1 = () => {
    return (
        <div className='manager-container'>
            <ManagerSideTab/>
            <div className='manager-listBox'>
                <br/><label className='listTitle'>등록 가게 결제 확인</label><br/><br/>
                <Table hover>
                    <tbody>
                        <tr>
                        <th scope="row">
                            <img className='listImg' src='/img/Ad1.png' alt=''/>
                        </th>
                        <td colSpan={11}>
                            <div className='listMiniTitle'>우드슬랩</div>
                            <div className='description1'>매일 갓 구운 빵을 파는 카페</div>
                        </td>
                        <td colSpan={1} className='permission-button'>
                            <button className='permission'>결제</button>
                            <div className='manager-dateTime'>2023.11.15 11:01</div>
                        </td>
                        </tr>
                        
                        <tr>
                        <th scope="row">
                            <img className='listImg' src='/img/Ad2.png' alt=''/>
                        </th>
                        <td colSpan={11}>
                            <div className='listMiniTitle'>감성카페</div>
                            <div className='description1'>감성이 철철 흘러내리는 카페</div>
                        </td>
                        <td colSpan={1} className='permission-button'>
                            <button className='unpermission'>미결제</button>
                            <div className='manager-dateTime'>2023.11.15 21:14</div>
                        </td>
                        </tr>

                        <tr>
                        <th scope="row">
                            <img className='listImg' src='/img/Ad3.png' alt=''/>
                        </th>
                        <td colSpan={10}>
                            <div className='listMiniTitle'>디저트 카페</div>
                            <div className='description1'>맛있는 디저트를 듬뿍 파는 카페</div>
                        </td>
                        <td colSpan={2} className='permission-button'>
                            <button className='permission'>결제</button>
                            <div className='manager-dateTime'>2023.11.16 12:30</div>
                        </td>
                        </tr>

                        <tr>
                        <th scope="row">
                            <img className='listImg' src='/img/Ad4.png' alt=''/>
                        </th>
                        <td colSpan={10}>
                            <div className='listMiniTitle'>빈티지 갬성</div>
                            <div className='description1'>빈티지한 느낌과 함께 쉬어갈 수 있는 ‘빈티지 카페'에 어서오세요</div>
                        </td>
                        <td colSpan={2} className='permission-button'>
                            <button className='permission'>결제</button>
                            <div className='manager-dateTime'>2023.11.17 10:03</div>
                        </td>
                        </tr>

                        <tr>
                        <th scope="row">
                            <img className='listImg' src='/img/Ad5.png' alt=''/>
                        </th>
                        <td colSpan={10}>
                            <div className='listMiniTitle'>수비니가 좋아하는 디저트 카페</div>
                            <div className='description1'>디저트가 맛있는 슈페너 카페에서 달달한 시간 보내보세요!</div>
                        </td>
                        <td colSpan={2} className='permission-button'>
                            <button className='unpermission'>미결제</button>
                            <div className='manager-dateTime'>2023.11.18 18:30</div>
                        </td>
                        </tr>

                    </tbody>
                </Table>
                <div className='manager-pagination'>
                    <div className='manager-prevPage'>&lt;</div>
                    <div className='manager-page'>1 2 3 맵사용해~</div>
                    <div className='manager-nextPage'>&gt;</div>
                </div>
            </div>
        </div>
    );
};

export default Manager1;