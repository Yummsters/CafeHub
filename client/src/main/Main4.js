import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main4 = () => {
    const navigate = useNavigate();

    const handleReviewButtonClick = () => {
        // ReviewWrite로 이동
        navigate('/reviewwrite');
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