
export function passwordCheck(value){
    var str=value;
    //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
    var Expression=/([A-Za-z0-9]|[_]){5,19}$/; 
    var objExp=new RegExp(Expression); //创建正则表达式对象
     //通过正则表达式验证
    return objExp.test(str) ? false :true
    
}

export function emailCheck (value) {
    var emailPat=/@./;
    var result=emailPat.test(value);
    return result ? false : true
    
}

export function validateCheck(value){
    let reg=/[0-9a-z]{6}$/;
    return reg.test(value) ? false : true
}

