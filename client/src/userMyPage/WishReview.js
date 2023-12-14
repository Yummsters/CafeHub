import ReviewDetail from "../review/ReviewDetail";
import wishReviewStyle from "./wishReviewStyle.css";
import { useState } from "react";
import UserSideTab from "../components/UserSideTab";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const WishReview = () => {
  const [wishReviewList, setWishReviewList] = useState([]);
  const [wishReviewNo, setWishReviewNo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const memNo = useSelector((state) => state.persistedReducer.member.memNo);
  const accessToken = useSelector((state) => state.persistedReducer.accessToken);
  console.log(currentPage)

  useEffect(() => {
    if (wishReviewNo !== null) {
      console.log(wishReviewNo);
      setShowModal(true);
    }
  }, [wishReviewNo]);
  
  const openModal = (reviewNo) => { 
    setWishReviewNo(reviewNo);
  };

  const closeModal = () => {
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
    axios
      .get(`http://localhost:8080/member/wishReviewList/${memNo}?page=${currentPage-1}`, {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setWishReviewList(res.data.data);
        setTotalPages(res.data.pageInfo.totalPages);
      })
      .catch((error) => {
        console.error("에러:" + error);
      });
  }, [memNo, currentPage]);

  return (
    <div className="wishReview-container">
      <UserSideTab />
      <div className="wishReview-list">
        <div className="wishReview-title">
          <img src="/img/star.png" alt="" /> <span> 찜한 리뷰 </span>
        </div>
        {wishReviewList.length !== 0 &&
          wishReviewList.map((review, index) => (
            <span className="wishReview-reviews" key={review.reviewNo} onClick={() => openModal(review.reviewNo)}>
              <img src={review.thumbImg} alt=""/>
              <div className="image-text">{review.cafeName}
                <p className="ReviewWriter">{review.nickname}</p></div>
              {index % 4 === 3 ? (<><br /></>) : ("")}
            </span>
          ))}

          {showModal && (
            <div className="modalBox">
                <ReviewDetail modalDetail wishReviewNo = {wishReviewNo}/>
                <p className='closeBtn'><img src="/img/X.png" alt="x" onClick={closeModal}/></p>
            </div>
            )}
            
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
      </div>
    </div>
  );
};

export default WishReview;
