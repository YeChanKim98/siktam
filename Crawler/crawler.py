
import requests as rs
from pprint import pprint
# 카카오 크롤
# 파일
placeCrawl = open('Data/Plcae_Around_Balsan_2.txt', 'w')
menuCrawl = open('Data/Menu_Around_Balsan_2.txt', 'w')

# 검색용 변수
url = 'https://dapi.kakao.com/v2/local/search/keyword.json'
menuUrl = 'https://place.map.kakao.com/main/v/'
headers = {'Authorization': 'KakaoAK 607d742fb29b6a3f7ac22e5becd8c0c3', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'}
params = {'query': '', 'page': 0, 'x': 126.83773640693936, 'y': 37.558677743241596, 'radius': 1000}  # 발산역(126.83773640693936, 37.558677743241596) 반경 1Km로 검색


# 누적 크롤링 키워드
# Keywords = {'중식':'ch','일식':'jp','한식':'kor','빵':'br','분식':'sb','패스트푸드':'ff','피자':'pz','치킨':'ck','양식':'wf','고기':'mt','카페':'cf'}

# Keywords = {'중식':'ch','일식':'jp','한식':'kor'}
# Keywords = {'양식':'wf','고기':'mt','카페':'cf','빵':'br'}
Keywords = {'빵':'br'}
# Keywords = {'분식':'sb','패스트푸드':'ff','피자':'pz','치킨':'ck'}

for search_keyword in Keywords.keys() :
    print('\n===============',search_keyword,'==============')
    for page in range(1,4) : # 최대 3페이지까지 뽑아올 수 있음
        params['query'] = search_keyword
        params['page'] = page
        getPage = rs.get(url, params=params, headers=headers).json()['documents']
        print('================',page,'Page ================')
        getOtherInfoLinks = ''
        for item in range(len(getPage)) :
            placeInfo= dict() # 저장할 딕셔너리 변수
            placeInfo['id'] = getPage[item]['id']
            # placeInfo['category_name'] = getPage[item]['category_name'].split('> ')[-1]
            placeInfo['place_name'] = getPage[item]['place_name']
            placeInfo['road_address_name'] = getPage[item]['road_address_name']
            placeInfo['phone'] = getPage[item]['phone']
            placeInfo['x'] = getPage[item]['x']
            placeInfo['y'] = getPage[item]['y']

            getPlaceMenu = rs.get(menuUrl+placeInfo['id']) # 메뉴정보 받아오기
            if getPlaceMenu.status_code == 200 : # 응답이 있으면
                getPlaceMenu = getPlaceMenu.json() # Json으로 받은 값저장

                if 'mainphotourl' in getPlaceMenu['basicInfo'] : # 만약 이미지 정보가 있으면
                    placeInfo['img'] = getPlaceMenu['basicInfo']['mainphotourl']# 대표 이미지 경로 저장
                else : placeInfo['img'] = '' # 없으면 널값


                if 'menuInfo' in getPlaceMenu : # 메뉴 정보가 있으면

                    # 메뉴 정보 있는 장소만 저장
                    placeCrawl.write("insert into place values ( '" + placeInfo['id'] + "' , '" + Keywords[search_keyword] + "' , '" +placeInfo['img'] + "', '" + placeInfo['place_name'] + "' , '" + placeInfo['road_address_name'] + "' , '" + placeInfo['phone'] + "' , '" + placeInfo['x'] + "' , '" + placeInfo['y'] + "' );\n")

                    menuList = getPlaceMenu['menuInfo']['menuList'] # 메뉴 딕셔너리 저장

                    if menuList : # 메뉴 정보가 있으면
                        for menuSeq in range(len(menuList)) : # 각 메뉴에 대해
                            menu = menuList[menuSeq]['menu'] # 메뉴 이름 저장

                            menuKinds = ''
                            if 'price' in menuList[menuSeq] : # 가격 정보가 있으면
                                price = menuList[menuSeq]['price'] # 가격 정보 저장
                                if price.find(',') != -1 : # 가격 정보에 콤마가 있으면
                                    price = price.replace(',','') # 제거
                                    
                                    # 음식 임의 분류 : 가격에 문자열만 있는 경우가 있어서 if문 안에 작성
                                    if int(price) <= 13000 or menu.find('R') != -1 or menu.find('S') != -1 :
                                        menuKinds = 'single'
                                    elif (menu.find('세트') != -1 or menu.find('set') != -1) < 0 :
                                        menuKinds = 'set()'
                                    else :
                                        menuKinds = 'dishe '
                                # menuKinds = '단품' if ( int(price) <= 15000 or menu.find('R') != -1 or menu.find('S') != -1 or menu.find('1인') != -1) else '식사' # 가격 및 이름으로 메뉴 카테고리 지정

                                # 가격 정보에 대한 처리를 끝낸 후 SQL문으로 출력
                                menuCrawl.write("insert into menu values ( '" + placeInfo['id'] + "' , '" + Keywords[search_keyword] + "' , '"+ menuKinds + "' , '" + menu + "' , '" + price + "' );\n")
                            else : # 가격 정보가 없으면 표기
                                price = '가격 정보 없음'

                else :
                    print('[!!!!!!!]',placeInfo['place_name'],': 메뉴 정보 없음' )
                    continue
                print('[Success]',placeInfo['place_name'])

            else :
                print('[!!!!!!!] 차단됨')
                break


#============== 좌표계 변환 : WTM -> WGS84 =================
# 기대 값 : lat: 37.56062359999999, lng: 126.83692409999998
# 기존 값 : 464236, 1128085
# headers = {'Authorization': 'KakaoAK 607d742fb29b6a3f7ac22e5becd8c0c3',}
#
# params = {
#     'x': '464203',
#     'y': '1128085',
#     'input_coord': 'CONGNAMUL',
#     'output_coord': 'WGS84',
# }
# latLng = rs.get('https://dapi.kakao.com/v2/local/geo/transcoord.json', params=params, headers=headers).json()

# print(latLng['documents'][0]['x'])
# print(latLng['documents'][0]['y'])
#=========================================================
# 검색에 대한 객체 ID 받기
# url='https://search.map.kakao.com/mapsearch/map.daum?callback=jQuery181011145854363305929_1653232245413&q=%EB%B0%9C%EC%82%B0%EC%97%AD+%EC%A4%91%EA%B5%AD%EC%A7%91&msFlag=A&sort=0'
# header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'}
# cookie = {
#     'webid': 'ab463f60d9e411eaae0c000af759d1a0',
#     'webid_ts' : '1596938673750',
#     'TIARA' : 'y5yaQgNw14UsWlW7CM6a6KlFjdEi6eGIx8BBOm81h.F4SvPtVf1uLN1yLDlFFmUIj6K.Cc-sAD_CO-yEuXhsp_WuQj1WNm.UP1EK1XtrwHA0',
#     '_kptid':'4036e06464e74b6ba8b0ea9b0a36a2f9',
#     '_kp_collector' : 'KP.3639527525.1640412959811',
#     '_ga' : 'GA1.2.473240059.1622945747',
#     '_ga_80D69HE0QD' : 'GS1.1.1640412960.1.1.1640412971.0',
#     '_karb' : '6JQ2gynv_J-uvd88_1644390705875',
#     'kd_lang' : 'ko',
#     '_kdt' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZlbG9wZXJJZCI6MjE5MzEwNSwidG9rZW4iOiJjOGI3NDg5Mzg2NDgzMWFlMzdhYTA1ZjQwMjMxOTU0YmUxZTQxNGY3ZDE4ZjNkYjJjMTgxZDZiMjhlYWQ1YWNmIn0.0xr9BTseEimNfnkUk97fIO06z_rys0FOE6vdSdX2VkY',
#     '_fbp' : 'fb.1.1651682327260.718791847',
#     '_gcl_aw' : 'GCL.1651682327.EAIaIQobChMI3JCqhaTG9wIV0tB8Ch1-MQzlEAEYASAAEgLnNPD_BwE',
#     '_gcl_au' : '1.1.960574786.1651682327',
#     '_gac_UA-131908380-2' : '1.1651682327.EAIaIQobChMI3JCqhaTG9wIV0tB8Ch1-MQzlEAEYASAAEgLnNPD_BwE',
#     '_gac_UA-127554126-14' : '1.1651682327.EAIaIQobChMI3JCqhaTG9wIV0tB8Ch1-MQzlEAEYASAAEgLnNPD_BwE',
#     '_kadu' : 'Hip3qlhiFJTBr3nz_1652863866199',
#     '__T_' : '1',
#     '_gid' : 'GA1.2.1512848386.1653222066',
#     '_kahai' : '446589d3469e983265f74bcc2c77919f42ae5883e59a0ac6744fee27540dc894',
#     '_kawlt' : 'A9Hs2z0L1TKH9Drjz8hPS7HNPFmTTNF0EfEcg53wqJgfQfjig0maVFttNm7GfjfuldkTen3_zfBbZdpJXBv6rDKb9HhDXrYRj3UEfkUKFEBtDdpYw58zjGu_3w7_JGWp',
#     '_kawltea' : '1653298850',
#     '_karmt' : 'loijw-DA0d1fK-ngUKQpYw17dF-Mo2jknRHb4XcbKoeIGmOhOKtiBJC4NfJgNPqa',
#     '_karmtea' : '1653309650',
#     '_T_ANO' : 'jz/DMv5Tdo7KEp4yS2QA/Pk1gtG+Q+H5Z0jGcnJAOqttWLcfmK1NQKwqzXv3eUpvPxZ4lxY6MtB0xxUziaYQbrjktptEEqpg2nIIeDPdNGc8++jtK2PffNcJxonoY85dJhWZmswoGyhQAIwZfoX79fPq8x7cO8bRu071OKcatq743GFPX7WpN9NKAgNzIfz75r34J+wUnmfSpAFEjpVE5vwzOPQPBwnEPVaFasUZTrJosJpABLS6wXh80MCkwBcPk9aOGAI3KC89ItfxyOrVcEdQmHK1ycyvvB8oSwIW6MCpT73ZK/ptqYgIvJ3RVeJa7ku5fhm19WSLERFg988LeQ=='
#     }
# getPlace_id = rs.get('https://search.map.kakao.com/mapsearch/map.daum?q=발산역+카페&msFlag=A&sort=0',headers=header, cookies=cookie)
#
# print(getPlace_id.text)
