import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './reviewStyle.css';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import Prism from 'prismjs';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

const ReviewModify = () => {
    const [selectTag, setSelectTag] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [thumbImg, setThumbImg] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const token = useSelector((state) => state.persistedReducer.accessToken);
    const memNo = useSelector((state) => state.persistedReducer.member.memNo);
    const editorRef = useRef();
    const navigate = useNavigate();
    const state2 = useLocation();
    const pathname = state2.pathname;
    const pathNamePart = pathname.split('/')[2];
    const [selectedReviewAuthNo, setSelectedReviewAuthNo] = useState('');
    const [selectedCafeNo, setSelectedCafeNo] = useState('');
    const [cafes, setCafes] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    
    

    const thumbnailUrl = thumbImg ? `http://localhost:8080/common/thumbImg/${thumbImg}` : '';
    console.log("썸" + thumbnailUrl);
    

    const initialState = {
        title: '',
        content: '',
        writer: '',
        reg_date: '',
        cafeNo: '',
        thumbImg: '',
        cafeName: '',
        reviewNo: pathNamePart,
        modDate : 3
    });
  
      const [review, setReview] = useState(initialState);
    // 초기화
    const handleReset = () => {
    setReview(initialState);
};


    const change = (e) => {
        const { name, value } = e.target;
        setReview((prevReview) => ({ ...prevReview, [name]: value }));
    };

    const handleEditorChange = (content) => {
        setReview((prevReview) => ({ ...prevReview, content: content }));
    };
    const ReviewCahange = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', review.title);
        const content = editorRef.current.getInstance().getHTML();
        formData.append('content', content);
        formData.append('memNo', memNo);
        formData.append('writer', memNo);
        formData.append('ReviewAuthNo', selectedReviewAuthNo);
        formData.append('cafeNo', selectedCafeNo);
        
        if (selectedFile) {
            formData.append('files', selectedFile);
        }
        
        // 다른 필요한 데이터도 필요에 따라 추가...
    
        try {
            const response = await axios.post(`http://localhost:8080/reviewmodify/${review.reviewNo}`, formData);
            
            Swal.fire({
                title: '수정 성공!',
                text: '리뷰가 성공적으로 등록되었습니다',
                icon: 'success',
                confirmButtonText: '확인',
            }).then(() => {
                navigate(`/reviewList`);
            });
            
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };
    
    const [editorInitialValue, setEditorInitialValue] = useState('');
    let encodedHTML;
    useEffect(() => {

        axios
            .get(`http://localhost:8080/review/${review.reviewNo}`)
            .then((response) => {
                setThumbImg(response.data.review.thumbImg || ''); 

                setReview({
                    title: response.data.review.title,
                    content: response.data.review.content,
                    reg_date: response.data.review.reg_date,
                    cafeNo: response.data.review.cafeNo,
                    thumbImg: response.data.review.thumbImg,
                    reviewNo: response.data.review.reviewNo,
                    cafeName: response.data.review.cafeName,
                    modDate : response.data.modDate
                });


                const htmlString = decodeURIComponent(response.data.review.content);
                editorRef.current?.getInstance().setHTML(htmlString);
                setSelectedCafeNo(response.data.review.cafeNo);
                console.log(response.data.review.cafeNo);
            })
            .catch((error) => {
                console.error('리뷰 정보 가져오기 실패:', error);
            });
    }, [token, review.reviewNo]);

    const tags = [
        '#카공',
        '#인스타 감성',
        '#고양이',
        '#드로잉',
        '#이색',
        '#주류판매',
        '#뷰 맛집',
        '#브런치',
        '#인테리어 맛집',
        '#대형',
        '#디저트',
        '#자연 친화적 ',
    ];
    const fetchCafeList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/reviewauth/${memNo}`);

            setCafes(response.data);
            console.log('Cafes:', response.data);
        } catch (error) {
            console.error('Error fetching cafe list:', error);
        }
    };


    const tagClick = (i) => {
        if (selectTag.includes(i)) {
            setSelectTag(selectTag.filter((item) => item !== i));
        } else {
            setSelectTag([...selectTag, i]);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            setSelectedFile(file);
    
            uploadImages(file, (response) => {
                console.log('이미지 업로드 결과:', response);
                setIsFileSelected(true);
                 // 이미지 프리뷰 업데이트
                 setImagePreview(URL.createObjectURL(file));
           
            });
        }
    };
   

 // 이미지 업로드 성공 후 처리
const uploadImages = (blob, callback) => {
    let formData = new FormData();
    formData.append('images', blob);

    axios({
        method: 'POST',
        url: 'http://localhost:8080/common/fileUpload',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((response) => {
            console.log('이미지 업로드 성공 맞나', response.data);
            const fileNum = response.data.filenum; // 파일의 filenum을 가져옴
            setThumbImg(fileNum); // 썸네일 이미지 업데이트
            callback(response.data);
        })
        .catch((error) => {
            console.error('이미지 업로드 실패', error);
            console.error('서버 응답 데이터:', error.response.data); // 서버 응답 데이터 출력
  
            callback('image_load_fail');
        });
};
    useEffect(() => {
        fetchCafeList();
    }, [memNo]);




    return (
        <div className="review-bgBox">
            <div className="reviewBox">
                <div className="reviewTitle">

                    <select
                        value={`${selectedReviewAuthNo},${selectedCafeNo}`}
                    >
                        <option value='1' disabled={!selectedReviewAuthNo && !selectedCafeNo}>
                            {review.cafeName}({review.modDate}일 남음)
                        </option>
                        <option>
                            (카페는 수정할 수 없습니다)
                        </option>
                    </select>

                    <input
                        className="title"
                        name="title"
                        type="text"
                        onChange={change}
                        id="title"
                        required="required"
                        value={review.title}
                        placeholder="{review.title}"
                    />
                </div>

                <hr className="line" />

                  <div className="thumbnail">
                    <p className="review-thum">썸네일 선택 &nbsp;&nbsp;&nbsp;</p>
                    <label className="review-img">
                        {' '}
                        사진 선택 
                        <input type="file" name="filename" onChange={handleFileChange} />
                    </label>&nbsp;&nbsp;
                    <img className='thumbnail-preview' src={thumbnailUrl} alt='Thumbnail Preview' />

                </div>


                <div className="editor">
                    <Editor
                        //value={decodeURIComponent(editorInitialValue)} 
                        ref={editorRef}
                        onChange={handleEditorChange}
                        className="custom-editor"
                        // ref={editorRef}
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}

                        previewStyle="vertical"
                        height="500px"
                        initialEditType="wysiwyg"
                        hooks={{
                            addImageBlobHook: (blob, callback) => {
                                let formData = new FormData();
                                formData.append('images', blob);

                                axios({
                                    method: 'POST',
                                    url: 'http://localhost:8080/common/fileUpload',
                                    data: formData,
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                })
                                    .then((response) => {
                                        console.log('이미지 업로드 성공', response.data);
                                        callback(response.data);
                                    })
                                    .catch((error) => {
                                        console.error('프론트 이미지 업로드 실패', error);
                                        callback('image_load_fail');
                                    });
                            },
                        }}
                    />

                </div>
                <div className="tagBox">
                    {tags.map((tag, i) => (
                        <div
                            key={i}
                            className={selectTag.includes(i) ? 'selectTag' : 'tag'}
                            onClick={() => tagClick(i)}
                        >
                            {tag}
                        </div>
                    ))}
                </div>

                <div className="btnBox">
                    <div className="review-btn" onClick={handleReset}>초기화</div>
                    <div className="review-btn" onClick ={ReviewCahange}>리뷰 수정</div>
                </div>
            </div>
        </div>
    );
};
export default ReviewModify;
