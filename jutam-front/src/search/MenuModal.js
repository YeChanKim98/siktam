import React, { useState } from 'react';
import './MenuModal.css';

const MenuModal = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, menuList } = props;
    // console.log('[모달] 받은 메뉴 리스트 : ',menuList);

    if(!menuList) return;
    const renderMenuList = menuList.map(menu => {
        return (
            <div className='MenuInfo'>
                <div className='MenuName'>{menu.name}</div>
                <div className='MenuPrice'>{menu.price} 원</div>
            </div>
        );
    });

    return (
    // 클래스 이름 정정
    <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
        <section>
            <header>
                {menuList[0].placeName}
                <button className='close' onClick={close}>&times;</button>
            </header>
            <main className='MenuList'>
                {/* 메뉴정보 */}
                {renderMenuList}
            </main>
        </section>
        ) : null}
    </div>
    );
};

export default MenuModal;


