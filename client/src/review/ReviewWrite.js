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
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ReviewWrite = () => {
    const [editorInstance, setEditorInstance] = useState(null);
    const [review, setReview] = useState({ title: '', content: '', writer: '', reg_date: '',cafeNo:'' });
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [selectTag, setSelectTag] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cafes, setCafes] = useState([]);
    const editorRef = useRef();
    const [thumbnail, setThumbnail] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const token = useSelector(state => state.persistedReducer.accessToken);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const memNo = useSelector(state => state.persistedReducer.member.memNo);
    const [selectedCafe, setSelectedCafe] = useState('');

    useEffect(() => {
        if (token) {
            console.log('현재 토큰:', token);

            // 토큰을 이용한 사용자 정보 가져오기
            axios.get(`http://localhost:8080/member`, {
                headers: {
                    Authorization: accessToken,
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
            url: 'http://localhost:8080/common/fileUpload',
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
            const response = await axios.get(`http://localhost:8080/reviewauth/${memNo}`);

            setCafes(response.data);
            console.log('Cafes:', response.data);
        } catch (error) {
            console.error('Error fetching cafe list:', error);
        }
    };

    const change = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setReview({ ...review, [name]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!selectedCafe) {
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
        const content = editorRef.current.getInstance().getMarkdown();

        console.log('FormData의 콘텐츠:', content);
        //content보내기
        formData.append('content', content);
        //writer보내기
        formData.append('writer', review.writer);
        //tag보내기
        formData.append('tagName', JSON.stringify(selectedTags));
        console.log('태그보내짐?', JSON.stringify(selectedTags));
        //cafeno보내기
        formData.append('cafeNo', selectedCafe);
        console.log("카페no보내지냐",selectedCafe);
        if (selectedFile) {
            formData.append('file', selectedFile);
            // formData.append('thumb_img', selectedFile);
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        axios
            .post('http://localhost:8080/reviewwrite', formData)
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

    const tagName = [
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
        '#자연 친화적',
    ];
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            const thumbnailURL = URL.createObjectURL(file);
            setThumbnail(thumbnailURL);
            setIsFileSelected(true);
        }
    };

    return (
        <div className='review-bgBox'>
            <div className='reviewBox'>
                <div className='reviewTitle'>
{/* 
                    <select
                        value={review.selectedCafe || ''}
                        onChange={(e) => setReview(prevReview => ({ ...prevReview, selectedCafe: e.target.value }))}>
                        <option value='' disabled>
                            카페 선택
                        </option>
                        {cafes.map((cafe, i) => (
                            <option key={i} value={cafe.reviewAuthNo}>

                                {cafe.cafeName}

                            </option>
                        ))}
                    </select> */}
                      <select
                        value={selectedCafe}
                        onChange={(e) => setSelectedCafe(e.target.value)}>
                        <option value='' disabled>
                            카페 선택
                        </option>
                        {cafes.map((cafe, i) => (
                            <option key={i} value={cafe.cafeNo}>
                                {cafe.cafeName}
                                
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
                    <p className='review-thum'>썸네일 선택 &nbsp;&nbsp;&nbsp;</p>
                    {!isFileSelected && (
                        <label className='review-img'>
                            사진 선택
                            <input type='file' name='thumbImg' onChange={handleFileChange} />
                        </label>
                    )}
                    {thumbnail && <img className='thumbnail-preview' src={thumbnail} alt='Thumbnail Preview' />}
                </div>
                <div className='editor'>
                    <Editor
                        className='custom-editor'
                        ref={editorRef}
                        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                        placeholder='Please Enter Text.'
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
                            {tag}
                        </div>
                    ))}
                </div>
                <div className='btnBox'>
                    <div className='btn'>초기화</div>
                    <div className='btn' onClick={submit}>
                        리뷰 등록
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewWrite;
