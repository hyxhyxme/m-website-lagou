import profileView from '../views/profile.art'
class Profile{
   
    render(){
        let html = profileView({})

        let $main = $('main')

        $main.html(html)
    }
}
export default new Profile()