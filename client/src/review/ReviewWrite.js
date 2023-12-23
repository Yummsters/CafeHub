import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { getCookie } from '../components/Cookie';
import { url } from '../config.js'

const ReviewWrite = () => {
    const [editorInstance, setEditorInstance] = useState(null);
    const [review, setReview] = useState({ title: '', content: '', writer: '', reg_date: '', cafeNo: '' });
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [tagName, setTagName] = useState([]);
    const [selectTag, setSelectTag] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cafes, setCafes] = useState([]);
    const editorRef = useRef();
    const [thumbnail, setThumbnail] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const token = useSelector(state => state.persistedReducer.accessToken);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const memNo = useSelector(state => state.persistedReducer.member.memNo);
    const [selectedReviewAuthNo, setSelectedReviewAuthNo] = useState('');
    const [selectedCafeNo, setSelectedCafeNo] = useState('');


    useEffect(() => {
        if (token) {
            console.log('현재 토큰:', token);
            console.log(getCookie("refreshToken"));

            // 토큰을 이용한 사용자 정보 가져오기
            axios.get(`${url}/member`, {
                headers: {
                    Authorization: accessToken,
                    Refresh: getCookie("refreshToken"),
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    // 사용자 정보에서 원하는 값(review.writer)을 가져와 설정
                    const memNo = response?.data?.memNo;
                    if (memNo) {
                        setReview(prevReview => ({
                            ...prevReview,
                            writer: memNo,
                        }));
                        console.log('사용자 정보:', response.data);
                        fetchCafeList();
                    } else {
                        console.error('사용자 정보에서 memNo를 찾을 수 없습니다.');
                    }
                })
                .catch(error => {
                    console.error('사용자 정보 가져오기 실패:', error);
                    // 실패 시에 대한 처리를 추가할 수 있습니다.
                });
        }
    }, [token, memNo]);

    const uploadImages = (blob, callback) => {
        let formData = new FormData();
        formData.append('images', blob);

        axios({
            method: 'POST',
            url: '${url}/common/fileUpload',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log('이미지 업로드 성공', response.data);

                // 에디터에 이미지 추가
                callback(response.data);
            })
            .catch((error) => {
                console.error('프론트 이미지 업로드 실패', error);
                callback('image_load_failfff');
            });
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
    const handleEditorChange = (content) => {
        console.log(content);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!selectedReviewAuthNo) {
            Swal.fire({
                title: '카페를 선택하세요',

                icon: 'error',
                confirmButtonText: '확인',
            });

            return;
        }

        const formData = new FormData();
        //title보내기
        formData.append('title', review.title);
        const content = editorRef.current.getInstance().getHTML();
        console.log('FormData의 콘텐츠:', content);
        //content보내기
        formData.append('content', content);
        //writer보내기
        formData.append('memNo', review.writer);
        formData.append('writer', review.writer);
        //tag보내기
        formData.append('tagName', JSON.stringify(selectedTags));
        console.log('태그보내짐?', JSON.stringify(selectedTags));
        //cafeno보내기
        formData.append('ReviewAuthNo', selectedReviewAuthNo); // 리뷰 인증 번호
        console.log("reviewauthno보내지나", selectedReviewAuthNo);
        formData.append('cafeNo', selectedCafeNo);
        console.log("카페번호", selectedCafeNo);
        if (selectedFile) {
            formData.append('file', selectedFile);
            // formData.append('thumb_img', selectedFile);
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        axios
            .post(`${url}/reviewwrite`, formData)
            .then((res) => {
                console.log(res);
                let reviewNo = res.data;

                Swal.fire({
                    title: '커피콩 1개 적립 성공!',
                    text: '리뷰가 성공적으로 등록되었습니다',
                    icon: 'success',
                    confirmButtonText: '확인',
                }).then(() => {
                    navigate(`/reviewList`);
                });
            })
            .catch((err) => {
                console.log(err);

                Swal.fire({
                    title: 'error',
                    text: '리뷰를 등록하는 중에 오류가 발생했습니다',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            });
    };

    useEffect(() => {
        axios.get(`${url}/reviewTagList`)
            .then(res => {
                console.log(res.data);
                setTagName([...res.data]);
                console.log("태그이름" + tagName);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const [selectedTags, setSelectedTags] = useState([]);

    const tagClick = (i) => {
        let updatedTags;

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
    const change = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        // 제목 글자수 제한
        if (name === 'title' && value.length > 15) {
            value = value.slice(0, 15); // 15자로 제한
            Swal.fire({
                title: '제목은 15자 이하로 입력해주세요',
                icon: 'warning',
                confirmButtonText: '확인',
            });
        }

        setReview({ ...review, [name]: value });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            const thumbnailURL = URL.createObjectURL(file);
            setThumbnail(thumbnailURL);
            // setIsFileSelected(true);
        }
    };
    const resetForm = () => {
        setReview({ title: '', content: '', writer: '', reg_date: '', cafeNo: '' });
        setFiles([]);
        setSelectedFile(null);
        setThumbnail(null);
        setIsFileSelected(false);
        setSelectTag([]);
        setSelectedTags([]);
        setSelectedReviewAuthNo('');
        setSelectedCafeNo('');
        //content초기화

        editorRef.current.getInstance().setMarkdown('');
    };

    return (
        <div className='review-bgBox'>
            <div className='reviewBox'>
                <div className='reviewTitle'>

                    <select
                        value={selectedReviewAuthNo && selectedCafeNo ? `${selectedReviewAuthNo},${selectedCafeNo}` : ''}
                        onChange={(e) => {
                            const [selectedReviewAuthNo, selectedCafeNo] = e.target.value.split(',');
                            setSelectedReviewAuthNo(selectedReviewAuthNo);
                            setSelectedCafeNo(selectedCafeNo);
                        }}>
                        <option value='' disabled>
                            카페 선택
                        </option>
                        {cafes.map((reviewAuth, i) => (
                            <option key={i} value={`${reviewAuth.reviewAuthNo},${reviewAuth.cafeNo}`}>
                                {reviewAuth.cafeName} ({reviewAuth.remainTime}일 남음)
                            </option>
                        ))}
                    </select>

                    <Input
                        className='title'
                        name='title'
                        type='text'
                        onChange={change}
                        id='title'
                        required='required'
                        value={review.title}
                        placeholder='제목을 입력하세요'
                    />
                </div>
                <hr className='line' />
                <div className='thumbnail'>
                    {/* <p className='review-thum'>썸네일 선택 &nbsp;&nbsp;&nbsp;</p> */}
                    {!isFileSelected && (
                        <label className='review-img' >
                            썸네일 선택
                            <input type='file' name='thumbImg' onChange={handleFileChange} />
                        </label>
                    )}&nbsp;&nbsp;&nbsp;
                    {thumbnail && <img className='thumbnail-preview' src={thumbnail} alt='Thumbnail Preview'/>}
                </div>
                <div className='editor'>
                    <Editor
                        onChange={handleEditorChange}
                        className='custom-editor'
                        ref={editorRef}
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                        // placeholder='Please Enter Text.'
                        previewStyle='vertical'
                        height='500px'
                        initialEditType='wysiwyg'
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
                <div className='tagBox'>
                    {tagName.map((tag, i) => (
                        <div
                            key={i}
                            className={selectedTags.includes(i) ? 'selectTag' : 'tag'}
                            onClick={() => tagClick(i)}>
                            {tag.tagName}
                        </div>
                    ))}
                </div>
                <div className='btnBox'>
                    <div className='review-btn' onClick={resetForm}>초기화</div>
                    <div className='review-btn' onClick={submit}>
                        리뷰 등록
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewWrite;
