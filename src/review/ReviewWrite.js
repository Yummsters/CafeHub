import React, { useState } from 'react';
import './reviewStyle.css'

const ReviewWrite = () => {
    const [selectTag, setSelectTag] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

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
    ]

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
                        <option value="">카페명 (n일 남음)</option>
                    </select>
                    <p>카페명</p>
                </div>

            <hr className='line'/>

            <div className='thumbnail'>
            <p className='review-thum'>썸네일 선택 &nbsp;&nbsp;&nbsp;</p>
                <label className='review-img'> 사진 선택
                    <input type="file" name="filename" onChange={handleFileChange}/>
                </label>
                {selectedFile && (
                    <p className="selected-file">선택된 파일: {selectedFile.name}</p>
                )}
            </div>

            <div className='editor'>에디터 삽입 부분</div>

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
                <div className='btn'>리뷰 등록</div>
            </div>


            </div>
        </div>
    );
};

export default ReviewWrite;

