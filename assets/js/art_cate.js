$(function(){
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var layerclose = null
    $('#btnAddCate').on('click',function(){
        layerclose = layer.open({
            type: 1,
            title:'添加文章分类',
            area:['500px','250px'],
            content:$('#tcc').html()
        })
    })
    $('body').on('submit','#add-form',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0 ) return layer.msg('添加失败！')
                initArtCateList()
                layer.msg('添加成功！')
                layer.close(layerclose)
            }
        })
    })
    var edit = null
    $('body').on('click','.btnEdit',function(e){
        edit = layer.open({
            type: 1,
            title:'修改文章分类',
            area:['500px','250px'],
            content:$('#edit').html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit','#edit-form',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0 ) return layer.msg("更新失败！")
                layer.close(edit)
                initArtCateList()
                layer.msg('更新成功！')
            }
        })
    })
    $('tbody').on('click','.btnDelete',function(){
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
             })   
        })

    })
})