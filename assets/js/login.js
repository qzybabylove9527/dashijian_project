$(function(){
    //点击去注册账号
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    //表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ] ,
        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(value !== pwd) return '两次密码不一致'
        }
    })

    //监听注册事件
    var data = {
        username:$('#form-reg [name=username]').val(),
        password:$('#form-reg [name=password]').val()
    }
    $('#form-reg').on('submit',function(e){
        e.preventDefault()
        $.post('/api/reguser',data,function(res){
            if(res.status !==0) return layer.msg(res.message);
            layer.msg('注册成功，请登录')
            $('#link_login').click()
        })
    })

    //监听登录事件
    $('#form-login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/reguser',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('登陆成功')
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
            }
        })
    })

    




})