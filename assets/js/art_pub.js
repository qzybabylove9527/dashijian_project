$(function(){
    var layer = layui.layer
    var form = layui.form
    initcate()
    initEditor()
    function initcate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0 ) layer.msg('获取失败！')
                var htmlStr = template("tpl-cate",res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
    // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    
    var art_status = "已发布"
        
    $('#btnsave2').on('click',function(){
        art_status = "草稿"
    })

    $('#form-pub').on('submit',function(e){
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state',art_status)
        $image
            .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
        })

    })
    function  publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData: false,
            success:function(res){
                if(res.status !==0) return layer.msg("发布失败！")
                location.href = '/article/art_list.html'
            }
        })
    }
})