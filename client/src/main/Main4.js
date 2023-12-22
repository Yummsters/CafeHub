import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { normalCheck } from '../login/TokenCheck';

const Main4 = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleReviewButtonClick = () => {
        
        if(isLogin){
            navigate('/reviewwrite');
        }else{
            navigate('/login');
        }

       
    };

    return (
        <div className='Main'>
            <div className='main-review'>
                <span className='reviewment'>
                    당신의 리뷰가<br />
                    더 나은 커피를 만들어 냅니다.<br/>
                    <button type='button' id='reviewbutton' onClick={handleReviewButtonClick}>&gt;&gt;커피콩받기</button>
                </span>
                < img className="reviewImg" src='/img/card.png' />
                 
                 
            </div>

        </div>
    );
};

export default Main4;