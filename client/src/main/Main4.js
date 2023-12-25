import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin, normalCheck } from '../login/TokenCheck';
import Swal from 'sweetalert2';

const Main4 = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);

    const navigate = useNavigate();
    const dispatch = useDispatch();

     // swal
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 800,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

    const handleReviewButtonClick = () => {
        
        if(isLogin){
            checkLogin(dispatch, accessToken, isLogin, navigate)
            .then(() => {
                 navigate('/reviewwrite');
            })
        }else{
            Toast.fire({
                icon: 'error',
                title: '로그인 후 이용해 주세요'
              }).then(()=>{
                window.location.href="/login";
              })
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