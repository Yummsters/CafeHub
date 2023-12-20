import React, { useEffect, useState } from "react";
import "./reviewDetailStyle.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { url } from '../config.js'
import { normalCheck, tokenCreate, tokenExpried } from "../login/TokenCheck.js";
import { getCookie, removeCookie, setCookie } from "../components/Cookie";

const { kakao } = window;

const ReviewDetail = ({ modalDetail, wishReviewNo }) => {
  const [review, setReview] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState(""); //댓글 내용 state
  const [replies, setReplies] = useState([]); //새로운 replies 상태 추가
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [wish, setWish] = useState(false);
  const [bestReply, setBestReply] = useState(null);
  const [replyLike, setReplyLike] = useState(false);
  const [replyLikeCount, setReplyLikeCount] = useState(0);
  const [pickBadgeName, setPickBadge] = useState([]);
  const dispatch = useDispatch;
  const memNo = useSelector(state => state.persistedReducer.member.memNo);
  const accessToken = useSelector(state => state.persistedReducer.accessToken);
  const isLogin = useSelector(state => state.persistedReducer.isLogin);


  const location = useLocation();
  const listReviewNo = location.state?.reviewNo
  const reviewNo = wishReviewNo || listReviewNo;


  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    repliesPerPage: 10,
    startPage: 1,
    endPage: 1,
    totalPages: 1
  })

  const showSwal = (title) => {
    Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500
    }).fire({
      icon: 'warning',
      title: title || '로그인이 필요합니다'
    })
  };

  const navigate = useNavigate();
  const ReviewModify = (e) => {
    e.preventDefault();
    if(review.modPossible){
      navigate(`/reviewmodify/${review.reviewNo}`);
    }else{
      Swal.fire({
        text: '리뷰 수정이 불가합니다',
        icon: 'error',
        confirmButtonText: '확인'
      });
    }
  }

  const ReviewDelete = async (reviewNo) => {
    try {
      await axios.delete(`${url}/review/${reviewNo}/delete`);
      console.log("리뷰 삭제 성공");
      Swal.fire({
        text: '리뷰가 삭제되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      });
      navigate("/reviewList"); // 페이지 이동
    } catch (error) {
      console.log("리뷰 삭제 에러");
      Swal.fire({
        title: 'error',
        text: '리뷰를 삭제하는 중에 오류가 발생했습니다',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };


  const handleReviewDelete = () => {
    Swal.fire({
      title: "리뷰 삭제",
      text: "리뷰를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        ReviewDelete(reviewNo);
      }
    });
  };

  const showReplyClick = (reply) => {
    setShowReply(!showReply);
    setSelectedReply(reply);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = () => {
    if(replyContent.length > 0) {
    axios
      .post(`${url}/replyWrite/${memNo}/${reviewNo}`, {
        content: replyContent,
      })
      .then((res) => {
        console.log("댓글이 성공적으로 등록되었습니다");
        setReplyContent("");
        fetchReplies();
      })
      .catch((error) => {
        console.error("댓글 등록 에러", error);

        if (error.response) {
          console.error("응답 데이터:", error.response.data);
          console.error("응답 상태 코드:", error.response.status);
          console.error("응답 헤더:", error.response.headers);
        } else if (error.request) {
          console.error("요청이 전송되었지만 응답을 받지 못했습니다.");
        } else {
          console.error("요청을 설정하는 과정에서 에러가 발생했습니다.", error.message);
        }
      });
  }}

  const fetchReplies = () => {
    axios
      .get(`${url}/reply/${reviewNo}/list`, {
        params: {
          page: pageInfo.currentPage - 1,
          size: pageInfo.repliesPerPage,
          memNo: memNo,
        },
      })
      .then((res) => {
        setReplies(res.data.content);
        let totalPages = res.data.totalPages;;
        let startPage = Math.floor((pageInfo.currentPage - 1) / pageInfo.repliesPerPage) + 1;
        let endPage = Math.min(startPage + pageInfo.repliesPerPage - 1, totalPages);
        console.log(totalPages)
        console.log(startPage)
        console.log(endPage)
        setPageInfo({ ...pageInfo, startPage: startPage, endPage: endPage, totalPages: totalPages })
      })
      .catch((error) => {
        if (error.response) {
          console.error("Server responded with error status:", error.response.status);
          console.error("Error response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received from the server.");
        } else {
          console.error("Error while sending the request:", error.message);
        }
      });
  };

  const handlePageChange = (pageNumber) => {
    setPageInfo({ ...pageInfo, currentPage: pageNumber });
  }

  const [reReplyContent, setReReplyContent] = useState("");

  const handleReReplyChange = (e) => {
    setReReplyContent(e.target.value);
  }

  const handleReReplySubmit = (parentReplyNo) => {
    if (selectedReply && reReplyContent) {
      axios.get(`${url}/member/${memNo}`)
        .then((response) => {
          const member = response.data;
          axios.post(`${url}/reply/${selectedReply.replyNo}/reReply`, {
            parentReplyNo: parentReplyNo,
            content: reReplyContent,
            writerNo: member.memNo, // writerNo 대신 memNo 사용
            likeCount: 0,
          })
            .then((res) => {
              console.log("대댓글이 성공적으로 등록되었습니다.");
              setReReplyContent("");
              fetchReplies();
            })
            .catch((error) => {
              console.error("대댓글 등록 에러", error);
            });
        })
        .catch((error) => {
          console.error("Member 조회 에러", error);
        });
    } else {
      console.error("댓글을 입력해주세요.");
      return;
    }
  };

  const [selectedReply, setSelectedReply] = useState(null);

  const handleReplyClick = (reply) => {
    setSelectedReply(reply);
    setShowReply(!showReply);
  }


  const ReplyDelete = async (replyNo) => {
    try {
      await axios.delete(`${url}/replyDelete/${replyNo}`);
      console.log("댓글 삭제 성공");
      Swal.fire({
        text: '댓글이 삭제되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      });

    } catch (error) {
      console.log("댓글 삭제 에러");
      Swal.fire({
        title: 'error',
        text: '댓글을 삭제하는 중에 오류가 발생했습니다',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleReplyDelete = (replyNo) => {
    Swal.fire({
      title: '댓글 삭제',
      text: '댓글을 삭제하시겠습니까?',
      icon: 'warning',

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정

    }).then(result => {
      if (result.isConfirmed) {
        ReplyDelete(replyNo);
      }
    });
  }

  const deleteSwal = () => {
    Swal.fire({
      title: '정말로 댓글을 삭제하시겠습니까?',
      text: '댓글이 삭제되면 복구할 수 없습니다..',
      icon: 'warning',

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정

      reverseButtons: true, // 버튼 순서 거꾸로

    }).then(result => {
      // 만약 Promise리턴을 받으면,
      if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면

        Swal.fire('댓글이 삭제되었습니다.', 'success');
      }
    });
  }

  const toggleLike = () => {
    if (memNo !== undefined) {
      axios.post(`${url}/member/like/${memNo}/${reviewNo}`, null,
      {
          headers : {
               Authorization :accessToken,
               Refresh : getCookie("refreshToken")
          }
      })
      .then((res) => {
        tokenCreate(dispatch, setCookie, res.headers)
        .then(()=>{
            setLike(res.data.toggleLike);
            setLikeCount(res.data.likeCount);
        })
      })
      .catch((error) => {
        console.error("toggleLike 에러:" + error);
        if(error.response !== undefined){
          tokenExpried(dispatch, removeCookie, error.response.data, navigate);
        }
      });
    } else {
      showSwal()
    }
  };

  const replyToggleLike = (replyNo) => {
    if (memNo !== undefined) {
      axios.post(`${url}/replyLike/${memNo}/${replyNo}`)
        .then((res) => {
          const index = replies.findIndex((reply) => reply.replyNo == replyNo);
          const reply = { ...replies[index] };
          reply.isReplyLike = res.data.isToggleLike;
          reply.likeCount = res.data.likeCount;
          setReplies([...replies.slice(0, index), reply, ...replies.slice(index + 1)]);
          getBestReply();
        })
        .catch((error) => {
          console.error("에러:" + error);
        });
    } else {
      showSwal()
      console.error('memNo 또는 replyNo가 유효하지 않습니다.');
    }
  }

  const toggleWish = () => {
    if (memNo !== undefined) {
      axios.post(`${url}/member/wish/${memNo}/${reviewNo}`, null,
      {
          headers : {
               Authorization :accessToken,
               Refresh : getCookie("refreshToken")
          }
      })
      .then((res) => {
        tokenCreate(dispatch, setCookie, res.headers)
        .then(()=>{
          setWish(res.data);
        })
      })
      .catch((error) => {
        console.error("toggleWish 에러:" + error);
        if(error.response !== undefined){
          tokenExpried(dispatch, removeCookie, error.response.data, navigate);
        }
      });
    } else {
      showSwal()
    }
  }

  const getBestReply = () => {
    //베스트 댓글 가져오기
    axios
      .get(`${url}/reply/${reviewNo}/best`, {
        params: {
          memNo: memNo,
        }
      })
      .then((res) => {
        setBestReply(res.data);
      })
      .catch((error) => {
        console.error("베스트 댓글 가져오기 에러", error);
      });
  }

  useEffect(() => { // 디테일 가져오기
    if (isLogin) {
      normalCheck(dispatch, accessToken);
    }
    axios.get(`http://localhost:8080/review/${reviewNo}?memNo=${memNo}`)
      .then((res) => {
        setReview(res.data.review);
        setLike(res.data.isLike);
        setWish(res.data.isWish);
        setLikeCount(res.data.review.likeCount);
      })
      .catch((error) => {
        console.error("에러:" + error);
      });

    fetchReplies();

    getBestReply();
  }, [pageInfo.currentPage]); // currentPage가 변경될 때마다 useEffect가 실행

  useEffect(() => {
    if (review && review.memNo) {
      if (isLogin) {
        normalCheck(dispatch, accessToken);
      }
      axios.get(`${url}/getMemberBadge/${review.memNo}`)
      .then((res) => {
          const badgeName = res.data.badgeName || ''; 
          setPickBadge([badgeName]);
          console.log(res.data + "dmd")
      })
      .catch(error => {
          console.error('에러 발생:', error);
      });
    }
  }, [review])

  useEffect(() => { // 디테일 지도
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
    <div className={!modalDetail ? "reviewDetail-bgBox" : "modalBox"}>
      {review && (
        <div className={!modalDetail ? "reviewBox" : "reviewModalContent"}>
          <div className="reviewContent">
            <p className="detailTitle">{review.title}</p>
            <div className="detailInfo">
              <div className="infoL">
                <p>
                  <img src="/img/house.png" alt="house" />
                  {review.cafeName}
                </p>
                {review.length > 0 && (
                <p>{review.tagNames.map((tag, i) => <span key={i}>{tag}&nbsp;</span>)}</p>
                )}
                </div>
              <div className="infoR">
                <span><img className='badgeImage' src={`/img/${pickBadgeName[0]}`} alt="house" />{review.nickname}</span>&nbsp;|&nbsp;
                <span>추천 {likeCount}</span>
                <p>{review.regDate}</p>
              </div>
            </div>
            <div className="detailContent"><Viewer initialValue={review.content || ''} /></div>

            <div id="detailMap"></div>

            {!modalDetail && ( // wishReviewList 모달 띄울 때 차별화 위해!
              <><div className="starNheart">
                <img src={wish ? "/img/y_star.png" : "/img/n_star.png"} alt="star" onClick={toggleWish} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <img src={like ? "/img/y_heart.png" : "/img/n_heart.png"} alt="heart" onClick={toggleLike} />
              </div>

                {memNo == review.memNo && (

                  <div className="detailBtnBox">

                    <div className="Gbtn" onClick={ReviewModify}>수정</div>


                    <div className="Obtn" onClick={handleReviewDelete}>삭제</div>
                  </div>

                )}
                <div className="detailLine" />



                {/* 댓글 */}
                <div className="reply">
                  <input type="text" name="reply" value={replyContent} onChange={handleReplyChange} />
                  <button className="Gbtn" onClick={handleReplySubmit}>등록</button>
                </div></>
            )}

            <div className="detailLine" />

            {bestReply && (
              <div key={bestReply.replyNo} className="replyInfo">
                <div className="infoT">
                  <p>
                    <img src="/img/house.png" alt="house" /> {bestReply.nickname}
                  </p>
                  <p>
                    <span className="underline" onClick={() => handleReplyDelete(bestReply.replyNo)}>삭제</span>&nbsp;&nbsp;
                    <span className="underline" onClick={() => showReplyClick(bestReply)}>
                      답글
                    </span>
                    &nbsp;&nbsp;
                    <img src={bestReply.isReplyLike ? "/img/y_heart.png" : "/img/n_heart.png"} alt="heart" onClick={() => replyToggleLike(bestReply.replyNo)} />
                    <span>{bestReply.likeCount}</span>
                  </p>
                </div>
                <div className="infoB">
                  <p>
                    <img src="/img/best.png" alt="best" />
                    {bestReply.content}
                  </p>
                  <p>{bestReply.regDate}</p>
                </div>
                <div className="detailLine" />

                {/* 베스트 댓글에 대한 답글 창 */}
                {showReply && selectedReply && selectedReply.replyNo === bestReply.replyNo && (
                  <>
                    <div className="reply comment">
                      <img src="/img/reply.png" alt="reReply" />
                      <input type="text" name="reply" onChange={handleReReplyChange} />
                      <div className="Gbtn" onClick={() => handleReReplySubmit(bestReply.replyNo)}>
                        등록
                      </div>
                    </div>
                    <div className="detailLine" />

                    {/* 베스트 댓글에 대한 답글 목록 */}
                    {selectedReply.replies && selectedReply.replies.length > 0 && (
                      <div className="reReplyInfo">
                        {selectedReply.replies.map((reReply) => (
                          <div key={reReply.replyNo} className="infoB comment">
                            <p>{reReply.content}</p>
                            <p>{reReply.regDate}</p>
                          </div>
                        ))}
                        <div className="detailLine" />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 댓글 목록 출력 */}
            {replies.map((reply) => (
              <div key={reply.replyNo} className="replyInfo">
                <div className="infoT">
                  <p>
                    {reply.depth === 1 && <img src="/img/reply.png" alt="reReply" />}
                    <img src="/img/house.png" alt="house" /> {reply.nickname}
                  </p>
                  <p>
                    <span className="underline" onClick={() => handleReplyDelete(reply.replyNo)}>삭제</span>&nbsp;&nbsp;
                    {reply.depth === 0 && <span className="underline" onClick={() => showReplyClick(reply)}>답글</span>}
                    &nbsp;&nbsp;
                    <img src={reply.isReplyLike ? "/img/y_heart.png" : "/img/n_heart.png"} alt="heart" onClick={() => replyToggleLike(reply.replyNo)} />
                    <span>{reply.likeCount}</span>
                  </p>
                </div>
                <div className="infoB" style={reply.depth === 1 ? {marginLeft: 35} : {}}>
                  <p>
                    {reply.content}
                  </p>
                  <p>{reply.regDate.split('.')[0]}</p>
                </div>
                <div className="detailLine" />

                {/* 대댓글 */}
                {showReply && selectedReply && selectedReply.replyNo === reply.replyNo && (
                  <>
                    <div className="reply comment">
                      <img src="/img/reply.png" alt="reReply" />
                      <input type="text" name="reply" onChange={handleReReplyChange} />
                      <div className="Gbtn" onClick={() => handleReReplySubmit(selectedReply.replyNo)}>
                        등록
                      </div>
                    </div>
                    <div className="detailLine" />
                  </>
                )}

              </div>
            ))}

            <div className="reviewDetail-pagination">
              <ul className="pagination">
                <li className={`page-item ${pageInfo.currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage - 1)}>&lt;</button>
                </li>
                {Array.from({ length: Math.ceil(pageInfo.endPage - pageInfo.startPage + 1) }, (_, index) => (
                  <li key={index} className={`page-item ${pageInfo.currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + pageInfo.startPage)}>{index + pageInfo.startPage}</button>
                  </li>
                ))}
                <li className={`page-item ${pageInfo.currentPage === pageInfo.endPage ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageInfo.currentPage + 1)}>&gt;</button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
