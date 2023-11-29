import React, { useState } from 'react';
import './UserPointStyle.css';
import UserSideTab from '../components/UserSideTab';

const UserPoint = () => {
    return (
        <div className='mypage'>
            <UserSideTab />
            <div className='userPointBox'>
                <div className='nicknameBox'>
                    <p><img src="/img/macaroon.png" alt="house" />바보수빈 님의 보유 커피콩</p>
                    <p><img src="/img/coffeebeans.png" alt="house" /></p>
                    <p>33개</p>
                </div>

                <div className='coffeebeanBox'>
                    <div className='infoTitle'>커피콩 충전</div>
                    <div className='pointContent'>
                        <div className='coffeeBox'>
                            <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />10</p>
                            <div>1000원</div>
                        </div>
                        <div className='coffeeBox'>
                            <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />30</p>
                            <div>3000원</div>
                        </div>
                        <div className='coffeeBox'>
                            <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />50</p>
                            <div>5000원</div>
                        </div>
                        <div className='coffeeBox'>
                            <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />100</p>
                            <div>10000원</div>
                        </div>
                        <div className='coffeeBox'>
                            <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />300</p>
                            <div>30000원</div>
                        </div>
                    </div>
                    <div className='purchaseWrap'><button className='purchaseBtn'>결제</button></div>
                </div>

                <div className='badgeWrap'>
                    <div className='notOwnBadgeBox'>
                        <div className='ownTitle'>
                            <p>뱃지 구매</p>
                        </div>
                        <div className='badgeContent1'>
                            <div className='badgeBox'>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                            </div>
                        </div>
                    </div>

                    <div className='ownBadgeBox'>
                        <div className='ownTitle'>
                            <p>보유중인 뱃지</p>
                        </div>
                        <div className='badgeContent2'>
                            <div className='badgeBox'>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserPoint;