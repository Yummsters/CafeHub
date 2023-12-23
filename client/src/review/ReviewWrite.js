import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'reactstrap';
import {useParams, useNavigate } from 'react-router-dom';
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
import { getCookie, setCookie, removeCookie } from '../components/Cookie';
import {useDispatch} from 'react-redux';
import { normalCheck, tokenCreate, tokenExpried } from "../login/TokenCheck.js";


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
  //  const {accessToken, refreshToken} = useParams();
  
   
    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:8080/member`, {
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
              
                callback(response.data);
            })
            .catch((error) => {
                callback('image_load_failfff');
            });
    };



    const fetchCafeList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/member/reviewauth/${memNo}`, {
                headers: {
                    Authorization: token,
                    Refresh: getCookie("refreshToken")
                }
            });
            setCafes(response.data);
        } catch (error) {
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
            Swal.fire({
                title: '카페를 선택하세요',

                icon: 'error',
                confirmButtonText: '확인',
            });

            return;
        }
        if (selectedTags.length === 0) {
            Swal.fire({
                title: '태그를 선택하세요',
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }
        if (!review.title.trim()) {
            Swal.fire({
                title: '제목을 입력하세요',
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }
        if (!thumbnail) {
            Swal.fire({
                title: '썸네일을 등록하세요',
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }
    
        const content = editorRef.current.getInstance().getHTML();
       
        if (!content.trim() || content.trim() === '<p><br></p>'){
            Swal.fire({
                title: '내용을 입력하세요',
                icon: 'error',
                confirmButtonText: '확인',
            });
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
            .post(`http://localhost:8080/member/reviewwrite`, formData, {
            headers : {
                Authorization :token,
                Refresh : getCookie("refreshToken")
            }
            
           })
           .then(res=>{
            tokenCreate(dispatch, setCookie, res.headers)
            .then(() => {
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
        })
        .catch(err=>{
            if(err.response !== undefined){
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
            }else{
                Swal.fire({
                    title: 'error',
                    text: '리뷰를 등록하는 중에 오류가 발생했습니다',
                    icon: 'error',
                    confirmButtonText: '확인',
                })         
            }
               
        })
    }

    useEffect(() => {
        axios.get('http://localhost:8080/reviewTagList', {
          headers: {
            Authorization: token,
            Refresh: getCookie("refreshToken")
          }
        })
        .then(res => {
          setTagName([...res.data]);
        })
        .catch(err => {
          console.log(err);
        });
      }, []);
      
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
                                    url: 'http://localhost:8080/common/fileUpload',
                                    data: formData,
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                })
                                    .then((response) => {
                                        callback(response.data);
                                    })
                                    .catch((error) => {
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
