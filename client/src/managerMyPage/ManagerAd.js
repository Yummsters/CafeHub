import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Manager.css';
import ManagerSideTab from '../components/ManagerSideTab';
import { url } from '../config.js'

const ManagerAd = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    cafesPerPage: 10,
    startPage: 1,
    endPage: 1,
    totalPages: 1
  });

  console.log(pageInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/cafeAd/unapprovedAds?page=${pageInfo.currentPage - 1}`);
        setAds(response.data.content);
        console.log(response.data);
        let totalPages = response.data.totalPages;
        let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.cafesPerPage) + 1;
        let endPage = Math.min(startPage + pageInfo.cafesPerPage - 1, totalPages);
        setPageInfo((prev) => ({ ...prev, startPage: startPage, endPage: endPage, totalPages: totalPages }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pageInfo.currentPage]);

  useEffect(() => {
    setPageInfo((prev) => ({...prev, currentPage: parseInt(searchParams.get('page') ?? 1)}))
  }, [searchParams]);

  const handlePageChange = (pageNumber) => {
    setSearchParams((prev) => {
      prev.delete('page');
      prev.append('page', pageNumber);
      return prev;
    });
  };

  const handleApproveAd = async (cafeAdNo) => {
    try {
      // Send approval request to the backend using axios
      await axios.put(`${url}/cafeAd/approve/${cafeAdNo}`);

      // Update the local state after successful approval
      setAds((prevAds) => prevAds.filter((ad) => ad.cafeAdNo !== cafeAdNo));
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  return (
    <div className='manager-container'>
      <ManagerSideTab />
      <div className='manager-listBox'>
        <br /><label className='listTitle'>광고 신청 현황</label><br /><br />
        <Table hover>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.cafeAdNo} className={`test-${ad.cafeAdNo}`}>
                <th scope="row">
                  <img className='listImg' src={`/img/${ad.thumbImg}.png`} alt='' />
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
                  {ad.isApproved && <div className='manager-dateTime'>{ad.authDate}</div>}
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

export default ManagerAd;
