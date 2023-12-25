import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { useSelector } from 'react-redux';
import { getCookie, setCookie, removeCookie } from '../components/Cookie';
import { useDispatch } from 'react-redux';
import { tokenCreate, tokenExpried } from "../login/TokenCheck.js";
import { url } from '../config.js'
import { Toast } from '../components/Toast.js'

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
    const memNo = useSelector(state => state.persistedReducer.member.memNo);
    const [selectedReviewAuthNo, setSelectedReviewAuthNo] = useState('');
    const [selectedCafeNo, setSelectedCafeNo] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            console.log('현재 토큰:', token);
            console.log(getCookie("refreshToken"));

            // 토큰을 이용한 사용자 정보 가져오기
            axios.get(`${url}/member`, {

                headers: {
                    Authorization: token,
                    Refresh: getCookie("refreshToken"),
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    const memNo = response?.data?.memNo;
                    if (memNo) {
                        setReview(prevReview => ({
                            ...prevReview,
                            writer: memNo,
                        }));
                        fetchCafeList();
                    } else {
                        console.error('error');
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [token, memNo, token, getCookie("refreshToken")]);


    const fetchCafeList = async () => {
        try {

            const response = await axios.get(`${url}/user/reviewauth/${memNo}`,{
                headers: {
                    Authorization: token,
                    Refresh: getCookie("refreshToken")
                }
            })
            .then(response => {
                tokenCreate(dispatch, setCookie, response.headers)
                    .then(() => {


            setCafes(response.data);
            })
        })
        } catch (error) {
            if (error.response !== undefined) {
                tokenExpried(dispatch, removeCookie, error.response.data, navigate);
            }
            console.error(error);
        }
    };

    const handleEditorChange = (content) => {
        setReview(prevReview => ({
            ...prevReview,
            content: content,
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (!selectedReviewAuthNo) {
            Toast('error', '카페를 선택하세요')
            return;
        }
        if (selectedTags.length === 0) {
            Toast('error', '태그를 선택하세요')
            return;
        }
        if (!review.title.trim()) {
            Toast('error', '제목을 선택하세요')
            return;
        }
        if (!thumbnail) {
            Toast('error', '썸네일을 등록하세요')
            return;
        }

        const content = editorRef.current.getInstance().getHTML();

        if (!content.trim() || content.trim() === '<p><br></p>') {
            Toast('error', '내용을 입력하세요')
            return;
        }

        const formData = new FormData();
        formData.append('title', review.title);
        formData.append('content', content);
        formData.append('memNo', review.writer);
        formData.append('writer', review.writer);
        formData.append('tagName', JSON.stringify(selectedTags));
        formData.append('ReviewAuthNo', selectedReviewAuthNo);
        formData.append('cafeNo', selectedCafeNo);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);

        }

        axios
            .post(`${url}/user/reviewwrite`, formData, {
                headers: {
                    Authorization: token,
                    Refresh: getCookie("refreshToken")
                }

            })
            .then(res => {
                tokenCreate(dispatch, setCookie, res.headers)
                    .then(() => {

                        console.log(res);
                        let reviewNo = res.data;

                        Toast('success', '리뷰 등록 성공!', '커피콩 1개 적립')
                        .then(() => {
                            navigate(`/reviewList`);
                        });
                    })
            })

            .catch(err => {
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                } else {
                    Toast('error', '리뷰 등록 중 오류가 발생했습니다')
                }

            })
    }

    useEffect(() => {

        axios.get(`${url}/user/reviewTagList`, {
            headers: {
                Authorization: token,
                Refresh: getCookie("refreshToken")
            }

        })
            .then(res => {
                // 토큰이 유효한 경우 확인 후 재발급
                tokenCreate(dispatch, setCookie, res.headers);
                setTagName([...res.data]);
            })
            .catch(err => {
                console.log(err);
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                }
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
            Toast('error', '3개까지 선택 가능합니다')
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
            Toast('warning', '제목은 15자 이하로 입력해주세요')
        }

        setReview({ ...review, [name]: value });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            const thumbnailURL = URL.createObjectURL(file);
            setThumbnail(thumbnailURL);

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

                        }}
                        style={{ width: '200px' }}
                        >
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
                    {!isFileSelected && (
                        <label className='review-img' >
                            썸네일 선택
                            <input type='file' name='thumbImg' onChange={handleFileChange} />
                        </label>
                    )}&nbsp;&nbsp;&nbsp;
                    {thumbnail && <img className='thumbnail-preview' src={thumbnail} alt='Thumbnail Preview' />}
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
                                        Authorization :token,
                                        Refresh : getCookie("refreshToken")
                        
                                    },
                                })
                                    .then((response) => {
                                        tokenCreate(dispatch, setCookie, response.headers);
                                        callback(response.data);
                                    })
                                    .catch((error) => {
                                        callback('image_load_fail');
                                        // 로컬 스토리지 정보 및 쿠키 토큰 제거
                                        tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                                      
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
