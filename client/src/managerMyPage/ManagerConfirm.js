import React from 'react';
import { Table } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';
import axios from 'axios';
import { url } from '../config.js'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';
import { useDispatch } from 'react-redux';
import { tokenCreate, tokenExpried } from '../login/TokenCheck';

const ManagerConfirm = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [unpaidCafes, setUnpaidCafes] = useState([]);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        cafesPerPage: 10,
        startPage: 1,
        endPage: 1,
        totalPages: 1
    })

    const handlePageChange = (pageNumber) => {
        setSearchParams((prev) => {
            prev.delete('page');
            prev.append('page', pageNumber);
            return prev;
        });
    };

    useEffect(() => {
        searchParams.get('page') && setPageInfo({ ...pageInfo, currentPage: parseInt(searchParams.get('page')) });
    }, [searchParams]);

    useEffect(() => {
        axios.get(`${url}/manager/managerConfirm`, {
            params: {
                page: pageInfo.currentPage - 1,
                size: pageInfo.cafesPerPage,
            },
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then((response) => {
                tokenCreate(dispatch, setCookie, response.headers)
                    .then(() => {
                        setUnpaidCafes(response.data.responseList);
                        let totalPages = response.data.unpaidCafes.totalPages;
                        let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.cafesPerPage) + 1;
                        let endPage = Math.min(startPage + pageInfo.cafesPerPage - 1, totalPages);
                        setPageInfo({ ...pageInfo, startPage: startPage, endPage: endPage, totalPages: totalPages });
                    })
            })
            .catch(error => {
                if (error.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                }
            });
    }, [pageInfo.currentPage]);

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