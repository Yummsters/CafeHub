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
import { url } from '../config.js'

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
    const [selectedTagNames, setSelectedTagNames] = useState([]);
    const [tagName, setTagName] = useState([]);

    const initialState = {
        tagName: '',
        title: '',
        content: '',
        writer: '',
        reg_date: '',
        cafeNo: '',
        thumbImg: '',
        cafeName: '',
        reviewNo: pathNamePart,
        modDate: 3
    };

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
        const serverTags = [
            { tagNo: 1, tagName: '#카공' },
            { tagNo: 2, tagName: '#인스타 감성' },
            { tagNo: 3, tagName: '#고양이' },
            { tagNo: 4, tagName: '#드로잉' },
            { tagNo: 5, tagName: '#이색' },
            { tagNo: 6, tagName: '#주류판매' },
            { tagNo: 7, tagName: '#뷰 맛집' },
            { tagNo: 8, tagName: '#브런치' },
            { tagNo: 9, tagName: '#인테리어 맛집' },
            { tagNo: 10, tagName: '#대형' },
            { tagNo: 11, tagName: '#디저트' },
            { tagNo: 12, tagName: '#자연친화적' },
            
        ];

        // 선택된 태그의 번호로 변환
        const tagNumbers = selectedTags.map(selectedTag => {
            const serverTag = serverTags.find(tag => tag.tagName === selectedTag);
            return serverTag ? serverTag.tagNo : null;
        });

        formData.append('tagName', JSON.stringify(tagNumbers.filter(tagNo => tagNo !== null)));

        console.log("태그", JSON.stringify(tagNumbers.filter(tagNo => tagNo !== null)))

        if (selectedFile) {
            formData.append('files', selectedFile);
        }

        try {
            const response = await axios.post(`${url}/reviewmodify/${review.reviewNo}`, formData);
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
            .get(`${url}/review/${review.reviewNo}`)
            .then((response) => {
                setThumbImg(response.data.review.thumbImg || '');
                console.log(response.data);
                setReview({
                    title: response.data.review.title,
                    content: response.data.review.content,
                    reg_date: response.data.review.reg_date,
                    cafeNo: response.data.review.cafeNo,
                    thumbImg: response.data.review.thumbImg,
                    reviewNo: response.data.review.reviewNo,
                    tagNames: response.data.review.tagNames,
                    cafeName: response.data.review.cafeName,
                    modDate: response.data.modDate,

                });


                const htmlString = decodeURIComponent(response.data.review.content);
                editorRef.current?.getInstance().setHTML(htmlString);
                setSelectedCafeNo(response.data.review.cafeNo);

                setSelectedTags(response.data.review.tagNames || []);


            })
            .catch((error) => {
                console.error('리뷰 정보 가져오기 실패:', error);
            });
    }, [token, review.reviewNo]);


    useEffect(() => {
        axios.get(`http://localhost:8080/reviewTagList`)
            .then(res => {
               
                setTagName([...res.data]);
               
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const [selectedTags, setSelectedTags] = useState([]);

    const tagClick = (i) => {
        let updatedTags;
        console.log(i);

        if (selectedTags.includes(i)) {
            updatedTags = selectedTags.filter((item) => item !== i);
        } else {
            updatedTags = [...selectedTags, i];
        }
        if (updatedTags.length > 3) {
            Swal.fire({
                title: '3개까지 선택 가능합니다',
                icon: 'error',
                confirmButtonText: '확인',
            });
        } else {
            setSelectedTags(updatedTags);
        }
    };

    const fetchCafeList = async () => {
        try {
            const response = await axios.get(`${url}/reviewauth/${memNo}`);

            setCafes(response.data);
            console.log('Cafes:', response.data);
        } catch (error) {
            console.error('Error fetching cafe list:', error);
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
        url: `${url}/common/fileUpload`,
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
        if (review.thumbImg) {
            const imageUrl = `http://localhost:8080/common/upload/${review.thumbImg}`;
            console.log('Image URL:', imageUrl);

            axios.get(imageUrl, { responseType: 'blob' })
                .then((res) => {
                   
                    const imageUrl = URL.createObjectURL(res.data);
                   
                    setReview((prevReview) => ({
                        ...prevReview,
                        imageUrl: imageUrl,
                    }));
                })
                .catch((error) => {
                    console.error('카페 사진 가져오기 실패:', error);
                });
        }
    }, [review.thumbImg]);




    const fileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

       
        const imageUrl = URL.createObjectURL(file);
        setReview((prevReview) => ({
            ...prevReview,
            imageUrl: imageUrl,
        }));
    }


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
                  
                    <label className="review-img">
                        썸네일 선택
                        <input type="file" name="filename" onChange={fileChange} style={{ display: 'none' }} />
                    </label>&nbsp;&nbsp;
                   
                        {review.imageUrl && (
                            <img src={review.imageUrl} alt="썸네일" style={{ width: "100px", height: "100px"}} />
                        )}
                    

                </div>


                <div className="editor">
                    <Editor
                       
                        ref={editorRef}
                        onChange={handleEditorChange}
                        className="custom-editor"
                      
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
                                    url: `${url}/common/fileUpload`,
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
                    {tagName.map((tag, i) => (
                        <div
                            key={i}
                            className={selectedTags.includes(tag.tagName) ? 'selectTags' : 'tags'}
                            onClick={() => tagClick(tag.tagName)}>
                            {tag.tagName}
                        </div>
                    ))}

                </div>

                <div className="btnBox">
                    <div className="review-btn" onClick={handleReset}>초기화</div>
                    <div className="review-btn" onClick={ReviewCahange}>리뷰 수정</div>
                </div>
            </div>
        </div>
    );
};
export default ReviewModify;
