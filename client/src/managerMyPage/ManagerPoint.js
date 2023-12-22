import React, { useEffect, useState } from 'react';
import { Table, Pagination, PaginationLink } from "reactstrap";
import {useSelector} from 'react-redux';
import './Manager.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import ManagerSideTab from '../components/ManagerSideTab';
import { url } from '../config.js'

const Manager2 = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);

    const [pointList, setPointList] = useState([]);
    const [pageInfo, setPageInfo] = useState({page : 1, size : 5, totalElements : 1, totalPages : 1});
    const [page, setPage] = useState(1);
    const [curPage, setCurPage] = useState(page);

    let firstNum = curPage - (curPage % 5) + 1;
    let lastNum = curPage - (curPage % 5) + 5;
    let total =  Math.min(4, (pageInfo.totalPages ===0 ? 1 : pageInfo.totalPages) - firstNum);

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
        getPage(page);
    },[])
    

    // 페이지 조회
    const getPage = (page) => {
        setPage(page);
        axios.get(`${url}/point/list?page=${page}&&size=5`,
        {
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            const list = res.data.data;
            const resPageInfo = res.data.pageInfo;

            setPointList([...list]);
            setPageInfo({
                page: resPageInfo.page,
                size: resPageInfo.size,
                totalElements: resPageInfo.totalElements,
                totalPages: resPageInfo.totalPages
              });
        })
        .catch(err=>{
            console.log(err);
        })
    }

    // 포인트 정산
    const permitPoint = (e) => {
        console.log("들어감");
        const memNo = e.target.id;

        axios.post(`${url}/point/${memNo}`,{
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
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
                                    <th scope="row"><img className='managerPoint-thumb' src={`${url}/common/uplooad/${list.thumbImg}`} alt=''/></th>
                                    <td colSpan={2}> <div className='listMiniTitle' >{list.cafeName}</div></td>
                                    <td colSpan={2}><div className='dateTime'>신청일 {list.refDate}</div></td>
                                    <td colSpan={2}> <img className='managerPoint-bean' src='/img/coffeebeans.png' alt=''/></td>
                                    <td colSpan={2}> {list.refPointCount}개 </td>
                                    <td colSpan={2}> <button className='managerPoint-permission' id={list.memNo} onClick={permitPoint}>정산</button> </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

                <Pagination className="managerPoint-Page">
                    <PaginationLink 
                    className='managerPoint-Button'
                        onClick={() => {getPage(page-1); setCurPage(page-2);}} 
                        disabled={page===1}>
                        &lt;
                    </PaginationLink>  
                    <PaginationLink 
                            className={`storeReview-Button ${firstNum === page ? 'current-page' : ''}`}
                            onClick={() => getPage(firstNum)}
                        aria-current={page === firstNum ? "page" : null}>
                        {firstNum}
                    </PaginationLink>
                    {Array(total).fill().map((_, i) =>{
                    if(i <=2){
                        return (
                            <PaginationLink
                            className={`storeReview-Button ${firstNum+1+i === page ? 'current-page' : ''}`}
                                key={i+1} 
                                onClick={() => {getPage(firstNum+1+i)}}
                                aria-current={page === firstNum+1+i ? "page" : null}>
                                {firstNum+1+i}
                            </PaginationLink>
                        )
                    }else if(i>=3){
                         return (
                            <PaginationLink
                            className={`storeReview-Button ${lastNum === page ? 'current-page' : ''}`}
                                key ={i+1}
                                onClick={() => getPage(lastNum)}
                                aria-current={page === lastNum ? "page" : null}>
                                {lastNum}
                            </PaginationLink>
                         )  
                        }
                    })}
                    <PaginationLink 
                      className='managerPoint-Button'
                        onClick={() => {getPage(page+1); setCurPage(page);}} 
                        disabled={page >=pageInfo.totalPages}>
                        &gt;
                    </PaginationLink>
                </Pagination>

            </div>
        </div>
    );
};

export default Manager2;