import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Table } from 'reactstrap';
import './Manager.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import ManagerSideTab from '../components/ManagerSideTab';

const Manager2 = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    
    const [pointList, setPointList] = useState([]);
    const [pageInfo, setPageInfo] = useState([]);
    const [curPage, setCurPage] = useState(1);

    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 900,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    useEffect(()=>{
        getPage(curPage);
    },[])

    // 페이지 조회
    const getPage = (page) => {
        axios.get(`http://localhost:8080/point/list?page=${page}&&size=5`,
        {
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            console.log(res);
            console.log(res.data);
            const list = res.data.data;
            const pageInfo = res.data.pageInfo;

            setPointList([...list]);
            setPageInfo([...pageInfo]);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    // totalPage를 이용해 페이지 버튼 생성
    // 해당 버튼 클릭 시 page의 값을 받아와 페이지 리스트 변환 진행

    // 포인트 정산
    const permitPoint = (e) => {
        console.log("들어감");
        const memNo = e.target.id;
        console.log(memNo);

        axios.post(`http://localhost:8080/point/${memNo}`,{
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            console.log(res);
            console.log(res.data);
            Toast.fire({
                icon: 'success',
                title: '포인트 정산이 완료되었습니다'
            }).then(()=>{
                getPage(1);
            })
            
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className='manager-container'>
            <ManagerSideTab/>
            <div className='manager-listBox'>
                <br/><label className='listTitle'>포인트 정산</label><br/><br/>
                <Table hover>
                    <tbody>
                        {pointList.length != 0 && pointList.map(list =>{
                            return (
                                <tr key={list.memNo}> 
                                    <th scope="row"><img className='listImg' src='/img/Ad1.png' alt=''/></th>
                                    <td colSpan={2}> <div className='listMiniTitle' >{list.cafeName}</div></td>
                                    <td colSpan={2}><div className='dateTime'>신청일 {list.refDate}</div></td>
                                    <td colSpan={2}> <img className='listImg' src='/img/coffeebeans.png' alt=''/></td>
                                    <td colSpan={2}> {list.refPointCount}개 </td>
                                    <td colSpan={2}> <button className='permission' id={list.memNo} onClick={permitPoint}>정산</button> </td>
                                </tr>
                            )
                        })}
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