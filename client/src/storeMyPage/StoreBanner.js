import { useState, useRef } from 'react';
import storeBannerStyle from './storeBannerStyle.css';
import StoreSideTab from '../components/StoreSideTab';

const StoreBanner = () => {

    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [menu, setMenu] = useState('');

    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setDescription(value);
        }
    };

    const handleMenuChange = (e) => {
        const value = e.target.value;
        const words = value.split(',').map((word) => word.trim());
        if (words.length <= 3) {
            setMenu(value);
        }
    };

    const handleReset = () => {
        setDescription('');
        setMenu('');
    };

    return (
        <div className='storeBanner-container'>
            <StoreSideTab />
            <div className='storeBanner-wrapper'>
                <div className='storeBanner-content'>
                    <div className='storeBanner-preview' onClick={handleImageClick}>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={inputRef}
                        />
                        <div className='storeBanner-img' style={{ backgroundImage: `url(${image || '/img/placeholder-image.jpg'})` }}>
                            {image ? null : <div className='preview-text'>클릭해서 사진을 첨부하세요</div>}
                        </div>
                        <div className='storeBanner-info'>
                            <div className='storeBanner-title'>우드슬랩,</div>
                            <div className='storeBanner-description'>
                                <br />{description}
                            </div>
                            <div className='storeBanner-menu'>
                                <br />대표메뉴: {menu}
                            </div>
                            <div className='storeBanner-address'>
                                서울 금천구 가산디지털1로 58  에이스한솔타워 제 101호
                            </div>
                        </div>
                    </div>

                    <div className='storeBanner-input-description-wrap'>
                        <div className='storeBanner-input-description-box'>
                            <div className='storeBanner-input-description-title'>
                                <div style={{ fontSize: "20px" }}>카페 설명 입력</div>
                                <div style={{ fontSize: "15px" }}>(최대 30자)</div>
                            </div>
                            <input
                                type='text'
                                className='storeBanner-input-description'
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                        <button className='storeBanner-cancelBtn' onClick={handleReset}>초기화</button>
                    </div>

                    <div className='hl' />

                    <div className='storeBanner-input-menu-wrap'>
                        <div className='storeBanner-input-menu-box'>
                            <div className='storeBanner-input-menu-title'>
                                <div style={{ fontSize: "20px" }}>대표 메뉴 입력</div>
                                <div style={{ fontSize: "15px" }}>(최대 3가지)</div>
                            </div>
                            <input
                                type='text'
                                className='storeBanner-input-menu'
                                value={menu}
                                onChange={handleMenuChange}
                            />
                        </div>
                        <button className='storeBanner-regBtn'>광고 신청</button>
                    </div>

                    <div className='hl' />

                </div>
            </div>
        </div>
    )
}

export default StoreBanner;