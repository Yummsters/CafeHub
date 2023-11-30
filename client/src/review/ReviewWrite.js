import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import "@toast-ui/editor/dist/toastui-editor.css";
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';

const ReviewWrite = () => {
    const [review, setReview] = useState({ title: '', content: '', writer: '' });
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [selectTag, setSelectTag] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [cafes, setCafes] = useState([]); // cafes 상태 추가

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
        formData.append("content", review.content);
        formData.append("writer", review.writer);

        for (let file of files) {
            formData.append("file", file);
        }

        axios.post('http://localhost:8080/reviewwrite', formData)
            .then(res => {
                console.log(res);
                let reviewNo = res.data;
                navigate(`/reviewwrite/${reviewNo}`);
            })
            .catch(err => {
                console.log(err)
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
        }
    };

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
                    <label className='review-img'> 사진 선택
                        <input type="file" name="thumbImg" onChange={handleFileChange} />
                    </label>
                    {selectedFile && (
                        <p className="selected-file">선택된 파일: {selectedFile.name}</p>
                    )}
                </div>
                <div className='editor'>
                    <Editor plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
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
                    <div className='btn'>초기화</div>
                    <div className='btn' onClick={submit}>리뷰 등록</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewWrite;
