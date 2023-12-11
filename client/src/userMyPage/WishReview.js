import ReviewDetail from "../review/ReviewDetail";
import wishReviewStyle from "./wishReviewStyle.css";
import { useState } from "react";
import UserSideTab from "../components/UserSideTab";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const WishReview = () => {
  const [wishReviewList, setWishReviewList] = useState([]);
  const [wishReviewNo, setWishReviewNo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (reviewNo) => { 
    setWishReviewNo(reviewNo);
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const memNo = useSelector((state) => state.persistedReducer.member.memNo);
  const accessToken = useSelector((state) => state.persistedReducer.accessToken);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/member/wishReviewList/${memNo}`, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setWishReviewList(res.data);
      })
      .catch((error) => {
        console.error("에러:" + error);
      });
  }, [memNo]);

  return (
    <div className="wishReview-container">
      <UserSideTab />
      <div className="wishReview-list">
        <div className="wishReview-title">
          <img src="/img/star.png" alt="" /> <span> 찜한 리뷰 </span>
        </div>
        {wishReviewList.length !== 0 &&
          wishReviewList.map((review, index) => (
            <span className="wishReview-reviews" key={index} onClick={() => openModal(review.reviewNo)}>
              <img src={review.thumbImg} alt=""/>
              <div className="image-text">{review.cafeName}
                <p className="ReviewWriter">{review.nickname}</p></div>
              {index % 4 === 3 ? (<><br /></>) : ("")}
            </span>
          ))}
        <div className="wishreview-pagination">
          <div className="wishreview-prevPage">&lt;</div>
          <div className="wishreview-page">1 2 3 맵사용해~</div>
          <div className="wishreview-nextPage">&gt;</div>
        </div>
      </div>

      {showModal && 
        <div className="modalBox">
            <ReviewDetail modalDetail wishReviewNo = {wishReviewNo}/>
            <p className='closeBtn'><img src="/img/X.png" alt="x" onClick={closeModal}/></p>
        </div>}
    </div>
  );
};

export default WishReview;
