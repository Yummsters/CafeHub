import React, { useState } from 'react';
import './reviewDetailStyle.css';

const ReviewDetail = () => {
    const [showReply, setShowReply] = useState(false);
    const showReplyClick = () => {
        setShowReply(!showReply);
    }

    return (
        <div className='reviewDetail-bgBox'>
            <div className='reviewBox'>
                <div className='reviewContent'>
                    <p className='detailTitle'>수빈바보</p>
                    <div className='detailLine'/>

                    <div className='detailInfo'>
                        <div className='infoL'>
                            <p><img src="/img/house.png" alt="house" /> 카페명</p>
                            <p>#고양이 카페 #이색 카페</p>
                        </div>
                        <div className='infoR'>
                            <span>닉네임</span>&nbsp;|&nbsp;
                            <span>추천nn</span>
                            <p>2023.11.14 07:10</p>
                        </div>
                    </div>
                    <div className='detailContent'>
                        <img src="/img/sample.png" alt="sample" style={{width:"100%"}} />
                    </div>

                    <div className='starNheart'>
                        <img src="/img/star.png" alt="star"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <img src="/img/heart.png" alt="heart"/>
                    </div>
                    <div className='detailBtnBox'>
                        <div className='Gbtn'>수정</div>
                        <div className='Obtn'>삭제</div>
                    </div>
                    <div className='detailLine'/>

                    <div className='reply'>
                        <input type="text" name="reply"/>
                        <div className='Gbtn'>등록</div>
                    </div>

                    <div className='detailLine'/>

                    <div className='replyInfo'>
                        <div className='infoT'>
                            <p><img src="/img/house.png" alt="house" /> 닉네임 (뱃지 임시)</p>
                            <p>
                                <span className='underline'>삭제</span>&nbsp;&nbsp;
                                <span className='underline' onClick={showReplyClick}>답글</span>&nbsp;&nbsp;
                                <span>♡ nn</span>
                            </p>
                        </div>
                        <div className='infoB'>
                            <p><img src="/img/best.png" alt="best"/>댓글 내용 와라라라라랄ㄹㄹ</p>
                            <p>2023.11.15 13:32</p>
                        </div>
                    </div>
                    
                    <div className='detailLine'/>
                    
                    {showReply && (
                    <>
                        <div className='reply comment'>
                            <img src="/img/reply.png" alt="reply" />
                            <input type="text" name="reply" value=""/>
                            <div className='Gbtn'>등록</div>
                        </div>

                        <div className='replyInfo'>
                            <div className='infoT'>
                                <p>
                                    <img src="/img/reply.png" alt="reply" />
                                    <img src="/img/house.png" alt="house" />닉네임 (뱃지 임시)
                                </p>
                                <p>♡ nn</p>
                            </div>
                            <div className='infoB comment'>
                                <p>대댓글오라올아ㅗㄹ아량ㄴ량리ㅑㄴㅇ</p>
                                <p>2023.11.15 13:32</p>
                            </div>
                            <div className='detailLine'/>
                        </div>
                    </>
                    )}

                    <div className='replyInfo'>
                        <div className='infoT'>
                            <p><img src="/img/house.png" alt="house" /> 닉네임 (뱃지 임시)</p>
                            <p>
                                {/* <span className='underline'>삭제</span>&nbsp;&nbsp; */}
                                <span className='underline' onClick={showReplyClick}>답글</span>&nbsp;&nbsp;
                                <span>♡ nn</span>
                            </p>
                        </div>
                        <div className='infoB'>
                            <p>댓글 내용 와라라라라랄ㄹㄹ</p>
                            <p>2023.11.15 13:32</p>
                        </div>
                        <div className='detailLine'/>
                    </div>
                    
                    <div className='reviewDetail-pagination'>
                        <div className='reviewDetail-prevPage'>&lt;</div>
                        <div className='reviewDetail-page'>1 2 3 맵사용해~</div>
                        <div className='reviewDetail-nextPage'>&gt;</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;