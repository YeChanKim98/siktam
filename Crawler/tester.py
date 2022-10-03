
import requests as rs
from pprint import pprint

# 카카오 크롤
# 파일
# placeCrawl = open('Data/Plcae_Around_Balsan_5.txt', 'w')
# menuCrawl = open('Data/Menu_Around_Balsan_5.txt', 'w')

# 검색용 변수
url = 'https://dapi.kakao.com/v2/local/search/keyword.json'
menuUrl = 'https://place.map.kakao.com/main/v/'
# params = { 'x' : 126.83773640693936, 'y' :37.558677743241596 , 'radius' : 10000}
headers = {'Authorization': 'KakaoAK 607d742fb29b6a3f7ac22e5becd8c0c3',
           'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'}

# 누적 크롤링 키워드
Keywords = ['고기']
# 37.56062359999999, lng: 126.83692409999998
for search_keyword in Keywords:
    print('\n===============', search_keyword, '==============')
    placeInfo_2 = dict()
    for page in range(1, 4):  # 최대 3페이지까지 뽑아올 수 있음
        params = {'query': search_keyword, 'page': page, 'x' : 126.83773640693936, 'y' :37.558677743241596 , 'radius' : 1000} # 발산역 반경 1Km로 검색
        getPage = rs.get(url, params=params, headers=headers).json()['documents']
        print('================', page, 'Page ================')
        getOtherInfoLinks = ''
        for item in range(len(getPage)):
            placeInfo = dict()  # 저장할 딕셔너리 변수
            # getOtherInfoLinks = getOtherInfoLinks+','+getPage[item]['id'] if item != 0 else getOtherInfoLinks+getPage[item]['id'] # 첫번째는 컴마 필요 없음
            placeInfo['id'] = getPage[item]['id']
            placeInfo['category_name'] = getPage[item]['category_name'].split('> ')[-1]
            placeInfo['place_name'] = getPage[item]['place_name']
            placeInfo['road_address_name'] = getPage[item]['road_address_name']
            placeInfo['phone'] = getPage[item]['phone']
            placeInfo['x'] = getPage[item]['x']
            placeInfo['y'] = getPage[item]['y']
            pprint(placeInfo)
            # getPlaceMenu = rs.get(menuUrl + placeInfo['id'])  # 메뉴정보 받아오기
            # if getPlaceMenu.status_code == 200:  # 응답이 있으면
            #     getPlaceMenu = getPlaceMenu.json()  # Json으로 받은 값저장
            #
            #     if 'mainphotourl' in getPlaceMenu['basicInfo']:  # 만약 이미지 정보가 있으면
            #         placeInfo['img'] = getPlaceMenu['basicInfo']['mainphotourl']  # 대표 이미지 경로 저장
            #     else:
            #         placeInfo['img'] = ''  # 없으면 널값
            #
            #     # 사진정보까지 받아오면 기본 장소의 정보는 모두 있으므로 쿼리 생성
            #     placeCrawl.write(
            #         "insert into place values ( '" + placeInfo['id'] + "' , '" + placeInfo['category_name'] + "' , '" +
            #         placeInfo['img'] + "', '" + placeInfo['place_name'] + "' , '" + placeInfo[
            #             'road_address_name'] + "' , '" + placeInfo['phone'] + "' , '" + placeInfo['x'] + "' , '" +
            #         placeInfo['y'] + "' );\n")
            #
            #     if 'menuInfo' in getPlaceMenu:  # 메뉴 정보가 있으면
            #
            #         menuList = getPlaceMenu['menuInfo']['menuList']  # 메뉴 딕셔너리 저장
            #
            #         if menuList:  # 메뉴 정보가 있으면
            #             for menuSeq in range(len(menuList)):  # 각 메뉴에 대해
            #                 menu = menuList[menuSeq]['menu']  # 메뉴 이름 저장
            #
            #                 menuKinds = ''
            #                 if 'price' in menuList[menuSeq]:  # 가격 정보가 있으면
            #                     price = menuList[menuSeq]['price']  # 가격 정보 저장
            #                     if price.find(',') != -1:  # 가격 정보에 콤마가 있으면
            #                         price = price.replace(',', '')  # 제거
            #                         menuKinds = '단품' if (int(price) <= 15000 or menu.find('R') != -1 or menu.find(
            #                             'S') != -1 or menu.find('1인') != -1) else '식사'  # 가격 및 이름으로 메뉴 카테고리 지정
            #
            #                     # 가격 정보에 대한 처리를 끝낸 후 SQL문으로 출력
            #                     menuCrawl.write("insert into menu values ( '" + placeInfo[
            #                         'id'] + "' , '" + menuKinds + "' , '" + menu + "' , '" + price + "' );\n")
            #                 else:  # 가격 정보가 없으면 표기
            #                     price = '가격 정보 없음'
            #         else:
            #             print('!!!!!!!!!!![ 메뉴 정보 없음 ]!!!!!!!!!!!!')  # 메뉴 정보가 없으면 출력
            #     else:
            #         print(placeInfo['place_name'], '-> 메뉴 정보 없음')
            #     print(placeInfo['place_name'], '완료')
            #
            # else:
            #     print('차단됨')
            #     break