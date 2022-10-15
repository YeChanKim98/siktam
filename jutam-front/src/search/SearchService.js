
import { Checkbox } from '@material-ui/core';
import { type } from '@testing-library/user-event/dist/type';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Map, ZoomControl, MapTypeControl, MapMarker } from "react-kakao-maps-sdk";
import CompareMenuModal from './CompareMenuModal';
import MenuModal from './MenuModal';
import './SearchService.css';

const { kakao } = window;

function ServiceMain(){

    const [map, setMap] = useState(); // 지도객체 : 순수카카오 함수 사용가능
    const [markers, setMarkers] = useState([]) // 검색 결과 마커 객체
    const [info, setInfo] = useState(); // 지도정보 변수
    const [lat, setLat] = useState(); // 중앙 좌표 위도
    const [lng, setLng] = useState(); // 중앙 좌표 경도
    const [category, setCategory] = useState([]); // 카테고리 선택 옵션
    const [people, setPeople] = useState(1); // 인원 선택 옵션
    const [money, setMoney] = useState(-1); // 식비 선택 옵션
    const [placeList, setPlaceList] = useState([]); // 장소 검색의 결과 객체( Json ) []
    const [placeRender, setPlaceRender] = useState(); // 장소검색 렌더링 정보
    const [pageRender, setPageRender] = useState(); // 페이지네이션 렌더링
    const [page, setPage] = useState([]); // 장소 검색의 결과 객체( Json ) []
    const [selectPage, setSelectPage] = useState(0); // 현재 페이지
    const [showMarker, setShowMarker] = useState(); // 현재 페이지
    const [showMenu, setShowMenu] = useState([]); // 띄울 메뉴 정보를 담을 객체

    let start, end, claName; // 페이지 네이션 변수

    // 메뉴 정보 모달 변수
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const openMenuModal = () => { setMenuModalOpen(true); };
    const closeMenuModal = () => { setMenuModalOpen(false); };
    
    // 가게 비교 모달 변수
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const openCompareModal = () => { setCompareModalOpen(true); };
    const closeCompareModal = () => {
        setCompareModalOpen(false); 
        initCompareParam();
    };

    // 가게 비교에 사용된 정보 초기화
    function initCompareParam(){
        let initTarget = JSON.parse(window.localStorage.getItem('ComparePlace'));
        document.getElementById(initTarget[0].id).style.background='';
        document.getElementById(initTarget[1].id).style.background='';
        window.localStorage.setItem('ComparePlace',JSON.stringify([]));
        setShowMenu([]);
    }
    
    // 메뉴 비교 가게 리스트 초기화
    useEffect(()=>{window.localStorage.setItem('ComparePlace',JSON.stringify([]));},[]);

    // ESC키를 통한 모달 닫기
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if(key == 27 && ( menuModalOpen || compareModalOpen )) { // ESC입력 and (모달 둘 중 하나) 열려 있을 때
            closeMenuModal();
            closeCompareModal();
        }
    }

    // 엑시오스 객체
    const api = axios.create({
	    baseURL : 'http://52.79.235.67:80/api',
        credentials: true, 
    });
    

    // 초기 지도 렌더링
    useEffect(() => {
        if (!map) return // 맵이 있을 때만 렌더링 시 한번 실행
        setLat(map.getCenter().getLat());
        setLng(map.getCenter().getLng());
        kakao.maps.event.addListener(map, 'dragend', () => {
            setLat(map.getCenter().getLat());
            setLng(map.getCenter().getLng());
            setInfo({
                center: {
                    lat: map.getCenter().getLat(),
                    lng: map.getCenter().getLng(),
                }})
            })
            // console.log('좌표획득 이벤트 등록 완료');
    }, [map])



    // 검색 결과가 반영되면 렌더링 하여 화면에 띄움
    useEffect(() => {
        window.localStorage.setItem('SearchPlace',JSON.stringify(placeList));
        if(placeList==null){
            //검색 결과가 없을 경우
            setPlaceRender(<div className='getNull'>검색 결과가 없습니다</div>);
            console.log('검색된 장소 없음 ( 에러X 받아오지 못 함 ) ');

        }else{
            RenderSearchList();
        }
    },[placeList])


    // 검색 API
    function requestPlaceList(e){
        e.preventDefault();
        console.log('전송정보[카테고리, 인원, 돈, 위도, 경도] : ',category,people,money,lat,lng);
        api.post('/place/search/around',{
            category : category,
            people : people,
            money : money,
            lat : lat,
            lng : lng
            // 머니는 기본 -1원으로 하며, 체크박스를 통해서 활성화 할 때만 사용가능 
        })
        .then(Result=>{
            // console.log(Result.data);
            setPlaceList(Result.data.map(place => {
                return({
                    id : place['place'].id,
                    address : place['place'].address,
                    category : place['place'].category,
                    id : place['place'].id,
                    img : place['place'].img,
                    lat : place['place'].lat,
                    lng : place['place'].lng,
                    name : place['place'].name,
                    tel : place['place'].tel,
                    price : parseInt(place['averPrice'])
                });
            }));
            // console.log('받은 데이터 : ',placeList);
        }).catch((Error)=>{
            console.log(Error);
            alert('검색 오류 발생.\n잠시 후 다시 시도해주세요');
        })
    }


    // 카테고리 목록 갱신 -> 다중 선택용 업데이트
    function updateCategory(e){
        let cat = e.target.value;
        if(category.includes(cat)){
            category.splice(category.indexOf(cat),1);
            
        }else{
            setCategory([...category, cat]);
        }
        // console.log('카테고리 : ',category);

    }


    // 페이지네이션 요청 갱신
    // 플레이스렌더링 스테이트 갱신
    // 맵핀 기능 추가
    function RenderSearchList(page=1){
        if(!map) return;
        setSelectPage(page);

        let getPlaceList = JSON.parse(window.localStorage.getItem('SearchPlace')); // 갯수 조절
        let placeSize = Math.ceil(getPlaceList.length/15); // 총 페이지 수
        if(page > placeSize) page = placeSize ; // 현재 있는 페이지보다 높은 페이지 요구는 무시
        getPlaceList = getPlaceList.slice((page-1)*14,page*14+1); // 현재 페이지에 맞는 장소정보 슬라이싱

        
        // 맵핀 생성용
        const bounds = new kakao.maps.LatLngBounds()
        let markers = []

        // 검색결과 랜더링
        setPlaceRender(getPlaceList.map(place => {
            markers.push({
                position: {
                    lat: place.lat,
                    lng: place.lng,
                },
                title: place.name,
            })
            bounds.extend(new kakao.maps.LatLng(place.lat,place.lng)); // 각 장소의 좌표 등록
            return(
                    <li className='searchPlace' key={place.id}>
                        <div className='placeImg'>
                            <img src={place.img?place.img:'/img/altimg.png'} alt='가게 대표 이미지'></img>
                        </div>

                        <div className='placeInfo'>
                            <div className='placeName'>{place.name}</div>
                            <div className='placeAddr'>{place.address}</div>
                            <div className='placeTel'>{place.tel}</div>
                            { place.price > 0 && <div className='placePrice'>평균가격 : {place.price}</div> }
                        </div>

                        <div className='placeAction'>
                            <button className='btn' onClick={(e) => {requestMenu([place.id],[place.name]);}}>메뉴</button>
                            <button className='btn' id={place.id} onClick={()=>{addCompareTarget(place.id, place.name);}} >비교</button>
                        </div>
                    </li>
                );
            }
        )); // setPlaceRender
        setMarkers(markers);
        getPlaceList.length > 0 && RenderPage(page,placeSize); // 페이지네이션 함수 : 정보가 1개 이상 있을때만 작동
    } // RenderSearchList


    // 렌더링 페이지네이션  
    function RenderPage(sel = 1, total = 1){
        if( sel == 0 ) return;

        // 잘못된 페이지 처리 -> 페이지네이션 시작 : 1보다 작은수가 들어오면 1로 입력
        if(sel%5 == 0){ start = sel - 4 }
        else{ sel < 1 ? start = 1 : start = sel - sel%5 + 1; }
        start+4 >= total ? end = total : end = start + 4; // 페이지네이션 끝 : 총 페이지 수 보다 큰 수가 들어오면 마지막 페이지로 입력

        // 렌더링을 위한 페이지 범위 배열 매핑
        setPageRender(
            [...Array(end+1).keys()].splice(start).map(i=>{
                sel == i ? claName = 'pagination-link is-current' : claName = 'pagination-link';
                return(
                    <li key={i}><a className={claName} onClick={()=>{RenderSearchList(i);}} >{i}</a></li>
                );
            }
        )); // function/map/render        
    } // RenderPage


    // 메뉴 요청
    function requestMenu(placeId,placeName){
        // console.log('메뉴 요청 : ',placeId,' / ', placeName);
        api.post('/place/search/menu',placeId)
        .then(Result=>{
            let responseMenu = Result.data;
                // 응답 객체 구조
                // category: ""
                // menuKey: {id: '', name: ''}
                // place_category: ""
                // price: 
            // console.log('메뉴정보 요청 결과 : ',responseMenu);
            if(responseMenu.length < 1){
                alert('메뉴 정보가 등록되지 않은 가게입니다..!');
                if(JSON.parse(window.localStorage.getItem('ComparePlace')).length > 1){
                    initCompareParam();
                }
                return;
            }

            // PlaceName length에 따라 동작 다르게
            if(placeId.length == 2){ // ID가 2개면 비교요청이므로, 데이터 재정의 -> 비교모달 오픈
                let defMenu = [[],[]];
                let defTarget;
                responseMenu.map(menu => {
                    menu.menuKey.id == placeId[0] ? defTarget = 0 : defTarget = 1;
                    // console.log('받은 ID / 비교군 -> 타겟팅 : ',menu.menuKey.id,' / ',placeId[0].id,' -> ',defTarget)
                    defMenu[defTarget] = [...defMenu[defTarget],{ name : menu.menuKey.name, price : menu.price}];
                })
                // console.log('메뉴 재정의 : ',defMenu);
                setShowMenu([
                    {
                        id : placeId[0],
                        name : placeName[0],
                        menu : defMenu[0]
                    },
                    {
                        id : placeId[1],
                        name : placeName[1],
                        menu : defMenu[1]
                    }
                ]);

                //모달 오픈
                openCompareModal();


            }else{ // ID가 1개면 일반 메뉴 조회 -> 메뉴모달 오픈
                console.log('받은 메뉴 정보 : ',responseMenu);
                setShowMenu(responseMenu.map(menu => {
                    return({
                        placeName : placeName,
                        placeId : placeId,
                        category : menu.category,
                        name : menu.menuKey.name,
                        price : menu.price,
                    });
                }));
                openMenuModal();
            }
        }).catch((Error)=>{
            console.log(Error);
            alert('메뉴정보 렌더링 오류 !!',Error);
        })
    }

// useEffect(()=>{console.log('메뉴 비교 정보 재정의 : ',showMenu);},[showMenu]);

    // 메뉴 비교 대상 등록
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 최적화 할 것 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    function addCompareTarget(placeId, placeName){
        let target = document.getElementById(placeId);
        let ComparePlace = JSON.parse(window.localStorage.getItem('ComparePlace')); // 저장된 비교 목록
        // console.log('불러온 비교 대상 목록 : ',ComparePlace);
        
        // 정보가 하나도 없으면 추가
        if (ComparePlace.length == 0 ){
            ComparePlace.push({id : placeId, name : placeName});
            window.localStorage.setItem('ComparePlace', JSON.stringify(ComparePlace)); // 추가
            target.style.background = 'blue'; // 스타일 추가
            // console.log('비교 항목 추가');
            return; 
        }


        // 정보가 1개 이상 있으면
        for(let i = 0 ; i < ComparePlace.length ; i++){
            // console.log('확인루프 : ',i,' / ',ComparePlace.length);
           if(ComparePlace[i].id == placeId) { // 이미 있는 ID는 
                ComparePlace.splice(i,1); // 제거
                window.localStorage.setItem('ComparePlace', JSON.stringify(ComparePlace));
                target.style.background = ''; // 스타일 제거
                // console.log('비교 항목 제거');
                return; 
            }//else{console.log('매칭X');}
           if(i == ComparePlace.length-1){ // 모두 검사할 동안 없으면
                // console.log('마지막루프 : ',i);
                if(ComparePlace.length > 1){ // 이미 2개가 있으면 종료
                    alert('비교는 2개만..!');
                    console.log('비교는 2개만..!');
                    return;
                }
                ComparePlace.push({id : placeId, name : placeName});
                window.localStorage.setItem('ComparePlace', JSON.stringify(ComparePlace)); // 추가
                target.style.background = 'blue'; // 스타일 추가
                // console.log('비교 항목 추가');
                break;
            }
            // console.log('아무 동작 없을 때.. 뜨면 안 됨');
        }


        // 요청하여 메뉴정보 갱신 후 비교 모달 열기
        let param = JSON.parse(window.localStorage.getItem('ComparePlace'));
        if(param.length == 2){
            // console.log('비교 2개 등록 -> 메뉴 정보 요청 실시!');
            requestMenu( [param[0].id, param[1].id], [param[0].name, param[1].name] ) // 메뉴 정보 요청
        }


        // if(ComparePlace.id.includes(placeId)){ // 받은 ID가 이미 있을 경우
        //     ComparePlace.splice(ComparePlace.indexOf(placeId),1); // 이미 있으면 제거
        //     console.log('비교 대상 제거 : ',ComparePlace);
        //     target.style.background = 'white'; // 스타일 헤제
        //     window.localStorage.setItem('ComparePlace',ComparePlace); // 제거 결과 저장
        // }else{ // 받은 ID가 없는 경우
        //     if(ComparePlace.length == 2){ // 이미 2개가 있는데 새로운 장소를 추가 하려 할 때
        //         alert('비교 대상은 2개까지 지정할 수 있습니다..!');
        //         console.log('비교 대상은 2개까지 지정할 수 있습니다..!');
        //         return;
        //     }
        //     window.localStorage.setItem('ComparePlace',[...ComparePlace, placeId]); // 받은 ID 저장
        //     target.style.background = 'green'; // 스타일 추가
        // }

        // // 입력 및 제거 후 크기가 2일 때 -> 비교 기능 작동
        // if(window.localStorage.getItem('ComparePlace').length == 2){
        //     console.log('비교 모달 오픈..!');
        //     requestMenu(window.localStorage.getItem('ComparePlace'),'')
        //     openCompareModal();
        // }

        // let placeId = e.target.value;
        // let target = document.getElementById(placeId);
        // if(compareMenu.length > 2){ // 2개이상 선택했으면 추가 선택 불가
        //     alert('메뉴 비교는 2개만 가능합니다..!');
        //     console.log('메뉴 비교는 2개만 가능합니다..!');
        //     return; 
        // } 
        // // console.log(placeId,'기존 비교 메뉴 대상 : ',compareMenu);
        // // setCompareMenu([placeId]);
        // // console.log('수정 후 ->', compareMenu);
        // if(compareMenu.includes(placeId)){ // 이미 있으면 제거, 없으면 등록
        //     compareMenu.splice(compareMenu.indexOf(placeId),1);
        //     console.log('비교 대상 제거 : ',compareMenu);
        //     target.style.background = 'white';
        // }else{
        //     setCompareMenu([placeId]);
        //     console.log('비교 대상 추가 : ',compareMenu);
        //     target.style.background = 'green';
        // }
    }

    // useEffect(()=>{
    //     console.log('비교 대상 변동 : ',compareMenu);
    //     if(compareMenu.length > 1){
    //         console.log('2개 선택 트리거..!');
    //     }
    // },[compareMenu])

    // 중앙좌표 반환 -> 지도 중앙 핀 생성 -> // 장소검색 -> 커스텀 오버레이 -> 
    return (
        <>
            {/* 맵 및 맵에 대한 정보를 담는 객체 생성 -> 객체 : 개발자 및 관리자용 */}
            <Map center={{lat: 37.56048643647845, lng:126.83786575805817 }}
                style={{width: '100%', height: '100%'}}
                level={3}  onCreate={(map) => setMap(map)} >    
                <ZoomControl position={kakao.maps.ControlPosition.TOPRIGHT} />
                <MapTypeControl position={kakao.maps.ControlPosition.TOPRIGHT}/>

                {/* 맵핀 띄우기 */}
	        {markers.map((marker) => (
                        <MapMarker
                            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                            position={marker.position} onClick={() => setInfo(marker)}>
                            {info &&info.content === marker.content && (
                                <div style={{color:"#000"}}>{marker.content}</div>
                            )}
                        </MapMarker>

                ))}

                {/* 검색 및 검색 결과 창 */}
                <div id="menu_wrap" style={{width: '400px', top : '10px'}}> {/*최소길이 지정 */}

                    {/* 검색 옵션 */}
                    <div className="searchForm">
                        <div>
                            <form onSubmit={requestPlaceList}>
                                <p>카테고리</p>
                                <label><input type='checkbox' name='category' value='kor' onChange={updateCategory}></input>한식 </label>
                                <label><input type='checkbox' name='category' value='ch' onChange={updateCategory}></input>중식 </label>
                                <label><input type='checkbox' name='category' value='jp' onChange={updateCategory}></input>일식 </label>
                                <label><input type='checkbox' name='category' value='wf' onChange={updateCategory}></input>양식 </label><br/>
                                <label><input type='checkbox' name='category' value='mt' onChange={updateCategory}></input>고기 </label>
                                <label><input type='checkbox' name='category' value='sb' onChange={updateCategory}></input>분식 </label>
                                <label><input type='checkbox' name='category' value='pz' onChange={updateCategory}></input>피자 </label><br/>
                                <label><input type='checkbox' name='category' value='ck' onChange={updateCategory}></input>치킨 </label>
                                <label><input type='checkbox' name='category' value='ff' onChange={updateCategory}></input>패스트푸드 </label>
                                <label><input type='checkbox' name='category' value='br' onChange={updateCategory}></input>빵 </label>
                                <label><input type='checkbox' name='category' value='cf' onChange={updateCategory}></input>카페 </label>
                                <details>
                                    <summary>추가 옵션</summary>
                                    <div className='people'>
                                        <p>인원수</p>
                                        <input type='range' name='people' id='people' value={people} min='1' max='10' onChange={(e)=>{setPeople(e.target.value)}}/>
                                            &nbsp;{people}명
                                    </div>
                                    <div className='money'>
                                        <p>식비</p>
                                        <input type='range' name='money' id='money' value={money} min='10000' max='150000' step='1000' onChange={(e)=>{setMoney(e.target.value)}}/>
                                            &nbsp;{money > 0 ? money+'원' : '선택 안 함'}
                                    </div>

                                </details>

                                <button type='submit' className='button is-primary' style={{width : '100%',height: '40px', fontSize:'18px'}}>검색하기</button> 
                            </form>
                        </div>
                    </div>
                    <hr/>

                    {/* 검색결과 */}
                    <ul id="placesList">
                        {placeRender}
                    </ul>

                    {/* 페이지네이션 */}
                    <div id="pagination">
                        {/* 스테이트 객체에 넣어서 검색 값이 있을 때만 렌더링 -> { pagenationa ? <></> : <pagenation /> } */}
                        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                            <span>
                                { selectPage > 1 ? <a className="pagination-previous" onClick={()=>{RenderSearchList(selectPage-1);}}> {'<'} </a> : <a style={{width : '40px'}}>&nbsp;</a>}
                            </span>
                            <span>
                                <ul className="pagination-list">
                                    {pageRender}
                                </ul>
                            </span>
                            <span>
                                { selectPage != 0 && (
                                    selectPage < placeList.length/15 ? <a className="pagination-next" onClick={()=> {RenderSearchList(selectPage+1);}}> {'>'} </a> : <a style={{width : '40px'}}>&nbsp;</a>
                                )}
                            </span>
                        </nav>
                    </div>

                    {/* 메뉴정보 모달 */}
                    <MenuModal open={menuModalOpen} close={closeMenuModal} menuList={showMenu} >
                    </MenuModal>

                    {/* 가게 비교 모달 */}
                    <CompareMenuModal open={compareModalOpen} close={closeCompareModal} menuList={showMenu} >
                    </CompareMenuModal>
                </div>
            </Map>
        </>
    );
}

export default ServiceMain;


