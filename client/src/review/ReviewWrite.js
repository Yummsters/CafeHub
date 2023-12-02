import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import Swal from 'sweetalert2';
const ReviewWrite = () => {
    const initialReviewState = { title: '', content: '', writer: '' };
    const [review, setReview] = useState(initialReviewState);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [selectTag, setSelectTag] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cafes, setCafes] = useState([]); // cafes 상태 추가
    const editorRef = useRef();
    const [thumbnail, setThumbnail] = useState(null); // 썸네일 이미지 경로 상태
    const [isFileSelected, setIsFileSelected] = useState(false);

    useEffect(() => {
        // 카페 목록을 가져옴
        fetchCafeList();
    }, []);

    const fetchCafeList = async () => {
        try {
          
            const response = await axios.get('http://localhost:8080/cafelist');
            // 가져온 카페 목록을 상태에 저장
            setCafes(response.data);
        } catch (error) {
            console.error('Error fetching cafe list:', error);
        }
    };

    const change = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setReview({ ...review, [name]: value });
    }

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", review.title);
        formData.append("content",editorRef.current.getInstance().getMarkdown());
        formData.append("writer", review.writer);

        if (selectedFile) {
            formData.append("file", selectedFile);
            formData.append("thumb_img", selectedFile);
        }
        if (thumbnail) {
            formData.append("thumbnail", thumbnail); // 리뷰에 썸네일 이미지 경로 추가
        }

        axios.post('http://localhost:8080/reviewwrite', formData)
            .then(res => {
                console.log(res);
                let reviewNo = res.data;
                 
            // 성공 시 SweetAlert를 표시
            Swal.fire({
                title: '커피콩 1개 적립 성공!',
                text: '리뷰가 성공적으로 등록되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
            }).then(() => {
                // 사용자가 확인을 클릭한 후에 리다이렉트 또는 다른 작업 수행
                navigate(`/reviewList`);
            });
        })
        .catch(err => {
            console.log(err);

            // 오류 발생 시 SweetAlert를 표시
            Swal.fire({
                title: 'error',
                text: '리뷰를 등록하는 중에 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인',
            });
        });
    }

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
        '#자연 친화적'
    ];

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

            // 썸네일 이미지 경로 설정 (로컬 프리뷰를 위한 URL)
            const thumbnailURL = URL.createObjectURL(file);
            setThumbnail(thumbnailURL);

            setIsFileSelected(true);
        }
    };
    const handleReset = () => {
        // 초기화 버튼 클릭 시 상태 초기화
        setReview(initialReviewState);
        setFiles([]);
        setIsFileSelected(false);
        setThumbnail(null);
        // 에디터 내용 초기화
    const editorInstance = editorRef.current.getInstance();
    editorInstance.setMarkdown('');
    }
    return (
        <div className='review-bgBox'>
            <div className='reviewBox'>
                <div className='reviewTitle'>
                    <select>
                        <option value="" disabled selected>카페 선택</option>
                        {cafes.map(cafe => (
                            <option key={cafe.reviewAuthNo} value={cafe.reviewAuthNo}>{cafe.cafeNo}</option>
                        ))}
                    </select>
                    <Input className="title" name="title" type="text" onChange={change}
                        id="title" required="required" value={review.title} placeholder="제목을 입력하세요" />
                </div>
                <hr className='line' />
                <div className='thumbnail'>
                    <p className='review-thum'>썸네일 선택 &nbsp;&nbsp;&nbsp;</p>
                     {!isFileSelected && (
                        <label className='review-img'> 사진 선택
                            <input type="file" name="thumbImg" onChange={handleFileChange} />
                        </label>
                    )}
                    {thumbnail && (
                        <img className="thumbnail-preview" src={thumbnail} alt="Thumbnail Preview" />
                    )}
                </div>
                <div className='editor'>
                    <Editor
                                            ref={editorRef}
                                            plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                                            placeholder="Please Enter Text."
                    
                    />
                </div>
                <div className='tagBox'>
                    {tags.map((tag, i) => (
                        <div key={i}
                            className={selectTag.includes(i) ? 'selectTag' : 'tag'}
                            onClick={() => tagClick(i)}>
                            {tag}
                        </div>
                    ))}
                </div>
                <div className='btnBox'>
                    <div className='btn' onClick={handleReset}>초기화</div>
                    <div className='btn' onClick={submit}>리뷰 등록</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewWrite;
