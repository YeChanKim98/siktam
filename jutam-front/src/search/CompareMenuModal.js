// import { MenuList } from '@material-ui/core';
import React, { useState } from 'react';
import './CompareMenuModal.css';

const CompareMenuModal = (props) => {
    const { open, close, menuList } = props;
    // console.log('[모달] 비교 모달 -> ',menuList);
    
    const [result, setResult] = useState([0,0]);
    const [result1, setResult1] = useState(0);
    const [result2, setResult2] = useState(0);

    if(!open) return;

    const renderMenu1 = menuList[0].menu.map(menu=>{
        return(
            <div className='menuInfo'>
                <div className='menuName'>
                    {menu.name}
                </div>
                <div className='menuPrice'>
                    <label>
                        {menu.price} 원 <input type='checkbox' name='0' id={menu.name} onChange={(e)=>{changeCalc(e); setResult1(result[0]);}} value={menu.price} ></input>
                    </label>
                </div>
            </div>
        );
    });

    const renderMenu2 = menuList[1].menu.map(menu=>{
        return(
            <div className='menuInfo'>
                <div className='menuName'>
                    {menu.name}
                </div>
                <div className='menuPrice'>
                    <label>
                        {menu.price} 원 <input type='checkbox' name='1' id={menu.name} onChange={(e)=>{changeCalc(e); setResult2(result[1])}} value={menu.price} ></input>
                    </label>
                </div>
            </div>
        );
    });

    function changeCalc(e){
        let price = parseInt(e.target.value); // 가격정보
        let targetIndex = parseInt(e.target.name); // 타겟 인덱스 ( 0 / 1 )
        let calc = result; // 현재 계산 값 저장
        console.log('받은 가격 / 타겟 인덱스 / 현재 누적 값 => ',price,' / ',targetIndex,' / ',calc)
        if(e.target.checked){ //체크 하면
            calc[targetIndex] += price;  
        }else{ //체크 빼면
            calc[targetIndex] -= price;
        }

        setResult(calc)
        console.log('체크 --> : ',result);

    }


    return (
    // 클래스 이름 정정
    <div className={open ? 'openCompareModal modal' : 'modal'}>
        {open ? (
        <section className='compareForm'>
            <header>
                메뉴 비교
                <button className='close' onClick={close}>&times;</button>
            </header>
            <main className='compareMain'>
                <div style={{width:'100%'}}>
                    <div className='compareList'> {/* 가게이름 및 메뉴 */}
                        <div className='comparePlace rightPartition'> {/* 좌측 가게 */}
                            <div className='comparePlaceName'>{menuList[0].name}</div> {/* 가게 이름 */}
                            <div className='comparePlaceMenu'>
                                {renderMenu1}
                            </div> {/* 가게 메뉴 -> 스테이트 훅 변수 사용 */}
                        </div>

                        <div className='comparePlace'> {/* 우측 가게 */}
                            <div className='comparePlaceName'>{menuList[1].name}</div> {/* 가게 이름 */}
                            <div className='comparePlaceMenu'>
                                {renderMenu2}
                            </div> {/* 가게 메뉴 -> 스테이트 훅 변수 사용 */}
                        </div> 
                    </div>
                </div>

                <div className='clacPlace'> {/* 각 가게별 선택 메뉴 가격 총합 */}
                    <div className='eachResult rightPartition'>
                        <span className='floatLeft ' style={{fontSize:'15pt'}} >합계</span>
                        <span style={{fontSize:'15pt', fontWeight:'bold'}}>{result1}원</span> {/* 스테이트 훅 변수 */}
                    </div>
                    <div className='eachResult'>
                        <span className='floatLeft' style={{fontSize:'15pt'}}>합계</span>
                        <span style={{fontSize:'15pt', fontWeight:'bold'}}>{result2}원</span> {/* 스테이트 훅 변수 */}
                    </div>
                </div>

                
                <div className='compareResult'> {/* 비교 결과 */}
                    {/* <div>비교 결과</div> */}
                        <span style={{fontWeight:'bold',}}>{result1 >= result2 ? menuList[1].name : menuList[0].name}</span>이(가)&nbsp;
                        <span style={{fontWeight:'bold',}}>{Math.abs(result1-result2)}</span>원 더 저렴합니다!&nbsp;&nbsp;
                    {/* <div>초기화 버튼</div>  */}
                </div>

            </main>
            <footer></footer>
        </section>
        ) : null}
    </div>
    );
};

export default CompareMenuModal;


