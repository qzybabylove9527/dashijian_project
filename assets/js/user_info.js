$(function(){
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.value > 6){
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()
    function  initUserInfo(){
        $.ajax({
            methed:"GET",
            url:"/my/userinfo",
            success:function(res){
                if(res.status !== 0) return layer.msg('获取用户信息失败')
                form.val('user_info',res.data)
            }
        })
    }
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })
    $('.layui-form').submit(function(e){
        e.preventDefault()
        // var data = {
        //     id:$('.layui-form [name=id]').val(),
        //     username:$('.layui-form [name=username]').val(),
        //     password:$('.layui-form [name=nickname]').val(),
        //     email:$('.layui-form [name=email]').val()
        // }
        // $.post('/my/userinfo',$('.layui-form').serialize(),function(res){
        //     if(res.status !==0 ) return layer.msg('修改信息失败！')
        //     layer.msg('修改信息成功！')
        //     window.parent.getuserinfo()
        // })
        $.ajax({
            method:"POST",
            url:"/my/userinfo",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0 ) return layer.msg('修改信息失败！')
                layer.msg('修改信息成功！')
                window.parent.getuserinfo()
            }
        })
    })   
        
    
})
