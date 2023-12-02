import React, { useEffect, useState } from "react";
import "./reviewDetailStyle.css";
import axios from "axios";
const { kakao } = window;

const ReviewDetail = () => {
  const [review, setReview] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const reviewNo = 1;
  const showReplyClick = () => {
    setShowReply(!showReply);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/review/${reviewNo}`)
      .then((res) => {
        setReview(res.data);
        console.log(res.data.tagName);
      })
      .catch((error) => {
        console.error("에러:" + error);
      });
  }, [reviewNo]);

  useEffect(() => {
    if (review && review.lat && review.lng) {
      const mapContainer = document.getElementById("detailMap"),
        mapOption = {
          center: new kakao.maps.LatLng(review.lat, review.lng),
          level: 3,
        };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      const markerPosition = new kakao.maps.LatLng(review.lat, review.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    }
  }, [review]);

  return (
    <div className="reviewDetail-bgBox">
      {review && (
        <div className="reviewBox">
          <div className="reviewContent">
            <p className="detailTitle">{review.title}</p>
            <div className="detailLine" />

            <div className="detailInfo">
              <div className="infoL">
                <p>
                  <img src="/img/house.png" alt="house" />
                  {review.cafeName}
                </p>
                <p>{review.tagName}</p>
              </div>
              <div className="infoR">
                <span>{review.nickname}</span>&nbsp;|&nbsp;
                <span>추천 {review.likeCount}</span>
                <p>{review.regDate}</p>
              </div>
            </div>
            <div className="detailContent">{review.content}</div>

            <div id="detailMap"></div>

            <div className="starNheart">
              <img src="/img/star.png" alt="star" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src="/img/heart.png" alt="heart" />
            </div>
            <div className="detailBtnBox">
              <div className="Gbtn">수정</div>
              <div className="Obtn">삭제</div>
            </div>
            <div className="detailLine" />








            {/* 댓글 */}
            <div className="reply">
              <input type="text" name="reply" />
              <div className="Gbtn">등록</div>
            </div>

            <div className="detailLine" />
            <div className="replyInfo">
              <div className="infoT">
                <p>
                  <img src="/img/house.png" alt="house" /> 닉네임 (뱃지 임시)
                </p>
                <p>
                  <span className="underline">삭제</span>&nbsp;&nbsp;
                  <span className="underline" onClick={showReplyClick}>
                    답글
                  </span>
                  &nbsp;&nbsp;
                  <span>♡ nn</span>
                </p>
              </div>
              <div className="infoB">
                <p>
                  <img src="/img/best.png" alt="best" />
                  댓글 내용 와라라라라랄ㄹㄹ
                </p>
                <p>2023.11.15 13:32</p>
              </div>
            </div>

            <div className="detailLine" />

            {showReply && (
              <>
                <div className="reply comment">
                  <img src="/img/reply.png" alt="reply" />
                  <input type="text" name="reply" value="" />
                  <div className="Gbtn">등록</div>
                </div>

                <div className="replyInfo">
                  <div className="infoT">
                    <p>
                      <img src="/img/reply.png" alt="reply" />
                      <img src="/img/house.png" alt="house" />
                      닉네임 (뱃지 임시)
                    </p>
                    <p>♡ nn</p>
                  </div>
                  <div className="infoB comment">
                    <p>대댓글오라올아ㅗㄹ아량ㄴ량리ㅑㄴㅇ</p>
                    <p>2023.11.15 13:32</p>
                  </div>
                  <div className="detailLine" />
                </div>
              </>
            )}

            <div className="replyInfo">
              <div className="infoT">
                <p>
                  <img src="/img/house.png" alt="house" /> 닉네임 (뱃지 임시)
                </p>
                <p>
                  {/* <span className='underline'>삭제</span>&nbsp;&nbsp; */}
                  <span className="underline" onClick={showReplyClick}>
                    답글
                  </span>
                  &nbsp;&nbsp;
                  <span>♡ nn</span>
                </p>
              </div>
              <div className="infoB">
                <p>댓글 내용 와라라라라랄ㄹㄹ</p>
                <p>2023.11.15 13:32</p>
              </div>
              <div className="detailLine" />
            </div>

            <div className="reviewDetail-pagination">
              <div className="reviewDetail-prevPage">&lt;</div>
              <div className="reviewDetail-page">1 2 3 맵사용해~</div>
              <div className="reviewDetail-nextPage">&gt;</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
