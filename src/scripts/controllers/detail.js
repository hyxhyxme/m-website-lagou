import detailView from '../views/detail.art'
/* import '../../styles/modules/over-lagou.scss' */
import indexController from '../controllers/index'
class Detail{
    render(){
        let html = detailView({})

        $('#root').html(html)

        $('header').on('click',()=>{
            indexController.render()
            location.hash = 'position'
            $('html').css({
                'font-size':'100px',
                'background':'#fff',
                'overflow-y':'scroll'
            })
            $('body').css('overflow-y','scroll')
        })

        $('html').css({
            'font-size':'65.5%',
            'background':'#fff',
            'overflow-y':'scroll'
        })
        $('body').css('overflow-y','scroll')

        let hash = location.hash
        let reg = RegExp('(\\d+)$','g')
        let id = reg.exec(hash)
        console.log(id[1]);
        
    }
}
export default new Detail()