import React, { useState } from 'react';
import './UserPointStyle.css';
import UserSideTab from '../components/UserSideTab';
import { useHref } from 'react-router';
import { Link } from 'react-router-dom';
import { CheckoutPage } from '../payment/CheckoutPage';

const UserPoint = () => {
    const [selectPrice, setSelectPrice] = useState();
    const [price, setPrice] = useState(0);
    const coffeeData = [
        { beansCount: 10, price: 1000 },
        { beansCount: 30, price: 3000 },
        { beansCount: 50, price: 5000 },
        { beansCount: 100, price: 10000 },
        { beansCount: 300, price: 30000 },
    ];

    const priceClick = (price, index) => {
        setPrice(price);
        setSelectPrice(index);
        console.log(price); 
    };

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
                        {coffeeData.map((coffee, index) => (
                            <div className={`${selectPrice === index ? 'selectBox' : 'coffeeBox'}`} onClick={()=>priceClick(coffee.price, index)} key={index}>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />{coffee.beansCount}</p>
                                <div>{coffee.price}원</div>
                            </div>
                        ))}
                    </div>
                    <div><CheckoutPage price={price}/></div>
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