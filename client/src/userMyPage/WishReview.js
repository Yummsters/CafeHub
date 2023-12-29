import ReviewDetail from "../review/ReviewDetail";
import wishReviewStyle from "./wishReviewStyle.css";
import { useState } from "react";
import UserSideTab from "../components/UserSideTab";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { url } from '../config.js'
import { checkToLogin } from "../login/TokenCheck.js";
import { useNavigate } from "react-router";

const WishReview = () => {
  const [wishReviewList, setWishReviewList] = useState([]);
  const [wishReviewNo, setWishReviewNo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const memNo = useSelector((state) => state.persistedReducer.member.memNo);
  const accessToken = useSelector((state) => state.persistedReducer.accessToken);
  const isLogin = useSelector((state) => state.persistedReducer.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = (reviewNo) => { 
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
    setWishReviewNo(reviewNo);
  };

  const closeModal = () => {
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
    setWishReviewNo(null);
    setShowModal(false);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
    axios.get(`${url}/member/wishReviewList/${memNo}?page=${currentPage-1}`, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setWishReviewList(res.data.data);
        setTotalPages(res.data.pageInfo.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memNo, currentPage]);

  useEffect(() => { // 모달위한 useEffect
    if (wishReviewNo !== null) {
      setShowModal(true);
    }
  }, [wishReviewNo]);

  return (
    <div className="wishReview-container">
      <UserSideTab />
      <div className="wishReview-list">
        <div className="wishReview-title">
          <img src="/img/y_star.png" alt=""  width={"30px"}/> <span> 찜한 리뷰 </span>
        </div>
        {wishReviewList.length !== 0 ?
          wishReviewList.map((review, index) => (
            <span className="wishReview-reviews" key={review.reviewNo} onClick={() => openModal(review.reviewNo)}>
              <img src={`${url}/common/thumbImg/${review.thumbImg}`} alt=""/>
              <div className="image-text">{review.cafeName}
                <p className="ReviewWriter">{review.nickname}</p></div>
              {/* {index % 4 === 3 ? (<><br /></>) : ("")} */}
            </span>
          )) : <div className="noWish">찜한 리뷰가 없습니다</div>}

          {wishReviewList.length !== 0  && (
            <div className="pagination-container">
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={prevPage} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index} active={currentPage === index + 1}>
                      <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={nextPage} />
                </PaginationItem>
              </Pagination>
            </div>
          )}

          {showModal && (
            <div className="modalBox">
                <ReviewDetail modalDetail wishReviewNo = {wishReviewNo}/>
                <p className='closeBtn'><img src="/img/X.png" alt="x" width={"70px"} onClick={closeModal}/></p>
            </div>
            )}
      </div>
    </div>
  );
};

export default WishReview;
