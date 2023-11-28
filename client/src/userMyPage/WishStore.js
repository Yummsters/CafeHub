import './wishStoreStyle.css';
import UserSideTab from '../components/UserSideTab';

import { useState } from 'react';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const WishStore = () => {
    const [wishStoreList, setWishStoreList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [selectedStore, setSelectedStore] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (store) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setSelectedStore(null);
        setIsModalOpen(false);
    }
    return (
        <div className="wishStore-container">
            <UserSideTab />
            <div className='wishStore-list'>
                <div className='wishStore-title'>
                    <img src="/img/star.png" alt='' /> <span> 찜한 가게 </span>
                </div>

                {wishStoreList.length !== 0 && (
                    <div>
                        {wishStoreList.map((store, index) => (
                            <span className='wishStore-stores' key={index} onClick={() => openModal(store)}>
                                <img src="/img/Store1.png" alt='' />
                                <p className="image-text">우드슬랩</p>
                                {index % 4 === 3 ? <><br /></> : ""}
                            </span>
                        ))}
                        <div className='wishstsore-pagination'>
                            <div className='wishstsore-prevPage'>&lt;</div>
                            <div className='wishstsore-page'>1 2 3 맵사용해~</div>
                            <div className='wishstsore-nextPage'>&gt;</div>
                        </div>
                    </div>
                )}
                {/* 모달 사용 */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content-map" onClick={(e) => e.stopPropagation()}>
                            <img className="close-button" onClick={closeModal} src='/img/X.png' />

                            {selectedStore && (
                                <div>
                                    <div className='Map'>
                                        <div className='wishmap_box'>
                                            <div className='wishstore'>
                                                <img src='/img/store.png' />
                                                선진언니바보 가게
                                            </div>
                                            <img className='wishstoreImag' src='/img/우드슬랩1.png' />
                                            <div className='wishstoreLine' />
                                            <div className='wishstore_address'>
                                                <img src='/img/pin.png' />
                                                <div className='address'>
                                                    서울특별시 강남구
                                                </div>
                                            </div>
                                            <div className='wishstore_call'>
                                                <img src='/img/phone.png' />
                                                <div className='call'>
                                                    02-123-4567
                                                </div>
                                            </div>
                                            <div className='wishstore_time'>
                                                <img src='/img/clock.png' />
                                                <div className='time'>
                                                    10:00~18:00
                                                </div>
                                            </div>
                                            <div className='wishstore_type'>
                                                <img src='/img/store.png' />
                                                <div className='call'>
                                                    애견동반카페
                                                </div>
                                            </div>
                                            <div className='wishstore_info'>
                                                <img src='/img/bean.png' />
                                                <div className='info'>
                                                    가게 정보
                                                </div>
                                            </div>
                                            <div className='wishmap_storemap' />
                                            <div className='wishstore_review'>
                                                <img src='/img/review.png' />
                                                <div className='review'>
                                                    리뷰
                                                </div>
                                            </div><br />
                                            <div className='wishmaplistbox'>
                                            <Table hover>
                                                <tbody>
                                                    <tr>
                                                        <div className='maplist'>
                                                            <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                                                            <div className='wishmap-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                                                                <div className='wishmap-writeInfo'>
                                                                    선진언니바보
                                                                </div>
                                                            </div>

                                                            <div className='wishmap-dateTime'>2023.11.15 11:01</div>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <div className='maplist'>
                                                            <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                                                            <div className='wishmap-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                                                                <div className='wishmap-writeInfo'>
                                                                    선진언니바보
                                                                </div>
                                                            </div>

                                                            <div className='wishmap-dateTime'>2023.11.15 11:01</div>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <div className='maplist'>
                                                            <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                                                            <div className='wishmap-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                                                                <div className='wishmap-writeInfo'>
                                                                    선진언니바보
                                                                </div>
                                                            </div>

                                                            <div className='wishmap-dateTime'>2023.11.15 11:01</div>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <div className='maplist'>
                                                            <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                                                            <div className='wishmap-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                                                                <div className='wishmap-writeInfo'>
                                                                    선진언니바보
                                                                </div>
                                                            </div>

                                                            <div className='wishmap-dateTime'>2023.11.15 11:01</div>
                                                        </div>
                                                    </tr>
                                                    <tr>
                                                        <div className='maplist'>
                                                            <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                                                            <div className='wishmap-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                                                                <div className='wishmap-writeInfo'>
                                                                    선진언니바보
                                                                </div>
                                                            </div>

                                                            <div className='wishmap-dateTime'>2023.11.15 11:01</div>
                                                        </div>
                                                    </tr>
                                                 
                                                </tbody>
                                            </Table>

                                            <div className='wishstsore-pagination'>
                                                <div className='wishstsore-prevPage'>&lt;</div>
                                                <div className='wishstsore-page'>1 2 3 맵사용해~</div>
                                                <div className='wishstsore-nextPage'>&gt;</div>

                                            </div>


                                        </div>
                                    </div>

                                </div>
                            </div> 
                            )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default WishStore;