import React from 'react';
import { Table } from 'reactstrap';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';

const Manager2 = () => {
    return (
        <div className='manager-container'>
            <ManagerSideTab/>
            <div className='manager-listBox'>
                <br/><label className='listTitle'>포인트 정산</label><br/><br/>
                <Table hover>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad1.png' alt=''/>
                            </th>
                            <td colSpan={2}>
                                <div className='listMiniTitle'>우드슬랩</div>
                            </td>
                            <td colSpan={2}>
                                <div className='dateTime'>신청일 2023.11.15 11:01</div>
                            </td>
                            <td colSpan={2}>
                                <img className='listImg' src='/img/coffeebeans.png' alt=''/>
                            </td>
                            <td colSpan={2}>
                                152개
                            </td>
                            <td colSpan={2}>
                                <button className='permission'>정산</button>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad2.png' alt=''/>
                            </th>
                            <td colSpan={2}>
                                <div className='listMiniTitle'>차가 맛있는 카페</div>
                            </td>
                            <td colSpan={2}>
                                <div className='dateTime'>신청일 2023.11.15 21:14</div>
                            </td>
                            <td colSpan={2}>
                                <img className='listImg' src='/img/coffeebeans.png' alt=''/>
                            </td>
                            <td colSpan={2}>
                                152개
                            </td>
                            <td colSpan={2}>
                                <button className='permission'>정산</button>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad3.png' alt=''/>
                            </th>
                            <td colSpan={2}>
                                <div className='listMiniTitle'>감성카페</div>
                            </td>
                            <td colSpan={2}>
                                <div className='dateTime'>신청일 2023.11.16 12:30</div>
                            </td>
                            <td colSpan={2}>
                                <img className='listImg' src='/img/coffeebeans.png' alt=''/>
                            </td>
                            <td colSpan={2}>
                                152개
                            </td>
                            <td colSpan={2}>
                                <button className='permission'>정산</button>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad2.png' alt=''/>
                            </th>
                            <td colSpan={2}>
                                <div className='listMiniTitle'>차가 맛있는 카페</div>
                            </td>
                            <td colSpan={2}>
                                <div className='dateTime'>신청일 2023.11.15 21:14</div>
                            </td>
                            <td colSpan={2}>
                                <img className='listImg' src='/img/coffeebeans.png' alt=''/>
                            </td>
                            <td colSpan={2}>
                                152개
                            </td>
                            <td colSpan={2}>
                                <button className='permission'>정산</button>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <img className='listImg' src='/img/Ad3.png' alt=''/>
                            </th>
                            <td colSpan={2}>
                                <div className='listMiniTitle'>감성카페</div>
                            </td>
                            <td colSpan={2}>
                                <div className='dateTime'>신청일 2023.11.16 12:30</div>
                            </td>
                            <td colSpan={2}>
                                <img className='listImg' src='/img/coffeebeans.png' alt=''/>
                            </td>
                            <td colSpan={2}>
                                152개
                            </td>
                            <td colSpan={2}>
                                <button className='permission'>정산</button>
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

export default Manager2;