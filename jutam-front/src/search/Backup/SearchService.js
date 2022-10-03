import React, { useEffect, useState } from 'react';
import KakaoMapScript, { setOverlayMapTypeId } from "./KaKaoMapScript";
import './SearchService.css';
import './PlaceOverlay.css';


function Map(){
    console.log('맵 전역 실행');
    let [keyword, setKeyword] = useState('발산역');

    useEffect(() => {
        console.log('맵 유스 이펙트 실행');
        KakaoMapScript();
    }, []); // 마운트 될때 사용할수 있도록 useEffect 사용

    function search(e){
        e.preventDefault();
        console.log('검색 시작 : '+keyword);
        KakaoMapScript();
    }

    
    return (
        <>
            <div id="menu_wrap" class="bg_white">
                <div class="option">
                    <div>
                        <div classNmae='type_changer'>
                            <button onClick={()=>{setOverlayMapTypeId('roadview')}}>로드뷰 도로정보 보기</button> 
                            <button onClick={()=>{setOverlayMapTypeId('traffic')}}>교통정보 보기</button> 
                        </div>
                        <form onSubmit={search}>  {/*"searchPlaces(); return false;"> */}
                            키워드 : <input type="text" value={keyword} onChange={(e) => {setKeyword(e.target.value);}} id="keyword" size="15"/> 
                            <button type="submit">검색하기</button> 
                        </form>
                    </div>
                </div>
                <hr/>
                <ul id="placesList"></ul>
                <div id="pagination"></div>
            </div>

            <div class="map_wrap" >
                <div id='myMap' style={{width: '83%', height: '95vh', float:'right',position:'relative'}}></div>
            </div>
        </>
    );
}

export default Map;


