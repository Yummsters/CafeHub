import React, { useState, useEffect, useRef } from 'react';
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
    const state2 = useLocation();
    const pathname = state2.pathname;
    const pathNamePart = pathname.split('/')[2];
    const [selectedReviewAuthNo, setSelectedReviewAuthNo] = useState('');
    const [selectedCafeNo, setSelectedCafeNo] = useState('');
    const [cafes, setCafes] = useState([]);

    const thumbnailUrl = thumbImg ? `http://localhost:8080/common/thumbImg/${thumbImg}` : '';
    console.log("썸" + thumbnailUrl);

    const [review, setReview] = useState({
        title: '',
        content: '',
        writer: '',
        reg_date: '',
        cafeNo: '',
        thumbImg: '',
        cafeName: '',
        reviewNo: pathNamePart,
    });


    const change = (e) => {
        const { name, value } = e.target;
        setReview((prevReview) => ({ ...prevReview, [name]: value }));
    };

    const handleEditorChange = (content) => {
        console.log(content);
        setReview((prevReview) => ({ ...prevReview, content: content }));
    };

    const [editorInitialValue, setEditorInitialValue] = useState('');
    let encodedHTML;
    useEffect(() => {

        axios
            .get(`http://localhost:8080/review/${review.reviewNo}`)
            .then((response) => {
                console.log('API 응답:', response.data);
                console.log('리뷰 정보:', response.data.review);
                console.log('리뷰', response.data.review.content);
                setThumbImg(response.data.review.thumbImg || ''); 

                setReview({
                    title: response.data.review.title,
                    content: response.data.review.content,
                    reg_date: response.data.review.reg_date,
                    cafeNo: response.data.review.cafeNo,
                    thumbImg: response.data.review.thumbImg,
                    reviewNo: response.data.review.reviewNo,
                    cafeName: response.data.review.cafeName,
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
                const thumbnailURL = URL.createObjectURL(file);
                setThumbnail(thumbnailURL);
                setThumbImg(response);
                setIsFileSelected(true);
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
                console.log('이미지 업로드 성공', response.data);
                setThumbImg(response.data);
                setIsFileSelected(true);
                callback(response.data);
            })
            .catch((error) => {
                console.error('프론트 이미지 업로드 실패', error);
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
                        onChange={(e) => {
                            const [selectedReviewAuthNo, selectedCafeNo] = e.target.value.split(',');
                            setSelectedReviewAuthNo(selectedReviewAuthNo);
                            setSelectedCafeNo(selectedCafeNo);
                        }}>
                        <option value='1' disabled={!selectedReviewAuthNo && !selectedCafeNo}>
                            {review.cafeName}
                        </option>
                        {cafes.map((reviewAuth, i) => (
                            <option key={i} value={`${reviewAuth.reviewAuthNo},${reviewAuth.cafeNo}`}>
                                {reviewAuth.cafeName}
                            </option>
                        ))}
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
                    </label>
                    {thumbImg && <img className='thumbnail-preview' src={thumbnailUrl} alt='Thumbnail Preview' />}
                </div>


                <div className="editor">
                    <Editor
                        //value={decodeURIComponent(editorInitialValue)} // 디코딩된 값을 사용
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
                    <div className="review-btn">초기화</div>
                    <div className="review-btn">리뷰 수정</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModify;
