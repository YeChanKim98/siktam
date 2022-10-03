const { kakao } = window;
let map;
export default function KakaoMapScript() {
    console.log('스크립트 전역 실행');
    var markers = [];
    const container = document.getElementById('myMap');
    const options = {
        center: new kakao.maps.LatLng(126.83773640693936, 37.558677743241596),
        level: 3
    };
    map = new kakao.maps.Map(container, options);


///////////////////////////////////////////////////[지도 생성]//////////////////////////////////////////////////////////
    // 장소 검색 객체를 생성합니다
    var ps = new kakao.maps.services.Places();  

    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({zIndex:1});

    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    var mapTypeControl = new kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////[중심에 마커 표시]/////////////////////////////////////////////////////
    // 마커 객체
    var marker = new kakao.maps.Marker({map : map});

    // 타일 로드가 완료되면 지도 중심에 마커를 표시합니다
    kakao.maps.event.addListener(map, 'tilesloaded', displayMarker);

    function displayMarker() {
        
        // 마커의 위치를 지도중심으로 설정합니다 
        marker.setPosition(map.getCenter()); 
        marker.setMap(map); 

        // 아래 코드는 최초 한번만 타일로드 이벤트가 발생했을 때 어떤 처리를 하고 
        // 지도에 등록된 타일로드 이벤트를 제거하는 코드입니다 
        // kakao.maps.event.removeListener(map, 'tilesloaded', displayMarker);
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////[장소 검색]///////////////////////////////////////////////////////
    // 키워드로 장소를 검색합니다
    searchPlaces();

    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces() {

        var keyword = document.getElementById('keyword').value;
        //파싱 및 if
        console.log('받은키워드 : '+keyword)

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch( keyword, placesSearchCB, {
            radius : 2000,
            location: new kakao.maps.LatLng(map.getCenter().getLat(),map.getCenter().getLng())
        }); 
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {

            // 정상적으로 검색이 완료됐으면
            // 검색 목록과 마커를 표출합니다
            displayPlaces(data);
            console.log(data)

            // 페이지 번호를 표출합니다
            displayPagination(pagination);

        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

            alert('검색 결과가 존재하지 않습니다.');
            return;

        } else if (status === kakao.maps.services.Status.ERROR) {

            alert('검색 결과 중 오류가 발생했습니다.');
            return;

        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////[검색 결과 마커 표시]//////////////////////////////////////////////////
    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {

        var listEl = document.getElementById('placesList'), 
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(), 
        bounds = new kakao.maps.LatLngBounds(), 
        listStr = '';
        
        // 검색 결과 목록에 추가된 항목들을 제거합니다
        removeAllChildNods(listEl);

        // 지도에 표시되고 있는 마커를 제거합니다
        removeMarker();
        
        for ( var i=0; i<places.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
                marker = addMarker(placePosition, i), 
                itemEl = getListItem(i, places[i]),
                address = places[i].road_address_name,
                place_name = places[i].place_name,
                phone = places[i].phone,
                place_id = places[i].id;
                
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
            bounds.extend(placePosition);

            // 마커와 검색결과 항목에 mouseover 했을때
            // 해당 장소에 인포윈도우에 장소명을 표시합니다
            // mouseout 했을 때는 인포윈도우를 닫습니다
            (function(marker, title) {
            
            // 마커 위에 커스텀오버레이를 표시합니다
            // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
            
            // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(marker, 'click', function() {
                var content = `
                                <div class="wrap" id="infoOverlay_${i}">
                                    <div class="info" id=>
                                        <div class="title" style="margin-bottom:0px;">
                                            ${place_name}
                                            <div class="close" onClick="closeOverlay('infoOverlay_${i}')" title="닫기"></div> 
                                        </div>
                                        <div class="body">
                                            <div class="img">
                                                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70"/>
                                            </div>
                                            <div class="desc">
                                                <div class="ellipsis">${address}</div>
                                                <div class="overlayPhone">${phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                var overlay = new kakao.maps.CustomOverlay({
                content: content,
                map: map,
                position: marker.getPosition()       
                });
                // overlay.setMap(map);

            });
            
            // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
                // kakao.maps.event.addListener(marker, 'click', function() {
                //     displayInfowindow(marker, title);
                // });
                
                // 사이드바 오버레이
                // itemEl.onmouseover =  function () {
                //     displayInfowindow(marker, title);
                // };

                // itemEl.onmouseout =  function () {
                //     infowindow.close();
                // };
            })(marker, places[i].place_name);

            fragment.appendChild(itemEl);
        }

        // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다 : 사이드 바
    function getListItem(index, places) {

        var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                    '<div class="info">' +
                    '   <h5>' + places.place_name + '</h5>';

        if (places.road_address_name) {
            itemStr += '    <span>' + places.road_address_name + '</span>' +
                        '   <span class="jibun gray">' +  places.address_name  + '</span>';
        } else {
            itemStr += '    <span>' +  places.address_name  + '</span>'; 
        }    
        itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                    '</div>';           

        el.innerHTML = itemStr;
        el.className = 'item';

        return el;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////[마커 생성 후 표시]//////////////////////////////////////////////////
    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position, idx, title) {
        var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
            imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
            imgOptions =  {
                spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage 
            });

        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers.push(marker);  // 배열에 생성된 마커를 추가합니다

        return marker;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////[기존 마커 전부 제거]//////////////////////////////////////////////////
    // 지도 위에 표시되고 있는 마커를 모두 제거
    function removeMarker() {
        for ( var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
        }   
        markers = [];
    }

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination) {
        var paginationEl = document.getElementById('pagination'),
            fragment = document.createDocumentFragment(),
            i; 

        // 기존에 추가된 페이지번호를 삭제합니다
        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild (paginationEl.lastChild);
        }

        for (i=1; i<=pagination.last; i++) {
            var el = document.createElement('a');
            el.href = "#";
            el.innerHTML = i;

            if (i===pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function(i) {
                    return function() {
                        pagination.gotoPage(i);
                    }
                })(i);
            }
            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    }
    
    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el) {   
        while (el.hasChildNodes()) {
            el.removeChild (el.lastChild);
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////[지도 이동 이벤트]///////////////////////////////////////////////////
    // 지도 이동 시, 중앙 좌표 획득
    kakao.maps.event.addListener(map, 'dragend', function() {        
        
        // 지도 중심좌표를 얻어옵니다 
        var latlng = map.getCenter(); 
        
        var message = '변경된 지도 중심좌표는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';
        
        // var resultDiv = document.getElementById('result');  
        // resultDiv.innerHTML = message;
        
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}

//////////////////////////////////////////////////[지도 타입 변경]////////////////////////////////////////////////////
    // 지도에 추가된 지도타입정보를 가지고 있을 변수입니다

    var currentTypeId;

    // 버튼이 클릭되면 호출되는 함수입니다
    export function setOverlayMapTypeId(maptype){
        var changeMaptype;
        
        // maptype에 따라 지도에 추가할 지도타입을 결정합니다
        if (maptype === 'traffic') {            
            // 교통정보 지도타입
            changeMaptype = kakao.maps.MapTypeId.TRAFFIC;     
        } else if (maptype === 'roadview') {        
            // 로드뷰 도로정보 지도타입
            changeMaptype = kakao.maps.MapTypeId.ROADVIEW;    
        }
        
        // 이미 등록된 지도 타입이 있으면 제거합니다
        if (currentTypeId) {
            map.removeOverlayMapTypeId(currentTypeId);    
        }
        
        // maptype에 해당하는 지도타입을 지도에 추가합니다
        map.addOverlayMapTypeId(changeMaptype);
        
        // 지도에 추가된 타입정보를 갱신합니다
        currentTypeId = changeMaptype;  
        return 0;      
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

