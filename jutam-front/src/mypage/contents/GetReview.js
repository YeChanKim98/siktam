// 리뷰관련 페이지 중 어떤 페이지를 반환할지 정하고, 반환하는 파일
import axios from 'axios';

function GetReviewData(id) {
    let data;
    const api = axios.create({
        baseURL : 'http://localhost:8080/api',
        withCredentials : true,
        credentials: 'include'
    });
    return api.post('/review/findByUserId/'+id,{id : id,})
    .then((Reviews)=>{
        data = Reviews.data;
        return data;
    }).catch((Error)=>{
        console.log(Error);
    })
}

export default GetReviewData;


