const positionView = require('../views/position.art')
const positionListView = require('../views/position-list.art')
const positionModel = require('../models/position')
class Position{
    constructor(){
        
        this.list = []
        this.pageNo = 0
        this.totalCount = 0
        this.pageSize = 15
    }

    renderer(list){

        let positionListHtml = positionListView({
            list
        })

        let $ul = $('main ul')
        $ul.html(positionListHtml)

        $('main ul li').on('tap',function(){
            let id = $(this).attr('data-id')
            location.hash = `detail/${id}`
        })

       
    }

    async render(){
        let that = this

        let result = await positionModel.get({
            pageNo:this.pageNo
        })

        //先把positionhtml装到main中
        let positionHtml = positionView({})
        let $main = $('main')
        $main.html(positionHtml);

        //然后把list装到ul里
        let list = this.list = result.content.data.page.result
        let totalCount = result.content.data.page.totalCount
        this.renderer(list)
        
        let $imgHead = $('.head img')
        let $imgFoot = $('.foot img')

        let bScroll = new BScroll($('main').get(0),{
            probeType:2,
        })

        bScroll.scrollBy(0,-40)//相对40px   而scrollTo是绝对40px
        
        bScroll.on('scrollEnd',async function (){
            //下拉刷新
            if(this.y>=0){
                $imgHead.attr('src','/assets/images/ajax-loader.gif')

                let result = await positionModel.get({
                    pageNo:1,
                    pageSize:1
                })
                
                
                let {result:list} = result.content.data.page

                that.list = [...list,...that.list]

                that.renderer(that.list)

                bScroll.scrollBy(0,-40)
                $imgHead.attr('src','/assets/images/arrow.png')
                $imgHead.removeClass('up')
            }

            //上拉加载更多
            if(this.maxScrollY >= this.y && Math.ceil(that.totalCount/that.pageSize)>=that.pageNo){
                that.pageNo++
                $imgFoot.attr('src','/assets/images/ajax-loader.gif')

                let result = await positionModel.get({
                    pageNo:that.pageNo,
                    pageSize:that.pageSize
                })
                
                let {result:list, totalCount} = result.content.data.page
                //更新tatalCount，因为有新的内容发布
                that.totalCount = totalCount

                that.list = [...that.list,...list]
                that.renderer(that.list)

                bScroll.scrollBy(0,40)
                $imgHead.attr('src','/assets/images/arrow.png')
                $imgHead.removeClass('down')
            }
            this.refresh()
        })
        bScroll.on('scroll', function(){
            if(this.y>0){
                $imgHead.addClass('up');
            }
            if(this.maxScrollY>this.y){
                $imgFoot.addClass('down')
            }
        })

    }
}

export default new Position();