import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';
import { url } from '../config.js'
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, removeCookie, setCookie } from '../components/Cookie.js';
import { tokenCreate, tokenExpried } from '../login/TokenCheck';

const ManagerAd = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [unapprovedAds, setUnapprovedAds] = useState([]);
  const accessToken = useSelector(state => state.persistedReducer.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    cafesPerPage: 5,
    startPage: 1,
    endPage: 1,
    totalPages: 1
  });

  const handlePageChange = (pageNumber) => {
    setSearchParams((prev) => {
      prev.delete('page');
      prev.append('page', pageNumber);
      return prev;
    });
  };

  const handleApproveAd = async (cafeAdNo) => {
    try {
      const response = await axios.put(`${url}/manager/approve/${cafeAdNo}`, null, {
        headers: {
          Authorization: accessToken,
          Refresh: getCookie("refreshToken")
        }
      })
        .then((response) => {
          tokenCreate(dispatch, setCookie, response.headers)
            .then(() => {
              setUnapprovedAds((prevAds) => prevAds.filter((ad) => ad.cafeAdNo !== cafeAdNo));
            })
        })
    } catch (error) {
      if (error.response !== undefined) {
        tokenExpried(dispatch, removeCookie, error.response.data, navigate);
      }
    }
  };

  const formatRegDate = (regDate) => {
    const date = new Date(regDate);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  useEffect(() => {
    setPageInfo((prev) => ({ ...prev, currentPage: parseInt(searchParams.get('page') ?? 1) }))
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/manager/unapprovedAds`, {
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
                setUnapprovedAds(response.data.responseList);
                let totalPages = response.data.unapprovedAds.totalPages;
                let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.cafesPerPage) + 1;
                let endPage = Math.min(startPage + pageInfo.cafesPerPage - 1, totalPages);
                setPageInfo((prev) => ({ ...prev, startPage: startPage, endPage: endPage, totalPages: totalPages }));
              })
          })
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response !== undefined) {
          tokenExpried(dispatch, removeCookie, error.response.data, navigate);
        }
      }
    };
    fetchData();
  }, [pageInfo.currentPage, accessToken]);

  return (
    <div className='manager-container'>
      <ManagerSideTab />
      <div className='manager-listBox'>
        <br /><label className='listTitle'>광고 신청 현황</label><br /><br />

        {unapprovedAds.length > 0 ? (
          <Table hover>
            <tbody>
              {unapprovedAds.map((ad) => (
                <tr key={ad.cafeAdNo} className={`test-${ad.cafeAdNo}`}>
                  <th scope="row" style={{ width: "115px" }}>
                    <img className='listImg' src={`${url}/common/thumbImg/${ad.thumbImg}`} alt='' />
                  </th>
                  <td colSpan={11}>
                    <div className='listMiniTitle'>{ad.cafeName}</div>
                    <div className='description1'>{ad.description}</div>
                    <div className='description2'>{ad.menu}</div>
                  </td>
                  <td colSpan={1} className='permission-button'>
                    {!ad.isApproved && (
                      <button className='permission' onClick={() => handleApproveAd(ad.cafeAdNo)}>승인</button>
                    )}
                    <div className='manager-dateTime'>{formatRegDate(ad.regDate)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>
            <p style={{ marginLeft: "12%" }}>광고 신청 목록이 존재하지 않습니다.</p>
          </div>
        )}

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

export default ManagerAd;
