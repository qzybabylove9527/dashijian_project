$(function(){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    inittable()
    initcate()
    function inittable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !==0 ) return layer.msg('列表获取失败!')
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderpage(res.total)
            }
        })
    }

    template.defaults.imports.dataFormat = function(date){
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d +" " + hh + ":" + mm + ":" + ss
    }
    function padZero(n){
        return n > 9 ? n : "0" + n
    }

    function initcate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0) return layer.msg('获取列表失败！')
                var htmlStr = template("tpl-cate",res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        inittable()
    })

    function renderpage(total){
        laypage.render({
            elem:'pageBox',
            count:total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump:function(obj,first){
                q.pagesize = obj.curr
                q.pagesize = obj.limit
                if(!first) inittable()
            }
        })
    }

    $('tobt').on('click','.btn-delete',function(){
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})