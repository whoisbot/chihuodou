/* 
@update:2022.5.27
@description:
����ͷ�� APP
���ܰ��� ǩ���򿨡���ȡ���䡢�Ķ��������ҡ��������¡��ۿ���桢����0.3

��������ͨ��

��������� jzToken ���˺ŷָ����@

��ѡ������ Ĭ���Ķ�3ƪ���£��Զ����Ķ����� articleNumer

�Ƽ���ʱһСʱһ��
5 8-22 * * *
*/

//����ű�����
const jsname = '����ͷ��APP'
const $ = Env(jsname);
//���Կ��� 1 Ϊ��ӡhttp����ͷ
const logDebug = 0 ;

//֪ͨ��Ϣ
const notify = $.isNode() ? require('./sendNotify') : '';
let notifyStr = '';

//�û�Cookie
let userCookie = process.env.jzToken;
let userCookieArr = [];

//���� ���
let articleNumer = process.env.articleNumer?process.env.articleNumer:3;
let articleArr = [];
let adslistArr = [71,77,98];


//�Ե��ú���
!(async () => {
   
        //������ ��������
        if(!(await checkEnv())) return
        //await: �ȴ������������֮��Ż������һ������

        for (let i = 0; i < userCookieArr.length; i++) {
            token = userCookieArr[i]
            $.index = i + 1;

            console.log(`=====����ͷ�����˺�${$.index}��====`)   
            notifyStr += `=====����ͷ�����˺�${$.index}��====`         
            await all();
      
        }
//await showmsg();  
    
})()
.catch((e) => $.logErr(e))
.finally(() => $.done())


async function all(){
    await benefit(token);
    await clock(token);
    await sign(token);
    await bx(token);
    await getReadId(token);
    //console.log(articleArr);
    for(let i=0;i<articleNumer;i++){
            await read(token,articleArr[i]);
            await getComment(token,articleArr[i]);
            await $.wait(20000);
            await articleCoin(token,articleArr[i]);

        };
    for(let i=0;i<3;i++){
            await share(token);
            await $.wait(3000);
        };
    await getAds(token);
    for(let i=0;i<adslistArr.length;i++){
        await videos(token,adslistArr[i]);
        await $.wait(20000);

         };
    await getInfo(token)
    await tx(token)
}
//����������
async function checkEnv() {
    //���ű��������
    if(userCookie) {
        //������ڣ������������
        //userCookie.split('@')�������ָ�������˺��������
        //for(let userCookies of xxx) �����������
        userCookieArr = userCookie.split('@')
        userCount = userCookieArr.length //����˺Ÿ���

    } else {
        //�����ڣ�����false���˳��ű�
        console.log('δ�ҵ�jzToken')
        return false;
    }
   console.log(`���ҵ�${userCount}���˺�`)
    return true
}
//��ʼ��
async function benefit(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/index/benefit?token=${token}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,           
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log(`\n----����˺�----`)
    if(result.code == 0) {
        // strData = JSON.stringify(result.data);
        console.log(`${JSON.stringify(result.data)}`);
        //notifyStr += `${JSON.stringify(result.data)}`;
        console.log(`${result.msg}`);
        //notifyStr += `${result.msg}`;
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
    }

 
    

}
//��ù��id
async function getAds(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/user/task??token=${tokens}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,           
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    if(result.code == 0) {
       adsArr = result.data.ads_task;
       //console.log(adsArr);
        for(let i=0; i<adsArr.length;i++){
            if(adsArr[i].is_finish == 0 || adsArr[i].seconds == null ){
               adslistArr.push(`${adsArr[i].id}`);                                            
            }
        } ;
        //console.log(adslistArr);
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
    }
}
// ��
async function clock(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/task/clock`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,      
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----׼��������....');
    if(result.code == 0) {
        //console.log(result);
        if(result.data.is_sign == 1){
            console.log(`����ɣ�����`)
            return;

        }
        console.log(`${result.msg}`);
        //notifyStr += `${result.msg}`;
        console.log(`${JSON.stringify(result.data)}`);
        //notifyStr += `${JSON.stringify(result.data)}`;
        
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `����: ${result.message}`;
    }


}
//��ȡ����id���ݺ���
async function getReadId(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/article/list?page=1&limit=20&cid=0&type=1&terminal=Xiaomi&version=2.0.8`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,      
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    if(result.code == 0) {
        listArr = result.data.list;
        for(let i=0; i<listArr.length;i++){
            if(listArr[i].type == 1){
               articleArr.push(`${listArr[i].id}`);
           }
       }               
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        //notifyStr += `${result.msg}`;
    }
}
//�Ķ�����
async function read(token,id){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/article/detail?id=${id}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,           
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----׼���Ķ���������....');
    if(result.code == 0) {
        console.log(`���±��⣺${JSON.stringify(result.data.title)}`);
        //notifyStr += `���±��⣺${JSON.stringify(result.data.title)}`;
        console.log(`���£�${result.msg}`);
        //notifyStr += `���£�${result.msg}`;
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
    };
    }
//��ȡ��������
async function getComment(token,id){
    let caller = printCaller();
    let tokens = token;
    let ids = id;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/comment/list?article_id=${ids}&page=1&limit=20`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,           
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    if(result.code == 0){
        console.log(`��ȡ�������۳ɹ�`);
        //notifyStr += `��ȡ�������۳ɹ�`;
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
    };
    }
//��ȡ������Ϣ
async function getInfo(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/user/info?token=${tokens}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'ChapterNine/1.2.8 (com.ass.jiuzhang; build:1137; iOS 14.3.0) Alamofire/5.4.4',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //���һ������
    let urlObject = {
        url: url,
        headers: header,      
    }
    await httpRequest('get',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    if(result.code == 0) {
        //console.log(result);
        console.log('\n----��������----');
        console.log(`${result.msg}`);
        //notifyStr += `${result.msg}`;
        console.log(`�ǳƣ�${JSON.stringify(result.data.name)}`);
        console.log(`��ң�${JSON.stringify(result.data.integral)}`);
        console.log(`ͨ����${JSON.stringify(result.data.money)}`);
        //notifyStr += `${JSON.stringify(result.data)}`;
        //notifyStr += `�ǳƣ�${JSON.stringify(result.data.name)}`;
        //notifyStr += `��ң�${JSON.stringify(result.data.integral)}`;
        //notifyStr += `ͨ����${JSON.stringify(result.data.money)}`
        
    } else {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `����: ${result.message}`;
    }
}

//����Ϊpost����

//�ۿ����ý��
async function videos(token,id) {

    let caller = printCaller();
    let tokens = token;
    let ids = id;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/task/ads?token=${token}`;

    //post body����
    let body = `token=${tokens}&id=${ids}`;


    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    }

    //���һ������
    let urlObject = {
        url: url,
        headers: header,  
        body: body,
    }
    

    await httpRequest('post',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----�ۿ���Ƶ----');
    if(result.code == 0) {
        console.log(`��Ƶ�ۿ���${result.msg}`);
        //notifyStr += `��Ƶ�ۿ���${result.msg}`;
        console.log(`��ý�ң�${JSON.stringify(result.data.coin)}`);
        //notifyStr += `��ý�ң�${JSON.stringify(result.data.coin)}`;
        
    } else if(result.code == 1)
    {
        console.log(result.msg);
        //notifyStr += `${result.msg}`;
    }
      else
     {        
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
     }



}
//ǩ��
async function sign(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/sign/sign`;
    //post body����
    let body = `token=${tokens}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    }
   //���һ������
    let urlObject = {
        url: url,
        headers: header,  
        body: body,
    }
    await httpRequest('post',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----׼��ǩ������....');
    if(result.code == 0) {
        console.log(`��ʼǩ����${result.msg}`);
        //notifyStr += `��ʼǩ����${result.msg}`;
        console.log(`��ý�ң�${JSON.stringify(result.data.integral)}`);
        //notifyStr += `��ý�ң�${JSON.stringify(result.data.integral)}`;
        
    } else if(result.code == 1)
    {
        console.log(`����ɣ�����`)
        return;
        console.log(result.msg);
        notifyStr += `${result.msg}`;
    }
      else
     {        
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`);
        notifyStr += `${result.msg}`;
     }

}
//��ñ���
async function bx(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/task/receive?token=${token}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'content-type':'application/x-www-form-urlencoded',
        'Referer':'http://ug4her.sousou.com/',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //post body����
    let body = `token=${tokens}`

    //���һ������
    let urlObject = {
        url: url,
        headers: header,
        body: body,      
    }
    await httpRequest('post',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----׼����������....');
    if(result.code == 0) {
        console.log(`������ȡ��${result.msg}`);
        //notifyStr += `������ȡ��${result.msg}`;
        console.log(`��ý�ң�${JSON.stringify(result.data.coin)}`);
        //notifyStr += `��ý�ң�${JSON.stringify(result.data.coin)}`;
    } else if(result.code == 1)
    {
        console.log(`��������ȡ������`);
        return 
        console.log(result.msg);
        notifyStr += `${result.msg}`;
    }else
   {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`)
        notifyStr += `${result.msg}`;
    }
}
//�Ķ���������
async function articleCoin(token,id){
    let caller = printCaller();
    let tokens = token;
    let ids = id;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/article/finish?token=${token}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'content-type':'application/x-www-form-urlencoded',
        'Referer':'http://ug4her.sousou.com/',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //post body����
    let body = `id=${ids}`

    //���һ������
    let urlObject = {
        url: url,
        headers: header,
        body: body,      
    }
    await httpRequest('post',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('----׼���Ķ�������������....');
    if(result.code == 0) {
        console.log(`������ȡ��${result.msg}`);
        //notifyStr += `������ȡ��${result.msg}`;
        console.log(`��ý�ң�${JSON.stringify(result.data.coin)}`);
        //notifyStr += `��ý�ң�${JSON.stringify(result.data.coin)}`;
   } else if(result.code == 1)
    {
        console.log(result.msg);
        //notifyStr += `${result.msg}`;
    }else
   {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`)
        notifyStr += `${result.msg}`;
    }
}
//����
async function share(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
    //����url
    let url = `http://api.st615.com/v2/article/share?token=${token}`;
    //����header
    let header = {
        'Host':'api.st615.com',
        'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
        'content-type':'application/x-www-form-urlencoded',
        'Referer':'http://ug4her.sousou.com/',
        'sign':`${sign}`,
        'noncestr':`${guid}`,
        'timestamp':`${ts}`,
        'token':`${tokens}`,
    };
    //post body����
    let body = ``;

    //���һ������
    let urlObject = {
        url: url,
        headers: header,
        body: body,      
    }
    await httpRequest('post',urlObject,caller);
    let result = httpResult;
    if(!result) return;
    console.log('\n----׼����������....');
    if(result.code == 0) {
        console.log(`������${result.msg}`);
        //notifyStr += `������${result.msg}`;
        } else if(result.code == 1)
    {
        console.log(result.msg);
        //notifyStr += `${result.msg}`;
    }else
   {
        //������һ����headerȱ�ٶ���������token����
        console.log(`����: ${result.message}`)
        notifyStr += `${result.msg}`;
    }



}
//���� �̶�0.3
async function tx(token){
    let caller = printCaller();
    let tokens = token;
    let signi = 'X2dk9sdnwoifPv7L';
    let ts = Math.round(new Date().getTime() / 1000).toString();
    let guid = randomString(16);
    let sign = MD5_Encrypt(`${signi}${guid}${ts}`);
       //����url
       let url = `http://api.st615.com/v2/cash/withdraw-new`;
       //����header
       let header = {
           'Host':'api.st615.com',
           'User-Agent':'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002;wv)AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36jiuzhang/android',
           'content-type':'application/x-www-form-urlencoded',
           'Referer':'http://ug4her.sousou.com/',
           'sign':`${sign}`,
           'noncestr':`${guid}`,
           'timestamp':`${ts}`,
           'token':`${tokens}`,
       };
       //post body����
       let body = `token=${token}&type=1&money=0.3`;
   
       //���һ������
       let urlObject = {
           url: url,
           headers: header,
           body: body,      
       }
       await httpRequest('post',urlObject,caller);
       let result = httpResult;
       if(!result) return;
       console.log('\n----׼����������....');
       if(result.code == 0) {
           console.log(`���֣�${result.msg}`);
           //notifyStr += `���֣�${result.msg}`;
           } else if(result.code == 1)
       {
           console.log(result.msg);
           //notifyStr += `${result.msg}`;
       }else
      {
           //������һ����headerȱ�ٶ���������token����
           console.log(`����: ${result.message}`)
           notifyStr += `${result.msg}`;
       }

}


//����֪ͨ����
async function showmsg() {
    // �ж�֪ͨ���� Ϊ�շ���
    if(!notifyStr) return
    // ֪ͨ��Ϣ�� 
    notifyBody = jsname + "����֪ͨ\n\n" + notifyStr
    // ����notify 
    if($.isNode())
    {
        await notify.sendNotify($.name, notifyBody );
    }
     else {
        console.log(notifyBody);
    }
}
//http������
async function httpRequest(method,url,caller) {
    httpResult = null
    return new Promise((resolve) => {
        $[method](url, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${caller}: ${method}����ʧ��`);
                    console.log(JSON.stringify(err));
                    $.logErr(err);
                } else {
                    if (safeGet(data)) {
                        httpResult = JSON.parse(data);
                        if(logDebug) console.log(httpResult);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//��鷵������
function safeGet(data,caller) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        } else {
            console.log(`Function ${caller}: δ֪����`);
            console.log(data)
        }
    } catch (e) {
        console.log(e);
        console.log(`Function ${caller}: ��������������Ϊ�գ����������豸�������`);
        return false;
    }
}
//����������
function printCaller(){
    return (new Error()).stack.split("\n")[2].trim().split(" ")[1]
}
//�������������
function randomString(e) { 
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
   }
//MD5���ܺ���
function MD5_Encrypt(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }

    function c(a, b) {
        var c, d, e, f, g;
        return e = 2147483648 & a,
            f = 2147483648 & b,
            c = 1073741824 & a,
            d = 1073741824 & b,
            g = (1073741823 & a) + (1073741823 & b),
            c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f :
            g ^ e ^ f
    }

    function d(a, b, c) {
        return a & b | ~a & c
    }

    function e(a, b, c) {
        return a & c | b & ~c
    }

    function f(a, b, c) {
        return a ^ b ^ c
    }

    function g(a, b, c) {
        return b ^ (a | ~c)
    }

    function h(a, e, f, g, h, i, j) {
        return a = c(a, c(c(d(e, f, g), h), j)),
            c(b(a, i), e)
    }

    function i(a, d, f, g, h, i, j) {
        return a = c(a, c(c(e(d, f, g), h), j)),
            c(b(a, i), d)
    }

    function j(a, d, e, g, h, i, j) {
        return a = c(a, c(c(f(d, e, g), h), j)),
            c(b(a, i), d)
    }

    function k(a, d, e, f, h, i, j) {
        return a = c(a, c(c(g(d, e, f), h), j)),
            c(b(a, i), d)
    }

    function l(a) {
        for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i =
                0; c > i;)
            b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | a.charCodeAt(i) << h,
            i++;
        return b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | 128 << h,
            g[f - 2] = c << 3,
            g[f - 1] = c >>> 29,
            g
    }

    function m(a) {
        var b, c, d = "",
            e = "";
        for (c = 0; 3 >= c; c++)
            b = a >>> 8 * c & 255,
            e = "0" + b.toString(16),
            d += e.substr(e.length - 2, 2);
        return d
    }

    function n(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                b += String.fromCharCode(d >> 6 & 63 | 128),
                b += String.fromCharCode(63 & d | 128))
        }
        return b
    }

    var o, p, q, r, s, t, u, v, w, x = [],
        y = 7,
        z = 12,
        A = 17,
        B = 22,
        C = 5,
        D = 9,
        E = 14,
        F = 20,
        G = 4,
        H = 11,
        I = 16,
        J = 23,
        K = 6,
        L = 10,
        M = 15,
        N = 21;
    for (a = n(a),
        x = l(a),
        t = 1732584193,
        u = 4023233417,
        v = 2562383102,
        w = 271733878,
        o = 0; o < x.length; o += 16)
        p = t,
        q = u,
        r = v,
        s = w,
        t = h(t, u, v, w, x[o + 0], y, 3614090360),
        w = h(w, t, u, v, x[o + 1], z, 3905402710),
        v = h(v, w, t, u, x[o + 2], A, 606105819),
        u = h(u, v, w, t, x[o + 3], B, 3250441966),
        t = h(t, u, v, w, x[o + 4], y, 4118548399),
        w = h(w, t, u, v, x[o + 5], z, 1200080426),
        v = h(v, w, t, u, x[o + 6], A, 2821735955),
        u = h(u, v, w, t, x[o + 7], B, 4249261313),
        t = h(t, u, v, w, x[o + 8], y, 1770035416),
        w = h(w, t, u, v, x[o + 9], z, 2336552879),
        v = h(v, w, t, u, x[o + 10], A, 4294925233),
        u = h(u, v, w, t, x[o + 11], B, 2304563134),
        t = h(t, u, v, w, x[o + 12], y, 1804603682),
        w = h(w, t, u, v, x[o + 13], z, 4254626195),
        v = h(v, w, t, u, x[o + 14], A, 2792965006),
        u = h(u, v, w, t, x[o + 15], B, 1236535329),
        t = i(t, u, v, w, x[o + 1], C, 4129170786),
        w = i(w, t, u, v, x[o + 6], D, 3225465664),
        v = i(v, w, t, u, x[o + 11], E, 643717713),
        u = i(u, v, w, t, x[o + 0], F, 3921069994),
        t = i(t, u, v, w, x[o + 5], C, 3593408605),
        w = i(w, t, u, v, x[o + 10], D, 38016083),
        v = i(v, w, t, u, x[o + 15], E, 3634488961),
        u = i(u, v, w, t, x[o + 4], F, 3889429448),
        t = i(t, u, v, w, x[o + 9], C, 568446438),
        w = i(w, t, u, v, x[o + 14], D, 3275163606),
        v = i(v, w, t, u, x[o + 3], E, 4107603335),
        u = i(u, v, w, t, x[o + 8], F, 1163531501),
        t = i(t, u, v, w, x[o + 13], C, 2850285829),
        w = i(w, t, u, v, x[o + 2], D, 4243563512),
        v = i(v, w, t, u, x[o + 7], E, 1735328473),
        u = i(u, v, w, t, x[o + 12], F, 2368359562),
        t = j(t, u, v, w, x[o + 5], G, 4294588738),
        w = j(w, t, u, v, x[o + 8], H, 2272392833),
        v = j(v, w, t, u, x[o + 11], I, 1839030562),
        u = j(u, v, w, t, x[o + 14], J, 4259657740),
        t = j(t, u, v, w, x[o + 1], G, 2763975236),
        w = j(w, t, u, v, x[o + 4], H, 1272893353),
        v = j(v, w, t, u, x[o + 7], I, 4139469664),
        u = j(u, v, w, t, x[o + 10], J, 3200236656),
        t = j(t, u, v, w, x[o + 13], G, 681279174),
        w = j(w, t, u, v, x[o + 0], H, 3936430074),
        v = j(v, w, t, u, x[o + 3], I, 3572445317),
        u = j(u, v, w, t, x[o + 6], J, 76029189),
        t = j(t, u, v, w, x[o + 9], G, 3654602809),
        w = j(w, t, u, v, x[o + 12], H, 3873151461),
        v = j(v, w, t, u, x[o + 15], I, 530742520),
        u = j(u, v, w, t, x[o + 2], J, 3299628645),
        t = k(t, u, v, w, x[o + 0], K, 4096336452),
        w = k(w, t, u, v, x[o + 7], L, 1126891415),
        v = k(v, w, t, u, x[o + 14], M, 2878612391),
        u = k(u, v, w, t, x[o + 5], N, 4237533241),
        t = k(t, u, v, w, x[o + 12], K, 1700485571),
        w = k(w, t, u, v, x[o + 3], L, 2399980690),
        v = k(v, w, t, u, x[o + 10], M, 4293915773),
        u = k(u, v, w, t, x[o + 1], N, 2240044497),
        t = k(t, u, v, w, x[o + 8], K, 1873313359),
        w = k(w, t, u, v, x[o + 15], L, 4264355552),
        v = k(v, w, t, u, x[o + 6], M, 2734768916),
        u = k(u, v, w, t, x[o + 13], N, 1309151649),
        t = k(t, u, v, w, x[o + 4], K, 4149444226),
        w = k(w, t, u, v, x[o + 11], L, 3174756917),
        v = k(v, w, t, u, x[o + 2], M, 718787259),
        u = k(u, v, w, t, x[o + 9], N, 3951481745),
        t = c(t, p),
        u = c(u, q),
        v = c(v, r),
        w = c(w, s);
    var O = m(t) + m(u) + m(v) + m(w);
    return O.toLowerCase()
}
//js���л���
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),"PUT"===e&&(s=this.put),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}put(t){return this.send.call(this.env,t,"PUT")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}put(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.put(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="PUT",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.put(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


