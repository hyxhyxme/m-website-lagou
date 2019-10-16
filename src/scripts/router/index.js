//显示layout
import indexController from '../controllers/index'

import positionController from '../controllers/position';
import searchController from '../controllers/search';
import profileController from '../controllers/profile';
import detailController from '../controllers/detail'

class Router{
    constructor(){
       
        this.render()
    }

    render(){
        window.addEventListener('hashchange',this.handleHashChange.bind(this))
        window.addEventListener('load',this.handlePageload.bind(this))
    }

    setActiveClass(hash){
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active')
    }


    renderDom(hash){
        let pageControllers = {
            positionController,
            searchController,
            profileController,
            detailController
        }
        pageControllers[hash+'Controller'].render()
    }
    handlePageload(){
        let hash = location.hash.substr(1) || 'position'
        let reg = new RegExp('^(\\w+)','g')
        let path = reg.exec(hash)

        indexController.render()
        location.hash = hash
        this.renderDom(path[1])
        this.setActiveClass(path[1])
    }

    handleHashChange(){
        let hash = location.hash.substr(1)
        let reg = new RegExp('^(\\w+)','g')
        let path = reg.exec(hash)

        this.renderDom(path[1])
        this.setActiveClass(path[1])
    }
}

new Router()

