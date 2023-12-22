import React from 'react';
import { Table } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';
import axios from 'axios';

const ManagerConfirm = () => {
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        cafesPerPage: 10,
        startPage: 1,
        endPage: 1,
        totalPages: 1
    })

    const [searchParams, setSearchParams] = useSearchParams();
    const [unpaidCafes, setUnpaidCafes] = useState([]);

    useEffect(() => {
        setPageInfo({...pageInfo, currentPage: parseInt(searchParams.get('page'))});
    }, [searchParams]);

    useEffect(() => {
        axios.get(`http://localhost:8080/managerConfirm`, {
            params: {
                page: pageInfo.currentPage - 1,
                size: pageInfo.cafesPerPage,
            },
        })
            .then((response) => {
                console.log(response);
                setUnpaidCafes(response.data.content);
                let totalPages = response.data.totalPages;
                let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.cafesPerPage) + 1;
                let endPage = Math.min(startPage + pageInfo.cafesPerPage - 1, totalPages);
                setPageInfo({ ...pageInfo, startPage: startPage, endPage: endPage, totalPages: totalPages });
            })
            .catch(error => {
                console.error('미결제 카페 목록 가져오기 오류:', error);
            });
    }, [pageInfo.currentPage]);

    const handlePageChange = (pageNumber) => {
        setSearchParams((prev) => {
            prev.delete('page');
            prev.append('page', pageNumber);
            return prev;
        });
    };

    return (
        <div className='manager-container'>
            <ManagerSideTab />
            <div className='manager-listBox'>
                <br /><label className='listTitle'>등록 가게 결제 확인</label><br /><br />
                <Table hover>
                    <tbody>
                        {unpaidCafes.map((cafe) => (
                            <tr key={cafe.cafeNo}>
                                <th scope="row">
                                    <img className='listImg' src={`/img/${cafe.thumbImg}.png`} alt='' />
                                </th>
                                <td colSpan={11}>
                                    <div className='listMiniTitle'>{cafe.cafeName}</div>
                                    <div className='description1'>{cafe.address}</div>
                                </td>
                                <td colSpan={1} className='permission-button'>
                                    <button className='unpermission'>미결제</button>
                                    <div className='manager-dateTime'>{cafe.paidDate}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className='manager-pagination'>
                    <ul className="pagination">
                        <li className={`page-item ${pageInfo.currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage - 1)}>&lt;</button>
                        </li>
                        {Array.from({ length: Math.ceil(pageInfo.endPage - pageInfo.startPage + 1) }, (_, index) => (
                            <li key={index} className={`page-item ${pageInfo.currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(index + pageInfo.startPage)}>{index + pageInfo.startPage}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pageInfo.currentPage === pageInfo.endPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage + 1)}>&gt;</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ManagerConfirm;