//js_copy_file.js
var fs = require('fs');
var path = require('path');//
// var filePaths = path.resolve('E:/zll/project/artgame/resource/assets/texture');//需要遍历的文件夹
var filePaths = path.resolve('E:/zll/project/artgame/resource/config/json');//需要遍历的文件夹
// var outFilePath = path.resolve('E:/zll/project/artgame/resource/assets/texture1');//out文件夹
var outFilePath = path.resolve('E:/zll/project/artgame/resource/config/json1');//out文件夹
var files = []
//调用文件遍历方法
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "g"), s2);
}

fileDisplay(filePaths);
//文件遍历方法
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    var ff = fs.readdirSync(filePath)
    //遍历读取到的文件列表
    ff.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = fs.statSync(filedir)
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if (isFile) {
            // if (filename.lastIndexOf('.png') >= 0 || filename.lastIndexOf('.jpg') >= 0) {
            if (filename.lastIndexOf('.json') >= 0) {
                files.push(filedir);//筛选文件类型 
            }
            // files.push(filedir)
            // console.log(filedir);
        }
        if (isDir) {
            var str1 = filedir.replace(filePaths, outFilePath)
            var str = str1.substring(0, str1.lastIndexOf('\\'))
            var ff2 = fs.readdirSync(str)
            var filedir2 = str1.substring(str1.lastIndexOf('\\') + 1)
            if (ff2.indexOf(filedir2) < 0) {
                var state = fs.mkdirSync(str1)
            }
            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }

    });
}
var len = files.length
files.forEach(function (filePathName, index) {
    console.log(index + 1, len, filePathName);
    /* 1 */
    // var buff = fs.readFileSync(filePathName, { encoding: 'utf8' })
    // let obj = JSON.parse(buff)
    // var str = filePathName.replace(filePaths, outFilePath)
    // let out = {
    //     file: obj.meta.image,
    //     frames: {}
    // }
    // for (let i in obj.frames) {
    //     let item = obj.frames[i]
    //     if (item.rotated) {
    //         out.frames[i] = { "x": item.frame.x, "y": item.frame.y, "w": item.frame.h, "h": item.frame.w, "offX": 0, "offY": 0, "sourceW": item.frame.h, "sourceH": item.frame.w }
    //     }
    //     else {
    //         out.frames[i] = { "x": item.frame.x, "y": item.frame.y, "w": item.frame.w, "h": item.frame.h, "offX": 0, "offY": 0, "sourceW": item.frame.w, "sourceH": item.frame.h }
    //     }
    // }
    // var state = fs.writeFileSync(str, JSON.stringify(out))
    /* 2 */
    // var buff = fs.readFileSync(filePathName)
    // var str = filePathName.replace(filePaths, outFilePath)
    // str = str.replaceAll('@', '_')
    // str = str.replaceAll('-', '_')
    // var state = fs.writeFileSync(str, buff)
    /* 3 */
    // var buff = fs.readFileSync(filePathName, { encoding: 'utf8' })
    // var str = filePathName.replace(filePaths, outFilePath)
    // let obj = JSON.parse(buff)
    // str = str.replaceAll('@', '_')
    // str = str.replaceAll('-', '_')
    // obj.file = obj.file.replaceAll('@', '_')
    // obj.file = obj.file.replaceAll('-', '_')
    // let temp = obj.frames
    // obj.frames = {}
    // for (let i in temp) {
    //     let cstr = i.replaceAll('@', '_')
    //     cstr = cstr.replaceAll('-', '_')
    //     obj.frames[cstr] = temp[i]
    // }
    // var state = fs.writeFileSync(str, JSON.stringify(obj))
    /* 4 */
    var buff = fs.readFileSync(filePathName, { encoding: 'utf8' })
    var str = filePathName.replace(filePaths, outFilePath)
    let obj = JSON.parse(buff)
    str = str.replaceAll('@', '_')
    str = str.replaceAll('-', '_')
    let temp = obj.frames
    obj.frames = {}
    for (let i in temp) {
        let cstr = i.replaceAll('@', '_')
        cstr = cstr.replaceAll('-', '_')
        obj.frames[cstr] = temp[i]
    }
    let anstr = JSON.stringify(obj.animations)
    if (anstr) {
        anstr = anstr.replaceAll('-', '_')
        anstr = anstr.replaceAll('@', '_')
        obj.animations = JSON.parse(anstr)
    }
    var state = fs.writeFileSync(str, JSON.stringify(obj))
})